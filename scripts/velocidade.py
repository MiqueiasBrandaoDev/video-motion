"""Velocidade da fala em sílabas por segundo (PT-BR) e fator de aceleração (atempo) para uma velocidade-alvo.

Métrica: sílabas faladas ÷ duração da fala DEPOIS de apertar as pausas (o que o ouvinte recebe). Alvo
padrão 7,4 síl/s: média dos dois últimos vídeos aprovados (19/10/2026, cortes do TSA Cast feitos a 1,3x),
medidos na voz final retranscrita: 6,74 e 8,05 síl/s.

Fator = alvo ÷ velocidade da fala mantida com as pausas já apertadas, com piso 1,3 (regra 4 de retenção)
e teto opcional (`tempo_max`, padrão sem teto). Acima de 1,6x o cortar avisa, sem bloquear. Acima de 2,0
o atempo vai em cadeia (cada estágio <= 2,0): um atempo só acima de 2 pula amostras em vez de misturar.

Contagem de sílabas (heurística sem dicionário; serve para medir ritmo, não para hifenizar):
  - núcleos vocálicos: cada vogal conta uma; ditongo decrescente (ai, ei, oi, ui, au, eu, ou, iu, ão, ãe,
    õe e as formas com acento) conta uma; o "u" de que/qui/gue/gui/qua vai junto com a vogal seguinte.
    Hiato conta dois (dia = 2, história = 4).
  - números como são falados: 2027 = "dois mil e vinte e sete" (8), 37,5 = "trinta e sete vírgula cinco",
    1.000 (ponto de milhar) = "mil", "%" = "por cento" (o whisper-1 tira o "%" da lista de palavras: ele é
    recolocado pelo campo "text"), "R$" = "reais", "1,3x" = "um vírgula três vezes". Mais de 12 dígitos
    (telefone, CNPJ) é lido dígito a dígito.
  - sigla (2 letras ou mais, tudo em maiúsculas): lida como palavra quando é pronunciável em português (tem
    vogal; começa com uma consoante ou um encontro como "pr"; termina em vogal ou em l/m/n/r/s/x/z; no meio,
    só encontros que existem em português): DAS, PIX, ONU, MEI, SUS. Senão, soletrada pelo nome das letras:
    IBS = i-bê-esse (4 sílabas), CBS, ICMS, INSS, CNPJ, IPVA, OK.

Uso como módulo: cortar.py e cortar_video.py (`"tempo": "auto"` no cortes.json).

Uso como CLI:
  python -I scripts/velocidade.py work/transcricao.json [--de 0 --ate 21.1] [--audio gravacao.m4a]
         [--plano cortes.json] [--alvo 7.4] [--piso 1.3] [--teto 1.8] [--sem-aperto] [--listar]
  --audio       mede igual ao cortar.py (silencedetect + planejar); sem ele, pausa entre palavras maior que
                pausa_max vira pos + pre (estimativa: o whisper-1 costuma grudar a pausa na palavra vizinha)
  --plano       lê pausa_max/pos/pre/silencio_*, alvo/piso/teto e, sem --de/--ate, as janelas manter/remover
  --sem-aperto  mede a fala como está, da 1ª à última palavra: use na voz final retranscrita para
                conferir a velocidade obtida
"""
import argparse
import json
import math
import os
import re
import subprocess
import sys
import tempfile
import unicodedata
from collections import Counter

ALVO_SILABAS_S = 7.4   # média dos 2 vídeos aprovados de 19/10/2026 (6,74 e 8,05 síl/s na voz final)
TEMPO_MIN = 1.3        # regra 4 de retenção: nunca abaixo de 1,3x
TEMPO_MAX = 2.0        # teto: o atempo fica estável até 1,9x e piora a partir de 2,1x (cadeia); None = sem teto
AVISO_ACIMA = 1.6      # acima disso, o cortar avisa para ouvir o resultado
LIMITE_ATEMPO = 3.0    # sanidade: acima disso é quase sempre transcrição ou plano errado

