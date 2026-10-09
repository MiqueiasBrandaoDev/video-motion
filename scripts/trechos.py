"""Lista a transcrição em trechos numerados para classificar em LOCUÇÃO / INSTRUÇÃO / DESCARTE.

Mostra cada segmento com início, fim e a pausa antes dele, e marca pistas automáticas:
  [PAUSA]     silêncio longo antes do trecho
  [REPETE?]   texto parecido com o trecho anterior (provável retomada; fica a ÚLTIMA tentativa)
  [INSTRUÇÃO?] frase com cara de instrução para quem edita ("aqui coloca o print", "corta isso")
  [HESITA?]   trecho curto só com muletas ("é...", "tipo", "então")
As pistas são só pistas: quem decide é o agente lendo o texto (ver references/audio.md).

Com --palavras, imprime também cada palavra com tempo, para achar o ponto exato de corte.
Com --saida, grava um JSON com os trechos e um campo "classe" vazio para preencher.

Uso:
  python -I scripts/trechos.py <transcricao.json> [--pausa 0.7] [--palavras] [--saida trechos.json]
"""
import argparse
import difflib
import json
import re
import sys
import unicodedata

PISTAS_INSTRUCAO = [
    # português
    "coloca", "coloque", "põe", "aqui entra", "aqui você", "aqui voce", "corta", "corte isso",
    "tira isso", "edita", "na edição", "na edicao", "mostra o print", "mostrar o print", "insere", "insira",
    "anota", "observação", "observacao", "deixa isso", "volta pra", "começar de novo", "comecar de novo",
    "de novo", "vou repetir", "regrava", "nesse momento mostra", "para o editor", "pro editor",
    # inglês
    "cut this", "put here", "insert", "show the screenshot", "for the editor", "let me redo", "start over",
]
MULETAS = {"é", "e", "eh", "ah", "hã", "ha", "hum", "hm", "tipo", "então", "entao", "né", "ne", "uh", "um", "so", "like"}


def norm(t):
    t = unicodedata.normalize("NFKD", t.lower())
    t = "".join(c for c in t if not unicodedata.combining(c))
    return re.sub(r"[^\w\s]", "", t).strip()


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Lista trechos da transcrição com pistas de instrução, repetição e pausa.")
    ap.add_argument("transcricao", help="JSON gerado por transcrever.py")
    ap.add_argument("--pausa", type=float, default=0.7, help="pausa (s) a partir da qual marca [PAUSA]")
    ap.add_argument("--palavras", action="store_true", help="imprime cada palavra com tempo")
    ap.add_argument("--saida", help="grava trechos em JSON com campo 'classe' para preencher")
    a = ap.parse_args()

    d = json.load(open(a.transcricao, encoding="utf-8"))
    segs = d.get("segments", [])
    pal = d.get("words", [])
    lista = []
    fim_ant = 0.0
    for i, s in enumerate(segs):
        txt = s["text"].strip()
        n = norm(txt)
        pistas = []
        if s["start"] - fim_ant >= a.pausa:
            pistas.append("PAUSA")
        if i and difflib.SequenceMatcher(None, norm(segs[i - 1]["text"]), n).ratio() > 0.6:
            pistas.append("REPETE?")
        if any(re.search(r"\b" + re.escape(norm(x)) + r"\b", n) for x in PISTAS_INSTRUCAO):
            pistas.append("INSTRUÇÃO?")
        toks = n.split()
        if toks and len(toks) <= 3 and all(t in MULETAS for t in toks):
            pistas.append("HESITA?")
        lista.append({"n": i, "ini": round(s["start"], 3), "fim": round(s["end"], 3),
                      "pausa_antes": round(s["start"] - fim_ant, 3), "texto": txt, "pistas": pistas, "classe": ""})
        fim_ant = s["end"]
        marca = " ".join(f"[{p}]" for p in pistas)
        print(f"{i:3d} {s['start']:8.2f}-{s['end']:8.2f} (pausa {lista[-1]['pausa_antes']:.2f}s) {marca} {txt}")
        if a.palavras:
            for w in pal:
                if s["start"] - 0.01 <= w["start"] < s["end"] + 0.01:
                    print(f"       {w['start']:8.3f}-{w['end']:8.3f}  {w['word']}")
    print(f"\n{len(lista)} trechos, duração {d.get('duration', 0):.1f} s. "
          f"Pistas: {sum(1 for x in lista if x['pistas'])} trechos marcados.")
    if a.saida:
        with open(a.saida, "w", encoding="utf-8") as f:
            json.dump({"fonte": a.transcricao, "classes": ["LOCUCAO", "INSTRUCAO", "DESCARTE"], "trechos": lista},
                      f, ensure_ascii=False, indent=1)
        print(f"gravado: {a.saida}")


if __name__ == "__main__":
    main()
