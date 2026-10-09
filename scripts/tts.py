"""Gera locução por TTS da OpenAI (para quando só existe a ideia/roteiro, sem gravação).

Usa OPENAI_API_KEY. Modelo padrão gpt-4o-mini-tts (aceita 'instrucoes' de tom e ritmo).
Custo: cobrado por caractere/token de entrada e saída de áudio (conferir preço atual em
https://openai.com/api/pricing). Avise o usuário que a voz é sintética e que, em várias
plataformas, conteúdo com voz gerada por IA deve ser sinalizado.

Texto longo é dividido por parágrafo (limite ~4000 caracteres por requisição) e as partes
são concatenadas com ffmpeg. A saída é wav 48 kHz mono, pronta para cortar.py/transcrever.py.

Uso:
  python -I scripts/tts.py --texto roteiro.txt --saida work/voz_tts.wav [--voz alloy]
         [--instrucoes "tom de conversa, ritmo ágil, sem soar locutor de rádio"]
         [--modelo gpt-4o-mini-tts]
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request

LIMITE = 3800


def partes(texto):
    blocos, atual = [], ""
    for par in [p.strip() for p in texto.split("\n") if p.strip()]:
        if len(atual) + len(par) + 1 > LIMITE and atual:
            blocos.append(atual)
            atual = ""
        atual = (atual + "\n" + par).strip()
    if atual:
        blocos.append(atual)
    return blocos


def falar(texto, saida, voz, modelo, instrucoes, chave):
    corpo = {"model": modelo, "voice": voz, "input": texto, "response_format": "wav"}
    if instrucoes:
        corpo["instructions"] = instrucoes
    req = urllib.request.Request("https://api.openai.com/v1/audio/speech", data=json.dumps(corpo).encode("utf-8"),
                                 method="POST", headers={"Authorization": f"Bearer {chave}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=600) as r, open(saida, "wb") as f:
            f.write(r.read())
    except urllib.error.HTTPError as e:
        sys.exit(f"falha no TTS: {e.code} {e.read().decode('utf-8', 'ignore')[:800]}")


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Gera locução com o TTS da OpenAI a partir de um roteiro em texto.")
    ap.add_argument("--texto", required=True, help="arquivo .txt com o roteiro (só o que será falado)")
    ap.add_argument("--saida", required=True, help="wav de saída")
    ap.add_argument("--voz", default="alloy", help="voz da OpenAI (ex.: alloy, ash, coral, echo, sage, verse)")
    ap.add_argument("--modelo", default="gpt-4o-mini-tts")
    ap.add_argument("--instrucoes", default="", help="tom, ritmo, sotaque (só modelos gpt-4o-*-tts)")
    a = ap.parse_args()

    chave = os.environ.get("OPENAI_API_KEY", "").strip()
    if not chave:
        sys.exit("OPENAI_API_KEY não definida. Alternativas: gravar a própria voz ou fazer o vídeo sem voz (tipografia cinética + música).")
    texto = open(a.texto, encoding="utf-8").read()
    with tempfile.TemporaryDirectory() as tmp:
        arqs = []
        for i, t in enumerate(partes(texto)):
            arq = os.path.join(tmp, f"p{i:03d}.wav")
            falar(t, arq, a.voz, a.modelo, a.instrucoes, chave)
            arqs.append(arq)
        lista = os.path.join(tmp, "lista.txt")
        with open(lista, "w", encoding="utf-8") as f:
            f.writelines(f"file '{x.replace(os.sep, '/')}'\n" for x in arqs)
        os.makedirs(os.path.dirname(os.path.abspath(a.saida)), exist_ok=True)
        r = subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lista,
                            "-ac", "1", "-ar", "48000", "-c:a", "pcm_s16le", a.saida], capture_output=True, text=True)
        if r.returncode:
            sys.exit(r.stderr[-1500:])
    print(f"voz sintética gravada em {a.saida} ({len(arqs)} parte(s)). Próximo passo: cortar.py com tempo 1.0-1.1 e transcrever.py.")


if __name__ == "__main__":
    main()