VOGAIS = "aeiouáéíóúâêôãõà"
_MUDO = re.compile(rf"(?<=[qg])u(?=[{VOGAIS}])")
_DITONGO = re.compile(r"ão|ãe|õe|ai|ei|oi|ui|au|eu|ou|iu|ái|éi|ói|áu|éu|êi|ôu")
_PEDACO = re.compile(r"R\$|\d+(?:[.,]\d+)*|%|[^\W\d_]+")
_NUMERO = re.compile(r"\d+(?:[.,]\d+)*")

_UNID = ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze",
         "treze", "catorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"]
_DEZ = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"]
_CEM = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos",
        "oitocentos", "novecentos"]
_LETRAS = {"a": "á", "b": "bê", "c": "cê", "d": "dê", "e": "é", "f": "efe", "g": "gê", "h": "agá", "i": "i",
           "j": "jota", "k": "cá", "l": "ele", "m": "eme", "n": "ene", "o": "ó", "p": "pê", "q": "quê", "r": "erre",
           "s": "esse", "t": "tê", "u": "u", "v": "vê", "w": "dáblio", "x": "xis", "y": "ípsilon", "z": "zê"}
_ATAQUES = {"bl", "br", "cl", "cr", "dr", "fl", "fr", "gl", "gr", "pl", "pr", "tr", "vr", "ch", "lh", "nh", "qu", "gu"}
_CODAS = set("lmnrsxz")


# ---------------------------------------------------------------- números por extenso

def _ate_mil(n):
    """1-999 por extenso."""
    if n == 100:
        return "cem"
    c, r = divmod(n, 100)
    partes = [_CEM[c]] if c else []
    if r:
        if r < 20:
            partes.append(_UNID[r])
        else:
            d, u = divmod(r, 10)
            partes.append(_DEZ[d] + (f" e {_UNID[u]}" if u else ""))
    return " e ".join(partes)


def inteiro_por_extenso(n):
    """Inteiro >= 0 por extenso em PT-BR (2027 -> "dois mil e vinte e sete")."""
    if n == 0:
        return "zero"
    if n >= 10 ** 12:
        return " ".join(_UNID[int(c)] for c in str(n))
    partes, resto = [], n
    for valor, sing, plur in ((10 ** 9, "bilhão", "bilhões"), (10 ** 6, "milhão", "milhões"), (1000, "mil", "mil")):
        q, resto = divmod(resto, valor)
        if q:
            partes.append("mil" if valor == 1000 and q == 1 else f"{inteiro_por_extenso(q)} {sing if q == 1 else plur}")
    if resto:
        # "e" antes do último grupo quando ele é menor que 100 ou centena redonda (dois mil e trezentos)
        partes.append(("e " if partes and (resto < 100 or resto % 100 == 0) else "") + _ate_mil(resto))
    return " ".join(partes)


def numero_falado(tok):
    """Número escrito com dígitos -> como é falado (inteiro, milhar com ponto, decimal com vírgula)."""
    tok = tok.strip(".,")
    if re.fullmatch(r"\d{1,3}(\.\d{3})+", tok) or ("." in tok and "," in tok):
        tok = tok.replace(".", "")  # 1.000 = mil; 1.234,5 = mil duzentos e trinta e quatro vírgula cinco
    if len(tok.replace(",", "").replace(".", "")) > 12:
        return " ".join(_UNID[int(c)] for c in tok if c.isdigit())
    m = re.fullmatch(r"(\d+)[.,](\d+)", tok)
    if m:
        dec = m.group(2)
        zeros = len(dec) - len(dec.lstrip("0"))
        lido = ["zero"] * zeros + ([inteiro_por_extenso(int(dec))] if dec.lstrip("0") else [])
        return f"{inteiro_por_extenso(int(m.group(1)))} vírgula {' '.join(lido)}"
    if tok.isdigit():
        return inteiro_por_extenso(int(tok))
    return " ".join(numero_falado(x) for x in re.split(r"[.,]", tok) if x)


# ---------------------------------------------------------------- siglas e sílabas

