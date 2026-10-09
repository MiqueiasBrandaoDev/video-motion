---
name: video-motion
description: Produz um vídeo com motion graphics do zero ao MP4 (Remotion + ffmpeg + Whisper) a partir de uma ideia/texto, de um áudio gravado, de um vídeo (talking head, screencast) ou de um projeto/produto (pasta de código, URL, app) para demonstrar. Pesquisa o nicho antes de desenhar, edita a fala, sincroniza animação e legenda palavra por palavra, monta trilha e efeitos com densidade controlada e faz QA olhando os frames. Use sempre que o pedido envolver vídeo animado ou editado, mesmo sem a palavra "motion" - "faz um vídeo com motion", "cria um vídeo animado", "transforma esse áudio em vídeo", "edita essa gravação com legenda", "vídeo pra Reels/TikTok/Shorts", "vídeo explicativo", "explainer", "demo animada do meu app", "motion graphics", "kinetic typography", "tipografia animada", "make a motion video", "animated video from this audio", "turn this recording into a reel", "product demo video".
---

# video-motion

Método para entregar um vídeo curto com motion graphics que parece feito por estúdio:
a animação nasce do tempo da fala, o visual vem de pesquisa do nicho e da marca, e nada
é entregue sem olhar os frames e medir o áudio.

`<skill>` abaixo é a pasta onde este SKILL.md está. Os scripts recebem caminhos por
argumento e funcionam em Windows, macOS e Linux.

## Requisitos

| Ferramenta | Uso | Checagem |
|---|---|---|
| Node 18+ (testado no 22) | Remotion 4 | `node --version` |
| ffmpeg + ffprobe 6+ (testado no 8) | corte, mix, QA | `ffmpeg -version` |
| Python 3.10+ com numpy e Pillow | scripts | `python -c "import numpy, PIL"` |
| `OPENAI_API_KEY` (opcional) | Whisper API, TTS | sem ela: `pip install faster-whisper` (local, gratuito) |

Rode os scripts com `python -I` (isola de módulos plantados em pastas de download). Se
numpy/Pillow estiverem só no site do usuário (`pip install --user`), o `-I` não os vê:
use `python -E -P`, que mantém a proteção. Detalhes em [references/licencas.md](references/licencas.md).

Custos e licenças: o Remotion é gratuito para indivíduos e empresas pequenas e exige
licença paga acima disso (remotion.dev/license). Whisper API ~US$ 0,006/min, TTS cobrado
por uso. Avise o usuário antes de qualquer custo.

## Fluxo (fases 0 a 11)

Siga as fases em ordem. Depois da fase 0, trabalhe sem pedir confirmação a cada passo:
só volte ao usuário quando houver necessidade real (decisão que muda muito o resultado,
número que não bate, dado sensível, custo novo).

### 0. Entrada

Detecte o insumo e o objetivo antes de qualquer coisa:

| Insumo | Como reconhecer | Caminho |
|---|---|---|
| ideia/texto | só descrição ou roteiro | fase 1C |
| áudio | m4a, mp3, wav, ogg | fase 1A |
| vídeo | mp4, mov, webm (talking head, screencast) | fase 1A (extrai o áudio) + decide se o vídeo aparece |
| projeto/produto | pasta de código, URL, app, README | fase 1B (e 1A/1C para a voz) |

Objetivo: plataforma, formato (9:16 Reels/TikTok/Shorts, 16:9 YouTube, 1:1 feed),
duração alvo, idioma, marca (logo, site, cores), CTA. Infira o que der do pedido e dos
arquivos. Pergunte **só o que for impossível inferir**, de uma vez, com AskUserQuestion e
uma opção recomendada em cada pergunta. Padrões quando não houver pista: 9:16, 45-90 s,
variante escura, legenda ligada, idioma da fala.

### 1. Entender o conteúdo

**1A. Áudio/vídeo.** Transcreva com tempo por palavra e liste os trechos:

