"""Ouve um trecho de áudio pelos números: energia por faixa, centroide, banda útil e fator de crista.

Feito para conferir a voz do teaser (megafone/rádio) contra a voz limpa do corpo, mas serve
para qualquer trecho. Referências (references/sound-design.md, "Voz do teaser"):
  megafone/corneta  quase nada abaixo de ~500 Hz e acima de ~4 kHz; centroide 1,3-2,2 kHz;
                    >= 90% da energia em 600-3400 Hz; fator de crista menor que o da voz limpa
  voz limpa         energia forte em 100-300 Hz (fundamental), centroide ~0,6-1,3 kHz

Uso:
  python -I scripts/espectro.py public/voz.wav --trecho 0:3.4 --trecho 5:15 [--rotulos teaser,corpo]
  python -I scripts/espectro.py public/voz.wav --blocos src/data/blocos.json   (teaser x corpo automático)
"""
import argparse
import json
import subprocess
import sys

SR = 48000
FAIXAS = [(0, 300), (300, 600), (600, 3400), (3400, 5000), (5000, 24000)]


def _np():
    try:
        import numpy
        return numpy
    except ImportError:
        sys.exit("numpy não encontrado (pip install numpy, ou python -E -P; ver references/licencas.md).")


def ler(arq, ini, fim):
    np = _np()
    r = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(ini), "-t", str(fim - ini), "-i", arq, "-ac", "1", "-ar", str(SR),
                        "-f", "f32le", "-"], capture_output=True)
    return np.frombuffer(r.stdout, dtype=np.float32).astype(np.float64)


def medir(x):
    np = _np()
    n = 4096
    jan = np.hanning(n)
    blocos = [x[i:i + n] * jan for i in range(0, len(x) - n, n // 2)]
    # só quadros com fala (até 30 dB abaixo do mais alto)
    rms = np.array([np.sqrt(np.mean(b ** 2)) + 1e-12 for b in blocos])
    ativos = [b for b, r in zip(blocos, rms) if 20 * np.log10(r / rms.max()) > -30]
    crus = [x[i:i + n] for i, r in zip(range(0, len(x) - n, n // 2), rms) if 20 * np.log10(r / rms.max()) > -30]
    P = np.mean([np.abs(np.fft.rfft(b)) ** 2 for b in ativos], axis=0)
    f = np.fft.rfftfreq(n, 1 / SR)
    tot = P.sum()
    faixas = {f"{a}-{b}": round(100 * P[(f >= a) & (f < b)].sum() / tot, 1) for a, b in FAIXAS}
    centroide = float((f * P).sum() / tot)
    acum = np.cumsum(P) / tot
    b5, b95 = float(f[np.searchsorted(acum, 0.05)]), float(f[np.searchsorted(acum, 0.95)])
    sinal = np.concatenate(crus) if crus else x
    crista = float(20 * np.log10(np.max(np.abs(sinal)) / (np.sqrt(np.mean(sinal ** 2)) + 1e-12)))
    return {"faixas_pct": faixas, "centroide_hz": round(centroide), "banda_5_95_hz": [round(b5), round(b95)], "crista_db": round(crista, 1)}


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Energia por faixa, centroide e fator de crista de trechos de áudio.")
    ap.add_argument("audio")
    ap.add_argument("--trecho", action="append", default=[], help="ini:fim em segundos (repita)")
    ap.add_argument("--rotulos", default="", help="nomes dos trechos, separados por vírgula")
    ap.add_argument("--blocos", help="blocos.json com objeto teaser: compara teaser x corpo")
    a = ap.parse_args()
    trechos = [tuple(float(v) for v in t.split(":")) for t in a.trecho]
    rot = [r for r in a.rotulos.split(",") if r]
    if a.blocos:
        tz = json.load(open(a.blocos, encoding="utf-8")).get("teaser")
        if not tz:
            sys.exit("blocos.json sem objeto teaser")
        ini_c = tz["volta_fim_ms"] / 1000
        trechos = [(0.0, tz["fim_ms"] / 1000), (ini_c, ini_c + 15)]
        rot = ["teaser", "corpo"]
    if not trechos:
        sys.exit("informe --trecho ini:fim ou --blocos")
    res = {}
    for i, (ini, fim) in enumerate(trechos):
        res[rot[i] if i < len(rot) else f"{ini:g}-{fim:g}s"] = medir(ler(a.audio, ini, fim))
    print(json.dumps(res, ensure_ascii=False, indent=1))
    if "teaser" in res:
        t = res["teaser"]
        ok = (t["faixas_pct"]["600-3400"] >= 90 and t["faixas_pct"]["0-300"] <= 1.5 and 1300 <= t["centroide_hz"] <= 2200)
        print(("ok" if ok else "AVISO") + f": teaser com {t['faixas_pct']['600-3400']}% em 600-3400 Hz, "
              f"{t['faixas_pct']['0-300']}% abaixo de 300 Hz, centroide {t['centroide_hz']} Hz (alvo >= 90%, <= 1,5%, 1300-2200 Hz)")


if __name__ == "__main__":
    main()