def _pronunciavel(s):
    """Sigla em minúsculas que dá para ler como palavra em português (das, pix, onu)."""
    blocos = re.split(f"[{VOGAIS}]+", s)
    if len(blocos) == 1:
        return False  # sem vogal
    ini, *meio, fim = blocos
    if len(ini) > 2 or (len(ini) == 2 and ini not in _ATAQUES):
        return False
    if len(fim) > 1 or (fim and fim not in _CODAS):
        return False
    for b in meio:
        if len(b) <= 1 or b in _ATAQUES or (b[0] in _CODAS and (len(b) == 2 or b[1:] in _ATAQUES)):
            continue
        return False
    return True


def sigla_falada(p):
    """IBS -> "i bê esse"; DAS -> "das"."""
    s = unicodedata.normalize("NFC", p.lower())
    if _pronunciavel(s):
        return s
    return " ".join(_LETRAS.get(unicodedata.normalize("NFD", c)[0], c) for c in s)


def _silabas_letras(s):
    """Núcleos vocálicos de uma palavra só com letras."""
    s = unicodedata.normalize("NFC", s.lower()).replace("ü", "u")
    s = re.sub(rf"[^a-zç{VOGAIS}]", "", s)
    if not s:
        return 0
    s = _DITONGO.sub("A", _MUDO.sub("", s))
    return max(1, len(re.findall(rf"[{VOGAIS}A]", s)))


def _chave_num(tok):
    return tok.strip(".,")


def porcentagens(texto):
    """Números seguidos de % no texto (o whisper-1 tira o % da lista de palavras)."""
    return Counter(_chave_num(m) for m in re.findall(r"(\d+(?:[.,]\d+)*)\s*%", texto or ""))


def falar(palavra, pendentes=None):
    """Forma falada de uma palavra da transcrição: números por extenso, sigla soletrada ou lida.

    `pendentes`: Counter de porcentagens() do texto inteiro; um número que aparece com % no texto e veio
    sem % na palavra ganha "por cento" (e sai do contador)."""
    palavra = unicodedata.normalize("NFC", palavra.strip())
    pedacos = _PEDACO.findall(palavra)
    out, reais, ant_num = [], False, False
    for p in pedacos:
        if p == "R$":
            reais = True
            continue
        if p[0].isdigit():
            out.append(numero_falado(p))
            ant_num = True
            continue
        if p == "%":
            out.append("por cento")
        elif ant_num and p.lower() == "x":
            out.append("vezes")
        elif p in ("º", "ª"):
            pass
        elif len(p) >= 2 and p.isupper():
            out.append(sigla_falada(p))
        else:
            out.append(p.lower())
        ant_num = False
    if pendentes is not None and _NUMERO.fullmatch(palavra.strip(".,")):
        k = _chave_num(palavra)
        if pendentes.get(k, 0) > 0:
            pendentes[k] -= 1
            out.append("por cento")
    elif pendentes is not None and "%" in palavra:
        for m in _NUMERO.findall(palavra):
            if pendentes.get(_chave_num(m), 0) > 0:
                pendentes[_chave_num(m)] -= 1
    if reais:
        out.append("reais")
    return " ".join(x for x in out if x)


def silabas(palavra):
    """Sílabas faladas de uma palavra da transcrição (números e siglas como são falados)."""
    return sum(_silabas_letras(x) for x in falar(palavra).split())


def anotar(doc):
    """Palavras da transcrição (verbose_json) com "falado" e "silabas"; o % volta pelo campo text."""
    pend = porcentagens(doc.get("text", ""))
    saida = []
    for w in doc.get("words", []):
        f = falar(w["word"], pend)
        saida.append({**w, "falado": f, "silabas": sum(_silabas_letras(x) for x in f.split())})
    return saida


# ---------------------------------------------------------------- velocidade e fator

def selecionar(palavras, manter=None, remover=(), de=None, ate=None):
    """Palavras da fala mantida: o meio da palavra cai numa janela `manter` (ou em de-ate) e fora de `remover`."""
    janelas = [(float(j["ini"]), float(j["fim"])) for j in (manter or [])]
    if de is not None or ate is not None:
        janelas = [(de if de is not None else -1e9, ate if ate is not None else 1e9)]
    tiras = [(float(r["ini"]), float(r["fim"])) for r in (remover or [])]
    saida = []
    for w in palavras:
        meio = (w["start"] + w["end"]) / 2
        if janelas and not any(a <= meio <= b for a, b in janelas):
            continue
        if any(a <= meio <= b for a, b in tiras):
            continue
        saida.append(w)
    return saida


