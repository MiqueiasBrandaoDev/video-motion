"""Borra (ou pixeliza, ou tampa) regiões sensíveis de um print antes de ir para o vídeo.

E-mails, nomes de clientes, tokens, chaves, telefones, valores de terceiros: tudo isso
sai borrado NO ARQUIVO (não só no vídeo). O original fica fora de public/ ou com sufixo
-raw (ignorado pelo git e nunca referenciado em prints.json).

Regiões: x,y,largura,altura. Se todos os valores forem <= 1, são frações da imagem
(0-1, mesmo sistema do prints.json); senão, pixels.

Uso:
  python -I scripts/borrar.py <entrada.png> <saida.png> --regiao 0.62,0.05,0.3,0.04
         [--regiao ...] [--modo blur|pixel|tampa] [--raio 18] [--info]
"""
import argparse
import os
import sys



def _pil():
    """Pillow é importado sob demanda para que --help funcione sem ele."""
    try:
        from PIL import Image, ImageDraw, ImageFilter, ImageFont
        return Image, ImageDraw, ImageFilter, ImageFont
    except ImportError:
        sys.exit("Pillow não encontrado neste Python. Instale (pip install Pillow) ou, se estiver só no site do usuário, "
                 "rode com python -E -P em vez de -I (ver references/licencas.md, seção Segurança).")


def caixa(txt, w, h):
    v = [float(x) for x in txt.split(",")]
    if len(v) != 4:
        sys.exit(f"região inválida: {txt} (use x,y,largura,altura)")
    if all(0 <= x <= 1 for x in v):
        v = [v[0] * w, v[1] * h, v[2] * w, v[3] * h]
    x, y, rw, rh = (int(round(c)) for c in v)
    return max(0, x), max(0, y), min(w, x + rw), min(h, y + rh)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Borra/pixeliza/tampa regiões sensíveis de uma imagem.")
    ap.add_argument("entrada")
    ap.add_argument("saida", nargs="?")
    ap.add_argument("--regiao", action="append", default=[], help="x,y,largura,altura (fração 0-1 ou px); repetível")
    ap.add_argument("--modo", choices=["blur", "pixel", "tampa"], default="blur")
    ap.add_argument("--raio", type=float, default=18, help="raio do blur / tamanho do bloco do pixel")
    ap.add_argument("--info", action="store_true", help="só mostra tamanho e proporção da imagem")
    a = ap.parse_args()
    Image, ImageDraw, ImageFilter, ImageFont = _pil()

    im = Image.open(a.entrada).convert("RGB")
    w, h = im.size
    if a.info or not a.saida:
        print(f"{a.entrada}: {w}x{h}px, aspecto {w / h:.4f}")
        return
    if os.path.abspath(a.entrada) == os.path.abspath(a.saida):
        sys.exit("a saída precisa ser outro arquivo: o original fica guardado fora do vídeo")
    if not a.regiao:
        sys.exit("informe ao menos uma --regiao")
    for r in a.regiao:
        x0, y0, x1, y1 = caixa(r, w, h)
        if x1 <= x0 or y1 <= y0:
            continue
        pedaco = im.crop((x0, y0, x1, y1))
        if a.modo == "blur":
            # duas passadas: texto borrado só uma vez às vezes continua legível
            pedaco = pedaco.filter(ImageFilter.GaussianBlur(a.raio)).filter(ImageFilter.GaussianBlur(a.raio))
            im.paste(pedaco, (x0, y0))
        elif a.modo == "pixel":
            b = max(4, int(a.raio))
            pq = pedaco.resize((max(1, (x1 - x0) // b), max(1, (y1 - y0) // b)), Image.BILINEAR)
            im.paste(pq.resize(pedaco.size, Image.NEAREST), (x0, y0))
        else:
            media = pedaco.resize((1, 1), Image.BILINEAR).getpixel((0, 0))
            ImageDraw.Draw(im).rounded_rectangle((x0, y0, x1, y1), radius=8, fill=media)
    os.makedirs(os.path.dirname(os.path.abspath(a.saida)), exist_ok=True)
    im.save(a.saida)
    print(f"{len(a.regiao)} região(ões) tratada(s) em modo {a.modo}: {a.saida} ({w}x{h}, aspecto {w / h:.4f})")
    print("confira abrindo a imagem: nenhum dado sensível pode continuar legível")


if __name__ == "__main__":
    main()
