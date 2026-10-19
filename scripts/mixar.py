"""Mixa voz + trilha + efeitos sonoros e entrega o áudio final (-14 LUFS, true peak -1 dBTP).

- Trilha começa em --offset s da faixa, normalizada para --musica-lufs no trecho usado
  (padrão -27 LUFS, que com o ducking fica ~20 dB abaixo da voz durante a fala).
- Ducking: sidechaincompress com a voz como chave (a música abaixa quando há fala).
- Fade-in --fade-in s, fade-out --fade-out s, subida de --subida-db a partir de --subida-em (CTA).
- Efeitos de work/sfx_resolvido.json (gerar_sfx.py): ganho para o pico alvo, pitch por
  asetrate, posicionados para o pico interno cair no tempo do evento.
- Sem voz (--sem-voz): vídeo só com tipografia + música; informe --duracao.
- Mix final em loudnorm 2 passadas.

Uso:
  python -I scripts/mixar.py [--projeto .] --musica public/musica/faixa.mp3 [--offset 0.8]
         [--voz public/voz.wav] [--sfx work/sfx_resolvido.json] [--saida public/mix.wav]
         [--subida-em bloco:cta] [--subida-db 3] [--musica-lufs -27]
  python -I scripts/mixar.py --sem-voz --duracao 30 --musica public/musica/faixa.mp3
"""
import argparse
import json
import os
import re
import subprocess
import sys