def duracao_estimada(palavras, pausa_max=0.28, aperto=0.20, apertar=True):
    """Da 1ª à última palavra; com `apertar`, intervalo entre palavras > pausa_max vira `aperto` (pos + pre)."""
    if not palavras:
        return 0.0
    d = palavras[-1]["end"] - palavras[0]["start"]
    if apertar:
        for a, b in zip(palavras, palavras[1:]):
            g = b["start"] - a["end"]
            if g > pausa_max:
                d -= g - aperto
    return d


def duracao_trechos(trechos, pre=0.08, pos=0.12):
    """Duração da fala que vai para o atempo (trechos do planejar(), pausas já apertadas), sem os respiros
    das pontas (pre antes da 1ª palavra, pos depois da última): é o que a medida da voz final enxerga."""
    d = sum(t["orig_fim"] - t["orig_ini"] for t in trechos)
    return max(0.01, d - pre - pos)


def fator(medida, alvo=ALVO_SILABAS_S, piso=TEMPO_MIN, teto=TEMPO_MAX):
    """Fator de aceleração para levar `medida` (síl/s) ao alvo. Retorna (fator, "piso" | "teto" | None)."""
    f, limite = alvo / medida, None
    if piso is not None and f < piso:
        f, limite = float(piso), "piso"
    if teto is not None and f > teto:
        f, limite = float(teto), "teto"
    return round(f, 3), limite


def atempo(f):
    """Cadeia de atempo para o fator f (estágios <= 2,0; acima de 2 um atempo só pula amostras)."""
    n = max(1, math.ceil(math.log(f) / math.log(2.0) - 1e-9)) if f > 2.0 else 1
    etapa = f ** (1.0 / n)
    return ",".join([f"atempo={etapa:.6f}".rstrip("0").rstrip(".")] * n)


# ---------------------------------------------------------------- integração com cortar.py / cortar_video.py

def ler_tempo(plano):
    """Valida o campo `tempo` do cortes.json antes do corte: devolve "auto" ou o número.

    Sem o campo, vale 1,3 (comportamento antigo). Número fora de 0,5-3,0 sai com erro; abaixo de 1,3 avisa."""
    t = plano.get("tempo", TEMPO_MIN)
    if isinstance(t, str) and t.strip().lower() == "auto":
        return "auto"
    try:
        t = float(t)
    except (TypeError, ValueError):
        sys.exit(f'tempo inválido no cortes.json: {t!r}. Use "auto" (velocidade-alvo) ou um número (ex.: 1.4).')
    if not 0.5 <= t <= LIMITE_ATEMPO:
        sys.exit(f"tempo fora de 0,5-{LIMITE_ATEMPO:g}. Para fala, use \"auto\" (alvo {ALVO_SILABAS_S} síl/s) ou >= 1,3.")
    if t < TEMPO_MIN:
        print(f"AVISO: tempo {t} abaixo do mínimo de 1,3 (regra 4: fala acelerada 1,3x ou mais; ver SKILL.md, fase 6).")
    return t


def _num(v, padrao):
    return padrao if v is None else float(v)


def _limite_txt(limite, piso, teto):
    if limite == "piso":
        return f" -> piso {piso:g}"
    if limite == "teto":
        return f" -> teto {teto:g}"
    return ""


