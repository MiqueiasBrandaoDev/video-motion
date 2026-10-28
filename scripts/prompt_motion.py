"""Consulta o prompt-motion.com (galeria de vídeos de motion feitos com o Opus 5.5, com o prompt ou a
skill de cada um) para puxar referência nova e fugir da mesmice.

O site não tem API pública de prompts (as rotas /api são de patrocínio e pesquisa, e o robots.txt
bloqueia /api/). Os dados vêm renderizados no servidor (Next.js, payload RSC em self.__next_f):
  lista     GET https://prompt-motion.com/           objetos {slug, title, date, tags, contentTags,
                                                     handle, poster, preview, video, ...}
  categoria GET https://prompt-motion.com/tags/<tag>  mesma lista filtrada
  item      GET https://prompt-motion.com/<slug>      prompt integral ("prompt", "translation"),
                                                     modelo, esforço, post original no X; item do
                                                     tipo skill traz descrição, comando e repositório
  extras    /templates/showreel, /templates/realtime, /blog/<post>, /sitemap.xml
  mídia     https://media.prompt-motion.com/...       preview.<hash>.mp4 (~100 KB), video.<hash>.mp4,
                                                     poster.<hash>.webp

O robots.txt declara ai-train=no e use=reference, e o rodapé diz que vídeos e prompts são dos
criadores. Por isso a skill guarda só o índice e fichas escritas por nós (references/prompt-motion/),
sempre com o link de origem, e busca o texto integral aqui, na hora, quando precisar.

Comandos:
  listar     [--tag kinetic-type ...] [--tipo prompt|skill] [--busca texto] [--desde AAAA-MM-DD] [--json]
  ver        <slug> [--json]                 prompt integral, modelo, esforço, post original
  frames     <slug> [...] | --todos  --saida <pasta> [--n 4] [--completo] [--guardar] [--refazer]
             <pasta>/<slug>/folha.jpg com N frames da prévia (~4 s) ou do vídeo completo
             (~15 s, 1080p60); lê direto da URL, pula folha que já existe
  novidades  [--indice references/prompt-motion/indice.json]   itens do site fora do índice
  coletar    --saida itens.jsonl [--slugs a b] [--pausa 1.0]   lote retomável de "ver" (refaz o catálogo)

Categorias: product-ui, phone, charts, diagrams, kinetic-type, shapes, particles, characters,
photos, music, code.

Uso:
  python -I scripts/prompt_motion.py listar --tag charts --desde 2026-10-01
  python -I scripts/prompt_motion.py ver stephanlivera-df17a2
  python -I scripts/prompt_motion.py frames stephanlivera-df17a2 --saida work/ref
  python -I scripts/prompt_motion.py novidades
"""
import argparse
import html as html_mod
import json
import math
import os
import re
import subprocess
import sys
import time
import urllib.request

BASE = "https://prompt-motion.com"
UA = "video-motion-skill/1.0 (referencia pessoal; respeita robots.txt)"
TAGS = ["product-ui", "phone", "charts", "diagrams", "kinetic-type", "shapes", "particles",
        "characters", "photos", "music", "code"]
AQUI = os.path.dirname(os.path.abspath(__file__))
INDICE_PADRAO = os.path.join(AQUI, "..", "references", "prompt-motion", "indice.json")


def baixar(url, timeout=30):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def payload(pagina):
    """Junta os pedaços self.__next_f.push([1,"..."]) num texto só."""
    pedacos = re.findall(r'self\.__next_f\.push\(\[1,"(.*?)"\]\)</script>', pagina, re.S)
    return "".join(json.loads('"' + p + '"') for p in pedacos)


