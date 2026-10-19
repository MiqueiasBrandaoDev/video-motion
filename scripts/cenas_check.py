"""Mede quanto tempo cada texto de tela fica parado, direto do cenas.json (antes do render).

Regra (lição real, reel de palestra): texto de tela, exceto a legenda, não fica parado
mais de ~2,5 s. Card com frase parada 5-8 s enquanto o orador fala faz o espectador ler
a mesma coisa várias vezes e perder a fala. Frase-chave curta e grande por ~1,5-2 s e
volta para o orador.

Como mede: cada cena vai do seu início até o início da próxima (como o Video.tsx, com
puxar_para_batida quando ligado). Dentro dela, toda referência de tempo nas chaves
"em", "risco", "ate", "escreveEm", "desde" (inclusive dentro de um objeto "em": {...})
conta como mudança na tela. O maior intervalo sem mudança é o "parado".

Categorias:
  texto   (padrão)  maior trecho parado > limite = ERRO
  orador  (tipos em --orador ou "orador": true na cena) a filmagem já muda sozinha;
          se a cena tiver "linhas" sobre o orador, o tempo em que elas ficam na tela
          (da primeira até o fim da cena) > limite = AVISO
  print   (tipo "print") mudanças vêm de prints.json (desde, zooms, clique); a câmera
          anda sozinha (Ken Burns), então > limite = AVISO
Cena orador com "sobre" (talking head): cada sobreposição de texto (titulo, riscado, numero,
chips, comando, cards) é medida do seu "em" até o "ate" (ou o fim da cena); trecho parado acima
do limite = AVISO. HUD (rec, objecoes, pill, final) e passos (muda por item) ficam de fora.
AVISO também para card de texto que fica mais de 2x o limite na tela (mesmo mudando, o
texto acumula). Na última cena, o fecho parado até o fim (CTA) é tolerado até 2x o
limite. Se o vídeo tem cena de orador, também avisa quando há mais de 6 s seguidos só de cenas
de texto/print (falta a alternância frase, orador, frase, orador).

Precisão: ~0,2 s (ignora os 6 frames de sobreposição e a antecipação da entrada).

Regras de ritmo padrão (SKILL.md, "Quatro regras de retenção"), conferidas aqui:
  1. nenhuma imagem parada por mais de 2 s: lista os eventos visuais (troca de cena, punch-in,
     P&B, card, sobreposição entrando/saindo, linha de frase, carimbo, câmera; a cena `volta`
     conta como movimento contínuo) e AVISA cada intervalo acima de --evento-max (2 s).
     Ken Burns/zoom lento não é evento. --eventos imprime todos os intervalos (para o QA).
  2. nunca ler a mesma coisa duas vezes: cruza as páginas do legendas.json com os textos visíveis
     (mesma conta do src/textoTela.ts). A página com palavra repetida some sozinha no render
     naquele trecho; com config "legenda_repete": true isso vira AVISO. AVISA também card que repete as palavras
     de outro card que acabou de sair (até 3 s).
  3. sempre voltar para a pessoa: AVISA trecho sem rosto acima de --sem-rosto (4 s).

Uso:
  python -I scripts/cenas_check.py [--projeto .] [--cenas src/data/cenas.json]
         [--limite 2.5] [--evento-max 2] [--sem-rosto 4] [--eventos]
         [--orador filmagem,orador,video,recorte]
Sai com código 1 se houver ERRO.
"""
import argparse
import json
import os
import re
import sys
import unicodedata

SOBRE_HUD = {"rec", "objecoes", "pill", "final", "passos"}
CHAVES_TEMPO = {"em", "risco", "ate", "escreveEm", "desde", "ateEm", "explodeEm", "juntaEm", "planaEm", "rotuloEm", "riscaEm", "feitoEm", "editadoEm", "checks"}
IGNORAR = {"id", "tipo", "inicio", "wipe", "rotulo", "chaves", "_como_usar", "cameraInicial"}


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
            raise ValueError(f"referência inválida: {ref}")
        tabela = blocos if m.group(1) else marcos
        if m.group(2) not in tabela:
            raise ValueError(f"{'bloco' if m.group(1) else 'marco'} ausente: {m.group(2)} (em '{ref}')")
        return float(tabela[m.group(2)] + (int(m.group(3)) if m.group(3) else 0))
    return ms