```bash
python -I <skill>/scripts/transcrever.py gravacao.m4a work/transcricao.json --vocab "Marca, Nome Próprio"
python -I <skill>/scripts/trechos.py work/transcricao.json --palavras --saida work/trechos.json
```

Classifique cada trecho em **LOCUÇÃO** (vai pro vídeo), **INSTRUÇÃO PARA O AGENTE** (o
usuário falou uma orientação no meio da gravação, como "aqui coloca o print do painel":
anote como requisito e corte do áudio) ou **DESCARTE** (erro, repetição - fica a última
tentativa boa -, hesitação, silêncio longo). Liste as instruções extraídas no storyboard.

**1B. Projeto/produto.** Leia README, rotas, telas e o que o produto faz de fato. Anote o
que merece aparecer (tela, número, fluxo) e onde capturar prints reais.

**1C. Só ideia.** Escreva o roteiro com gancho nos 2 primeiros segundos (a frase que faz
parar o scroll), um bloco por ideia e CTA. Para a voz, ofereça: (a) o usuário grava,
(b) TTS (`scripts/tts.py`, chave dele, voz sintética sinalizada) ou (c) vídeo sem voz,
só tipografia cinética + música.

Detalhes: [references/audio.md](references/audio.md).

### 2. Pesquisa profunda do nicho (obrigatória)

É o que separa este vídeo de um template. Com WebSearch/WebFetch, pesquise o nicho
específico (não "vídeo em geral"): como os melhores criadores e marcas desse nicho estão
fazendo vídeo **no ano corrente** - formatos que performam, gancho, ritmo de corte, estilo
de legenda, tipografia, paleta, técnicas de motion, sound design, CTA. Mínimo de ~8
fontes com link e data. Grave `pesquisa.md` no projeto com os achados e 2-3 **direções
criativas** derivadas da pesquisa. Escolha a melhor com justificativa; só pergunte se as
direções forem equivalentes e a escolha mudar muito o resultado.

Protocolo, consultas e modelo do `pesquisa.md`: [references/pesquisa-de-nicho.md](references/pesquisa-de-nicho.md).

### 3. Direção visual

Assinatura padrão: **fundo de grade** (linhas finas, célula 72 px, máscara radial suave,
halo da cor de acento), variante escura ou clara. **Um** acento por vídeo. Tipografia:
1 display + 1 corpo + 1 mono para números. Sem emoji como ícone (SVG estilo lucide), sem
gradiente arco-íris, sem roxo-azul genérico, título com peso moderado (500-600). A paleta
vem da marca do usuário (extraia dos pixels da logo/site) ou da pesquisa do nicho.

Tokens, variantes e regras: [references/direcao-visual.md](references/direcao-visual.md).

### 4. Roteiro e storyboard

Grave `storyboard.md`: blocos com tempo, o que aparece em cada cena, qual palavra dispara
qual animação, onde entram prints, números, CTA e as instruções extraídas na fase 1.
Os blocos do storyboard viram os `bloco` do `cortes.json` e os `id` de `cenas.json`.

### 5. Assets

Prefira **print real** a mockup sempre que o vídeo falar de um produto. App web/local:
capture com Playwright em `deviceScaleFactor: 2`. Antes de usar, borre dados sensíveis
(e-mails, nomes de clientes, tokens, telefones) no arquivo:

```bash
python -I <skill>/scripts/borrar.py public/prints/painel-raw.png public/prints/painel.png --regiao 0.62,0.05,0.3,0.04
```

