"""Rodízio de direções visuais: propõe direções do catálogo (references/prompt-motion/direcoes.json)
que casam com o vídeo e não foram usadas nos últimos vídeos, e registra o que cada vídeo usou.
Serve para não repetir a mesma linguagem visual vídeo após vídeo.

Registro de uso: um JSON por linha em <VIDEO_MOTION_PASTA>/direcoes-usadas.jsonl (ou
~/.video-motion/direcoes-usadas.jsonl sem a variável; --registro muda). Fica fora do repositório
da skill: é histórico de quem usa, não da skill.

Comandos:
  sugerir    [--encaixe orador] [--categorias charts product-ui] [--familia dados] [--custo-max medio]
             [--n 3] [--ultimos 5] [--semente 7]
             filtra pelo encaixe/categorias, tira as usadas nos últimos N vídeos, prefere famílias
             diferentes entre si e as menos usadas no histórico; empate é sorteado
  registrar  --video <nome> --direcoes <id> [<id> ...] [--nota texto]
  historico  [--ultimos 10]
  listar     [--familia dados] [--encaixe orador]

Uso:
  python -I scripts/rodizio.py sugerir --encaixe orador --categorias kinetic-type
  python -I scripts/rodizio.py registrar --video corte-tema --direcoes hud-camera-capitulos
"""
import argparse
import collections
import datetime
import json
import os
import random
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
CATALOGO = os.path.join(AQUI, "..", "references", "prompt-motion", "direcoes.json")
CUSTOS = ["baixo", "medio", "alto"]


def registro_padrao():
    mae = os.environ.get("VIDEO_MOTION_PASTA", "").strip()
    base = mae if mae else os.path.join(os.path.expanduser("~"), ".video-motion")
    return os.path.join(base, "direcoes-usadas.jsonl")


def carregar_direcoes(caminho):
    if not os.path.exists(caminho):
        sys.exit(f"catálogo não encontrado: {caminho}")
    return json.load(open(caminho, encoding="utf-8"))["direcoes"]


def carregar_registro(caminho):
    if not os.path.exists(caminho):
        return []
    return [json.loads(l) for l in open(caminho, encoding="utf-8") if l.strip()]


def usadas_recentes(registro, ultimos):
    videos, ids = [], set()
    for r in reversed(registro):
        if r["video"] not in videos:
            videos.append(r["video"])
        if len(videos) > ultimos:
            break
        ids.update(r["direcoes"])
    return ids


def casa(d, a):
    if a.familia and d.get("familia") != a.familia:
        return None
    if a.encaixe and a.encaixe not in (d.get("encaixe") or []):
        return None
    if a.custo_max and CUSTOS.index(d.get("custo", "alto")) > CUSTOS.index(a.custo_max):
        return None
    pontos = 0
    if a.categorias:
        pontos = len(set(a.categorias) & set(d.get("categorias") or []))
        if not pontos:
            return None
    return pontos


def mostrar(d, extra=""):
    refs = d.get("refs") or []
    print(f'{d["id"]}  [{d.get("familia")}, custo {d.get("custo")}, força {d.get("forca", "-")}]{extra}')
    print(f'  {d["nome"]}: {d.get("resumo", "")}')
    if d.get("componentes"):
        print(f'  no template: {", ".join(d["componentes"])}')
    if refs:
        print(f'  refs: {" ".join("https://prompt-motion.com/" + r for r in refs[:4])}')
        print(f'  ver:  python -I scripts/prompt_motion.py frames {refs[0]} --completo --n 9 --saida work/ref')


