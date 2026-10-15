"""OPCIONAL. Recorta o apresentador de um vídeo e gera um vídeo com canal alfa (texto atrás da pessoa).

Só para entrada com rosto filmado (talking head). O resultado alimenta a cena "recorte"
(template/src/comp/Recorte.tsx): fundo (vídeo original) -> texto/letreiro -> recorte com alfa.

Pré-requisito: o vídeo de entrada já cortado com os MESMOS trechos e o mesmo tempo da voz
editada (frame N do arquivo = frame N da timeline). Recorte depois de cortar, não antes.

Como funciona: extrai os quadros (ffmpeg), remove o fundo quadro a quadro com o rembg
(modelo de segmentação de pessoa) e codifica um WebM VP9 com alfa (yuva420p), que o
<OffthreadVideo transparent> do Remotion lê. Com --prores, gera também um .mov ProRes 4444.

Custo: pesado. Na CPU, ~0,3-1,5 s por quadro em 1080x1920 (1 min de vídeo a 30 fps = 1800
quadros). Use GPU (pip install "rembg[gpu]") ou recorte só os trechos que terão texto atrás
(--de/--ate em segundos). Alternativas mais rápidas e estáveis entre quadros: RobustVideoMatting
(github.com/PeterL1n/RobustVideoMatting) ou BiRefNet em lote; o formato de saída é o mesmo.

Instalação (uma vez): pip install "rembg[cpu]"   (ou rembg[gpu])
O modelo é baixado pelo rembg na primeira execução (~170 MB para birefnet-portrait).

Uso:
  python -I scripts/recortar_orador.py public/orador.mp4 public/orador-alfa.webm
         [--modelo birefnet-portrait|u2net_human_seg|isnet-general-use] [--fps 30]
         [--de 12.0 --ate 18.5] [--prores] [--manter-quadros]
"""
import argparse
import os
import shutil
import subprocess
import sys
import tempfile


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
    ap.add_argument("--de", type=float, help="início do trecho (s); o resto sai transparente")
    ap.add_argument("--ate", type=float, help="fim do trecho (s)")
    ap.add_argument("--prores", action="store_true", help="gera também .mov ProRes 4444 com alfa")
    ap.add_argument("--manter-quadros", action="store_true", help="não apaga os PNG intermediários")
    a = ap.parse_args()

    try:
        from rembg import new_session, remove  # import tardio: --help funciona sem o rembg
        from PIL import Image
    except ImportError:
        sys.exit('rembg/Pillow não encontrados. Instale com: pip install "rembg[cpu]"  (opcional; ver references/remotion-padroes.md)')

    tmp = tempfile.mkdtemp(prefix="recorte_")
    origem = os.path.join(tmp, "in")
    alfa = os.path.join(tmp, "alfa")
    os.makedirs(origem)
    os.makedirs(alfa)
    try:
        corte = []
        if a.de is not None:
            corte += ["-ss", f"{a.de:.3f}"]
        if a.ate is not None:
            corte += ["-to", f"{a.ate:.3f}"]
        rodar(["ffmpeg", "-v", "error", "-y", *corte, "-i", a.entrada, "-vf", f"fps={a.fps}", os.path.join(origem, "%06d.png")])
        quadros = sorted(os.listdir(origem))
        if not quadros:
            sys.exit("nenhum quadro extraído")
        sessao = new_session(a.modelo)
        for i, q in enumerate(quadros, 1):
            with Image.open(os.path.join(origem, q)) as im:
                remove(im, session=sessao).save(os.path.join(alfa, q))
            if i % 30 == 0 or i == len(quadros):
                print(f"{i}/{len(quadros)} quadros")
        os.makedirs(os.path.dirname(os.path.abspath(a.saida)) or ".", exist_ok=True)
        padrao = os.path.join(alfa, "%06d.png")
        rodar(["ffmpeg", "-v", "error", "-y", "-framerate", str(a.fps), "-i", padrao, "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p",
               "-auto-alt-ref", "0", "-b:v", "0", "-crf", "28", a.saida])
        print(f"ok: {a.saida}")
        if a.prores:
            mov = os.path.splitext(a.saida)[0] + ".mov"
            rodar(["ffmpeg", "-v", "error", "-y", "-framerate", str(a.fps), "-i", padrao, "-c:v", "prores_ks", "-profile:v", "4444",
                   "-pix_fmt", "yuva444p10le", mov])
            print(f"ok: {mov}")
        if a.de:
            print(f"atenção: o recorte começa em {a.de:.2f}s do original; na cena, use \"de\" = frame desse instante.")
    finally:
        if a.manter_quadros:
            print(f"quadros mantidos em {tmp}")
        else:
            shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