def refs_de(no, dentro_tempo=False):
    """Coleta todas as referências de tempo de uma cena (ou de um plano de print)."""
    if isinstance(no, dict):
        for k, v in no.items():
            if k in IGNORAR and not dentro_tempo:
                continue
            if k in CHAVES_TEMPO or dentro_tempo:
                if isinstance(v, (str, int, float)) and not isinstance(v, bool):
                    yield v
                else:
                    yield from refs_de(v, dentro_tempo=True)
            else:
                yield from refs_de(v)
    elif isinstance(no, list):
        for x in no:
            yield from refs_de(x, dentro_tempo)
    elif dentro_tempo and isinstance(no, (str, int, float)) and not isinstance(no, bool):
        yield no


# ---------- regra 2: texto da legenda x texto na tela (espelha src/textoTela.ts) ----------
CHAVES_TEXTO = {"texto", "texto2", "linha1", "linha2", "rotulo", "titulo", "sub", "marca", "slogan", "principal", "prefixo", "sufixo", "rodape"}
PULAR_TEXTO = {"legenda", "pb", "punch", "camera", "cameraInicial", "enquadramento", "card", "raw", "_como_usar", "id", "tipo", "inicio", "video", "recorte", "icone"}
VAZIAS = {"para", "como", "mais", "isso", "esse", "essa", "este", "esta", "eles", "elas", "voce", "quando", "porque", "entao", "muito", "tudo",
          "pelo", "pela", "sobre", "aqui", "onde", "qual", "quem", "dele", "dela", "deles", "numa", "num",
          "que", "pra", "pro", "com", "por", "uma", "uns", "dos", "das", "nos", "nas", "ele", "ela", "seu", "sua", "meu", "mas",
          "nem", "foi", "era", "vai", "tem", "the", "and"}


def normaliza(t):
    t = unicodedata.normalize("NFD", t.lower())
    return "".join(ch for ch in t if not unicodedata.combining(ch) and (ch.isalnum() or ch == "%"))


def significativa(w):
    n = normaliza(w)
    if not n:
        return None
    tem_dig = any(ch.isdigit() for ch in n)
    if not tem_dig and (len(n) < 3 or n in VAZIAS):
        return None
    return n[:-1] if len(n) >= 5 and n.endswith("s") and not tem_dig else n


def palavras_de(texto):
    return {x for x in (significativa(w) for w in re.split(r"[\s\-/]+", re.sub(r"[*_\[\]{}~|]", " ", texto))) if x}


def repete(palavra, na_tela):
    partes = [x for x in (significativa(w) for w in re.split(r"[-/]+", palavra)) if x]
    return bool(partes) and all(x in na_tela for x in partes)


def janelas_texto(cenas, inicios, fim_video, ms):
    """[(ini_ms, fim_ms, palavras, texto, id_cena)] de todo texto de tela."""
    saida = []

    def visita(no, ini, fim, cid):
        if isinstance(no, list):
            for x in no:
                visita(x, ini, fim, cid)
            return
        if not isinstance(no, dict):
            return
        a, b = ini, fim
        try:
            if isinstance(no.get("em"), (int, float, str)) and not isinstance(no.get("em"), bool):
                a = max(ini, ms(no["em"]))
            if isinstance(no.get("ate"), (int, float, str)) and not isinstance(no.get("ate"), bool):
                b = min(fim, ms(no["ate"]))
        except ValueError:
            pass
        for k, v in no.items():
            if k in PULAR_TEXTO:
                continue
            if k in CHAVES_TEXTO and isinstance(v, str) and v.strip():
                pal = palavras_de(v)
                if pal and b > a:
                    saida.append((a, b, pal, v, cid))
            elif isinstance(v, (dict, list)):
                visita(v, a, b, cid)

    for i, c in enumerate(cenas):
        visita(c, inicios[i], inicios[i + 1] if i + 1 < len(cenas) else fim_video, c.get("id", "?"))
    return saida


# ---------- regra 1: eventos visuais ----------
def eventos_de(no, caminho="", pai=""):
    """(ref, caminho) de tudo que muda a imagem numa cena (sem a posição da legenda)."""
    if isinstance(no, dict):
        for k, v in no.items():
            if k in ("legenda", "_como_usar", "cameraInicial", "inicio", "id", "tipo"):
                continue
            if (k in CHAVES_TEMPO and k != "checks") or (k == "de" and pai == "pb"):
                if isinstance(v, (str, int, float)) and not isinstance(v, bool):
                    yield v, f"{caminho}.{k}".lstrip(".")
                    continue
            if k == "checks" and isinstance(v, list):
                for j, r in enumerate(v):
                    yield r, f"{caminho}.checks[{j}]".lstrip(".")
                continue
            yield from eventos_de(v, f"{caminho}.{k}".lstrip("."), k)
    elif isinstance(no, list):
        for j, x in enumerate(no):
            yield from eventos_de(x, f"{caminho}[{j}]", pai)


