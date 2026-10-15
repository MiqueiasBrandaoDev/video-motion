"""OPCIONAL. Recorta o apresentador de um vídeo e gera um vídeo com canal alfa (texto atrás da pessoa).

Só para entrada com rosto filmado (talking head). O resultado alimenta a cena "recorte"
(template/src/comp/Recorte.tsx): fundo (vídeo original) -> texto/letreiro -> recorte com alfa.

Pré-requisito: o vídeo de entrada já cortado com os MESMOS trechos e o mesmo tempo da voz
editada (frame N do arquivo = frame N da timeline). Recorte depois de cortar, não antes.

Como funciona: lê os quadros por pipe (ffmpeg, sem PNG em disco), remove o fundo quadro a
quadro com o rembg (modelo de segmentação de pessoa) e manda por pipe para um WebM VP9 com alfa
(yuva420p), que o <OffthreadVideo transparent> do Remotion lê. No fim confere se o WebM tem um
quadro para cada quadro lido. Com --prores, gera também um .mov ProRes 4444.

Custo: pesado. Na CPU, ~0,35-1,5 s por quadro (u2net_human_seg; notebook esquentando fica no alto) (1 min de vídeo a 30 fps = 1800
quadros). Use GPU (pip install "rembg[gpu]") ou recorte só os trechos que terão texto atrás
(--de/--ate em segundos), ou só a região visível no enquadramento (--regiao). Alternativas mais rápidas e estáveis entre quadros: RobustVideoMatting
(github.com/PeterL1n/RobustVideoMatting) ou BiRefNet em lote; o formato de saída é o mesmo.

Instalação (uma vez): pip install "rembg[cpu]"   (ou rembg[gpu])
O modelo é baixado pelo rembg na primeira execução (~170 MB para birefnet-portrait).

Gravação em fundo verde/azul (chroma key): use --chroma "#64DB08" (cor do fundo, amostre um
pixel). Só ffmpeg (chromakey + despill), segundos em vez de minutos, sem rembg nem modelo.

Uso:
  python -I scripts/recortar_orador.py public/orador.mp4 public/orador-alfa.webm
         [--modelo birefnet-portrait|u2net_human_seg|isnet-general-use] [--fps 30]
         [--de 12.0 --ate 18.5] [--regiao 0.35,0,0.4,1] [--prores]
  python -I scripts/recortar_orador.py public/orador.mp4 public/orador-alfa.webm --chroma "#64DB08"
         [--similaridade 0.13] [--suavidade 0.06]
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time


def rodar(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore")
    if r.returncode:
        sys.exit(f"falhou: {' '.join(cmd[:4])}...\n{r.stderr[-2000:]}")
    return r


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="OPCIONAL: recorta o apresentador e gera vídeo com alfa (WebM VP9 / ProRes 4444).")
    ap.add_argument("entrada", help="vídeo do apresentador já cortado igual à voz")
    ap.add_argument("saida", help="vídeo com alfa (.webm)")
    ap.add_argument("--modelo", default="birefnet-portrait", help="modelo do rembg (padrão birefnet-portrait; mais leve: u2net_human_seg)")
    ap.add_argument("--fps", type=float, default=30.0)
    ap.add_argument("--de", type=float, help="início do trecho (s); o arquivo sai só com o trecho (na cena, \"deRecorte\" = frame desse instante)")
    ap.add_argument("--ate", type=float, help="fim do trecho (s)")
    ap.add_argument("--prores", action="store_true", help="gera também .mov ProRes 4444 com alfa")
    ap.add_argument("--regiao", help="x,y,largura,altura (0-1): só essa região passa pelo modelo, o resto sai transparente "
                    "(ex.: a fatia 9:16 de uma fonte 16:9). Mais rápido; o arquivo continua do tamanho da entrada")
    ap.add_argument("--chroma", help="cor do fundo verde/azul (#RRGGBB): recorte por chroma key só com ffmpeg, sem rembg")
    ap.add_argument("--similaridade", type=float, default=0.13, help="chromakey: quanto da cor sai (0,08-0,2)")
    ap.add_argument("--suavidade", type=float, default=0.06, help="chromakey: borda (0,03-0,1)")
    a = ap.parse_args()

    if a.chroma:
        cor = a.chroma.lstrip("#")
        r, g, b = int(cor[0:2], 16), int(cor[2:4], 16), int(cor[4:6], 16)
        spill = "green" if g >= b else "blue"
        corte = []
        if a.de is not None:
            corte += ["-ss", f"{a.de:.3f}"]
        if a.ate is not None:
            corte += ["-to", f"{a.ate:.3f}"]
        os.makedirs(os.path.dirname(os.path.abspath(a.saida)) or ".", exist_ok=True)
        vf = f"fps={a.fps},chromakey=0x{cor}:{a.similaridade}:{a.suavidade},despill=type={spill},format=yuva420p"
        rodar(["ffmpeg", "-v", "error", "-y", *corte, "-i", a.entrada, "-vf", vf, "-an", "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p",
               "-auto-alt-ref", "0", "-b:v", "0", "-crf", "30", "-row-mt", "1", a.saida])
        print(f"ok (chroma {a.chroma}): {a.saida}")
        if a.prores:
            mov = os.path.splitext(a.saida)[0] + ".mov"
            rodar(["ffmpeg", "-v", "error", "-y", *corte, "-i", a.entrada, "-vf", vf.replace("yuva420p", "yuva444p10le"), "-an",
                   "-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le", mov])
            print(f"ok: {mov}")
        return

    if sys.platform == "win32":
        # O onnxruntime chama platform.system(), que no Python 3.12+ consulta o WMI. Com o serviço
        # WMI travado, o import fica parado para sempre sem erro; sem o _wmi, o platform usa o registro.
        import platform
        platform._wmi = None
    try:
        import numpy as np
        from rembg import new_session, remove  # import tardio: --help funciona sem o rembg
    except ImportError:
        sys.exit('rembg/numpy não encontrados. Instale com: pip install "rembg[cpu]"  (opcional; ver references/remotion-padroes.md)')

    # Quadros passam por pipe (ffmpeg -> rembg), sem PNG em disco: 1 min de 1080p em PNG ocupava
    # ~10 GB no temp e uma rodada real saiu com 605 de 1575 quadros sem erro nenhum. Durante a
    # inferência só a máscara (cinza, FFV1 sem perda, 1 thread) é gravada: um encoder VP9 rodando junto
    # deixou cada quadro do modelo 4x mais lento (medido: 0,35 s -> 1,4 s). O VP9 com alfa sai no
    # fim, juntando cor + máscara (alphamerge) com a CPU livre.
    sv = json.loads(rodar(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                           "-of", "json", a.entrada]).stdout)["streams"][0]
    w, h = int(sv["width"]), int(sv["height"])
    rx, ry, rw, rh = 0, 0, w, h
    if a.regiao:
        fx, fy, fw, fh = (float(v) for v in a.regiao.split(","))
        rx, ry = int(fx * w) // 2 * 2, int(fy * h) // 2 * 2
        rw, rh = min(w - rx, int(fw * w) // 2 * 2), min(h - ry, int(fh * h) // 2 * 2)
    corte = []
    if a.de is not None:
        corte += ["-ss", f"{a.de:.3f}"]
    if a.ate is not None:
        corte += ["-to", f"{a.ate:.3f}"]
    os.makedirs(os.path.dirname(os.path.abspath(a.saida)) or ".", exist_ok=True)
    tmp = tempfile.mkdtemp(prefix="recorte_")
    mascara = os.path.join(tmp, "mascara.mkv")
    log = os.path.join(tmp, "ffmpeg.log")
    mov = os.path.splitext(a.saida)[0] + ".mov"
    try:
        with open(log, "w") as l1:
            leitor = subprocess.Popen(["ffmpeg", "-nostdin", "-v", "error", *corte, "-i", a.entrada, "-vf", f"fps={a.fps}",
                                       "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE, stderr=l1)
            gravador = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "gray", "-s", f"{w}x{h}",
                                         "-framerate", str(a.fps), "-i", "-", "-c:v", "ffv1", "-threads", "1", mascara],
                                        stdin=subprocess.PIPE, stderr=l1)
            sessao = new_session(a.modelo)
            t0 = time.time()
            tam, n = w * h * 3, 0
            alfa = np.zeros((h, w), dtype=np.uint8)
            while True:
                buf = leitor.stdout.read(tam)
                if len(buf) < tam:
                    break
                quadro = np.frombuffer(buf, dtype=np.uint8).reshape(h, w, 3)
                rec = remove(np.ascontiguousarray(quadro[ry:ry + rh, rx:rx + rw]), session=sessao)
                alfa[ry:ry + rh, rx:rx + rw] = np.asarray(rec)[:, :, 3]
                gravador.stdin.write(alfa.tobytes())
                n += 1
                if n % 60 == 0:
                    print(f"{n} quadros", flush=True)
            leitor.wait()
            gravador.stdin.close()
            gravador.wait()
        if leitor.returncode or gravador.returncode or not n:
            sys.exit(f"falhou ({n} quadros)\n{open(log).read()[-2000:]}")
        print(f"{n} quadros com máscara em {time.time() - t0:.0f}s; codificando o vídeo com alfa...", flush=True)
        t1 = time.time()
        juntar = ["ffmpeg", "-nostdin", "-v", "error", "-y", *corte, "-i", a.entrada, "-i", mascara, "-filter_complex",
                  f"[0:v]fps={a.fps},format=rgba[c];[1:v]format=gray[m];[c][m]alphamerge[v]", "-map", "[v]", "-an", "-frames:v", str(n)]
        rodar(juntar + ["-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-auto-alt-ref", "0", "-b:v", "0", "-crf", "28",
                        "-row-mt", "1", "-deadline", "good", "-cpu-used", "4", a.saida])
        print(f"WebM em {time.time() - t1:.0f}s", flush=True)
        if a.prores:
            rodar(juntar + ["-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le", mov])
        # confere: o WebM tem que ter um quadro de alfa para cada quadro lido
        r = rodar(["ffmpeg", "-nostdin", "-v", "error", "-c:v", "libvpx-vp9", "-i", a.saida, "-map", "0:v", "-f", "null", "-",
                   "-progress", "pipe:1", "-nostats"])
        n_saida = max([int(l.split("=")[1]) for l in r.stdout.splitlines() if l.startswith("frame=")] or [0])
        print(f"quadros: lidos {n}, no WebM {n_saida}")
        if n_saida != n:
            sys.exit(f"ERRO: o WebM tem {n_saida} quadros e foram lidos {n}. Não use este arquivo.")
        print(f"ok: {a.saida}" + (f" e {mov}" if a.prores else ""))
        if a.de:
            print(f"atenção: o recorte começa em {a.de:.2f}s do original; na cena, use \"deRecorte\" = frame desse instante.")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
