"""Edita a locução a partir de um plano (cortes.json) e gera a voz final + blocos.json.

O que faz, sempre a partir do ORIGINAL (nunca acelera em cima de áudio já acelerado):
  1. Converte o original para wav mono 48 kHz (aceita áudio ou vídeo).
  2. Acha as ilhas de fala (complemento do silencedetect).
  3. Mantém só a fala dentro das janelas "manter" (recorta a ilha na borda da janela).
  4. Tira os trechos "remover" (tropeço, repetição, instrução falada para o agente).
  5. Pausa natural <= pausa_max fica; pausa maior vira pos + pre (respiro curto).
  6. Fade de 10-15 ms em cada borda, concat, atempo (tom preservado), highpass 80 Hz.
  7. loudnorm em 2 passadas: -14 LUFS integrado, true peak -1 dBTP.

Plano (cortes.json), tempos em segundos do original:
  {"tempo": 1.3, "pausa_max": 0.28, "pos": 0.12, "pre": 0.08, "fade": 0.012,
   "silencio_db": -36, "silencio_min_s": 0.22,
   "manter": [{"ini": 0.0, "fim": 8.5, "bloco": "gancho"}, ...],
   "remover": [{"ini": 30.1, "fim": 33.4, "gap": 0.14, "motivo": "..."}]}

Saídas: a voz editada (padrão public/voz.wav) e src/data/blocos.json com a duração,
o início de cada bloco na timeline final (ms) e o mapa trecho original -> novo.

Uso:
  python -I scripts/cortar.py --entrada <gravação> [--projeto .] [--plano cortes.json]
         [--saida public/voz.wav] [--blocos src/data/blocos.json]
"""
import argparse
import json
import os
import re
import subprocess
import sys


def rodar(cmd, checar=True):
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore")
    if checar and r.returncode:
        sys.exit(f"ffmpeg falhou:\n{r.stderr[-2500:]}")
    return r


def versao_ffmpeg():
    r = rodar(["ffmpeg", "-version"])
    m = re.search(r"ffmpeg version n?(\d+)", r.stdout)
    return int(m.group(1)) if m else 6


def filtro_arquivo(caminho):
    """Opção para ler o grafo de filtros de um arquivo (evita limite de linha de comando)."""
    return ["-/filter_complex", caminho] if versao_ffmpeg() >= 7 else ["-filter_complex_script", caminho]


def duracao(arq):
    return float(rodar(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", arq]).stdout.strip())


def silencios(wav, db, minimo):
    r = rodar(["ffmpeg", "-hide_banner", "-i", wav, "-af", f"silencedetect=noise={db}dB:d={minimo}", "-f", "null", "-"])
    ini = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", r.stderr)]
    fim = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r.stderr)]
    if len(fim) < len(ini):
        fim.append(duracao(wav))
    return list(zip(ini, fim))


def loudnorm_2p(entrada, saida, alvo=-14.0, tp=-1.0):
    r = rodar(["ffmpeg", "-hide_banner", "-i", entrada, "-af", f"loudnorm=I={alvo}:TP={tp}:LRA=11:print_format=json", "-f", "null", "-"])
    m = json.loads(r.stderr[r.stderr.rfind("{"): r.stderr.rfind("}") + 1])
    ln = (f"loudnorm=I={alvo}:TP={tp}:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
          f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    rodar(["ffmpeg", "-y", "-hide_banner", "-i", entrada, "-af", ln, "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", saida])
    r = rodar(["ffmpeg", "-hide_banner", "-i", saida, "-af", "ebur128=peak=true", "-f", "null", "-"])
    integ = re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)
    pico = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", r.stderr)
    return (float(integ[-1]) if integ else None, float(pico[-1]) if pico else None)