def rodar(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore")
    if r.returncode:
        sys.exit(f"ffmpeg falhou:\n{r.stderr[-3000:]}")
    return r


def filtro_arquivo(caminho):
    r = rodar(["ffmpeg", "-version"])
    m = re.search(r"ffmpeg version n?(\d+)", r.stdout)
    return ["-/filter_complex", caminho] if (int(m.group(1)) if m else 6) >= 7 else ["-filter_complex_script", caminho]


def duracao(arq):
    return float(rodar(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", arq]).stdout.strip())


def medir(arq, filtro=""):
    af = (filtro + "," if filtro else "") + "loudnorm=I=-14:TP=-1:LRA=11:print_format=json"
    r = rodar(["ffmpeg", "-hide_banner", "-i", arq, "-af", af, "-f", "null", "-"])
    return json.loads(r.stderr[r.stderr.rfind("{"): r.stderr.rfind("}") + 1])


def resolver_tempo(ref, raiz):
    """Aceita segundos (número) ou referência 'bloco:nome' / 'marco' (+/- ms)."""
    try:
        return float(ref)
    except ValueError:
        pass
    m = re.match(r"^(bloco:)?([\w.-]+?)([+-]\d+)?$", ref.strip())
    if not m:
        sys.exit(f"--subida-em inválido: {ref}")
    if m.group(1):
        arq = os.path.join(raiz, "src", "data", "blocos.json")
        tabela = json.load(open(arq, encoding="utf-8")).get("blocos", {}) if os.path.exists(arq) else {}
    else:
        arq = os.path.join(raiz, "src", "data", "marcos.json")
        tabela = json.load(open(arq, encoding="utf-8")) if os.path.exists(arq) else {}
    if m.group(2) not in tabela:
        sys.exit(f"referência não encontrada: {ref}")
    return (tabela[m.group(2)] + (int(m.group(3)) if m.group(3) else 0)) / 1000


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Mixa voz, trilha (com ducking) e SFX; loudnorm final -14 LUFS / -1 dBTP.")
    ap.add_argument("--projeto", default=".")
    ap.add_argument("--voz", default=os.path.join("public", "voz.wav"))
    ap.add_argument("--sem-voz", action="store_true", help="vídeo sem locução (só música + SFX)")
    ap.add_argument("--duracao", type=float, default=0.0, help="duração (s); obrigatória com --sem-voz")
    ap.add_argument("--musica", help="faixa de música (opcional)")
    ap.add_argument("--offset", type=float, default=0.0, help="segundo da faixa em que o vídeo começa")
    ap.add_argument("--musica-lufs", type=float, default=-27.0, help="nível da música antes do ducking")
    ap.add_argument("--fade-in", type=float, default=1.0)
    ap.add_argument("--fade-out", type=float, default=1.5)
    ap.add_argument("--subida-em", help="segundos ou referência (ex.: bloco:cta) onde a música sobe")
    ap.add_argument("--subida-db", type=float, default=3.0)
    ap.add_argument("--sfx", default=os.path.join("work", "sfx_resolvido.json"), help="eventos resolvidos (gerar_sfx.py)")
    ap.add_argument("--sem-sfx", action="store_true")
    ap.add_argument("--saida", default=os.path.join("public", "mix.wav"))
    a = ap.parse_args()

    raiz = os.path.abspath(a.projeto)
    p = lambda x: x if os.path.isabs(x) else os.path.join(raiz, x)
    work = os.path.join(raiz, "work")
    os.makedirs(work, exist_ok=True)

    entradas, cadeias, rotulos = [], [], []
    tem_voz = not a.sem_voz
    if tem_voz:
        voz = p(a.voz)
        if not os.path.exists(voz):
            sys.exit(f"voz não encontrada: {voz} (use --sem-voz para vídeo sem locução)")
        dur = duracao(voz)
        # o vídeo dura voz + config.extra_fim_s (card final): o mix vai até lá, senão o som do card final é cortado
        cfg_arq = os.path.join(raiz, "src", "data", "config.json")
        extra = float((json.load(open(cfg_arq, encoding="utf-8")) if os.path.exists(cfg_arq) else {}).get("extra_fim_s") or 0)
        dur += extra
        entradas += ["-i", voz]
        cadeias.append("[0:a]aresample=48000,aformat=channel_layouts=stereo,asplit=2[voz][chave]")
        rotulos.append("[voz]")
    else:
        if a.duracao <= 0:
            sys.exit("--sem-voz exige --duracao")
        dur = a.duracao

    if a.musica:
        mus = p(a.musica)
        idx = len(entradas) // 2
        med = medir(mus, f"atrim={a.offset}:{a.offset + dur}")
        alvo = a.musica_lufs if tem_voz else -16.0
        ganho = alvo - float(med["input_i"])
        sobe = ""
        if a.subida_em:
            t_sobe = resolver_tempo(a.subida_em, raiz)
            sobe = f"volume='if(gte(t,{max(0.0, t_sobe - 0.3):.3f}),{10 ** (a.subida_db / 20):.4f},1)':eval=frame,"
        entradas += ["-i", mus]
        cadeias.append(f"[{idx}:a]atrim={a.offset}:{a.offset + dur + 0.5},asetpts=PTS-STARTPTS,aresample=48000,"
                       f"aformat=channel_layouts=stereo,volume={ganho:.2f}dB,{sobe}"
                       f"afade=t=in:d={a.fade_in},afade=t=out:st={max(0.0, dur - a.fade_out):.3f}:d={a.fade_out}[mus]")
        if tem_voz:
            cadeias.append("[mus][chave]sidechaincompress=threshold=0.05:ratio=3:attack=15:release=350:makeup=1[musd]")
            rotulos.append("[musd]")
        else:
            rotulos.append("[mus]")
    elif tem_voz:
        cadeias.append("[chave]anullsink")

    eventos = []
    if not a.sem_sfx and os.path.exists(p(a.sfx)):
        eventos = json.load(open(p(a.sfx), encoding="utf-8"))
    sfx_rot = []
    for k, e in enumerate(eventos):
        idx = len(entradas) // 2
        arq = e["arquivo"] if os.path.isabs(e["arquivo"]) else p(e["arquivo"])
        entradas += ["-i", arq]
        fator = 2 ** (e["semitons"] / 12)
        ini = max(0.0, e["t"] - e["pico_interno_s"] / fator)
        ganho_e = e["pico_alvo_dbfs"] - e["pico_arquivo_dbfs"]
        atraso = int(ini * 1000)
        cadeias.append(f"[{idx}:a]aresample=48000,aformat=channel_layouts=stereo,asetrate={48000 * fator:.1f},"
                       f"aresample=48000,volume={ganho_e:.2f}dB,adelay={atraso}|{atraso},apad=whole_dur={dur:.3f}[e{k}]")
        sfx_rot.append(f"[e{k}]")
    if sfx_rot:
        cadeias.append("".join(sfx_rot) + f"amix=inputs={len(sfx_rot)}:duration=longest:normalize=0[sfx]")
        rotulos.append("[sfx]")
    if not rotulos:
        sys.exit("nada para mixar: informe voz, música ou SFX")
    cadeias.append("".join(rotulos) + f"amix=inputs={len(rotulos)}:duration=longest:normalize=0,atrim=0:{dur:.3f}[mix]"
                   if len(rotulos) > 1 else f"{rotulos[0]}atrim=0:{dur:.3f}[mix]")

    grafo = os.path.join(work, "mix_grafo.txt")
    with open(grafo, "w", encoding="utf-8") as f:
        f.write(";\n".join(cadeias))
    bruto = os.path.join(work, "mix_bruto.wav")
    rodar(["ffmpeg", "-y", "-hide_banner"] + entradas + filtro_arquivo(grafo) + ["-map", "[mix]", "-c:a", "pcm_s16le", bruto])
    m = medir(bruto)
    ln = (f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
          f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    saida = p(a.saida)
    os.makedirs(os.path.dirname(saida), exist_ok=True)
    rodar(["ffmpeg", "-y", "-hide_banner", "-i", bruto, "-af", ln + ",aresample=48000", "-c:a", "pcm_s16le", saida])
    r = rodar(["ffmpeg", "-hide_banner", "-i", saida, "-af", "ebur128=peak=true", "-f", "null", "-"])
    integ = re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)[-1]
    pico = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", r.stderr)[-1]
    print(json.dumps({"saida": saida, "duracao_s": round(dur, 3), "voz": tem_voz, "musica": bool(a.musica),
                      "sfx": len(sfx_rot), "mix_lufs": float(integ), "true_peak_dbtp": float(pico)}, ensure_ascii=False))
    print("lembrete: em src/data/config.json, \"audio\": \"" + os.path.relpath(saida, os.path.join(raiz, "public")).replace(os.sep, "/") + "\"")


if __name__ == "__main__":
    main()
