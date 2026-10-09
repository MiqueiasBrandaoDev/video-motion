"""Converte a transcrição da VOZ FINAL em legendas (Caption[] do @remotion/captions) e marcos.

Legendas: páginas de 2 a 4 palavras (máx. ~22 caracteres), quebrando em fim de frase
e em silêncio > 380 ms, evitando palavra órfã no fim da frase.

Marcos: tempo (ms) de palavras-chave que disparam animações (src/data/marcos.json).
A especificação (marcos.spec.json) diz qual palavra vira qual marco:
  {"gancho": "perde",                                   primeira ocorrência
   "custo":  {"palavra": "custo", "depois_de": "gancho"}, primeira depois de outro marco
   "valor":  {"palavra": "4,79", "ocorrencia": 2},        n-ésima ocorrência
   "fim_cta": {"palavra": "link", "borda": "fim"}}        fim da palavra (padrão: início)
Sem spec, use --listar para ver todas as palavras com tempo e índice.

Correções (opcional, correcoes.json), só para grafia/erro evidente do Whisper:
  {"trocas": {"Cloud": "Claude"},
   "sequencias": [{"de": ["4", "e", "79", "dólares"], "para": ["4,79", "dólares"]}]}
O tempo de uma sequência corrigida é redistribuído entre as palavras novas.

Uso:
  python -I scripts/legendas.py --palavras work/voz_final.json [--projeto .]
         [--marcos-spec marcos.spec.json] [--correcoes correcoes.json]
         [--max-palavras 4] [--max-chars 22] [--listar]
"""
import argparse
import json
import os
import sys

PONT_FIM = ".?!;:"
PONT_TIRAR = ".,;:"


def carregar_palavras(d):
    pal = []
    for w in d["words"]:
        txt = w["word"].strip()
        if not txt:
            continue
        pal.append({"w": txt, "s": float(w["start"]), "e": float(w["end"]), "fim_frase": txt[-1] in PONT_FIM or txt[-1] == ","})
    # pontuação: palavras da API vêm sem pontuação; tenta alinhar 1:1 com o texto
    toks = d.get("text", "").split()
    if len(toks) == len(pal):
        for p, t in zip(pal, toks):
            p["fim_frase"] = p["fim_frase"] or t[-1] in PONT_FIM + ","
    else:  # fallback: fim de segmento = fim de frase
        fins = [s["end"] for s in d.get("segments", [])]
        for p in pal:
            if any(abs(p["e"] - f) < 0.06 for f in fins):
                p["fim_frase"] = True
    for p in pal:
        if p["w"][-1] in PONT_TIRAR and len(p["w"]) > 1 and not p["w"][-2].isdigit():
            p["w"] = p["w"].rstrip(PONT_TIRAR)
    return pal


def corrigir(pal, corr):
    trocas = corr.get("trocas", {})
    seqs = corr.get("sequencias", [])
    out, i = [], 0
    limpa = lambda x: x.strip(",.?!;:").lower()
    while i < len(pal):
        feito = False
        for s in seqs:
            de, para = s["de"], s["para"]
            n = len(de)
            if [limpa(p["w"]) for p in pal[i:i + n]] == [limpa(x) for x in de]:
                ini, fim = pal[i]["s"], pal[i + n - 1]["e"]
                passo = (fim - ini) / len(para)
                for k, txt in enumerate(para):
                    out.append({"w": txt, "s": ini + k * passo, "e": ini + (k + 1) * passo,
                                "fim_frase": pal[i + n - 1]["fim_frase"] if k == len(para) - 1 else False})
                i += n
                feito = True
                break
        if not feito:
            p = dict(pal[i])
            p["w"] = trocas.get(p["w"], p["w"])
            out.append(p)
            i += 1
    for k, p in enumerate(out):  # monotonia e duração mínima
        if k and p["s"] < out[k - 1]["s"]:
            p["s"] = out[k - 1]["s"]
        if p["e"] <= p["s"]:
            p["e"] = p["s"] + 0.08
    return out


