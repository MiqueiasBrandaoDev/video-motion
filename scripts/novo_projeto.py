"""Cria um projeto de vídeo novo a partir do template da skill.

Copia <skill>/template para o destino, renomeia gitignore.txt -> .gitignore e
cria os arquivos de dados reais a partir dos *.example.json (sem sobrescrever
nada que já exista). Não instala dependências: rode `npm install` no destino.

Uso:
  python -I scripts/novo_projeto.py <pasta-destino> [--formato 9:16|16:9|1:1]
         [--variante escura|clara] [--acento "#RRGGBB"] [--titulo "Nome"]
"""
import argparse
import json
import os
import shutil
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
TEMPLATE = os.path.join(os.path.dirname(AQUI), "template")
IGNORAR = {"node_modules", "out", "work", "qa", ".remotion"}


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Cria um projeto Remotion a partir do template da skill video-motion.")
    ap.add_argument("destino", help="pasta do projeto novo (criada se não existir)")
    ap.add_argument("--formato", choices=["9:16", "16:9", "1:1"], help="formato do vídeo")
    ap.add_argument("--variante", choices=["escura", "clara"], help="variante do fundo de grade")
    ap.add_argument("--acento", help="cor de acento hex, ex.: #F2A33A")
    ap.add_argument("--titulo", help="título interno do projeto")
    ap.add_argument("--forcar", action="store_true", help="permite copiar sobre uma pasta que já tem package.json")
    a = ap.parse_args()

    destino = os.path.abspath(a.destino)
    if os.path.exists(os.path.join(destino, "package.json")) and not a.forcar:
        sys.exit(f"{destino} já tem package.json. Use --forcar para copiar por cima (arquivos de dados existentes são preservados).")
    os.makedirs(destino, exist_ok=True)

    criados = []
    for raiz, dirs, arqs in os.walk(TEMPLATE):
        dirs[:] = [d for d in dirs if d not in IGNORAR]
        rel = os.path.relpath(raiz, TEMPLATE)
        alvo_dir = os.path.join(destino, rel) if rel != "." else destino
        os.makedirs(alvo_dir, exist_ok=True)
        for nome in arqs:
            origem = os.path.join(raiz, nome)
            final = nome
            if nome == "gitignore.txt":
                final = ".gitignore"
            elif nome.endswith(".example.json"):
                final = nome.replace(".example.json", ".json")
            alvo = os.path.join(alvo_dir, final)
            if os.path.exists(alvo) and (final.endswith(".json") or final.endswith(".md")):
                continue  # nunca sobrescreve dados/fichas do usuário
            shutil.copy2(origem, alvo)
            criados.append(os.path.relpath(alvo, destino))

    cfg_path = os.path.join(destino, "src", "data", "config.json")
    with open(cfg_path, encoding="utf-8") as f:
        cfg = json.load(f)
    for chave, valor in (("formato", a.formato), ("variante", a.variante), ("acento", a.acento), ("titulo", a.titulo)):
        if valor:
            cfg[chave] = valor
    with open(cfg_path, "w", encoding="utf-8") as f:
        json.dump(cfg, f, ensure_ascii=False, indent=2)

    for pasta in ("work", "out", "downloads", os.path.join("public", "prints")):
        os.makedirs(os.path.join(destino, pasta), exist_ok=True)

    print(f"projeto criado em {destino} ({len(criados)} arquivos)")
    print(f"config: formato={cfg['formato']} variante={cfg['variante']} acento={cfg['acento']}")
    print("próximo passo: npm install && npx tsc --noEmit")


if __name__ == "__main__":
    main()