def planejar(orig, plano, total):
    """Trechos do original que ficam (fala dentro de `manter`, sem `remover`, pausas apertadas).

    Retorna [{"orig_ini", "orig_fim", "bloco"}] em segundos do original. Usado também por
    cortar_video.py, para o vídeo e a voz saírem do MESMO plano.
    """
    pausa_max = float(plano.get("pausa_max", 0.28))
    pos, pre, fade = float(plano.get("pos", 0.12)), float(plano.get("pre", 0.08)), float(plano.get("fade", 0.012))
    manter = sorted(plano["manter"], key=lambda j: j["ini"])
    remover = sorted(plano.get("remover", []), key=lambda j: j["ini"])
    # 1) ilhas de fala
    ilhas, t = [], 0.0
    for s, e in silencios(orig, plano.get("silencio_db", -36), plano.get("silencio_min_s", 0.22)):
        if s - t > 0.06:
            ilhas.append((max(0.0, t), s))
        t = e
    if total - t > 0.06:
        ilhas.append((t, total))

    # 2) recorta pelas janelas manter
    falas = []
    for j in manter:
        for a0, b0 in ilhas:
            ini, fim = max(a0, j["ini"]), min(b0, j["fim"])
            if fim - ini > 0.05:
                falas.append([ini, fim, j["bloco"]])
    falas.sort()

    # 3) tira os trechos remover (divide a fala; guarda o gap pedido)
    partes = []
    for ini, fim, bl in falas:
        pedacos = [(ini, fim, None)]
        for r in remover:
            novo = []
            for x0, x1, g in pedacos:
                if x1 <= r["ini"] or x0 >= r["fim"]:
                    novo.append((x0, x1, g))
                    continue
                if x0 < r["ini"]:
                    novo.append((x0, r["ini"], float(r.get("gap", 0.14))))
                if x1 > r["fim"]:
                    novo.append((r["fim"], x1, g))
            pedacos = novo
        partes += [{"ini": x0, "fim": x1, "bloco": bl, "gap": g} for x0, x1, g in pedacos if x1 - x0 > 0.04]

    # 4) junta pausas naturais curtas do mesmo bloco
    segs = []
    for s in partes:
        u = segs[-1] if segs else None
        if u and u["gap"] is None and u["bloco"] == s["bloco"] and s["ini"] - u["fim"] <= pausa_max:
            u["fim"], u["gap"] = s["fim"], s["gap"]
        else:
            segs.append(dict(s))

    # 5) respiros
    trechos = []
    for i, s in enumerate(segs):
        antes = segs[i - 1]["gap"] if i and segs[i - 1]["gap"] is not None else None
        ini = max(0.0, s["ini"] - (antes if antes is not None else pre))
        fim = min(total, s["fim"] + (0.0 if s["gap"] is not None else pos))
        # o respiro não pode entrar num trecho removido: quando o `remover` termina no silêncio antes
        # da fala seguinte, o `pre` padrão trazia de volta os últimos ~80 ms do que saiu (e o `pos`, o começo)
        for r in remover:
            if r["ini"] < s["ini"] and ini < r["fim"] <= s["ini"] + 1e-6:
                ini = r["fim"]
            if s["fim"] - 1e-6 <= r["ini"] < fim and r["fim"] > s["fim"]:
                fim = r["ini"]
        if trechos:
            ini = max(ini, trechos[-1]["orig_fim"])
        if fim - ini > 2 * fade:
            trechos.append({"orig_ini": round(ini, 3), "orig_fim": round(fim, 3), "bloco": s["bloco"]})
    if not trechos:
        sys.exit("nenhum trecho de fala dentro das janelas 'manter'. Confira os tempos do plano.")

    return trechos


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Corta, aperta pausas, acelera (atempo) e normaliza a locução a partir de cortes.json.")
    ap.add_argument("--entrada", required=True, help="gravação original (áudio ou vídeo)")
    ap.add_argument("--projeto", default=".", help="raiz do projeto (padrão: pasta atual)")
    ap.add_argument("--plano", default="cortes.json", help="plano de cortes, relativo ao projeto")
    ap.add_argument("--saida", default=os.path.join("public", "voz.wav"), help="voz final, relativa ao projeto")
    ap.add_argument("--blocos", default=os.path.join("src", "data", "blocos.json"), help="blocos.json, relativo ao projeto")
    a = ap.parse_args()

    raiz = os.path.abspath(a.projeto)
    p = lambda x: x if os.path.isabs(x) else os.path.join(raiz, x)
    plano = json.load(open(p(a.plano), encoding="utf-8"))
    tempo = float(plano.get("tempo", 1.3))
    fade = float(plano.get("fade", 0.012))
    if not 0.5 <= tempo <= 2.0:
        sys.exit("tempo fora de 0,5-2,0. O padrão para fala é 1,3 (mínimo).")
    if tempo < 1.3:
        print(f"AVISO: tempo {tempo} abaixo do mínimo de 1,3 (regra padrão: fala acelerada 1,3x ou mais; ver SKILL.md, fase 6).")

    work = os.path.join(raiz, "work")
    os.makedirs(work, exist_ok=True)
    orig = os.path.join(work, "orig.wav")
    entrada = a.entrada if os.path.exists(a.entrada) else p(a.entrada)
    if not os.path.exists(entrada):
        sys.exit(f"entrada não encontrada: {a.entrada}")
    rodar(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", entrada,
           "-vn", "-ac", "1", "-ar", "48000", "-c:a", "pcm_s16le", orig])
    total = duracao(orig)

    trechos = planejar(orig, plano, total)

    # 6) grafo de filtros
    filtros, rot, t_novo = [], [], 0.0
    for i, tr in enumerate(trechos):
        d = tr["orig_fim"] - tr["orig_ini"]
        filtros.append(f"[0:a]atrim={tr['orig_ini']:.3f}:{tr['orig_fim']:.3f},asetpts=PTS-STARTPTS,"
                       f"afade=t=in:d={fade},afade=t=out:st={d - fade:.3f}:d={fade}[s{i}]")
        rot.append(f"[s{i}]")
        tr["novo_ini"] = round(t_novo / tempo, 3)
        tr["novo_fim"] = round((t_novo + d) / tempo, 3)
        t_novo += d
    filtros.append("".join(rot) + f"concat=n={len(trechos)}:v=0:a=1,atempo={tempo},highpass=f=80[cat]")
    grafo = os.path.join(work, "cortes_grafo.txt")
    with open(grafo, "w", encoding="utf-8") as f:
        f.write(";\n".join(filtros))
    bruto = os.path.join(work, "voz_bruta.wav")
    rodar(["ffmpeg", "-y", "-hide_banner", "-i", orig] + filtro_arquivo(grafo) + ["-map", "[cat]", "-ar", "48000", "-ac", "1", bruto])

    # 7) loudnorm
    saida = p(a.saida)
    os.makedirs(os.path.dirname(saida), exist_ok=True)
    lufs, pico = loudnorm_2p(bruto, saida)
    dur_final = duracao(saida)

    blocos = {}
    for tr in trechos:
        blocos.setdefault(tr["bloco"], round(tr["novo_ini"] * 1000))
    doc = {"_como_usar": "Gerado por scripts/cortar.py. Não edite à mão: edite cortes.json e rode de novo.",
           "original": os.path.basename(a.entrada), "duracao_original_s": round(total, 3),
           "duracao_s": round(dur_final, 3), "tempo": tempo, "lufs": lufs, "pico_dbfs": pico,
           "blocos": blocos, "trechos": trechos}
    destino = p(a.blocos)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    with open(destino, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=1)

    print(f"voz: {saida}  {total:.1f}s -> {dur_final:.1f}s  (atempo {tempo}, {lufs} LUFS, pico {pico} dBFS)")
    print(f"{len(trechos)} trechos, blocos: " + ", ".join(f"{k}@{v / 1000:.2f}s" for k, v in blocos.items()))
    print("próximo passo: retranscrever a voz final (transcrever.py) e gerar legendas/marcos (legendas.py)")


if __name__ == "__main__":
    main()
