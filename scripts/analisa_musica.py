"""Analisa trilha (BPM, batidas, loudness por trecho) ou o perfil de efeitos sonoros.

Arquivos baixados são tratados como NÃO confiáveis: só são decodificados pelo ffmpeg
para PCM; nada do arquivo é executado. Rode sempre com python -I.

Modo trilha (padrão):
  BPM estimado por autocorrelação do envelope de ataques, fase da primeira batida e
  RMS por trecho de 15 s (para ver onde a faixa é densa demais e competiria com a voz).
  Com --saida-batidas, grava as batidas na TIMELINE DO VÍDEO considerando --offset
  (segundo da faixa em que o vídeo começa) e --duracao.

Modo --sfx:
  Para cada arquivo: duração, pico, RMS, centróide espectral, ataque (50% do pico) e
  instante do pico interno. Serve para montar um kit de timbre coerente.

Uso:
  python -I scripts/analisa_musica.py public/musica/faixa.mp3 [--offset 0.8] [--duracao 84]
         [--saida-batidas src/data/batidas.json]
  python -I scripts/analisa_musica.py --sfx public/sfx/*.ogg
"""
import argparse
import glob
import json
import os
import subprocess
import sys



def _np():
    """numpy é importado sob demanda para que --help funcione sem ele."""
    try:
        import numpy
        return numpy
    except ImportError:
        sys.exit("numpy não encontrado neste Python. Instale (pip install numpy) ou, se estiver só no site do usuário, "
                 "rode com python -E -P em vez de -I (ver references/licencas.md, seção Segurança).")


def pcm(arq, sr):
    np = _np()
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", arq, "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"], capture_output=True)
    if r.returncode or not r.stdout:
        sys.exit(f"não consegui decodificar {arq}: {r.stderr.decode('utf-8', 'ignore')[-500:]}")
    return np.frombuffer(r.stdout, dtype=np.float32)


def trilha(a):
    np = _np()
    sr, hop = 22050, 512
    x = pcm(a.arquivos[0], sr)
    n = len(x) // hop
    fr = x[: n * hop].reshape(n, hop)
    energia = np.log1p(100 * np.sqrt((fr ** 2).mean(axis=1)))
    onset = np.maximum(0, np.diff(energia, prepend=energia[0]))
    onset -= onset.mean()
    fps = sr / hop
    ac = np.correlate(onset, onset, mode="full")[len(onset) - 1:]
    lag_de = lambda b: 60 * fps / b
    lo, hi = int(lag_de(a.bpm_max)), int(lag_de(a.bpm_min))
    lag = lo + int(np.argmax(ac[lo:hi]))
    bpm = float(60 * fps / lag)
    fase = int(np.argmax([onset[f::lag].sum() for f in range(lag)]))
    batidas = [round((fase + k * lag) / fps, 3) for k in range(int((n - fase) / lag))]
    dur = len(x) / sr
    rms = lambda i, f: float(20 * np.log10(np.sqrt((x[int(i * sr): int(f * sr)] ** 2).mean()) + 1e-9))
    trechos = {f"{i}-{i + 15}s": round(rms(i, min(dur, i + 15)), 1) for i in range(0, int(dur), 15)}
    print(json.dumps({"arquivo": os.path.basename(a.arquivos[0]), "duracao_s": round(dur, 1), "bpm": round(bpm, 1),
                      "primeira_batida_s": batidas[0] if batidas else None, "rms_db_por_trecho": trechos}, ensure_ascii=False, indent=1))
    if a.saida_batidas:
        fim = a.offset + (a.duracao if a.duracao else dur)
        em_video = [round(b - a.offset, 3) for b in batidas if a.offset <= b <= fim]
        os.makedirs(os.path.dirname(os.path.abspath(a.saida_batidas)), exist_ok=True)
        with open(a.saida_batidas, "w", encoding="utf-8") as f:
            json.dump({"bpm": round(bpm, 2), "offset_musica_s": a.offset, "batidas_s": em_video}, f, indent=1)
        print(f"{len(em_video)} batidas gravadas em {a.saida_batidas}")


def sfx(a):
    np = _np()
    sr = 48000
    arqs = []
    for padrao in a.arquivos:
        arqs += sorted(glob.glob(padrao)) or [padrao]
    for arq in arqs:
        x = pcm(arq, sr)
        env = np.abs(x)
        pico = 20 * np.log10(env.max() + 1e-9)
        rms = 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-9)
        esp = np.abs(np.fft.rfft(x * np.hanning(len(x))))
        cent = float((esp * np.fft.rfftfreq(len(x), 1 / sr)).sum() / (esp.sum() + 1e-9))
        ataque = float(np.argmax(env > env.max() * 0.5) / sr * 1000)
        jan = max(1, int(0.01 * sr))  # pico interno pelo envelope suavizado (10 ms)
        suave = np.convolve(env, np.ones(jan) / jan, mode="same")
        pico_int = float(np.argmax(suave) / sr)
        print(f"{os.path.basename(arq):30} dur={len(x) / sr:5.2f}s pico={pico:6.1f}dBFS rms={rms:6.1f} "
              f"centroide={cent:6.0f}Hz ataque50%={ataque:5.0f}ms pico_interno={pico_int:5.2f}s")


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="BPM/batidas/loudness de uma trilha, ou perfil de efeitos sonoros (--sfx).")
    ap.add_argument("arquivos", nargs="+", help="faixa de música (modo trilha) ou arquivos/padrões de SFX (modo --sfx)")
    ap.add_argument("--sfx", action="store_true", help="perfil de efeitos sonoros")
    ap.add_argument("--offset", type=float, default=0.0, help="segundo da faixa em que o vídeo começa")
    ap.add_argument("--duracao", type=float, default=0.0, help="duração do vídeo (s) para recortar as batidas")
    ap.add_argument("--saida-batidas", help="grava batidas na timeline do vídeo (src/data/batidas.json)")
    ap.add_argument("--bpm-min", type=float, default=70)
    ap.add_argument("--bpm-max", type=float, default=160)
    a = ap.parse_args()
    sfx(a) if a.sfx else trilha(a)


if __name__ == "__main__":
    main()
