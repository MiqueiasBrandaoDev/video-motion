"""Aplica o cortes.json ao VÍDEO e à voz juntos (talking head), com sincronia garantida.

Mesmo plano e mesmo planejamento do cortar.py (janelas `manter`, trechos `remover`, pausas
apertadas, respiros), mas cortando imagem e som no mesmo grafo do ffmpeg:

  1. Lê o vídeo (16:9 ou 9:16, qualquer fps) e extrai o áudio para achar as ilhas de fala.
  2. Calcula os trechos com cortar.planejar() e ARREDONDA cada borda para a grade de quadros
     do vídeo fonte (sem isso, cada corte deixa uma fração de quadro de erro e a boca
     descola da voz depois de 10-20 cortes).
  3. Para cada trecho: trim (por número de quadro) + setpts no vídeo; atrim + asetpts +
     fade de 10-15 ms no áudio. Concat v=1 a=1.
  4. Acelera os dois JUNTOS: setpts=PTS/tempo no vídeo e atempo=tempo no áudio (tom preservado).
     Saída em fps fixo (padrão 30) e lado maior até 1920 px.
  5. Voz: highpass 80 Hz + loudnorm 2 passadas (-14 LUFS, TP -1) -> public/voz.wav.
  6. Vídeo: H.264 CRF 18, GOP de 1 s (busca rápida no OffthreadVideo) -> public/orador.mp4,
     com a voz normalizada embutida (o Remotion usa o vídeo mudo + voz.wav/mix.wav).
  7. Confere a sincronia (ffprobe): duração do vídeo x duração da voz; erro se passar de 1 quadro.
  8. Grava src/data/blocos.json (duração, início de cada bloco, mapa original -> novo).

Frame N de orador.mp4 = frame N da timeline do Remotion: cada cena começa o vídeo em
`trimBefore = ini` (cena orador faz isso sozinha).

Uso:
  python -I scripts/cortar_video.py --entrada gravacao.mp4 [--projeto .] [--plano cortes.json]
         [--video-saida public/orador.mp4] [--saida public/voz.wav] [--blocos src/data/blocos.json]
         [--fps 30] [--lado-max 1920] [--crf 18] [--sem-audio-no-video]

Depois: retranscreva public/voz.wav (transcrever.py) e gere legendas/marcos (legendas.py).
Recorte com alfa (texto atrás da pessoa), se quiser: recortar_orador.py public/orador.mp4 ...
"""
import argparse
import json
import os
import subprocess
import sys
from fractions import Fraction

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)  # python -I tira a pasta do script do sys.path; esta é a pasta da skill (confiável)
from cortar import duracao, filtro_arquivo, loudnorm_2p, planejar, rodar  # noqa: E402


def sonda(arq):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height,r_frame_rate,nb_frames",
                        "-of", "json", arq], capture_output=True, text=True, encoding="utf-8", errors="ignore")
    if r.returncode:
        sys.exit(f"ffprobe falhou em {arq}:\n{r.stderr[-800:]}")
    ss = json.loads(r.stdout).get("streams", [])
    v = next((s for s in ss if s.get("codec_type") == "video"), None)
    a = next((s for s in ss if s.get("codec_type") == "audio"), None)
    return v, a


