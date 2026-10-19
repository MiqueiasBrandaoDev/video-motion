"""Valida o plano de efeitos sonoros (src/data/sfx.json) e resolve para o mixar.py.

Cada evento é ancorado no MESMO tempo que dispara a animação (marco, bloco ou ms).
O script mede o pico interno de cada arquivo para que o ataque caia no frame certo.

Duas camadas (ver references/sound-design.md):
  comum   base de ~1 efeito a cada 2-3 s nas viradas (troca de bloco, entrada de janela,
          destaque, clique), pico 18-24 dB abaixo da voz.
  impacto poucos e fortes nos momentos-chave (carimbo com flash, revelação/afastamento de
          câmera, número-chave, CTA), pico 12-16 dB abaixo da voz. Campo "categoria": "impacto".

Regras de densidade (lição de vídeo real: excesso de efeito cansa e soa amador):
  ERRO (bloqueia):
    - dois efeitos a menos de 400 ms (--min-gap)
    - o mesmo arquivo duas vezes seguidas
    - comum: pico fora de -26..-16 dB relativo ao pico da voz (alvo: -18 a -24)
    - impacto: pico fora de -20..-10 dB relativo à voz (alvo: -12 a -16)
    - pitch fora de -3..+3 semitons
    - efeito dentro de um trecho de respiro
    - arquivo ausente
  AVISO:
    - intervalo médio < 2 s (denso demais) ou > 5 s (pode estar seco)
    - mais de 3 efeitos em qualquer janela de 5 s
    - impacto fora de -16..-12 dB; dois impactos a menos de --min-gap-impacto (padrão 4 s);
      impactos passando de 1/3 dos efeitos (forte demais vira ruído)
    - carimbo ou afastamento de câmera do cenas.json sem efeito de impacto a até 250 ms
    - todos os ganhos iguais ou todos os pitches iguais (falta variação leve)

Terceira categoria, "transicao": o som da volta do teaser (scripts/som_volta.py), que cobre um
silêncio da voz; pico -16..-4 dB relativo à voz (alvo -8 a -12). Com "alinhar": "inicio" o
arquivo começa no tempo do evento (padrão: o pico interno cai no tempo).

Perfil (campo "perfil" do sfx.json):
  motion  (padrão) motion puro com trilha: base de ~1 efeito a cada 2-3 s nas viradas + impactos
  orador  talking head SEM trilha (anúncios analisados em out/2026): só ~1-2,5 impactos graves a
          cada 10 s, nos títulos que entram atrás da cabeça, no número-chave e no CTA, mais um ou
          outro efeito comum discreto. Intervalo médio esperado 2,5-8 s; impactos podem passar
          de 1/3 dos efeitos; distância mínima entre impactos padrão 2,5 s.

Formato do plano: ver template/src/data/sfx.example.json (motion) e sfx-orador.example.json (orador).
Referência de tempo: número (ms), "marco", "bloco:nome", com deslocamento "+200"/"-150".

Uso:
  python -I scripts/gerar_sfx.py [--projeto .] [--plano src/data/sfx.json]
         [--voz public/voz.wav] [--saida work/sfx_resolvido.json] [--min-gap 0.4]
         [--min-gap-impacto 4] [--cenas src/data/cenas.json]
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


def momentos_chave(caminho, ms):
    """Carimbos e afastamentos de câmera (escala diminuindo) declarados no cenas.json."""
    if not os.path.exists(caminho):
        return []
    try:
        cenas = json.load(open(caminho, encoding="utf-8")).get("cenas", [])
    except (OSError, ValueError):
        return []
    saida = []

    def visita(c):
        for cb in c.get("carimbos", []) or []:
            try:
                saida.append((ms(cb["em"]) / 1000, f"carimbo '{cb.get('texto', '')}' ({c.get('id', c.get('tipo'))})"))
            except (KeyError, SystemExit):
                pass
        escala = (c.get("cameraInicial") or {}).get("escala", 1)
        for ch in c.get("camera", []) or []:
            nova = ch.get("escala", escala)
            if nova < escala - 0.05:
                try:
                    saida.append((ms(ch["em"]) / 1000, f"afastamento de câmera ({c.get('id', c.get('tipo'))})"))
                except (KeyError, SystemExit):
                    pass
            escala = nova
        for pl in c.get("planos", []) or []:
            if isinstance(pl, dict):
                visita(pl)

    for c in cenas:
        visita(c)
    return saida


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Valida a densidade do plano de SFX e resolve tempos/ganhos para o mixar.py.")
    ap.add_argument("--projeto", default=".")
    ap.add_argument("--plano", default=os.path.join("src", "data", "sfx.json"))
    ap.add_argument("--voz", default=os.path.join("public", "voz.wav"), help="voz final (para medir o pico de referência)")
    ap.add_argument("--saida", default=os.path.join("work", "sfx_resolvido.json"))
    ap.add_argument("--min-gap", type=float, default=0.4, help="intervalo mínimo entre efeitos (s)")
    ap.add_argument("--min-gap-impacto", type=float, default=None,
                    help="intervalo mínimo recomendado entre dois impactos (s); padrão 4 (motion) ou 2,5 (orador)")
    ap.add_argument("--cenas", default=os.path.join("src", "data", "cenas.json"),
                    help="cenas.json (para conferir se carimbos e afastamentos de câmera têm impacto)")
    a = ap.parse_args()

    raiz = os.path.abspath(a.projeto)
    p = lambda x: x if os.path.isabs(x) else os.path.join(raiz, x)
    plano = json.load(open(p(a.plano), encoding="utf-8"))
    orador = plano.get("perfil", "motion") == "orador"
    if a.min_gap_impacto is None:
        a.min_gap_impacto = 2.5 if orador else 4.0
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
        cat = e.get("categoria", "comum")
        if cat not in ("comum", "impacto", "transicao"):
            erros.append(f"{t:6.2f}s categoria '{cat}' inválida (use comum, impacto ou transicao)")
            cat = "comum"
        rel = float(e.get("rel_db", -14 if cat == "impacto" else -9 if cat == "transicao" else -21))
        st = float(e.get("semitons", 0))
        desc = e.get("evento", "")
        if pf is None:
            erros.append(f"{t:6.2f}s arquivo ausente ou ilegível: {arq}")
            continue
        if cat == "comum" and not -26 <= rel <= -16:
            erros.append(f"{t:6.2f}s rel_db {rel} fora de -26..-16 para efeito comum ({desc}). "
                         f"Se for um momento-chave, use categoria impacto.")
        if cat == "impacto":
            if not -20 <= rel <= -10:
                erros.append(f"{t:6.2f}s impacto com rel_db {rel} fora de -20..-10 ({desc})")
            elif not -16 <= rel <= -12:
                avisos.append(f"{t:6.2f}s impacto com rel_db {rel}: alvo -12 a -16 ({desc})")
        if cat == "transicao" and not -16 <= rel <= -4:
            erros.append(f"{t:6.2f}s transição com rel_db {rel} fora de -16..-4 ({desc}); alvo -8 a -12 (cobre um silêncio da voz)")
        if abs(st) > 3:
            erros.append(f"{t:6.2f}s pitch {st} st fora de -3..+3 ({desc})")
        for r0, r1 in respiros:
            if r0 <= t <= r1:
                erros.append(f"{t:6.2f}s cai no respiro {r0:.2f}-{r1:.2f}s ({desc})")
        eventos.append({"t": round(t, 3), "arquivo": arq.replace(os.sep, "/"), "nome": e["arquivo"], "categoria": cat, "rel_voz_db": rel,
                        "pico_alvo_dbfs": round(ref_voz + rel, 2), "pico_arquivo_dbfs": round(pf["pico_dbfs"], 2),
                        "pico_interno_s": 0.0 if e.get("alinhar") == "inicio" else pf["pico_interno_s"], "semitons": st, "evento": desc})

    eventos.sort(key=lambda x: x["t"])
    for x, y in zip(eventos, eventos[1:]):
        if y["t"] - x["t"] < a.min_gap:
            erros.append(f"{x['t']:6.2f}s e {y['t']:6.2f}s a {y['t'] - x['t']:.2f}s (< {a.min_gap}s): '{x['evento']}' / '{y['evento']}'")
        if x["nome"] == y["nome"]:
            erros.append(f"{x['t']:6.2f}s e {y['t']:6.2f}s: mesmo som seguido ({x['nome']}). Alterne com outro da mesma família.")
    if len(eventos) > 1:
        gaps = [y["t"] - x["t"] for x, y in zip(eventos, eventos[1:])]
        media = sum(gaps) / len(gaps)
        lim_min, lim_max = (2.5, 8.0) if orador else (2.0, 5.0)
        if media < lim_min:
            avisos.append(f"intervalo médio {media:.2f}s < {lim_min:g} s: denso demais{' para talking head (sem trilha, cada som aparece)' if orador else ''}. "
                          f"Corte efeitos de saída, legenda e badges individuais.")
        if media > lim_max:
            avisos.append(f"intervalo médio {media:.2f}s > {lim_max:g} s: confira se as viradas principais têm efeito.")
        for x in eventos:
            n = sum(1 for y in eventos if x["t"] <= y["t"] < x["t"] + 5)
            if n > 3:
                avisos.append(f"{n} efeitos entre {x['t']:.2f}s e {x['t'] + 5:.2f}s (máx. recomendado 3)")
                break
        imp = [x for x in eventos if x["categoria"] == "impacto"]
        for x, y in zip(imp, imp[1:]):
            if y["t"] - x["t"] < a.min_gap_impacto:
                avisos.append(f"impactos a {y['t'] - x['t']:.2f}s ({x['t']:.2f}s e {y['t']:.2f}s; mínimo recomendado "
                              f"{a.min_gap_impacto:g}s): impacto perde força se repetir. Rebaixe um para comum.")
        if not orador and len(eventos) >= 6 and len(imp) > len(eventos) / 3:
            avisos.append(f"{len(imp)} de {len(eventos)} efeitos são impacto: reserve para carimbo, revelação, número-chave e CTA.")
        if len({x["rel_voz_db"] for x in eventos if x["categoria"] == "comum"}) == 1 and len(eventos) - len(imp) > 1:
            avisos.append("todos os efeitos com o mesmo ganho: varie 1-3 dB")
        if len(eventos) > 4 and len({x["semitons"] for x in eventos}) == 1:
            avisos.append("todos os efeitos com o mesmo pitch: varie -1/0/+1 semitom")

    # momentos-chave do cenas.json (carimbos e afastamentos de câmera) sem impacto por perto
    for t_chave, o_que in momentos_chave(p(a.cenas), ms):
        if not any(x["categoria"] == "impacto" and abs(x["t"] - t_chave) <= 0.25 for x in eventos):
            avisos.append(f"{t_chave:6.2f}s {o_que} sem efeito de impacto (categoria impacto a até 250 ms)")

    for e in eventos:
        marca = {"impacto": "IMPACTO", "transicao": "VOLTA  "}.get(e["categoria"], "       ")
        print(f"{e['t']:7.2f}s {marca} {e['nome']:24} {e['rel_voz_db']:+5.1f} dB {e['semitons']:+.0f}st  {e['evento']}")
    if len(eventos) > 1:
        print(f"\nperfil {'orador (sem trilha)' if orador else 'motion'} · {len(eventos)} efeitos, 1 a cada {(eventos[-1]['t'] - eventos[0]['t']) / (len(eventos) - 1):.2f}s em média. "
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
