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
     Saída em fps fixo (padrão 30) e lado maior até 1920 px. Com "tempo": "auto", o fator sai da
     velocidade-alvo em sílabas/s (scripts/velocidade.py, igual ao cortar.py), medida na transcrição
     do original (--transcricao, padrão work/transcricao.json) sobre os trechos do corpo.
  5. Voz: highpass 80 Hz + loudnorm 2 passadas (-14 LUFS, TP -1) -> public/voz.wav.
  6. Vídeo: H.264 CRF 18, GOP de 1 s (busca rápida no OffthreadVideo) -> public/orador.mp4,
     com a voz normalizada embutida (o Remotion usa o vídeo mudo + voz.wav/mix.wav).
  7. Confere a sincronia (ffprobe): duração do vídeo x duração da voz; erro se passar de 1 quadro.
  8. Grava src/data/blocos.json (duração, início de cada bloco, mapa original -> novo).

Frame N de orador.mp4 = frame N da timeline do Remotion: cada cena começa o vídeo em
`trimBefore = ini` (cena orador faz isso sozinha).

Teaser (cold open / flash-forward), opcional: campo "teaser" no cortes.json com a janela da
FRASE DE IMPACTO em segundos do original (a mesma frase precisa estar dentro de um `manter`,
é o payoff que reaparece no meio do corte):
  "teaser": {"ini": 743.9, "fim": 748.4, "filtro": "megafone", "volta_s": 0.8, "ganho_db": -1,
             "remover": [], "tempo": 1.3}
"tempo" do teaser: número = fator só do teaser; sem o campo (ou "auto") = o fator do corpo, já
resolvido (com "tempo": "auto" no plano, o mesmo fator calculado para o corpo; o teaser não entra
na medida, que é só do corpo).
O trecho vai para o COMEÇO da timeline: voz com filtro de megafone (ou "radio", ou uma cadeia
ffmpeg própria em "filtro"), depois `volta_s` de silêncio para a transição (o vídeo congela no
último quadro; a cena `volta` cobre esse tempo) e então o corpo normal. blocos.json ganha os
blocos "teaser" (0), "volta" (fim do teaser), "payoff" (onde a frase reaparece no corpo) e o
objeto "teaser" com os tempos. Som da transição: scripts/som_volta.py.

Uso:
  python -I scripts/cortar_video.py --entrada gravacao.mp4 [--projeto .] [--plano cortes.json]
         [--video-saida public/orador.mp4] [--saida public/voz.wav] [--blocos src/data/blocos.json]
         [--fps 30] [--lado-max 1920] [--crf 18] [--sem-audio-no-video] [--transcricao work/transcricao.json]