def paginar(pal, max_pal, max_chars, quebra_ms):
    legendas, pagina = [], []

    def fecha():
        if pagina:
            legendas[-1]["pageBreakAfter"] = True
            pagina.clear()

    for p in pal:
        texto = " ".join(x["w"] for x in pagina + [p])
        estoura = len(pagina) >= max_pal or len(texto) > max_chars
        if estoura and p["fim_frase"] and len(pagina) <= max_pal and len(texto) <= max_chars + 4:
            estoura = False  # não deixa palavra órfã no fim da frase
        if pagina and (estoura or (p["s"] - pagina[-1]["e"]) * 1000 > quebra_ms):
            fecha()
        legendas.append({"text": (" " if legendas else "") + p["w"], "startMs": round(p["s"] * 1000),
                         "endMs": round(p["e"] * 1000), "timestampMs": None, "confidence": None})
        pagina.append(p)
        if p["fim_frase"]:
            fecha()
    fecha()
    return legendas


def marcos_de(pal, spec):
    marcos = {}
    base = lambda w: w.lower().strip(",.?!;:")

    def acha(nome, regra):
        if isinstance(regra, str):
            regra = {"palavra": regra}
        alvo = base(regra["palavra"])
        depois = regra.get("depois_de", 0)
        if isinstance(depois, str):
            if depois not in marcos:
                sys.exit(f"marco '{nome}': depois_de '{depois}' precisa vir antes na spec")
            depois = marcos[depois]
        n = int(regra.get("ocorrencia", 1))
        achadas = [p for p in pal if base(p["w"]) == alvo and p["s"] * 1000 >= depois - 1]
        if len(achadas) < n:
            sys.exit(f"marco '{nome}': palavra '{regra['palavra']}' (ocorrência {n}) não encontrada. Use --listar.")
        p = achadas[n - 1]
        return round((p["e"] if regra.get("borda") == "fim" else p["s"]) * 1000)

    for nome, regra in spec.items():
        if nome.startswith("_"):
            continue
        marcos[nome] = acha(nome, regra)
    marcos["fim"] = round(pal[-1]["e"] * 1000)
    return marcos


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Gera legendas palavra por palavra e marcos de animação a partir da transcrição da voz final.")
    ap.add_argument("--palavras", required=True, help="transcrição da VOZ FINAL (transcrever.py)")
    ap.add_argument("--projeto", default=".", help="raiz do projeto")
    ap.add_argument("--marcos-spec", help="JSON nome -> palavra (ver docstring)")
    ap.add_argument("--correcoes", help="JSON de correções de grafia")
    ap.add_argument("--saida-legendas", default=os.path.join("src", "data", "legendas.json"))
    ap.add_argument("--saida-marcos", default=os.path.join("src", "data", "marcos.json"))
    ap.add_argument("--max-palavras", type=int, default=4)
    ap.add_argument("--max-chars", type=int, default=22)
    ap.add_argument("--quebra-silencio-ms", type=int, default=380)
    ap.add_argument("--listar", action="store_true", help="só lista as palavras com índice e tempo (ms)")
    a = ap.parse_args()

    raiz = os.path.abspath(a.projeto)
    p = lambda x: x if os.path.isabs(x) else os.path.join(raiz, x)
    d = json.load(open(a.palavras if os.path.exists(a.palavras) else p(a.palavras), encoding="utf-8"))
    pal = carregar_palavras(d)
    if a.correcoes:
        pal = corrigir(pal, json.load(open(p(a.correcoes), encoding="utf-8")))
    if not pal:
        sys.exit("transcrição sem palavras")

    if a.listar:
        for i, w in enumerate(pal):
            print(f"{i:4d} {round(w['s'] * 1000):7d} ms  {w['w']}{'  |' if w['fim_frase'] else ''}")
        return

    legendas = paginar(pal, a.max_palavras, a.max_chars, a.quebra_silencio_ms)
    os.makedirs(os.path.dirname(p(a.saida_legendas)), exist_ok=True)
    json.dump(legendas, open(p(a.saida_legendas), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    spec = json.load(open(p(a.marcos_spec), encoding="utf-8")) if a.marcos_spec else {}
    marcos = marcos_de(pal, spec)
    json.dump(marcos, open(p(a.saida_marcos), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    paginas, txt = [], ""
    for l in legendas:
        txt += l["text"]
        if l.get("pageBreakAfter"):
            paginas.append(txt.strip())
            txt = ""
    print(f"{len(legendas)} palavras, {len(paginas)} páginas, {len(marcos)} marcos")
    print(" | ".join(paginas))
    print(json.dumps(marcos, ensure_ascii=False))


if __name__ == "__main__":
    main()
