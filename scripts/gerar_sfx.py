"""Valida o plano de efeitos sonoros (src/data/sfx.json) e resolve para o mixar.py.

Cada evento é ancorado no MESMO tempo que dispara a animação (marco, bloco ou ms).
O script mede o pico interno de cada arquivo para que o ataque caia no frame certo.

Regras de densidade (lição de vídeo real: excesso de efeito cansa e soa amador):
  ERRO (bloqueia):
    - dois efeitos a menos de 400 ms (--min-gap)
    - o mesmo arquivo duas vezes seguidas
    - pico fora de -26..-16 dB relativo ao pico da voz (alvo: -18 a -24)
    - pitch fora de -3..+3 semitons
    - efeito dentro de um trecho de respiro
    - arquivo ausente
  AVISO:
    - intervalo médio < 2 s (denso demais) ou > 5 s (pode estar seco)
    - mais de 3 efeitos em qualquer janela de 5 s
    - todos os ganhos iguais ou todos os pitches iguais (falta variação leve)

Formato do plano: ver template/src/data/sfx.example.json.
Referência de tempo: número (ms), "marco", "bloco:nome", com deslocamento "+200"/"-150".

Uso:
  python -I scripts/gerar_sfx.py [--projeto .] [--plano src/data/sfx.json]
         [--voz public/voz.wav] [--saida work/sfx_resolvido.json] [--min-gap 0.4]
"""
import argparse
import json
import os
import re
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


def carregar(caminho, padrao):
    return json.load(open(caminho, encoding="utf-8")) if os.path.exists(caminho) else padrao


def resolvedor(raiz):
    marcos = carregar(os.path.join(raiz, "src", "data", "marcos.json"), {})
    blocos = carregar(os.path.join(raiz, "src", "data", "blocos.json"), {}).get("blocos", {})

    def ms(ref):
        if isinstance(ref, (int, float)):
            return float(ref)
        m = re.match(r"^(bloco:)?([\w.-]+?)([+-]\d+)?$", str(ref).strip())
        if not m:
            sys.exit(f"referência inválida: {ref}")
        tabela = blocos if m.group(1) else marcos
        if m.group(2) not in tabela:
            sys.exit(f"{'bloco' if m.group(1) else 'marco'} ausente: {m.group(2)} (em '{ref}')")
        return float(tabela[m.group(2)] + (int(m.group(3)) if m.group(3) else 0))
    return ms


def perfil(arq):
    np = _np()
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", arq, "-ac", "1", "-ar", "48000", "-f", "f32le", "-"], capture_output=True)
    x = np.frombuffer(r.stdout, dtype=np.float32)
    if r.returncode or not len(x):
        return None
    env = np.abs(x)
    jan = 480
    suave = np.convolve(env, np.ones(jan) / jan, mode="same")
    return {"pico_dbfs": float(20 * np.log10(env.max() + 1e-9)), "pico_interno_s": round(float(np.argmax(suave) / 48000), 3),
            "duracao_s": round(len(x) / 48000, 3)}


