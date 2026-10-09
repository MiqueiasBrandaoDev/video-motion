"""QA do MP4: ffprobe, loudness e N frames distribuídos (com folha de contato e área segura).

Extrai N frames espaçados (no meio de cada fatia do vídeo), grava cada um em PNG e
monta uma folha de contato com o tempo de cada frame e as linhas da área segura da
plataforma desenhadas por cima. Depois disso, OLHE cada frame (texto cortado,
sobreposição, contraste, legenda dentro da área segura, dado sensível visível).

Uso:
  python -I scripts/frames_check.py out/video.mp4 [--n 18] [--saida qa/frames]
         [--formato 9:16] [--tempos 1.5,3.2] [--sem-folha] [--sem-audio]
"""
import argparse
import json
import os
import re
import subprocess
import sys


# margens que a interface da plataforma cobre (px no tamanho nativo), ver formatos-plataformas.md
SEGURO = {"9:16": (200, 250, 64), "16:9": (80, 90, 120), "1:1": (70, 90, 70)}


def _pil():
    """Pillow é importado sob demanda para que --help funcione sem ele."""
    try:
        from PIL import Image, ImageDraw, ImageFilter, ImageFont
        return Image, ImageDraw, ImageFilter, ImageFont
    except ImportError:
        sys.exit("Pillow não encontrado neste Python. Instale (pip install Pillow) ou, se estiver só no site do usuário, "
                 "rode com python -E -P em vez de -I (ver references/licencas.md, seção Segurança).")


def rodar(cmd):
    return subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore")


def sonda(video):
    r = rodar(["ffprobe", "-v", "error", "-show_entries",
               "format=duration,bit_rate,size:stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels,pix_fmt",
               "-of", "json", video])
    if r.returncode:
        sys.exit(r.stderr[-800:])
    return json.loads(r.stdout)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Extrai frames para revisão visual e mede o MP4 (ffprobe + LUFS).")
    ap.add_argument("video")
    ap.add_argument("--n", type=int, default=18, help="quantidade de frames distribuídos (15-20 recomendado)")
    ap.add_argument("--saida", default=os.path.join("qa", "frames"))
    ap.add_argument("--formato", choices=list(SEGURO), help="desenha a área segura (padrão: deduz pela proporção)")
    ap.add_argument("--tempos", default="", help="tempos extras em segundos, separados por vírgula")
    ap.add_argument("--sem-folha", action="store_true")
    ap.add_argument("--sem-audio", action="store_true", help="não mede loudness")
    a = ap.parse_args()
    Image, ImageDraw, ImageFilter, ImageFont = _pil()

    info = sonda(a.video)
    fmt = info["format"]
    dur = float(fmt["duration"])
    v = next((s for s in info["streams"] if s["codec_type"] == "video"), {})
    au = next((s for s in info["streams"] if s["codec_type"] == "audio"), None)
    w, h = int(v.get("width", 0)), int(v.get("height", 0))
    print(f"vídeo: {v.get('codec_name')} {w}x{h} {v.get('r_frame_rate')} fps {v.get('pix_fmt')}  "
          f"duração {dur:.2f}s  {int(fmt.get('bit_rate', 0)) / 1e6:.1f} Mbps  {int(fmt.get('size', 0)) / 1e6:.1f} MB")
    print(f"áudio: {au['codec_name']} {au.get('sample_rate')} Hz {au.get('channels')} canais" if au else "áudio: AUSENTE")

    if au and not a.sem_audio:
        r = rodar(["ffmpeg", "-hide_banner", "-i", a.video, "-vn", "-af", "ebur128=peak=true", "-f", "null", "-"])
        integ = re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)
        pico = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", r.stderr)
        if integ:
            i, tp = float(integ[-1]), float(pico[-1]) if pico else None
            ok = -15.0 <= i <= -13.0 and (tp is None or tp <= -0.8)
            print(f"loudness: {i} LUFS, true peak {tp} dBTP -> {'ok' if ok else 'FORA DO ALVO (-14 LUFS, <= -1 dBTP)'}")

    tempos = [dur * (k + 0.5) / a.n for k in range(a.n)]
    tempos += [float(t) for t in a.tempos.split(",") if t.strip()]
    tempos = sorted(set(round(t, 2) for t in tempos if 0 <= t < dur))
    os.makedirs(a.saida, exist_ok=True)
    arqs = []
    for t in tempos:
        arq = os.path.join(a.saida, f"t{t:07.2f}".replace(".", "_") + ".png")
        rodar(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-ss", f"{t:.3f}", "-i", a.video, "-frames:v", "1", arq])
        if os.path.exists(arq):
            arqs.append((t, arq))
    print(f"{len(arqs)} frames em {a.saida}")

    if not a.sem_folha and arqs:
        formato = a.formato or ("9:16" if h > w * 1.3 else "16:9" if w > h * 1.3 else "1:1")
        topo, base, lado = SEGURO[formato]
        cols = 6 if formato == "9:16" else 4
        tw = 260 if formato == "9:16" else 420
        th = int(tw * h / w)
        linhas = (len(arqs) + cols - 1) // cols
        folha = Image.new("RGB", (cols * (tw + 10) + 10, linhas * (th + 34) + 10), (24, 24, 26))
        d = ImageDraw.Draw(folha)
        try:
            fonte = ImageFont.load_default(size=18)
        except TypeError:
            fonte = ImageFont.load_default()
        k = tw / w
        for i, (t, arq) in enumerate(arqs):
            x = 10 + (i % cols) * (tw + 10)
            y = 10 + (i // cols) * (th + 34)
            folha.paste(Image.open(arq).convert("RGB").resize((tw, th)), (x, y + 24))
            d.text((x, y + 2), f"{t:6.2f}s", fill=(230, 230, 230), font=fonte)
            # área segura (linhas tracejadas simples)
            for yy in (y + 24 + int(topo * k), y + 24 + th - int(base * k)):
                for xx in range(x, x + tw, 8):
                    d.line((xx, yy, xx + 4, yy), fill=(255, 64, 160))
            for xx in (x + int(lado * k), x + tw - int(lado * k)):
                for yy in range(y + 24, y + 24 + th, 8):
                    d.line((xx, yy, xx, yy + 4), fill=(255, 64, 160))
        caminho = os.path.join(a.saida, "folha.png")
        folha.save(caminho)
        print(f"folha de contato: {caminho} (linhas rosa = área segura {formato})")


if __name__ == "__main__":
    main()