def cmd_sugerir(a):
    direcoes = carregar_direcoes(a.catalogo)
    registro = carregar_registro(a.registro)
    recentes = usadas_recentes(registro, a.ultimos)
    vezes = collections.Counter(i for r in registro for i in r["direcoes"])
    rnd = random.Random(a.semente)
    candidatas = []
    for d in direcoes:
        p = casa(d, a)
        if p is None or d["id"] in recentes:
            continue
        # mais categorias em comum, menos usada no histórico, mais forte; sorteio desempata
        candidatas.append(((-p, vezes[d["id"]], -(d.get("forca") or 0), rnd.random()), d))
    candidatas.sort(key=lambda x: x[0])
    escolhidas, familias = [], set()
    for _, d in candidatas:  # 1ª passada: uma por família
        if len(escolhidas) < a.n and d.get("familia") not in familias:
            escolhidas.append(d)
            familias.add(d.get("familia"))
    for _, d in candidatas:  # completa se faltou família
        if len(escolhidas) < a.n and d not in escolhidas:
            escolhidas.append(d)
    if not escolhidas:
        print("nenhuma direção casa com o filtro fora das usadas recentemente; afrouxe o filtro ou aumente o catálogo")
        return
    print(f"{len(candidatas)} candidata(s); fora {len(recentes)} usada(s) nos últimos {a.ultimos} vídeo(s) ({a.registro})\n")
    for d in escolhidas:
        mostrar(d, f"  usada {vezes[d['id']]}x" if vezes[d["id"]] else "")
        print()


def cmd_registrar(a):
    ids = {d["id"] for d in carregar_direcoes(a.catalogo)}
    desconhecidas = [i for i in a.direcoes if i not in ids]
    if desconhecidas:
        sys.exit(f"id(s) fora do catálogo: {', '.join(desconhecidas)}")
    os.makedirs(os.path.dirname(a.registro), exist_ok=True)
    linha = {"data": datetime.date.today().isoformat(), "video": a.video, "direcoes": a.direcoes}
    if a.nota:
        linha["nota"] = a.nota
    with open(a.registro, "a", encoding="utf-8") as f:
        f.write(json.dumps(linha, ensure_ascii=False) + "\n")
    print(f"registrado em {a.registro}: {a.video} -> {', '.join(a.direcoes)}")


def cmd_historico(a):
    registro = carregar_registro(a.registro)
    for r in registro[-a.ultimos:]:
        print(f'{r["data"]}  {r["video"]:28} {", ".join(r["direcoes"])}{"  # " + r["nota"] if r.get("nota") else ""}')
    print(f"{len(registro)} registro(s) em {a.registro}")


def cmd_listar(a):
    direcoes = [d for d in carregar_direcoes(a.catalogo)
                if (not a.familia or d.get("familia") == a.familia) and (not a.encaixe or a.encaixe in (d.get("encaixe") or []))]
    for d in sorted(direcoes, key=lambda d: (d.get("familia") or "", d["id"])):
        print(f'{d.get("familia", ""):12} {d["id"]:34} {d.get("custo", ""):6} {d["nome"]}')
    print(f"{len(direcoes)} direção(ões)")


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Rodízio de direções visuais do catálogo prompt-motion.")
    ap.add_argument("--catalogo", default=CATALOGO)
    ap.add_argument("--registro", default=registro_padrao())
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("sugerir")
    p.add_argument("--encaixe")
    p.add_argument("--categorias", nargs="+")
    p.add_argument("--familia")
    p.add_argument("--custo-max", choices=CUSTOS)
    p.add_argument("--n", type=int, default=3)
    p.add_argument("--ultimos", type=int, default=5, help="vídeos recentes cujas direções ficam de fora")
    p.add_argument("--semente", type=int)
    p = sub.add_parser("registrar")
    p.add_argument("--video", required=True)
    p.add_argument("--direcoes", nargs="+", required=True)
    p.add_argument("--nota")
    p = sub.add_parser("historico")
    p.add_argument("--ultimos", type=int, default=10)
    p = sub.add_parser("listar")
    p.add_argument("--familia")
    p.add_argument("--encaixe")
    a = ap.parse_args()
    {"sugerir": cmd_sugerir, "registrar": cmd_registrar, "historico": cmd_historico, "listar": cmd_listar}[a.cmd](a)


if __name__ == "__main__":
    main()
