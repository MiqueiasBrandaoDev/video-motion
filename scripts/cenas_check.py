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

Uso:
  python -I scripts/cenas_check.py [--projeto .] [--cenas src/data/cenas.json]
         [--limite 2.5] [--orador filmagem,orador,video,recorte]
Sai com código 1 se houver ERRO.
"""
import argparse
import json
import os
import re
import sys

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


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Mede o tempo de texto parado por cena a partir do cenas.json.")
    ap.add_argument("--projeto", default=".")
    ap.add_argument("--cenas", default=os.path.join("src", "data", "cenas.json"))
    ap.add_argument("--limite", type=float, default=2.5, help="máximo de texto parado (s)")
    ap.add_argument("--orador", default="filmagem,orador,video,recorte,duelo,letterbox", help="tipos de cena que mostram o orador")
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
            if tipos_orador & {x.get("tipo") for x in cenas} and seq_texto[-1][1] - seq_texto[0][0] > 6000 and len(seq_texto) > 1:
                avisos.append(f"{seq_texto[0][0] / 1000:.2f}-{seq_texto[-1][1] / 1000:.2f}s: só texto por "
                              f"{(seq_texto[-1][1] - seq_texto[0][0]) / 1000:.1f}s seguidos. Alterne frase e orador.")
                seq_texto = []
        linhas_saida.append(f"{c.get('id', '?'):14} {tipo:13} {cat:7} {ini / 1000:6.2f}-{fim / 1000:6.2f}s "
                            f"dur {(fim - ini) / 1000:5.2f}s  parado {parado / 1000:5.2f}s  {status}")

    print(f"{'cena':14} {'tipo':13} {'categ.':7} {'início-fim':16} {'duração':11} {'maior parado':15} status")
    for ln in linhas_saida:
        print(ln)
    print(f"\nlimite {a.limite:.1f}s · duração do vídeo {dur_s:.2f}s · tipos de orador: {', '.join(sorted(tipos_orador))}")
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