def resolver(plano, t, trechos, arq_transcricao, total=None):
    """Escolhe o `tempo` do corte e mede a velocidade. Retorna (tempo, info para o blocos.json ou None).

    `t` vem de ler_tempo(plano). Número: fixo, como sempre foi; se a transcrição do original existir, mede e
    informa a velocidade. "auto": alvo_silabas_s ÷ velocidade da fala mantida (trechos do planejar(), pausas
    já apertadas), limitado a [tempo_min, tempo_max]. Precisa da transcrição do ORIGINAL (fase 1A).
    """
    auto = t == "auto"
    alvo = _num(plano.get("alvo_silabas_s"), ALVO_SILABAS_S)
    piso = _num(plano.get("tempo_min"), TEMPO_MIN)
    teto = plano.get("tempo_max", TEMPO_MAX)
    teto = None if teto is None else float(teto)
    pre, pos = float(plano.get("pre", 0.08)), float(plano.get("pos", 0.12))

    if not arq_transcricao or not os.path.exists(arq_transcricao):
        if auto:
            sys.exit(f'tempo "auto" precisa da transcrição do ORIGINAL com tempo por palavra ({arq_transcricao}). '
                     "Rode transcrever.py <gravação> work/transcricao.json (fase 1A), passe --transcricao <arquivo> "
                     "ou use um tempo fixo no cortes.json (ex.: 1.4).")
        return t, None
    doc = json.load(open(arq_transcricao, encoding="utf-8"))
    if total and doc.get("duration") and abs(float(doc["duration"]) - total) > 1.0:
        print(f"AVISO: a transcrição tem {float(doc['duration']):.1f}s e a entrada {total:.1f}s. "
              "Ela precisa ser do ORIGINAL (mesma linha do tempo do cortes.json).")
    ws = selecionar(anotar(doc), plano.get("manter"), plano.get("remover", []))
    if not ws:
        if auto:
            sys.exit("tempo \"auto\": nenhuma palavra da transcrição dentro das janelas 'manter'. Confira a transcrição.")
        return t, None
    sil = sum(w["silabas"] for w in ws)
    dur = duracao_trechos(trechos, pre, pos)
    medida = sil / dur
    limite = None
    if auto:
        t, limite = fator(medida, alvo, piso, teto)
        if t > LIMITE_ATEMPO:
            sys.exit(f"tempo \"auto\" deu {t}x ({medida:.2f} síl/s medidos): fora do limite de {LIMITE_ATEMPO:g}. "
                     "Confira se a transcrição é do original ou defina tempo_max no cortes.json.")
    info = {"modo": "auto" if auto else "fixo", "alvo_silabas_s": alvo, "tempo_min": piso, "tempo_max": teto,
            "limite": limite, "palavras": len(ws), "silabas": sil, "duracao_fala_s": round(dur, 3),
            "medida_silabas_s": round(medida, 2), "tempo": t, "resultado_silabas_s": round(medida * t, 2),
            "transcricao": os.path.basename(arq_transcricao)}
    print(f"velocidade: {medida:.2f} síl/s na fala mantida ({sil} sílabas, {len(ws)} palavras, "
          f"{dur:.2f}s com as pausas apertadas)")
    if auto:
        print(f"tempo auto: alvo {alvo:g} ÷ {medida:.2f} = {alvo / medida:.3f}{_limite_txt(limite, piso, teto)} -> tempo {t:g} "
              f"(resultado previsto {medida * t:.2f} síl/s)")
    else:
        print(f"tempo fixo {t:g}: resultado previsto {medida * t:.2f} síl/s (alvo {alvo:g}; \"tempo\": \"auto\" calcula sozinho)")
    if t > AVISO_ACIMA:
        print(f"AVISO: tempo {t:g} acima de {AVISO_ACIMA:g}: ouça a voz final (sílabas embolando, timbre metálico "
              "do atempo)." + ("" if teto is not None else " Para limitar: \"tempo_max\" no cortes.json."))
    return t, info


# ---------------------------------------------------------------- CLI

