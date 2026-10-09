# QA obrigatório (fase 10)

Nada é entregue sem passar por aqui. Se algo falhar, corrija na fonte (JSON, cena,
cortes), re-renderize e repita o QA inteiro, não só o item que falhou.

## 1. Arquivo

```bash
python -I <skill>/scripts/frames_check.py out/video.mp4 --n 18
```

| Item | Esperado |
|---|---|
| codec / resolução / fps | h264, 1080x1920 (9:16) ou 1920x1080 (16:9) ou 1080x1080, 30 fps |
| bitrate | 8-12 Mbps |
| áudio | AAC 48 kHz, estéreo |
| loudness | -14 LUFS +-1, true peak <= -1 dBTP |
| duração | dentro da meta da plataforma |

O Remotion com frames JPEG gera `yuvj420p` (faixa completa). As plataformas aceitam. Se
algum player mostrar cor lavada, reencode: `ffmpeg -i out/video.mp4 -vf scale=out_range=tv -pix_fmt yuv420p -c:v libx264 -crf 16 -c:a copy out/video-tv.mp4`.

## 2. Texto de tela e filmagem

```bash
python -I <skill>/scripts/cenas_check.py --orador filmagem
```

| Item | Esperado |
|---|---|
| texto de tela parado (fora a legenda) | nenhum acima de ~2,5 s (`cenas_check.py` sem ERRO) |
| card de texto inteiro | sem AVISO, ou AVISO justificado (ex.: metáfora animada que muda o tempo todo) |
| alternância com o orador | segue a "presença do orador" do storyboard; sem trecho longo só de texto em "frase e volta" |
| sincronia labial | nos trechos de filmagem, boca bate com a voz editada em início, meio e fim de cada cena do orador (`frames_check.py --tempos` nesses instantes + ouvir o trecho) |

Lição real (reel de palestra): card parado 5-8 s fez o espectador ler a mesma coisa
várias vezes e perder a fala. Confirme nos frames que a frase é grande e não há card
pequeno com tela vazia em volta.

## 3. Frames (olhar cada um)

Abra cada PNG de `qa/frames/` e a `folha.png` (linhas rosa = área segura). Use
`--tempos 12.3,40.1` para incluir instantes críticos (troca de bloco, CTA, número).

- Texto cortado na borda ou quebrado no meio da palavra
- Sobreposição: legenda em cima de print, pill em cima de número, cena saindo sobre a próxima
- Contraste: acento como texto legível; texto sobre print com card opaco
- Área segura: nada importante fora das linhas (interface da plataforma cobre)
- Conteúdo acima da zona da legenda
- Placeholder "print pendente" esquecido
- Dado sensível visível (e-mail, nome de cliente, token, telefone, valor de terceiro)
- Número na tela = número falado = número no print
- Frame vazio demais (cena sem elemento por > 1 s sem intenção)
- Emoji como ícone, segundo acento, gradiente arco-íris

## 4. Fala

```bash
python -I <skill>/scripts/transcrever.py out/video.mp4 work/qa_final.json --vocab "Marca, Nome"
```

- Compare com o roteiro/storyboard: nenhum trecho de `remover` (instrução, tropeço,
  repetição) voltou; nenhuma palavra foi comida no corte (fim de frase cortado).
- Palavras-chave e marcas transcritas certas = voz inteligível com a música. Se a
  transcrição do MP4 erra palavras que a da voz limpa acertava, a música está alta: baixe
  `--musica-lufs` em 2 dB e mixe de novo.
- Legenda bate com a fala (grafia, números). Legenda adiantada/atrasada = marcos de
  outra versão da voz: refaça transcrever -> legendas.

## 5. Som

- Ouça início, cada troca de bloco e o CTA.
- SFX: nenhum some sob a voz, nenhum salta acima dela; densidade conforme `gerar_sfx.py`.
- Música não termina seca (fade-out) e não começa alta.

## 6. Licenças e privacidade

- `public/musica/LICENCA.md` e `public/sfx/LICENCA.md` preenchidos para todo arquivo usado.
- Nenhum PNG `-raw` referenciado em `prints.json`.
- Nenhum dado sensível em frame algum (repita o olhar dos frames só com esse foco).

## Registro

No relatório final, liste: resultado do ffprobe e do LUFS, quantos frames vistos, o que
foi corrigido entre renders e o que ficou pendente (com motivo).