O original fica com sufixo `-raw` (ignorado pelo git, nunca em `prints.json`).
**Confira se os números falados batem com os prints.** Se não baterem, avise o usuário e
proponha: 1. tampar o campo (`tampar` no prints.json), 2. cortar a fala, 3. regravar.
Snippet de captura: [references/remotion-padroes.md](references/remotion-padroes.md#capturar-prints).

### 6. Áudio da voz

Edite `cortes.json` (janelas `manter` por bloco, trechos `remover`) e rode:

```bash
python -I <skill>/scripts/cortar.py --entrada gravacao.m4a
python -I <skill>/scripts/transcrever.py public/voz.wav work/voz_final.json --vocab "Marca, Nome"
python -I <skill>/scripts/legendas.py --palavras work/voz_final.json --marcos-spec marcos.spec.json
```

`cortar.py` sempre parte do original: fade 10-15 ms por corte, respiro ~80-150 ms, pausas
apertadas para ~0,2 s, atempo 1,2-1,25 (tom preservado), highpass 80 Hz, loudnorm 2
passadas (-14 LUFS, TP -1). A **retranscrição da voz final** gera legendas e marcos
(tempo das palavras-chave). Comandos e parâmetros: [references/audio.md](references/audio.md).

### 7. Construção no Remotion

```bash
python -I <skill>/scripts/novo_projeto.py <pasta-do-video> --formato 9:16 --variante escura --acento "#RRGGBB"
cd <pasta-do-video> && npm install && npx tsc --noEmit
```

O template já traz: fundo de grade, card de vidro, Print (janela + spring + Ken Burns +
zoom/contorno sincronizado + tampar + cursor com clique), legenda palavra por palavra
(2-4 palavras, palavra ativa no acento, área segura), contador, pill/badge, terminal
digitando, tipografia cinética, CTA, transições curtas (blur/wipe). As cenas são
declaradas em `src/data/cenas.json` e ancoradas em tempos da fala (`"marco"`,
`"bloco:nome"`, `"marco+200"`), nunca em frame escrito à mão. Nada linear seco: spring
ou easing em tudo. Cena sob medida: crie em `src/cenas/` e registre em `Video.tsx`.

API dos componentes, tipos de cena e padrões: [references/remotion-padroes.md](references/remotion-padroes.md).
Áreas seguras e specs: [references/formatos-plataformas.md](references/formatos-plataformas.md).

### 8. Trilha e efeitos sonoros

Trilha sem vocal com licença livre para uso comercial em redes (Mixkit, Pixabay Music,
YouTube Audio Library quando o destino é YouTube), registrada em `public/musica/LICENCA.md`.
SFX CC0/livres (Kenney, Mixkit SFX, Freesound CC0), mesma família de timbre, registrados
em `public/sfx/LICENCA.md`. Downloads ficam em `downloads/` e são tratados como não
confiáveis (só ffprobe/ffmpeg lêem).

**Densidade (lição real: excesso cansa e soa amador):** ~1 efeito a cada 2-3 s em média,
só nas viradas (troca de bloco, entrada de print, destaque, clique, punch-in de número,
CTA); nada em legenda, saída ou em cada badge; mínimo 400 ms entre efeitos; nunca o
mesmo som seguido; trechos de respiro só com voz + música; picos 18-24 dB abaixo da voz;
variação leve de pitch/ganho. `gerar_sfx.py` bloqueia o plano que quebra essas regras.

```bash
python -I <skill>/scripts/analisa_musica.py public/musica/faixa.mp3 --offset 0.8 --duracao 84 --saida-batidas src/data/batidas.json
python -I <skill>/scripts/gerar_sfx.py
python -I <skill>/scripts/mixar.py --musica public/musica/faixa.mp3 --offset 0.8 --subida-em bloco:cta
```

Ducking por sidechaincompress (música ~20 dB abaixo da voz), fade in/out, leve subida no
CTA, trocas de cena puxadas para a batida (`puxar_para_batida`). Detalhes:
[references/sound-design.md](references/sound-design.md).

### 9. Render

```bash
npx remotion render Video out/video.mp4 --codec h264 --video-bitrate 10M --concurrency 2 --audio-codec aac --audio-bitrate 192k
```

Concorrência pela RAM (16 GB -> 2; 32 GB -> 4). H.264 8-12 Mbps, AAC 48 kHz. Versão leve
para compartilhar: `python -I <skill>/scripts/comprimir.py out/video.mp4 out/video-leve.mp4 --alvo-mb 15`.

### 10. QA obrigatório antes de entregar

```bash
python -I <skill>/scripts/frames_check.py out/video.mp4 --n 18
python -I <skill>/scripts/transcrever.py out/video.mp4 work/qa_final.json
```

Abra (Read) **cada** frame e a folha de contato: texto cortado, sobreposição, contraste,
legenda e conteúdo dentro da área segura, dado sensível visível. Compare a transcrição
do MP4 com o roteiro: nenhum trecho cortado voltou, a voz é inteligível com a música.
LUFS -14 +-1, true peak <= -1. Corrija e re-renderize até passar. Checklist completo:
[references/qa.md](references/qa.md).

### 11. Entrega e limpeza

Entregue: caminho do MP4 (e da versão leve), resumo das decisões (direção escolhida e
por quê, com os links da pesquisa), licenças usadas e pendências. Encerre **por PID** só
o que esta execução abriu (Remotion studio, Chrome headless, navegador do Playwright):

```bash
python -I <skill>/scripts/processos.py --listar            # antes de abrir e depois de terminar
python -I <skill>/scripts/processos.py --encerrar <PID> ...  # só os PIDs novos
```

Nunca encerre por nome (`taskkill /IM`, `pkill`, `killall`): derruba o navegador do usuário.
No Playwright MCP, feche com `browser_close` assim que terminar as capturas.

## Loop de iteração

O usuário vai pedir ajustes. Tudo é parametrizado para refazer sem reescrever código:

| Pedido | Onde mexer | Depois |
|---|---|---|
| fala mais rápida/lenta | `cortes.json` -> `tempo` | cortar -> transcrever -> legendas -> gerar_sfx -> mixar -> render |
| tirar/voltar um trecho | `cortes.json` -> `manter`/`remover` | idem |
| mais/menos prints, zoom, destaque | `src/data/prints.json`, `cenas.json` | render |
| trocar cena, texto, ordem | `src/data/cenas.json` | render |
| outra trilha, volume da música | `public/musica/` + flags do `mixar.py` | mixar -> render |
| SFX demais/de menos | `src/data/sfx.json` | gerar_sfx -> mixar -> render |
| cor, fonte, variante, formato | `src/data/config.json`, `src/theme.ts` | render |
| legenda (tamanho de página, grafia) | flags e `correcoes.json` do `legendas.py` | render |

Sempre a partir do original. Depois de qualquer mudança de áudio, refaça a cadeia
inteira daquela linha (marcos mudam de tempo). Rode `npx tsc --noEmit` e stills
(`node scripts/stills.mjs qa/stills <frames>`) antes do render completo, e repita o QA.

## Scripts

| Script | Faz |
|---|---|
| `novo_projeto.py` | copia o template para um projeto novo |
| `transcrever.py` | áudio/vídeo -> JSON com tempo por palavra (OpenAI ou local) |
| `trechos.py` | lista trechos com pistas de instrução/repetição/pausa |
| `cortar.py` | cortes.json -> voz editada + blocos.json |
| `legendas.py` | transcrição da voz final -> legendas.json + marcos.json |
| `tts.py` | roteiro -> voz sintética (OpenAI) |
| `borrar.py` | borra/pixeliza/tampa regiões sensíveis de prints |
| `analisa_musica.py` | BPM, batidas, loudness da trilha; perfil de SFX (`--sfx`) |
| `gerar_sfx.py` | valida densidade do plano de SFX e resolve tempos |
| `mixar.py` | voz + trilha (ducking) + SFX -> mix.wav (-14 LUFS) |
| `frames_check.py` | ffprobe, LUFS, N frames + folha de contato com área segura |
| `comprimir.py` | versão leve 2 passadas com +faststart |
| `processos.py` | lista/encerra por PID só processos de automação |