def quadros(arq):
    """Conta os quadros do vídeo (pacotes), exato para H.264."""
    r = rodar(["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_packets", "-show_entries", "stream=nb_read_packets",
               "-of", "csv=p=0", arq])
    return int(r.stdout.strip().split(",")[0])


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Corta vídeo + voz pelo cortes.json com sincronia (trim/atrim + concat + setpts/atempo).")
    ap.add_argument("--entrada", required=True, help="gravação original com rosto (mp4, mov, webm)")
    ap.add_argument("--projeto", default=".", help="raiz do projeto (padrão: pasta atual)")
    ap.add_argument("--plano", default="cortes.json", help="plano de cortes, relativo ao projeto")
    ap.add_argument("--video-saida", default=os.path.join("public", "orador.mp4"), help="vídeo cortado, relativo ao projeto")
    ap.add_argument("--saida", default=os.path.join("public", "voz.wav"), help="voz final, relativa ao projeto")
    ap.add_argument("--blocos", default=os.path.join("src", "data", "blocos.json"), help="blocos.json, relativo ao projeto")
    ap.add_argument("--fps", type=int, default=30, help="fps de saída (o mesmo do config.json)")
    ap.add_argument("--lado-max", type=int, default=1920, help="lado maior do vídeo de saída (px)")
    ap.add_argument("--crf", type=int, default=18)
    ap.add_argument("--sem-audio-no-video", action="store_true", help="não embute a voz no orador.mp4")
    a = ap.parse_args()

    raiz = os.path.abspath(a.projeto)
    p = lambda x: x if os.path.isabs(x) else os.path.join(raiz, x)
    plano = json.load(open(p(a.plano), encoding="utf-8"))
    tempo = float(plano.get("tempo", 1.2))
    fade = float(plano.get("fade", 0.012))
    if not 0.5 <= tempo <= 2.0:
        sys.exit("tempo fora de 0,5-2,0. O padrão para fala é 1,2-1,25.")

    entrada = a.entrada if os.path.exists(a.entrada) else p(a.entrada)
    if not os.path.exists(entrada):
        sys.exit(f"entrada não encontrada: {a.entrada}")
    sv, sa = sonda(entrada)
    if not sv:
        sys.exit("a entrada não tem vídeo: use cortar.py (só voz).")
    if not sa:
        sys.exit("a entrada não tem áudio: junte a voz ao vídeo antes (ffmpeg -i video -i voz -map 0:v -map 1:a -c:v copy ...).")
    fps_src = Fraction(sv["r_frame_rate"])
    if fps_src <= 0:
        sys.exit(f"fps inválido no vídeo: {sv['r_frame_rate']}")

    work = os.path.join(raiz, "work")
    os.makedirs(work, exist_ok=True)
    orig = os.path.join(work, "orig.wav")
    rodar(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", entrada, "-vn", "-ac", "1", "-ar", "48000", "-c:a", "pcm_s16le", orig])
    total = duracao(orig)

    # trechos do MESMO planejamento da voz, com as bordas na grade de quadros do vídeo fonte
    trechos, ult = [], 0
    for tr in planejar(orig, plano, total):
        q0 = max(ult, round(Fraction(tr["orig_ini"]) * fps_src))
        q1 = round(Fraction(tr["orig_fim"]) * fps_src)
        if q1 - q0 < 2:
            continue
        trechos.append({**tr, "q0": q0, "q1": q1, "orig_ini": round(float(q0 / fps_src), 4), "orig_fim": round(float(q1 / fps_src), 4)})
        ult = q1
    if not trechos:
        sys.exit("nenhum trecho sobrou depois de alinhar à grade de quadros.")

    M = a.lado_max
    escala = f"scale=w='if(gte(iw,ih),min(iw,{M}),-2)':h='if(gte(iw,ih),-2,min(ih,{M}))'"
    filtros, rot, t_novo = [], [], Fraction(0)
    for i, tr in enumerate(trechos):
        ini_s, fim_s = Fraction(tr["q0"]) / fps_src, Fraction(tr["q1"]) / fps_src
        d = float(fim_s - ini_s)
        filtros.append(f"[0:v]trim=start_frame={tr['q0']}:end_frame={tr['q1']},setpts=PTS-STARTPTS[v{i}]")
        filtros.append(f"[0:a]aresample=48000,aformat=channel_layouts=mono,atrim=start={float(ini_s):.6f}:end={float(fim_s):.6f},"
                       f"asetpts=PTS-STARTPTS,afade=t=in:d={fade},afade=t=out:st={max(0.0, d - fade):.6f}:d={fade}[a{i}]")
        rot.append(f"[v{i}][a{i}]")
        tr["novo_ini"] = round(float(t_novo) / tempo, 4)
        tr["novo_fim"] = round(float(t_novo + (fim_s - ini_s)) / tempo, 4)
        t_novo += fim_s - ini_s
    filtros.append("".join(rot) + f"concat=n={len(trechos)}:v=1:a=1[vc][ac]")
    filtros.append(f"[vc]setpts=PTS/{tempo},fps={a.fps},{escala},format=yuv420p[vout]")
    filtros.append(f"[ac]atempo={tempo},highpass=f=80[aout]")
    grafo = os.path.join(work, "cortes_video_grafo.txt")
    with open(grafo, "w", encoding="utf-8") as f:
        f.write(";\n".join(filtros))

    vid_tmp = os.path.join(work, "orador_mudo.mp4")
    bruto = os.path.join(work, "voz_bruta.wav")
    print(f"cortando {len(trechos)} trechos (vídeo {sv['width']}x{sv['height']} @ {float(fps_src):.3f} fps, tempo {tempo})...")
    rodar(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", entrada] + filtro_arquivo(grafo) +
          ["-map", "[vout]", "-c:v", "libx264", "-preset", "medium", "-crf", str(a.crf), "-g", str(a.fps), "-r", str(a.fps),
           "-pix_fmt", "yuv420p", "-movflags", "+faststart", vid_tmp,
           "-map", "[aout]", "-ar", "48000", "-ac", "1", bruto])

    voz = p(a.saida)
    os.makedirs(os.path.dirname(voz), exist_ok=True)
    lufs, pico = loudnorm_2p(bruto, voz)
    dur_voz = duracao(voz)

    vid = p(a.video_saida)
    os.makedirs(os.path.dirname(vid), exist_ok=True)
    if a.sem_audio_no_video:
        rodar(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", vid_tmp, "-c", "copy", vid])
    else:
        rodar(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", vid_tmp, "-i", voz, "-map", "0:v", "-map", "1:a",
               "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", vid])

    n_q = quadros(vid)
    dur_vid = n_q / a.fps
    dif_ms = (dur_vid - dur_voz) * 1000
    sv2, _ = sonda(vid)

    blocos = {}
    for tr in trechos:
        blocos.setdefault(tr["bloco"], round(tr["novo_ini"] * 1000))
    for tr in trechos:
        tr.pop("q0", None)
        tr.pop("q1", None)
    doc = {"_como_usar": "Gerado por scripts/cortar_video.py. Não edite à mão: edite cortes.json e rode de novo.",
           "original": os.path.basename(a.entrada), "duracao_original_s": round(total, 3),
           "duracao_s": round(dur_voz, 3), "tempo": tempo, "lufs": lufs, "pico_dbfs": pico,
           "video": {"arquivo": os.path.relpath(vid, os.path.join(raiz, "public")).replace(os.sep, "/"), "fps": a.fps, "quadros": n_q,
                     "largura": sv2.get("width"), "altura": sv2.get("height"), "fonte": f"{sv['width']}x{sv['height']}@{float(fps_src):.3f}",
                     "diferenca_ms": round(dif_ms, 1)},
           "blocos": blocos, "trechos": trechos}
    destino = p(a.blocos)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    with open(destino, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=1)

    print(f"vídeo: {vid}  {n_q} quadros @ {a.fps} fps = {dur_vid:.3f}s  ({sv2.get('width')}x{sv2.get('height')})")
    print(f"voz:   {voz}  {total:.1f}s -> {dur_voz:.3f}s  ({lufs} LUFS, pico {pico} dBFS)")
    print(f"sincronia: vídeo - voz = {dif_ms:+.1f} ms ({abs(dif_ms) / (1000 / a.fps):.2f} quadro)")
    print(f"{len(trechos)} trechos, blocos: " + ", ".join(f"{k}@{v / 1000:.2f}s" for k, v in blocos.items()))
    if abs(dif_ms) > 1000 / a.fps + 1:
        sys.exit("ERRO: vídeo e voz diferem mais de 1 quadro. Confira o fps da entrada e se o áudio começa junto do vídeo.")
    print("próximo passo: transcrever public/voz.wav -> legendas.py; opcional: recortar_orador.py public/orador.mp4")


if __name__ == "__main__":
    main()
