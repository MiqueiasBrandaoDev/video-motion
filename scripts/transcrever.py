"""Transcreve áudio ou vídeo com timestamp por palavra (formato verbose_json da OpenAI).

Motores:
  openai  whisper-1 da OpenAI. Precisa da variável de ambiente OPENAI_API_KEY.
          Custo aproximado: US$ 0,006 por minuto de áudio (conferir preço atual).
  local   faster-whisper, gratuito, roda na máquina (pip install faster-whisper).
          Na primeira vez baixa o modelo (small ~0,5 GB; medium ~1,5 GB).
  auto    openai se OPENAI_API_KEY existir, senão local (padrão).

A entrada pode ser qualquer arquivo que o ffmpeg leia (m4a, mp3, wav, mp4, mov...).
Ela é convertida para mp3 mono 16 kHz antes do envio. Áudio longo é dividido em
partes de 20 min e os tempos são reajustados.

Saída: JSON com text, language, duration, words[{word,start,end}], segments[{id,start,end,text}].

Uso:
  python -I scripts/transcrever.py <entrada> <saida.json> [--idioma pt]
         [--vocab "Marca, Nome Próprio, termo técnico"] [--motor auto|openai|local]
         [--modelo-local small]
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request
import uuid

PARTE_S = 1200  # 20 min por requisição (limite de 25 MB da API com folga)


def rodar(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore")
    if r.returncode:
        sys.exit(f"falhou: {' '.join(cmd[:3])}...\n{r.stderr[-1500:]}")
    return r


def duracao(arq):
    r = rodar(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", arq])
    return float(r.stdout.strip())


def preparar(entrada, pasta, ini=None, dur=None):
    """Extrai o áudio (de áudio ou vídeo) em mp3 mono 16 kHz."""
    nome = f"parte_{int(ini or 0)}.mp3"
    saida = os.path.join(pasta, nome)
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error"]
    if ini is not None:
        cmd += ["-ss", f"{ini:.3f}"]
    cmd += ["-i", entrada]
    if dur is not None:
        cmd += ["-t", f"{dur:.3f}"]
    cmd += ["-vn", "-ac", "1", "-ar", "16000", "-c:a", "libmp3lame", "-b:a", "64k", saida]
    rodar(cmd)
    return saida


def openai_transcrever(arq, idioma, vocab, chave):
    campos = [("model", "whisper-1"), ("response_format", "verbose_json"),
              ("timestamp_granularities[]", "word"), ("timestamp_granularities[]", "segment"),
              ("temperature", "0")]
    if idioma:
        campos.append(("language", idioma))
    if vocab:
        campos.append(("prompt", vocab))
    limite = uuid.uuid4().hex
    corpo = b""
    for nome, valor in campos:
        corpo += f"--{limite}\r\nContent-Disposition: form-data; name=\"{nome}\"\r\n\r\n{valor}\r\n".encode("utf-8")
    with open(arq, "rb") as f:
        audio = f.read()
    corpo += (f"--{limite}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{os.path.basename(arq)}\"\r\n"
              f"Content-Type: audio/mpeg\r\n\r\n").encode("utf-8")
    corpo += audio + f"\r\n--{limite}--\r\n".encode("utf-8")
    req = urllib.request.Request(
        "https://api.openai.com/v1/audio/transcriptions", data=corpo, method="POST",
        headers={"Authorization": f"Bearer {chave}", "Content-Type": f"multipart/form-data; boundary={limite}"})
    try:
        with urllib.request.urlopen(req, timeout=900) as r:
            d = json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        sys.exit(f"falha na API da OpenAI: {e.code} {e.read().decode('utf-8', 'ignore')[:800]}")
    palavras = [{"word": w["word"].strip(), "start": w["start"], "end": w["end"]} for w in d.get("words", [])]
    segs = [{"start": s["start"], "end": s["end"], "text": s["text"].strip()} for s in d.get("segments", [])]
    return d.get("text", ""), d.get("language", idioma), palavras, segs


_modelo_local = None


def local_transcrever(arq, idioma, vocab, modelo, pasta_modelos=None, dispositivo="cpu"):
    global _modelo_local
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        sys.exit("faster-whisper não instalado. Rode: pip install faster-whisper\n"
                 "ou defina OPENAI_API_KEY para usar a API (ver references/audio.md).")
    if _modelo_local is None:
        try:
            _modelo_local = WhisperModel(modelo, device=dispositivo, compute_type="int8" if dispositivo == "cpu" else "float16",
                                         download_root=pasta_modelos)
        except RuntimeError as e:
            sys.exit(f"não consegui carregar o modelo '{modelo}': {e}\n"
                     "Se o download anterior ficou incompleto, use --pasta-modelos <pasta nova> para baixar de novo.")
    segs_it, info = _modelo_local.transcribe(arq, language=idioma or None, word_timestamps=True,
                                             initial_prompt=vocab or None, temperature=0)
    palavras, segs, textos = [], [], []
    for s in segs_it:
        segs.append({"start": s.start, "end": s.end, "text": s.text.strip()})
        textos.append(s.text.strip())
        for w in s.words or []:
            palavras.append({"word": w.word.strip(), "start": w.start, "end": w.end})
    return " ".join(textos), info.language, palavras, segs


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Transcreve áudio/vídeo com tempo por palavra (OpenAI whisper-1 ou faster-whisper local).")
    ap.add_argument("entrada", help="arquivo de áudio ou vídeo")
    ap.add_argument("saida", help="JSON de saída (verbose_json com words e segments)")
    ap.add_argument("--idioma", default="pt", help="código ISO do idioma falado (padrão pt; vazio = detectar)")
    ap.add_argument("--vocab", default="", help="nomes próprios, marcas e termos para guiar a grafia")
    ap.add_argument("--motor", choices=["auto", "openai", "local"], default="auto")
    ap.add_argument("--modelo-local", default="small", help="modelo do faster-whisper: tiny, base, small, medium, large-v3")
    ap.add_argument("--dispositivo", choices=["cpu", "cuda"], default="cpu",
                    help="cuda só com CUDA 12 + cuBLAS/cuDNN instalados; cpu funciona em qualquer máquina")
    ap.add_argument("--pasta-modelos", help="onde baixar/ler os modelos locais (padrão: cache do Hugging Face)")
    a = ap.parse_args()

    chave = os.environ.get("OPENAI_API_KEY", "").strip()
    motor = a.motor if a.motor != "auto" else ("openai" if chave else "local")
    if motor == "openai" and not chave:
        sys.exit("OPENAI_API_KEY não definida. Defina a variável ou use --motor local.")

    total = duracao(a.entrada)
    texto_total, lingua, palavras, segs = [], a.idioma, [], []
    with tempfile.TemporaryDirectory() as tmp:
        ini = 0.0
        while ini < total - 0.05:
            dur = min(PARTE_S, total - ini)
            parte = preparar(a.entrada, tmp, ini if total > PARTE_S else None, dur if total > PARTE_S else None)
            if motor == "openai":
                t, lingua, w, s = openai_transcrever(parte, a.idioma, a.vocab, chave)
            else:
                t, lingua, w, s = local_transcrever(parte, a.idioma, a.vocab, a.modelo_local, a.pasta_modelos, a.dispositivo)
            texto_total.append(t.strip())
            palavras += [{**x, "start": round(x["start"] + ini, 3), "end": round(x["end"] + ini, 3)} for x in w]
            segs += [{**x, "start": round(x["start"] + ini, 3), "end": round(x["end"] + ini, 3)} for x in s]
            ini += dur

    for i, s in enumerate(segs):
        s["id"] = i
    doc = {"task": "transcribe", "motor": motor, "language": lingua, "duration": round(total, 3),
           "text": " ".join(texto_total), "words": palavras, "segments": segs}
    os.makedirs(os.path.dirname(os.path.abspath(a.saida)), exist_ok=True)
    with open(a.saida, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=1)
    print(f"[{motor}] {len(palavras)} palavras, {len(segs)} segmentos, {total:.1f} s -> {a.saida}")
    print(doc["text"])


if __name__ == "__main__":
    main()