Depois: retranscreva public/voz.wav (transcrever.py) e gere legendas/marcos (legendas.py).
Recorte com alfa (texto atrás da pessoa), se quiser: recortar_orador.py public/orador.mp4 ...
"""
import argparse
import json
import os
import re
import subprocess
import sys
from fractions import Fraction

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)  # python -I tira a pasta do script do sys.path; esta é a pasta da skill (confiável)
import velocidade  # noqa: E402
from cortar import duracao, filtro_arquivo, loudnorm_2p, planejar, rodar  # noqa: E402

# Voz do teaser. Megafone/corneta: passa-faixa ~700 Hz-3,5 kHz (6 polos embaixo, 4 em cima),
# ressonâncias da corneta em 1,7 e 2,6 kHz, compressão forte, overdrive (tanh com oversample),
# duas reflexões curtas de metal, segundo compressor + limitador e nova limitação de faixa (o
# clipe gera harmônicos fora da faixa). Medido com scripts/espectro.py na voz do TSA Cast:
# 97% da energia em 600-3400 Hz, centroide ~1,5 kHz, banda 5-95% de ~700 a ~2900 Hz.
# Rádio AM: faixa mais estreita (450-2800 Hz), menos saturação.
# Referências e números: references/sound-design.md, seção "Voz do teaser".
FILTROS_TEASER = {
    "megafone": ("highpass=f=700,highpass=f=700,highpass=f=700,lowpass=f=3500,lowpass=f=3500,"
                 "equalizer=f=1700:t=q:w=1.0:g=7,equalizer=f=2600:t=q:w=1.2:g=4,"
                 "acompressor=threshold=0.03:ratio=10:attack=1:release=50:makeup=6,"
                 "volume=11dB,asoftclip=type=tanh:threshold=0.4:oversample=4,"
                 "aecho=1:0.7:6|11:0.22|0.12,"
                 "acompressor=threshold=0.08:ratio=8:attack=0.5:release=30:makeup=3,"
                 "alimiter=limit=0.5:attack=1:release=20:level=false,"
                 "highpass=f=620,highpass=f=620,lowpass=f=3700,lowpass=f=3700"),
    "radio": ("highpass=f=450,highpass=f=450,lowpass=f=2800,lowpass=f=2800,"
              "equalizer=f=1400:t=q:w=1.4:g=4,"
              "acompressor=threshold=0.06:ratio=6:attack=3:release=90:makeup=3,"
              "volume=5dB,asoftclip=type=atan:threshold=0.7:oversample=4,"
              "alimiter=limit=0.6:attack=1:release=30:level=false,"
              "highpass=f=400,lowpass=f=3000,lowpass=f=3000"),
}


def filtro_teaser(nome):
    """Preset (megafone, radio, nenhum) ou uma cadeia ffmpeg própria."""
    if not nome or nome == "nenhum":
        return "anull"
    return FILTROS_TEASER.get(nome, nome)


def medir(arq):
    """LUFS integrado e true peak (ebur128)."""
    r = rodar(["ffmpeg", "-hide_banner", "-i", arq, "-af", "ebur128=peak=true", "-f", "null", "-"])
    integ = re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)
    pico = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", r.stderr)
    return (float(integ[-1]) if integ else None, float(pico[-1]) if pico else None)


def na_grade(trs, fps_src, ult=0):
    """Arredonda as bordas dos trechos para a grade de quadros da fonte (sem sobrepor)."""
    saida = []
    for tr in trs:
        q0 = max(ult, round(Fraction(tr["orig_ini"]) * fps_src))
        q1 = round(Fraction(tr["orig_fim"]) * fps_src)
        if q1 - q0 < 2:
            continue
        saida.append({**tr, "q0": q0, "q1": q1, "orig_ini": round(float(q0 / fps_src), 4), "orig_fim": round(float(q1 / fps_src), 4)})
        ult = q1
    return saida


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
    ap.add_argument("--transcricao", default=os.path.join("work", "transcricao.json"),
                    help='transcrição do ORIGINAL com tempo por palavra (fase 1A), para "tempo": "auto"; relativa ao projeto')
    a = ap.parse_args()

    raiz = os.path.abspath(a.projeto)
    p = lambda x: x if os.path.isabs(x) else os.path.join(raiz, x)
    plano = json.load(open(p(a.plano), encoding="utf-8"))
    tempo = velocidade.ler_tempo(plano)  # "auto" ou número (validado)
    fade = float(plano.get("fade", 0.012))

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
    trechos = na_grade(planejar(orig, plano, total), fps_src)
    if not trechos:
        sys.exit("nenhum trecho sobrou depois de alinhar à grade de quadros.")
    tempo, vel = velocidade.resolver(plano, tempo, trechos, p(a.transcricao), total)  # medida só do corpo

    # teaser: a frase de impacto vai para o começo (fora da ordem cronológica, por isso planeja à parte)
    tz = plano.get("teaser")
    tz_trechos = []
    if tz:
        sub = {**plano, "manter": [{"ini": float(tz["ini"]), "fim": float(tz["fim"]), "bloco": "teaser"}], "remover": tz.get("remover", [])}
        # o teaser corta SECO em `fim` (sem o respiro `pos`): costuma parar no meio da frase, antes da conclusão
        tz_plan = [{**tr, "orig_fim": min(tr["orig_fim"], float(tz["fim"]))} for tr in planejar(orig, sub, total)]
        tz_trechos = na_grade([tr for tr in tz_plan if tr["orig_fim"] - tr["orig_ini"] > 0.05], fps_src)
        if not tz_trechos:
            sys.exit("teaser: nenhuma fala dentro da janela ini-fim. Confira os tempos do original.")

    M = a.lado_max
    escala = f"scale=w='if(gte(iw,ih),min(iw,{M}),-2)':h='if(gte(iw,ih),-2,min(ih,{M}))',setsar=1"

    def segmentos(trs, pref, tmp):
        """trim/atrim + fade por trecho; preenche novo_ini/novo_fim (s, antes do deslocamento do teaser)."""
        fs, rot, t_novo = [], [], Fraction(0)
        for i, tr in enumerate(trs):
            ini_s, fim_s = Fraction(tr["q0"]) / fps_src, Fraction(tr["q1"]) / fps_src
            d = float(fim_s - ini_s)
            fs.append(f"[0:v]trim=start_frame={tr['q0']}:end_frame={tr['q1']},setpts=PTS-STARTPTS[{pref}v{i}]")
            fs.append(f"[0:a]aresample=48000,aformat=channel_layouts=mono,atrim=start={float(ini_s):.6f}:end={float(fim_s):.6f},"
                      f"asetpts=PTS-STARTPTS,afade=t=in:d={fade},afade=t=out:st={max(0.0, d - fade):.6f}:d={fade}[{pref}a{i}]")
            rot.append(f"[{pref}v{i}][{pref}a{i}]")
            tr["novo_ini"] = round(float(t_novo) / tmp, 4)
            tr["novo_fim"] = round(float(t_novo + (fim_s - ini_s)) / tmp, 4)
            t_novo += fim_s - ini_s
        fs.append("".join(rot) + f"concat=n={len(trs)}:v=1:a=1[{pref}vc][{pref}ac]")
        return fs, t_novo

    filtros, _ = segmentos(trechos, "", tempo)
    n_t = n_g = 0
    tempo_t = tempo
    if tz_trechos:
        t_tz = tz.get("tempo")  # número fixa o do teaser; sem o campo ou "auto", segue o fator do corpo
        tempo_t = tempo if t_tz is None or str(t_tz).strip().lower() == "auto" else float(t_tz)
        ft, dur_src_t = segmentos(tz_trechos, "t", tempo_t)
        filtros += ft
        n_t = round(float(dur_src_t) / tempo_t * a.fps)            # quadros do teaser na saída
        n_g = max(1, round(float(tz.get("volta_s", 0.8)) * a.fps))  # quadros da transição (silêncio)
        filtros.append(f"[tvc]setpts=PTS/{tempo_t},fps={a.fps},{escala},format=yuv420p,"
                       f"tpad=stop_mode=clone:stop={n_g + 4},trim=end_frame={n_t + n_g},setpts=PTS-STARTPTS[tvout]")
        filtros.append(f"[tac]{velocidade.atempo(tempo_t)},highpass=f=80,{filtro_teaser(tz.get('filtro', 'megafone'))},"
                       f"apad=whole_dur={n_t / a.fps:.6f},atrim=end={n_t / a.fps:.6f}[taout]")
        filtros.append(f"[vc]setpts=PTS/{tempo},fps={a.fps},{escala},format=yuv420p[vcorpo]")
        filtros.append("[tvout][vcorpo]concat=n=2:v=1:a=0[vout]")
    else:
        filtros.append(f"[vc]setpts=PTS/{tempo},fps={a.fps},{escala},format=yuv420p[vout]")
    filtros.append(f"[ac]{velocidade.atempo(tempo)},highpass=f=80[aout]")
    grafo = os.path.join(work, "cortes_video_grafo.txt")
    with open(grafo, "w", encoding="utf-8") as f:
        f.write(";\n".join(filtros))

    vid_tmp = os.path.join(work, "orador_mudo.mp4")
    bruto = os.path.join(work, "voz_bruta.wav")
    teaser_bruto = os.path.join(work, "teaser_bruto.wav")
    print(f"cortando {len(trechos)} trechos{f' + teaser ({len(tz_trechos)})' if tz_trechos else ''} "
          f"(vídeo {sv['width']}x{sv['height']} @ {float(fps_src):.3f} fps, tempo {tempo:g})...")
    rodar(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", entrada] + filtro_arquivo(grafo) +
          ["-map", "[vout]", "-c:v", "libx264", "-preset", "medium", "-crf", str(a.crf), "-g", str(a.fps), "-r", str(a.fps),
           "-pix_fmt", "yuv420p", "-movflags", "+faststart", vid_tmp,
           "-map", "[aout]", "-ar", "48000", "-ac", "1", bruto] +
          (["-map", "[taout]", "-ar", "48000", "-ac", "1", teaser_bruto] if tz_trechos else []))

    voz = p(a.saida)
    os.makedirs(os.path.dirname(voz), exist_ok=True)
    t_corpo = (n_t + n_g) / a.fps  # início do corpo na timeline (0 sem teaser)
    tz_doc = None
    if tz_trechos:
        corpo_norm = os.path.join(work, "voz_corpo.wav")
        teaser_norm = os.path.join(work, "voz_teaser.wav")
        loudnorm_2p(bruto, corpo_norm)
        lufs_t, _ = loudnorm_2p(teaser_bruto, teaser_norm, alvo=-14.0 + float(tz.get("ganho_db", -1.0)))
        rodar(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", teaser_norm, "-i", corpo_norm, "-filter_complex",
               f"[0:a]apad=whole_dur={t_corpo:.6f},atrim=end={t_corpo:.6f}[t];[t][1:a]concat=n=2:v=0:a=1[o]",
               "-map", "[o]", "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", voz])
        lufs, pico = medir(voz)
        for tr in trechos:
            tr["novo_ini"] = round(tr["novo_ini"] + t_corpo, 4)
            tr["novo_fim"] = round(tr["novo_fim"] + t_corpo, 4)

        def no_corpo(x):
            """Segundo do original -> segundo da timeline final (dentro do corpo)."""
            for tr in trechos:
                if tr["orig_ini"] - 1e-6 <= x <= tr["orig_fim"] + 1e-6:
                    return tr["novo_ini"] + (x - tr["orig_ini"]) / tempo
            depois = [tr for tr in trechos if tr["orig_ini"] > x]
            return depois[0]["novo_ini"] if depois else None

        fala_ini = max(float(tz["ini"]), tz_trechos[0]["orig_ini"])
        payoff = no_corpo(fala_ini)
        payoff_fim = no_corpo(min(float(tz["fim"]), tz_trechos[-1]["orig_fim"]))
        tz_doc = {"orig_ini": float(tz["ini"]), "orig_fim": float(tz["fim"]), "filtro": tz.get("filtro", "megafone"),
                  "tempo": tempo_t, "lufs": lufs_t, "quadros": n_t, "quadros_volta": n_g,
                  "fim_ms": round(n_t / a.fps * 1000), "volta_ms": round(n_t / a.fps * 1000), "volta_fim_ms": round(t_corpo * 1000),
                  "payoff_ms": round(payoff * 1000) if payoff is not None else None,
                  "payoff_fim_ms": round(payoff_fim * 1000) if payoff_fim is not None else None,
                  "trechos": [{k: tr[k] for k in ("orig_ini", "orig_fim", "novo_ini", "novo_fim")} for tr in tz_trechos]}
    else:
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
    if tz_doc:
        blocos["teaser"] = 0
        blocos["volta"] = tz_doc["volta_ms"]
    for tr in trechos:
        blocos.setdefault(tr["bloco"], round(tr["novo_ini"] * 1000))
    if tz_doc and tz_doc["payoff_ms"] is not None:
        blocos["payoff"] = tz_doc["payoff_ms"]
    for tr in trechos + tz_trechos:
        tr.pop("q0", None)
        tr.pop("q1", None)
    doc = {"_como_usar": "Gerado por scripts/cortar_video.py. Não edite à mão: edite cortes.json e rode de novo.",
           "original": os.path.basename(a.entrada), "duracao_original_s": round(total, 3),
           "duracao_s": round(dur_voz, 3), "tempo": tempo, "velocidade": vel, "lufs": lufs, "pico_dbfs": pico,
           "video": {"arquivo": os.path.relpath(vid, os.path.join(raiz, "public")).replace(os.sep, "/"), "fps": a.fps, "quadros": n_q,
                     "largura": sv2.get("width"), "altura": sv2.get("height"), "fonte": f"{sv['width']}x{sv['height']}@{float(fps_src):.3f}",
                     "diferenca_ms": round(dif_ms, 1)},
           "blocos": blocos, "trechos": trechos}
    if tz_doc:
        doc["teaser"] = tz_doc
    destino = p(a.blocos)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    with open(destino, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=1)

    print(f"vídeo: {vid}  {n_q} quadros @ {a.fps} fps = {dur_vid:.3f}s  ({sv2.get('width')}x{sv2.get('height')})")
    print(f"voz:   {voz}  {total:.1f}s -> {dur_voz:.3f}s  ({lufs} LUFS, pico {pico} dBFS)")
    print(f"sincronia: vídeo - voz = {dif_ms:+.1f} ms ({abs(dif_ms) / (1000 / a.fps):.2f} quadro)")
    print(f"{len(trechos)} trechos, blocos: " + ", ".join(f"{k}@{v / 1000:.2f}s" for k, v in blocos.items()))
    if tz_doc:
        d_t = tz_doc["fim_ms"] / 1000
        pay = "-" if tz_doc["payoff_ms"] is None else f"{tz_doc['payoff_ms'] / 1000:.2f}s"
        print(f"teaser: {d_t:.2f}s ({tz_doc['filtro']}, {tz_doc['lufs']} LUFS) + volta {n_g / a.fps:.2f}s; corpo começa em {t_corpo:.2f}s "
              f"e dura {dur_voz - t_corpo:.2f}s; payoff em {pay}")
        if not 3.0 <= d_t <= 5.5:
            print(f"AVISO: teaser com {d_t:.2f}s; a regra é 3-5 s (references/roteiros-e-ganchos.md, estrutura teaser).")
        if tz_doc["payoff_ms"] is None:
            print("AVISO: a frase do teaser não está em nenhum 'manter': ela precisa reaparecer no corpo (é o payoff).")
    if abs(dif_ms) > 1000 / a.fps + 1:
        sys.exit("ERRO: vídeo e voz diferem mais de 1 quadro. Confira o fps da entrada e se o áudio começa junto do vídeo.")
    print("próximo passo: transcrever public/voz.wav -> legendas.py; opcional: recortar_orador.py public/orador.mp4"
          + ("; som da transição: som_volta.py" if tz_doc else ""))


if __name__ == "__main__":
    main()