def eventos_visuais(cenas, inicios, fim_video, ms):
    ev = []
    for i, c in enumerate(cenas):
        ini, fim = inicios[i], inicios[i + 1] if i + 1 < len(cenas) else fim_video
        ev.append((ini, f"cena {c.get('id', '?')} ({c.get('tipo')})"))
        if c.get("tipo") == "volta":  # a fita corre: movimento contínuo
            t = ini + 400
            while t < fim:
                ev.append((t, f"{c.get('id')}: rebobinando"))
                t += 400
        for r, cam in eventos_de(c):
            try:
                t = ms(r)
            except ValueError:
                continue
            if ini <= t <= fim:
                ev.append((t, f"{c.get('id')}.{cam}"))
    ev.append((fim_video, "fim"))
    ev.sort()
    return ev


def cortes_do_video(blocos, pulo_min=1.0):
    """Junções do orador.mp4 em que o original pulou mais de `pulo_min` s: corte visível (a cabeça muda de posição)."""
    trs = blocos.get("trechos", [])
    return [(tr2["novo_ini"] * 1000, f"corte no vídeo (pulo de {tr2['orig_ini'] - tr1['orig_fim']:.1f}s do original)")
            for tr1, tr2 in zip(trs, trs[1:]) if tr2["orig_ini"] - tr1["orig_fim"] >= pulo_min]


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Mede o tempo de texto parado por cena a partir do cenas.json.")
    ap.add_argument("--projeto", default=".")
    ap.add_argument("--cenas", default=os.path.join("src", "data", "cenas.json"))
    ap.add_argument("--limite", type=float, default=2.5, help="máximo de texto parado (s)")
    ap.add_argument("--evento-max", type=float, default=2.0, help="máximo sem evento visual (s), regra 1")
    ap.add_argument("--sem-rosto", type=float, default=4.0, help="máximo seguido sem o orador (s), regra 3")
    ap.add_argument("--eventos", action="store_true", help="lista todos os intervalos entre eventos visuais")
    ap.add_argument("--orador", default="filmagem,orador,video,recorte,duelo,letterbox,teaser,volta", help="tipos de cena que mostram o orador")
    a = ap.parse_args()

    raiz = os.path.abspath(a.projeto)
    p = lambda x: x if os.path.isabs(x) else os.path.join(raiz, x)
    cenas = json.load(open(p(a.cenas), encoding="utf-8"))["cenas"]
    config = carregar(os.path.join(raiz, "src", "data", "config.json"), {})
    blocos = carregar(os.path.join(raiz, "src", "data", "blocos.json"), {})
    prints = carregar(os.path.join(raiz, "src", "data", "prints.json"), {})
    batidas = carregar(os.path.join(raiz, "src", "data", "batidas.json"), {}).get("batidas_s", [])
    tipos_orador = {t.strip() for t in a.orador.split(",") if t.strip()}
    ms = resolvedor(raiz)

    dur_s = (blocos.get("duracao_s") or config.get("duracao_s") or 10) + (config.get("extra_fim_s") or 0)
    fim_video = dur_s * 1000

    def na_batida(t):
        if not config.get("puxar_para_batida") or not batidas:
            return t
        antes = [b * 1000 for b in batidas if b * 1000 <= t and t - b * 1000 <= 300]
        return antes[-1] if antes else t

    erros, avisos = [], []
    inicios = []
    for i, c in enumerate(cenas):
        try:
            inicios.append(0.0 if i == 0 else na_batida(ms(c["inicio"])))
        except ValueError as e:
            sys.exit(f"cena {c.get('id')}: {e}")

    linhas_saida = []
    seq_texto = []  # trechos contínuos só de texto (para checar a alternância com o orador)
    for i, c in enumerate(cenas):
        ini = inicios[i]
        fim = inicios[i + 1] if i + 1 < len(cenas) else fim_video
        tipo = c.get("tipo", "?")
        cat = "orador" if (tipo in tipos_orador or c.get("orador")) else "print" if tipo == "print" else "texto"

        fonte = c
        if cat == "print":
            fonte = prints.get(c.get("janela", c.get("id")), {})
        tempos = []
        for r in refs_de(fonte):
            if r == "inicio":  # "desde": "inicio" no prints.json = início da cena
                continue
            try:
                t = ms(r)
            except ValueError as e:
                erros.append(f"cena {c.get('id')}: {e}")
                continue
            if ini < t < fim:
                tempos.append(t)
        marcos_cena = sorted({ini, *tempos, fim})
        gaps = [(y - x, x, y) for x, y in zip(marcos_cena, marcos_cena[1:])]
        ultima = i == len(cenas) - 1
        if ultima and len(gaps) > 1 and cat != "orador":
            # o fecho (CTA parado até o fim) é tolerado até ~2x o limite; o resto da cena segue a regra
            cauda = gaps.pop()
            if cauda[0] > 2 * a.limite * 1000:
                avisos.append(f"{c.get('id')}: fecho parado {cauda[0] / 1000:.1f}s no fim do vídeo. Encurte o final.")
        parado, de, ate = max(gaps) if gaps else (fim - ini, ini, fim)
        if cat == "texto" and fim - ini > 2 * a.limite * 1000 and not ultima:
            avisos.append(f"{c.get('id')} ({tipo}): card na tela por {(fim - ini) / 1000:.1f}s. Mesmo mudando, "
                          f"texto acumulado cansa: prefira frase curta (~1,5-2 s) e volta para o orador.")

        status = "ok"
        if cat == "orador":
            if c.get("linhas"):
                prim = []
                for ln in c["linhas"]:
                    try:
                        prim.append(ms(ln["em"]) if "em" in ln else ini)
                    except ValueError:
                        prim.append(ini)
                ini_txt = max(ini, min(prim))
                parado, de, ate = fim - ini_txt, ini_txt, fim
                if parado > a.limite * 1000:
                    status = "AVISO"
                    avisos.append(f"{c.get('id')}: linhas sobre o orador ficam {parado / 1000:.1f}s na tela "
                                  f"({de / 1000:.2f}-{ate / 1000:.2f}s). Tire a frase após ~2 s e deixe o orador com a legenda.")
            else:
                parado = 0.0
            for it in c.get("sobre", []) or []:
                if it.get("tipo") in SOBRE_HUD:
                    continue
                try:
                    a0 = max(ini, ms(it["em"]))
                    a1 = min(fim, ms(it["ate"])) if "ate" in it else fim
                    mud = sorted({a0, a1, *[t for t in (ms(r) for r in refs_de({k: v for k, v in it.items() if k not in ("em", "ate")})) if a0 < t < a1]})
                except (ValueError, KeyError) as e:
                    erros.append(f"cena {c.get('id')}: sobre {it.get('tipo')}: {e}")
                    continue
                gap = max((y - x for x, y in zip(mud, mud[1:])), default=0)
                parado = max(parado, gap)
                if gap > a.limite * 1000:
                    status = "AVISO"
                    avisos.append(f"{c.get('id')}: sobre '{it.get('tipo')}' parado {gap / 1000:.1f}s ({a0 / 1000:.2f}-{a1 / 1000:.2f}s). "
                                  f"Ponha um 'ate', troque o texto ou faça punch-in.")
            seq_texto = []
        else:
            if parado > a.limite * 1000:
                msg = (f"{c.get('id')} ({tipo}): {parado / 1000:.1f}s sem mudança ({de / 1000:.2f}-{ate / 1000:.2f}s). "
                       f"Corte a cena, troque a frase, faça punch-in ou volte para o orador.")
                if cat == "texto":
                    status = "ERRO"
                    erros.append(msg)
                else:
                    status = "AVISO"
                    avisos.append(msg)
            seq_texto.append((ini, fim))
            if tipos_orador & {x.get("tipo") for x in cenas} and seq_texto[-1][1] - seq_texto[0][0] > a.sem_rosto * 1000:
                avisos.append(f"{seq_texto[0][0] / 1000:.2f}-{seq_texto[-1][1] / 1000:.2f}s: sem o rosto por "
                              f"{(seq_texto[-1][1] - seq_texto[0][0]) / 1000:.1f}s seguidos (máx. {a.sem_rosto:g} s, regra 3). "
                              f"Volte para o orador entre um bloco de motion e outro.")
                seq_texto = []
        linhas_saida.append(f"{c.get('id', '?'):14} {tipo:13} {cat:7} {ini / 1000:6.2f}-{fim / 1000:6.2f}s "
                            f"dur {(fim - ini) / 1000:5.2f}s  parado {parado / 1000:5.2f}s  {status}")

    print(f"{'cena':14} {'tipo':13} {'categ.':7} {'início-fim':16} {'duração':11} {'maior parado':15} status")
    for ln in linhas_saida:
        print(ln)
    print(f"\nlimite {a.limite:.1f}s · duração do vídeo {dur_s:.2f}s · tipos de orador: {', '.join(sorted(tipos_orador))}")

    # regra 1: intervalos entre eventos visuais
    ev = sorted(eventos_visuais(cenas, inicios, fim_video, ms) + cortes_do_video(blocos))
    tempos = sorted({round(t / 10) * 10 for t, _ in ev})
    desc = {}
    for t, d in ev:
        desc.setdefault(round(t / 10) * 10, d)
    gaps = [(y - x, x, y) for x, y in zip(tempos, tempos[1:])]
    if gaps:
        maior = max(gaps)
        acima = [g for g in gaps if g[0] > a.evento_max * 1000 + 1]
        print(f"\nregra 1 (imagem parada): {len(tempos)} eventos visuais; maior intervalo {maior[0] / 1000:.2f}s "
              f"({maior[1] / 1000:.2f}-{maior[2] / 1000:.2f}s); {len(acima)} acima de {a.evento_max:g} s")
        if a.eventos:
            for g, x, y in gaps:
                print(f"  {x / 1000:6.2f}-{y / 1000:6.2f}s  {g / 1000:4.2f}s  {'!!' if g > a.evento_max * 1000 + 1 else '  '} {desc.get(x, '')}")
        for g, x, y in acima:
            avisos.append(f"{x / 1000:.2f}-{y / 1000:.2f}s: {g / 1000:.2f}s sem evento visual (máx. {a.evento_max:g} s, regra 1; depois de '{desc.get(x, '')}'). "
                          f"Ponha punch-in, troca de enquadramento, componente entrando/saindo ou troca rosto/motion. Zoom lento não conta.")

    # regra 2: legenda x texto na tela, e card repetindo card
    janelas = janelas_texto(cenas, inicios, fim_video, ms)
    legendas = carregar(os.path.join(raiz, "src", "data", "legendas.json"), [])
    # páginas como o Remotion monta (pageBreakAfter), visíveis de início-60 ms até a próxima página
    paginas, atual = [], []
    for tk in legendas:
        atual.append(tk)
        if tk.get("pageBreakAfter"):
            paginas.append(atual)
            atual = []
    if atual:
        paginas.append(atual)
    repetidas = []
    for k, pg in enumerate(paginas):
        p0 = float(pg[0]["startMs"]) - 60
        p1 = float(paginas[k + 1][0]["startMs"]) if k + 1 < len(paginas) else float(pg[-1]["endMs"]) + 900
        p1 = min(p1, float(pg[-1]["endMs"]) + 900)
        for j0, j1, pal, txt, cid in janelas:
            if j0 < p1 and j1 > p0:
                ws = [tk["text"].strip() for tk in pg if repete(tk["text"].strip(), pal)]
                if ws:
                    repetidas.append((max(p0, j0), min(p1, j1), " ".join(tk["text"].strip() for tk in pg), ", ".join(ws), txt))
    auto = not config.get("legenda_repete")
    if repetidas:
        oculto = sum(b - a for a, b, *_ in repetidas)
        print(f"\nregra 2 (ler duas vezes): {len(repetidas)} página(s) da legenda com palavra já escrita na tela"
              + (f" -> somem sozinhas no render (textoTela.ts), {oculto / 1000:.1f}s de legenda oculta" if auto else ""))
        for a0, a1, pg, ws, f in repetidas:
            print(f"  {a0 / 1000:6.2f}-{a1 / 1000:6.2f}s  '{pg}'  ({ws} = tela '{f}')")
            if not auto:
                avisos.append(f"{a0 / 1000:.2f}s legenda '{pg}' repete o texto da tela '{f}' (regra 2). Tire \"legenda_repete\" do config.json ou oculte a legenda.")
    else:
        print("\nregra 2 (ler duas vezes): nenhuma página da legenda repete texto da tela")
    janelas.sort(key=lambda j: j[0])
    for i, (a0, a1, pa, ta, ca) in enumerate(janelas):
        for b0, b1, pb, tb, cb in janelas[i + 1:]:
            if b0 - a1 > 3000:
                break
            if b0 < a0 or ta == tb or (b0 < a1 and ca == cb):
                continue
            comum = pa & pb
            if comum and len(comum) >= 0.6 * min(len(pa), len(pb)):
                avisos.append(f"{b0 / 1000:.2f}s card '{tb}' repete '{ta}' (até {a1 / 1000:.2f}s): {', '.join(sorted(comum))} (regra 2)")
    for w in avisos:
        print(f"AVISO: {w}")
    for x in erros:
        print(f"ERRO: {x}")
    if erros:
        print(f"{len(erros)} erro(s): texto parado demais.")
        sys.exit(1)
    print("ok")


if __name__ == "__main__":
    main()