def catalogo(url=BASE):
    texto = payload(baixar(url).decode("utf-8"))
    dec = json.JSONDecoder()
    vistos, itens = set(), []
    for m in re.finditer(r'\{"slug":', texto):
        try:
            obj, _ = dec.raw_decode(texto, m.start())
        except ValueError:
            continue
        if "title" in obj and "promptShared" in obj and obj["slug"] not in vistos:
            vistos.add(obj["slug"])
            itens.append({k: obj.get(k) for k in ("slug", "title", "date", "tags", "contentTags", "handle",
                                                     "poster", "preview", "video", "width", "height")})
    return itens


def limpar(t):
    return html_mod.unescape(re.sub(r"<[^>]+>", "", t or "")).strip()


def resolver(texto, val):
    """Texto longo vem como referência "$27" a uma linha "27:T<bytes em hex>,<texto>" do payload."""
    if not isinstance(val, str) or not re.fullmatch(r"\$[0-9a-f]+", val):
        return val
    m = re.search(r"(?:^|\n)" + val[1:] + r":T([0-9a-f]+),", texto)
    if not m:
        return val
    return texto[m.end():].encode("utf-8")[:int(m.group(1), 16)].decode("utf-8", "ignore")


def item(slug):
    pagina = baixar(f"{BASE}/{slug}").decode("utf-8")
    texto = payload(pagina)
    dec = json.JSONDecoder()
    prompts = []
    # só o prompt principal: o que vem seguido de "translation" (a tradução é um objeto com outro "prompt" dentro)
    for m in re.finditer(r'"prompt":', texto):
        try:
            val, fim = dec.raw_decode(texto, m.end())
        except ValueError:
            continue
        t = re.match(r'\s*,\s*"translation":', texto[fim:])
        if not isinstance(val, str) or not t:
            continue
        try:
            trad, _ = dec.raw_decode(texto, fim + t.end())
        except ValueError:
            trad = None
        idioma = None
        if isinstance(trad, dict):
            idioma, trad = trad.get("language"), resolver(texto, trad.get("prompt"))
        elif not isinstance(trad, str) or trad.startswith("$undefined"):
            trad = None
        val = resolver(texto, val)
        if val not in [p["texto"] for p in prompts]:
            prompts.append({"texto": val, "idioma": idioma, "traducao": resolver(texto, trad)})
    meta = {limpar(k): limpar(v) for k, v in re.findall(r"<dt[^>]*>(.*?)</dt><dd[^>]*>(.*?)</dd>", pagina, re.S)}
    titulo = re.search(r"<title>(.*?)</title>", pagina, re.S)
    post = re.search(r'href="(https://x\.com/[^/"]+/status/\d+)', pagina)
    tags = re.findall(r'href="/tags/([a-z0-9-]+)"', pagina)
    skill = re.search(r'<h2[^>]*>Skill</h2><p[^>]*>(.*?)</p>', pagina, re.S)
    instalar = re.search(r"(npx skills add[^<]*)", pagina)
    repo = re.search(r'href="(https://github\.com/[^"]+)"', pagina)
    return {
        "slug": slug,
        "url": f"{BASE}/{slug}",
        "titulo": limpar(titulo.group(1)).replace(" · Prompt Motion", "").replace(" · Prompt Motion", "") if titulo else slug,
        "modelo": meta.get("Model"),
        "esforco": meta.get("Effort"),
        "publicado": meta.get("Posted"),
        "categorias": list(dict.fromkeys(tags)),
        "post": post.group(1) if post else None,
        "prompts": prompts,
        "skill": {"descricao": limpar(skill.group(1)), "instalar": limpar(instalar.group(1)) if instalar else None,
                  "repo": repo.group(1) if repo else None} if skill else None,
    }


