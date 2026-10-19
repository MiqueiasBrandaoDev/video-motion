"""Sintetiza o som da transição de volta do teaser (fita rebobinando), sem amostra de terceiros.

Depois do teaser (cold open), a cena `volta` mostra o vídeo voltando do payoff até o começo do
corpo, com cara de VHS rebobinando. Este script gera o som desse trecho a partir da PRÓPRIA voz
do vídeo (public/voz.wav), então não há licença envolvida:

  1. Tagarelar da fita: lê a voz de trás para frente, do payoff até o início do corpo, com a
     velocidade subindo de ~3x para ~12x (o pitch sobe junto: é o que faz soar "rebobinando" e
     não só "ao contrário"); nos últimos ~12% a fita freia (pitch cai) até parar.
  2. Motor: zumbido tonal (fundamental 55 Hz x velocidade, com harmônicos) + ruído de fita
     filtrado, com o volume seguindo a velocidade.
  3. Clunk: batida grave curta + clique, ~25 ms antes do corpo começar (tecla de play).

Lê os tempos de src/data/blocos.json (objeto "teaser", gravado pelo cortar_video.py). A duração
é a da volta (volta_s do cortes.json). Saída: public/sfx/volta.wav (mono 48 kHz, pico -1 dBFS).
No src/data/sfx.json, use "categoria": "transicao" e "alinhar": "inicio" (gerar_sfx.py):
  {"em": "bloco:volta", "arquivo": "volta.wav", "categoria": "transicao", "alinhar": "inicio",
   "rel_db": -9, "evento": "rebobina para o começo"}

Uso:
  python -I scripts/som_volta.py [--projeto .] [--voz public/voz.wav] [--saida public/sfx/volta.wav]
         [--vel 3,12] [--seed 7]
"""
import argparse
import json
import os
import subprocess
import sys
import wave

SR = 48000


def _np():
    try:
        import numpy
        return numpy
    except ImportError:
        sys.exit("numpy não encontrado neste Python. Instale (pip install numpy) ou rode com python -E -P "
                 "(ver references/licencas.md, seção Segurança).")


def ler(arq):
    np = _np()
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", arq, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True)
    if r.returncode:
        sys.exit(f"não consegui ler {arq}: {r.stderr.decode('utf-8', 'ignore')[-400:]}")
    return np.frombuffer(r.stdout, dtype=np.float32).astype(np.float64)


def passa_baixa(np, x, fc):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / fc) ** 8)
    return np.fft.irfft(X, len(x))


def passa_faixa(np, x, f1, f2):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= (1 / (1 + (f1 / np.maximum(f, 1)) ** 6)) * (1 / (1 + (f / f2) ** 6))
    return np.fft.irfft(X, len(x))


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Som de fita rebobinando para a transição do teaser (gerado da própria voz).")
    ap.add_argument("--projeto", default=".")
    ap.add_argument("--voz", default=os.path.join("public", "voz.wav"))
    ap.add_argument("--saida", default=os.path.join("public", "sfx", "volta.wav"))
    ap.add_argument("--vel", default="3,12", help="velocidade inicial,máxima da fita (x tempo real)")
    ap.add_argument("--seed", type=int, default=7)
    a = ap.parse_args()
    np = _np()

    raiz = os.path.abspath(a.projeto)
    p = lambda x: x if os.path.isabs(x) else os.path.join(raiz, x)
    doc = json.load(open(os.path.join(raiz, "src", "data", "blocos.json"), encoding="utf-8"))
    tz = doc.get("teaser")
    if not tz:
        sys.exit("blocos.json sem objeto 'teaser': rode cortar_video.py com o campo 'teaser' no cortes.json.")
    t0, t1 = tz["volta_ms"] / 1000, tz["volta_fim_ms"] / 1000
    dur = t1 - t0
    if dur < 0.3:
        sys.exit(f"volta de {dur:.2f}s é curta demais para o som (use volta_s >= 0,5 no cortes.json).")
    v0, v1 = (float(x) for x in a.vel.split(","))

    voz = ler(p(a.voz))
    # região rebobinada: do payoff (ou do fim do teaser, se não houver payoff) para trás até o início do corpo
    de = (tz["payoff_ms"] / 1000) if tz.get("payoff_ms") is not None else t0
    ate = t1 if tz.get("payoff_ms") is not None else 0.0
    fonte = passa_baixa(np, voz, 24000 / v1 * 0.9)  # evita aliasing ao ler acelerado

    n = int(round(dur * SR))
    u = np.arange(n) / n
    rampa = np.clip(u / 0.7, 0, 1)
    vel = v0 + (v1 - v0) * (rampa * rampa * (3 - 2 * rampa))       # sobe suave até 70%
    freio = np.clip((u - 0.86) / 0.12, 0, 1)
    vel = vel * (1 - freio) ** 1.6                                  # freia nos últimos ~12%
    pos = de * SR - np.cumsum(vel)                                  # posição (amostras), andando para trás
    pos = np.clip(pos, ate * SR, len(fonte) - 2)
    i0 = pos.astype(np.int64)
    fr = pos - i0
    chatter = fonte[i0] * (1 - fr) + fonte[i0 + 1] * fr
    chatter = passa_faixa(np, chatter, 250, 7500)

    # motor: fundamental proporcional à velocidade + 2 harmônicos, e ruído de fita
    rng = np.random.default_rng(a.seed)
    f0 = 55.0 * np.maximum(vel, 0.05)
    fase = 2 * np.pi * np.cumsum(f0) / SR
    motor = np.sin(fase) + 0.5 * np.sin(2 * fase + 0.3) + 0.25 * np.sin(3 * fase + 1.1)
    ruido = passa_faixa(np, rng.standard_normal(n), 900, 6000)
    nivel = vel / v1

    def norm(x):
        return x / (np.max(np.abs(x)) + 1e-9)

    som = 0.75 * norm(chatter) * (0.35 + 0.65 * nivel) + 0.16 * norm(motor) * nivel + 0.12 * norm(ruido) * nivel
    som *= np.minimum(1, np.arange(n) / (0.03 * SR))                 # fade-in 30 ms

    # clunk da tecla de play, 25 ms antes do corpo
    tc = max(0, n - int(0.025 * SR) - int(0.09 * SR))
    k = np.arange(n - tc) / SR
    grave = np.sin(2 * np.pi * 78 * k) * np.exp(-k / 0.045)
    clique = passa_faixa(np, rng.standard_normal(len(k)), 1500, 7000) * np.exp(-k / 0.004)
    som[tc:] += 0.9 * grave + 0.35 * norm(clique)

    som = som / (np.max(np.abs(som)) + 1e-9) * 10 ** (-1 / 20)
    saida = p(a.saida)
    os.makedirs(os.path.dirname(saida), exist_ok=True)
    with wave.open(saida, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((som * 32767).astype("<i2").tobytes())
    print(json.dumps({"saida": saida, "duracao_s": round(dur, 3), "rebobina_de_s": round(de, 3), "ate_s": round(ate, 3),
                      "vel": [v0, v1], "clunk_s": round(tc / SR, 3)}, ensure_ascii=False))
    print('no sfx.json: {"em": "bloco:volta", "arquivo": "volta.wav", "categoria": "transicao", "alinhar": "inicio", "rel_db": -9}')


if __name__ == "__main__":
    main()