def pico_voz(arq):
    if not os.path.exists(arq):
        return None
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", arq, "-af", "volumedetect", "-f", "null", "-"],
                       capture_output=True, text=True, encoding="utf-8", errors="ignore")
    m = re.findall(r"max_volume: (-?[\d.]+) dB", r.stderr)
    return float(m[-1]) if m else None


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Valida a densidade do plano de SFX e resolve tempos/ganhos para o mixar.py.")
    ap.add_argument("--projeto", default=".")
    ap.add_argument("--plano", default=os.path.join("src", "data", "sfx.json"))
    ap.add_argument("--voz", default=os.path.join("public", "voz.wav"), help="voz final (para medir o pico de referência)")
    ap.add_argument("--saida", default=os.path.join("work", "sfx_resolvido.json"))
    ap.add_argument("--min-gap", type=float, default=0.4, help="intervalo mínimo entre efeitos (s)")
    a = ap.parse_args()

    raiz = os.path.abspath(a.projeto)
    p = lambda x: x if os.path.isabs(x) else os.path.join(raiz, x)
    plano = json.load(open(p(a.plano), encoding="utf-8"))
    ms = resolvedor(raiz)
    pasta = p(plano.get("pasta", os.path.join("public", "sfx")))
    voz_pico = pico_voz(p(a.voz))
    ref_voz = voz_pico if voz_pico is not None else -1.0

    respiros = [(ms(r[0]) / 1000, ms(r[1]) / 1000) for r in plano.get("respiros", [])]
    erros, avisos, eventos, perfis = [], [], [], {}
    for e in plano.get("eventos", []):
        arq = os.path.join(pasta, e["arquivo"])
        if e["arquivo"] not in perfis:
            perfis[e["arquivo"]] = perfil(arq) if os.path.exists(arq) else None
        pf = perfis[e["arquivo"]]
        t = ms(e["em"]) / 1000
        rel = float(e.get("rel_db", -21))
        st = float(e.get("semitons", 0))
        desc = e.get("evento", "")
        if pf is None:
            erros.append(f"{t:6.2f}s arquivo ausente ou ilegível: {arq}")
            continue
        if not -26 <= rel <= -16:
            erros.append(f"{t:6.2f}s rel_db {rel} fora de -26..-16 ({desc})")
        if abs(st) > 3:
            erros.append(f"{t:6.2f}s pitch {st} st fora de -3..+3 ({desc})")
        for r0, r1 in respiros:
            if r0 <= t <= r1:
                erros.append(f"{t:6.2f}s cai no respiro {r0:.2f}-{r1:.2f}s ({desc})")
        eventos.append({"t": round(t, 3), "arquivo": arq.replace(os.sep, "/"), "nome": e["arquivo"], "rel_voz_db": rel,
                        "pico_alvo_dbfs": round(ref_voz + rel, 2), "pico_arquivo_dbfs": round(pf["pico_dbfs"], 2),
                        "pico_interno_s": pf["pico_interno_s"], "semitons": st, "evento": desc})

    eventos.sort(key=lambda x: x["t"])
    for x, y in zip(eventos, eventos[1:]):
        if y["t"] - x["t"] < a.min_gap:
            erros.append(f"{x['t']:6.2f}s e {y['t']:6.2f}s a {y['t'] - x['t']:.2f}s (< {a.min_gap}s): '{x['evento']}' / '{y['evento']}'")
        if x["nome"] == y["nome"]:
            erros.append(f"{x['t']:6.2f}s e {y['t']:6.2f}s: mesmo som seguido ({x['nome']}). Alterne com outro da mesma família.")
    if len(eventos) > 1:
        gaps = [y["t"] - x["t"] for x, y in zip(eventos, eventos[1:])]
        media = sum(gaps) / len(gaps)
        if media < 2.0:
            avisos.append(f"intervalo médio {media:.2f}s < 2 s: denso demais. Corte efeitos de saída, legenda e badges individuais.")
        if media > 5.0:
            avisos.append(f"intervalo médio {media:.2f}s > 5 s: confira se as viradas principais têm efeito.")
        for x in eventos:
            n = sum(1 for y in eventos if x["t"] <= y["t"] < x["t"] + 5)
            if n > 3:
                avisos.append(f"{n} efeitos entre {x['t']:.2f}s e {x['t'] + 5:.2f}s (máx. recomendado 3)")
                break
        if len({x["rel_voz_db"] for x in eventos}) == 1:
            avisos.append("todos os efeitos com o mesmo ganho: varie 1-3 dB")
        if len(eventos) > 4 and len({x["semitons"] for x in eventos}) == 1:
            avisos.append("todos os efeitos com o mesmo pitch: varie -1/0/+1 semitom")

    for e in eventos:
        print(f"{e['t']:7.2f}s {e['nome']:24} {e['rel_voz_db']:+5.1f} dB {e['semitons']:+.0f}st  {e['evento']}")
    if len(eventos) > 1:
        print(f"\n{len(eventos)} efeitos, 1 a cada {(eventos[-1]['t'] - eventos[0]['t']) / (len(eventos) - 1):.2f}s em média. "
              f"Pico de referência da voz: {ref_voz:.1f} dBFS{' (padrão, voz não encontrada)' if voz_pico is None else ''}")
    for w in avisos:
        print(f"AVISO: {w}")
    if erros:
        for x in erros:
            print(f"ERRO: {x}")
        sys.exit(f"{len(erros)} erro(s) no plano de SFX. Nada foi gravado.")
    os.makedirs(os.path.dirname(p(a.saida)), exist_ok=True)
    with open(p(a.saida), "w", encoding="utf-8") as f:
        json.dump(eventos, f, ensure_ascii=False, indent=1)
    print(f"ok: {p(a.saida)}")


if __name__ == "__main__":
    main()
