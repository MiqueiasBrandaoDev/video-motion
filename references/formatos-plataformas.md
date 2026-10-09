# Formatos e plataformas

Valores de referência. As plataformas mudam limites com frequência: confirme na pesquisa
da fase 2 (blog/central do criador da plataforma, ano corrente) e anote no `pesquisa.md`.

## Formatos do template

| `formato` | Tamanho | Área segura no template (topo / base / lados) | Uso |
|---|---|---|---|
| `9:16` | 1080x1920 | 200 / 250 / 64 px | Reels, TikTok, Shorts, Stories |
| `16:9` | 1920x1080 | 80 / 90 / 120 px | YouTube, LinkedIn, site, apresentação |
| `1:1` | 1080x1080 | 70 / 90 / 70 px | feed (Instagram, LinkedIn, X) |

A área segura de base do 9:16 (250 px) fica livre para a interface (legenda do post,
botões, nome). A coluna da direita (~120 px a partir da borda, entre 900 e 1500 px de
altura) também recebe botões no Reels e TikTok: não coloque número ou CTA colado na
borda direita. A legenda do template fica entre `H - 250 - 300` e `H - 250`.

`config.fps`: 30 é o padrão (bom para fala). 60 só se houver screencast rápido.

## Plataformas (referência)

| Plataforma | Formato | Duração que costuma performar | Observação |
|---|---|---|---|
| Instagram Reels | 9:16 | 15-90 s | capa: frame com título legível; gancho nos 2 primeiros segundos |
| TikTok | 9:16 | 20-60 s (aceita bem mais) | legenda grande ajuda; texto longe da direita e da base |
| YouTube Shorts | 9:16 | até 60 s é o mais comum (limite atual maior) | loop: o fim pode emendar no começo |
| YouTube | 16:9 | 2-10 min para explainer | capítulos; legenda queimada é opcional (há CC) |
| LinkedIn | 1:1 ou 16:9 (9:16 aceito) | 30-90 s | muita gente assiste sem som: legenda obrigatória |

## Encode

| Item | Publicação | Versão leve (compartilhar) |
|---|---|---|
| vídeo | H.264, 8-12 Mbps, yuv420p/yuvj420p | H.264 2 passadas, ~15 MB, 720 px de largura opcional |
| áudio | AAC 48 kHz 192 kbps | AAC 128 kbps |
| loudness | -14 LUFS, TP <= -1 dBTP | igual |
| contêiner | MP4 | MP4 + faststart |

```bash
npx remotion render Video out/video.mp4 --codec h264 --video-bitrate 10M --concurrency 2 --audio-codec aac --audio-bitrate 192k
python -I <skill>/scripts/comprimir.py out/video.mp4 out/video-leve.mp4 --alvo-mb 15 --largura 720
```

## Variações a partir do mesmo projeto

Trocar `formato` no `config.json` reaproveita tudo (tamanhos escalam por `px()` e o print
se ajusta à área livre). Renderize em outro arquivo, rode o QA de frames de novo (a
composição muda) e ajuste `cenas.json` onde precisar.
