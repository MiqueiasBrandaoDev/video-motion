"""Gera uma versão leve do MP4 para compartilhar (mensagem, e-mail, revisão) com tamanho alvo.

H.264 em 2 passadas com bitrate calculado para caber em --alvo-mb, AAC 128 kbps,
+faststart (começa a tocar antes de baixar tudo). O arquivo final de publicação
continua sendo o render original (8-12 Mbps).

Uso:
  python -I scripts/comprimir.py out/video.mp4 out/video-leve.mp4 [--alvo-mb 15] [--largura 720]
"""
import argparse
import os
import subprocess
import sys
import tempfile


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Versão leve do vídeo (2 passadas, tamanho alvo, +faststart).")
    ap.add_argument("entrada")
    ap.add_argument("saida")
    ap.add_argument("--alvo-mb", type=float, default=15.0)
    ap.add_argument("--largura", type=int, default=0, help="redimensiona a largura (0 = mantém)")
    a = ap.parse_args()

    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", a.entrada],
                       capture_output=True, text=True)
    dur = float(r.stdout.strip())
    audio_k = 128
    video_k = int(a.alvo_mb * 8 * 1024 / dur - audio_k) * 0.97
    if video_k < 300:
        sys.exit(f"alvo de {a.alvo_mb} MB pequeno demais para {dur:.0f} s de vídeo")
    escala = ["-vf", f"scale={a.largura}:-2"] if a.largura else []
    nulo = "NUL" if os.name == "nt" else "/dev/null"
    with tempfile.TemporaryDirectory() as tmp:
        log = os.path.join(tmp, "passlog")
        base = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", a.entrada] + escala + [
            "-c:v", "libx264", "-preset", "slow", "-b:v", f"{int(video_k)}k", "-pix_fmt", "yuv420p", "-passlogfile", log]
        for cmd in (base + ["-pass", "1", "-an", "-f", "mp4", nulo],
                    base + ["-pass", "2", "-c:a", "aac", "-b:a", f"{audio_k}k", "-ar", "48000", "-movflags", "+faststart", a.saida]):
            r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore")
            if r.returncode:
                sys.exit(r.stderr[-1500:])
    print(f"{a.saida}: {os.path.getsize(a.saida) / 1e6:.1f} MB (alvo {a.alvo_mb} MB, vídeo {int(video_k)} kbps)")


if __name__ == "__main__":
    main()