def cmd_listar(a):
    itens = catalogo(f"{BASE}/tags/{a.tag[0]}" if a.tag and len(a.tag) == 1 else BASE)
    if a.tag:
        itens = [i for i in itens if all(t in (i["contentTags"] or []) for t in a.tag)]
    if a.tipo:
        itens = [i for i in itens if a.tipo in (i["tags"] or [])]
    if a.busca:
        b = a.busca.lower()
        itens = [i for i in itens if b in (i["title"] or "").lower() or b in (i["handle"] or "").lower()]
    if a.desde:
        itens = [i for i in itens if (i["date"] or "") >= a.desde]
    if a.json:
        print(json.dumps(itens, ensure_ascii=False, indent=1))
        return
    for i in itens:
        print(f'{i["date"]}  {i["slug"]:32} {"/".join(i["tags"] or []):12} {",".join(i["contentTags"] or []):34} {i["title"]}')
    print(f"{len(itens)} item(ns)")


def cmd_ver(a):
    d = item(a.slug)
    if a.json:
        print(json.dumps(d, ensure_ascii=False, indent=1))
        return
    print(f'{d["titulo"]}  ({d["url"]})')
    print(f'modelo {d["modelo"]}  esforço {d["esforco"] or "-"}  publicado {d["publicado"]}  categorias {", ".join(d["categorias"])}')
    print(f'post original: {d["post"]}')
    for n, p in enumerate(d["prompts"], 1):
        print(f"\n--- prompt {n} ---\n{p['texto']}")
        if p["traducao"]:
            print(f"\n--- tradução do site (original em {p.get('idioma') or '?'}) ---\n{p['traducao']}")
    if d["skill"]:
        s = d["skill"]
        print(f"\n--- skill ---\n{s['descricao']}\ninstalar: {s['instalar']}\nrepositório: {s['repo']}")
    if not d["prompts"] and not d["skill"]:
        print("\n(sem prompt nem skill na página: o layout do site pode ter mudado)")


def cmd_frames(a):
    itens = {i["slug"]: i for i in catalogo()}
    slugs = list(itens) if a.todos else (a.slugs or [])
    if not slugs:
        sys.exit("informe um ou mais slugs, ou --todos")
    falhas = 0
    for n, slug in enumerate(slugs, 1):
        if slug not in itens:
            print(f"{slug}: não está na lista do site")
            falhas += 1
            continue
        if not a.refazer and os.path.exists(os.path.join(a.saida, slug, "folha.jpg")):
            continue
        try:
            folha_de(itens[slug], a)
        except (subprocess.CalledProcessError, OSError, SystemExit) as e:  # segue o lote
            falhas += 1
            print(f"{n}/{len(slugs)} {slug}  FALHOU: {e}", flush=True)
    if len(slugs) > 1:
        print(f"fim: {len(slugs)} item(ns), {falhas} falha(s)")


def folha_de(it, a):
    url = it["video" if a.completo else "preview"]
    pasta = os.path.join(a.saida, it["slug"])
    os.makedirs(pasta, exist_ok=True)
    fonte = url  # o ffmpeg lê direto da URL; o mp4 só fica em disco com --guardar
    if a.guardar:
        fonte = os.path.join(pasta, "completo.mp4" if a.completo else "preview.mp4")
        if not os.path.exists(fonte):
            with open(fonte, "wb") as f:
                f.write(baixar(url, timeout=180))
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-user_agent", UA, "-show_entries", "format=duration",
                                "-of", "csv=p=0", fonte], capture_output=True, text=True).stdout.strip() or 0)
    if dur <= 0:
        sys.exit(f"{fonte}: ffprobe não leu a duração")
    cols = math.ceil(math.sqrt(a.n))
    linhas = math.ceil(a.n / cols)
    folha = os.path.join(pasta, "folha.jpg")
    # passo dur/(n+1): o último frame cai antes do fim (no fim o fps pode não ter frame e o quadro sai preto);
    # vertical fica com 270 px de largura para a folha não crescer demais
    passo = dur / (a.n + 1)
    larg = 480 if (it.get("width") or 16) >= (it.get("height") or 9) else 270
    vf = f"fps=1/{passo:.4f}:start_time={passo / 2:.4f},scale={larg}:-2,tile={cols}x{linhas}:padding=6:color=black"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-user_agent", UA, "-i", fonte, "-vf", vf, "-frames:v", "1",
                    "-q:v", "3", folha], check=True)
    print(f"{folha}  ({a.n} frames de {dur:.1f} s, {cols}x{linhas})", flush=True)