def main():
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Sílabas por segundo da fala (PT-BR) e fator de aceleração para a velocidade-alvo.")
    ap.add_argument("transcricao", help="JSON do transcrever.py (words com start/end)")
    ap.add_argument("--de", type=float, help="início do trecho (s)")
    ap.add_argument("--ate", type=float, help="fim do trecho (s)")
    ap.add_argument("--audio", help="gravação original: mede as pausas pelo silencedetect, igual ao cortar.py")
    ap.add_argument("--plano", help="cortes.json: parâmetros e, sem --de/--ate, as janelas manter/remover")
    ap.add_argument("--alvo", type=float, help=f"síl/s alvo (padrão {ALVO_SILABAS_S} ou o alvo_silabas_s do plano)")
    ap.add_argument("--piso", type=float, help=f"fator mínimo (padrão {TEMPO_MIN})")
    ap.add_argument("--teto", type=float, help="fator máximo (padrão: sem teto)")
    ap.add_argument("--sem-aperto", action="store_true", help="mede como está (voz final), sem apertar pausas")
    ap.add_argument("--listar", action="store_true", help="lista cada palavra com a forma falada e as sílabas")
    a = ap.parse_args()

    plano = json.load(open(a.plano, encoding="utf-8")) if a.plano else {}
    if a.de is not None or a.ate is not None or not plano.get("manter"):
        de = a.de if a.de is not None else 0.0
        ate = a.ate if a.ate is not None else 1e9
        plano = {**plano, "manter": [{"ini": de, "fim": ate, "bloco": "trecho"}]}
    doc = json.load(open(a.transcricao, encoding="utf-8"))
    ws = selecionar(anotar(doc), plano["manter"], plano.get("remover", []))
    if not ws:
        sys.exit("nenhuma palavra no trecho pedido.")
    sil = sum(w["silabas"] for w in ws)
    pausa_max = float(plano.get("pausa_max", 0.28))
    pre, pos = float(plano.get("pre", 0.08)), float(plano.get("pos", 0.12))

    if a.listar:
        for w in ws:
            extra = f"  ({w['falado']})" if w["falado"] != w["word"].lower() else ""
            print(f"{w['start']:8.2f} {w['end']:8.2f}  {w['silabas']:2d}  {w['word']}{extra}")

    if a.sem_aperto:
        dur, como = duracao_estimada(ws, apertar=False), "da 1ª à última palavra, sem apertar pausas"
    elif a.audio:
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        from cortar import duracao, planejar  # noqa: E402  (import tardio: cortar.py importa este módulo)
        with tempfile.TemporaryDirectory() as tmp:
            orig = os.path.join(tmp, "orig.wav")
            r = subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", a.audio, "-vn", "-ac", "1",
                                "-ar", "48000", "-c:a", "pcm_s16le", orig], capture_output=True, text=True, encoding="utf-8", errors="ignore")
            if r.returncode:
                sys.exit(f"ffmpeg falhou:\n{r.stderr[-1500:]}")
            trechos = planejar(orig, plano, duracao(orig))
        dur, como = duracao_trechos(trechos, pre, pos), f"pausas apertadas como o cortar.py ({len(trechos)} trechos)"
    else:
        dur = duracao_estimada(ws, pausa_max, pre + pos)
        como = f"estimada: pausa entre palavras > {pausa_max:g}s vira {pre + pos:g}s (use --audio para medir como o cortar.py)"

    medida = sil / dur
    alvo = a.alvo if a.alvo is not None else _num(plano.get("alvo_silabas_s"), ALVO_SILABAS_S)
    print(f"palavras: {len(ws)}  sílabas: {sil}  duração: {dur:.2f}s ({como})")
    print(f"velocidade: {medida:.2f} síl/s  ({len(ws) / dur:.2f} palavras/s)")
    if a.sem_aperto:
        print(f"alvo {alvo:g} síl/s: {100 * (medida / alvo - 1):+.1f}%")
        return
    piso = a.piso if a.piso is not None else _num(plano.get("tempo_min"), TEMPO_MIN)
    teto = a.teto if a.teto is not None else plano.get("tempo_max", TEMPO_MAX)
    f, limite = fator(medida, alvo, piso, teto)
    print(f"fator: alvo {alvo:g} ÷ {medida:.2f} = {alvo / medida:.3f}{_limite_txt(limite, piso, teto)} -> tempo {f:g} "
          f"(resultado previsto {medida * f:.2f} síl/s; duração final ~{dur / f:.2f}s)")
    if f > AVISO_ACIMA:
        print(f"AVISO: acima de {AVISO_ACIMA:g}x: ouça o resultado (sílabas embolando, timbre metálico do atempo).")


if __name__ == "__main__":
    main()