def cmd_novidades(a):
    caminho = a.indice or INDICE_PADRAO
    conhecidos = set()
    if os.path.exists(caminho):
        conhecidos = {i["slug"] for i in json.load(open(caminho, encoding="utf-8"))["itens"]}
    novos = [i for i in catalogo() if i["slug"] not in conhecidos]
    for i in novos:
        print(f'{i["date"]}  {i["slug"]:32} {",".join(i["contentTags"] or []):34} {i["title"]}')
    print(f"{len(novos)} item(ns) novo(s) fora de {os.path.relpath(caminho)} ({len(conhecidos)} no índice)")


def cmd_coletar(a):
    feitos = set()
    if os.path.exists(a.saida):
        for linha in open(a.saida, encoding="utf-8"):
            if linha.strip():
                feitos.add(json.loads(linha)["slug"])
    lista = catalogo()
    meta = {i["slug"]: i for i in lista}
    slugs = a.slugs or [i["slug"] for i in lista]
    pendentes = [s for s in slugs if s not in feitos]
    print(f"{len(slugs)} item(ns), {len(feitos)} já coletado(s), {len(pendentes)} a coletar", flush=True)
    falhas = 0
    with open(a.saida, "a", encoding="utf-8") as f:
        for n, s in enumerate(pendentes, 1):
            try:
                d = item(s)
                d["lista"] = meta.get(s)
                f.write(json.dumps(d, ensure_ascii=False) + "\n")
                f.flush()
                vazio = "" if d["prompts"] or d["skill"] else "  SEM PROMPT"
                print(f"{n}/{len(pendentes)} {s}{vazio}", flush=True)
            except Exception as e:  # segue o lote; o item fica para a próxima rodada
                falhas += 1
                print(f"{n}/{len(pendentes)} {s}  FALHOU: {e}", flush=True)
            time.sleep(a.pausa)
    print(f"fim: {len(pendentes) - falhas} coletado(s), {falhas} falha(s)")


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Consulta o prompt-motion.com (lista, prompt integral, frames, novidades).")
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("listar")
    p.add_argument("--tag", nargs="+", choices=TAGS)
    p.add_argument("--tipo", choices=["prompt", "skill"])
    p.add_argument("--busca")
    p.add_argument("--desde", help="AAAA-MM-DD")
    p.add_argument("--json", action="store_true")
    p = sub.add_parser("ver")
    p.add_argument("slug")
    p.add_argument("--json", action="store_true")
    p = sub.add_parser("frames")
    p.add_argument("slugs", nargs="*")
    p.add_argument("--todos", action="store_true", help="todos os itens da lista (pula folha que já existe)")
    p.add_argument("--refazer", action="store_true", help="refaz a folha mesmo se já existir")
    p.add_argument("--saida", required=True)
    p.add_argument("--n", type=int, default=4)
    p.add_argument("--completo", action="store_true", help="vídeo completo em vez da prévia de ~4 s (use --n 9)")
    p.add_argument("--guardar", action="store_true", help="salva o mp4 na pasta em vez de ler direto da URL")
    p = sub.add_parser("novidades")
    p.add_argument("--indice")
    p = sub.add_parser("coletar")
    p.add_argument("--saida", required=True)
    p.add_argument("--slugs", nargs="+")
    p.add_argument("--pausa", type=float, default=1.0)
    a = ap.parse_args()
    {"listar": cmd_listar, "ver": cmd_ver, "frames": cmd_frames, "novidades": cmd_novidades, "coletar": cmd_coletar}[a.cmd](a)


if __name__ == "__main__":
    main()
