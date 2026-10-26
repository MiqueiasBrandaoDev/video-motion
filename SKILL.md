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
| **vídeo com rosto** (caminho principal) | mp4, mov, webm com a pessoa falando (talking head, 9:16 ou 16:9) | fase 1A no próprio vídeo -> classifica trechos -> `cortar_video.py` corta VÍDEO + voz juntos -> modelo `orador`; pergunta de presença do orador obrigatória |
| screencast | mp4/mov de tela | fase 1A (extrai o áudio) + trechos da tela como print/janela |
| projeto/produto | pasta de código, URL, app, README | fase 1B (e 1A/1C para a voz) |

Objetivo: plataforma, formato (9:16 Reels/TikTok/Shorts, 16:9 YouTube, 1:1 feed),
duração alvo, idioma, marca (logo, site, cores), CTA. Infira o que der do pedido e dos
arquivos. Pergunte **só o que for impossível inferir**, de uma vez, com AskUserQuestion e
uma opção recomendada em cada pergunta. Padrões quando não houver pista: 9:16, 45-90 s,
variante escura, legenda ligada, idioma da fala.

**Presença do orador (obrigatória quando há filmagem dele: talking head, palestra,
entrevista).** É gosto do cliente e não dá para inferir: pergunte sempre, no mesmo
AskUserQuestion das outras perguntas desta fase (lição real, mesmo feedback da regra de
texto de tela da fase 3):

1. **Mais orador**: a pessoa aparece a maior parte do tempo; o motion entra pontual,
   como destaque curto por cima ou num corte rápido.
2. **Frase e volta (recomendado)**: frase-chave grande por ~1,5-2 s e volta para o
   orador, alternância contínua. Foi o que funcionou no feedback real.
3. **Mais texto para ler**: cenas de motion e texto mais longas, orador em menos
   momentos. Mesmo assim nenhum texto fica parado mais de ~2,5 s: o texto muda (palavra
   por palavra, punch-in, ícone que reage), não congela.

Sem vídeo do orador (só áudio, ideia ou produto), a pergunta não se aplica.

**Vídeo com rosto: o caminho completo** (detalhes em [references/audio.md](references/audio.md#7-vídeo-de-entrada)):

1. Transcreva **o próprio vídeo** (o script extrai o áudio): `transcrever.py gravacao.mp4 work/transcricao.json`.
2. Classifique os trechos (fase 1A) e escreva o `cortes.json` com os blocos do roteiro.
3. Corte **o vídeo e a voz juntos**, nunca só o áudio:
   `python -I <skill>/scripts/cortar_video.py --entrada gravacao.mp4` -> `public/orador.mp4` +
   `public/voz.wav` + `blocos.json`. As bordas dos cortes caem na grade de quadros da fonte,
   a aceleração usa `setpts=PTS/tempo` e `atempo=tempo` no mesmo grafo e o script confere a
   sincronia (vídeo x voz, erro acima de 1 quadro).
4. Opcional, para texto atrás da pessoa: `recortar_orador.py public/orador.mp4 public/orador-alfa.webm`
   (`--chroma "#RRGGBB"` se a gravação for em fundo verde/azul: segundos, sem modelo).
5. Projeto com o modelo talking head: `novo_projeto.py <pasta> --modelo orador` (legenda
   fantasma, cenas `orador`, sem trilha).

Fonte 16:9: o rosto é reenquadrado para 9:16 (`config.orador.enquadramento`: `x`, `zoom`,
`foco`, `desce` para abrir espaço acima da cabeça) ou vai inteiro na cena `letterbox`/`duelo`.

**Corte de podcast: teaser (cold open) por padrão.** Quando a frase de impacto está no meio do
trecho, ela abre o vídeo de relance (3-5 s, preto e branco, voz de megafone), a fita rebobina
(cena `volta`, som de `som_volta.py`) e o corte começa colorido; a frase reaparece no contexto
(payoff). Campo `teaser` do `cortes.json` + cenas `teaser`/`volta`. Estrutura, regras e links:
[references/roteiros-e-ganchos.md](references/roteiros-e-ganchos.md) (seção 3.E); exemplo em
`references/teaser.example.json`.

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

**1C. Só ideia.** Escreva o roteiro numa das estruturas de
[references/roteiros-e-ganchos.md](references/roteiros-e-ganchos.md) (problema -> demonstração
em ~30% -> produto em ~82% -> CTA em ~89%; demonstração ao vivo com corpo versionável;
objeções enumeradas; duelo), com um gancho da biblioteca de 18 tipos e **o resultado
visível no 1º segundo**. Para a voz, ofereça: (a) o usuário grava,
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

**Estilo padrão** (kit de 10 pontos em `direcao-visual.md`): o vídeo tem que parecer
*produzido*, não colado. Fundo de grade (escuro ou claro) com halos de luz e profundidade;
UI inventada que narra a fala (TelaViva) no lugar de print ilegível; carimbo com flash como
pontuação; camadas 3D e câmera que se afasta para revelar; cards com halo e borda luminosa;
tipografia em 4 papéis (frase grotesca pesada, número largo/estreito, **uma** palavra
emocional em serifa itálica, rótulo mono espaçado); HUD fixo (barra de capítulos, título
opcional, quadro 4:5); legenda pequena em caixa; ritmo calmo x rajada. Paleta: acento com
significado (solução x problema) ou acento único com gradiente, brilho e profundidade. Nunca
terceira cor, emoji como ícone ou elemento copiado de referência. A paleta vem da marca do
usuário (pixels da logo/site) ou da pesquisa do nicho. A variante clássica (cards de vidro,
legenda grande, cross-fade) continua disponível quando o cliente pedir algo mais sóbrio.

**Texto de tela (lição real: card parado cansa e compete com a fala):** fora a legenda,
nenhum texto fica parado mais de ~2,5 s. Texto de tela é frase-chave curta (2-6
palavras), grande, no centro, entrando no marco da palavra falada. Com filmagem do
orador (talking head, palestra), o padrão é alternar frase-chave (~1,5-2 s) e volta ao
orador enquanto ele desenvolve: frase, orador, frase, orador. Nada de card pequeno com
tela vazia em volta, nem texto repetindo por segundos o que a legenda já mostra.

**Quatro regras de retenção (padrão, pedido do Miquéias em out/2026; valem para todo vídeo):**

| # | Regra | Como a skill garante |
|---|---|---|
| 1 | **Nenhuma imagem parada por mais de 2 s.** A cada 2 s no máximo algo muda de verdade: corte, punch-in/zoom, troca de enquadramento, componente entrando ou saindo, troca rosto/motion. Zoom lento (Ken Burns) sozinho não conta. Sem esse pico a pessoa sai do vídeo. | `cenas_check.py` lista os eventos visuais e avisa cada intervalo acima de 2 s; no QA, `--eventos` mostra todos (o maior não passa de 2 s) |
| 2 | **Nunca ler a mesma coisa duas vezes.** Se o título ou o componente já mostra as palavras ditas, a legenda some naquele trecho; nenhum card repete o que outro acabou de mostrar. A frase do teaser voltar no payoff é permitido (é fala). | `src/textoTela.ts` esconde sozinho a página da legenda que tem palavra escrita na tela (desliga com `"legenda_repete": true`); `cenas_check.py` lista essas páginas e avisa card repetindo card |
| 3 | **Sempre voltar para a pessoa.** Rosto, motion, rosto, motion; nenhum trecho sem rosto passa de ~4 s. | `cenas_check.py` avisa trecho sem rosto acima de 4 s (`--sem-rosto`) |
| 4 | **Fala a 1,3x no mínimo** (atempo + setpts juntos, com sincronia). | padrão `tempo: 1.3` no `cortar.py`/`cortar_video.py`; abaixo disso eles avisam |

Tokens, variantes e regras: [references/direcao-visual.md](references/direcao-visual.md).

**Fichas de estilo** (`references/estilos/`): estilos medidos em referências reais. Quando o
pedido ou a pesquisa do nicho apontar para um deles, a ficha sobrescreve o padrão só nos
pontos da seção "Conflitos" dela; o resto da skill continua valendo.

| Ficha | Quando usar |
|---|---|
| [dossiê](references/estilos/dossie.md) | motion puro com locução: explicador de dados com dois lados (política, economia, placar), fundo de papel cinza, dado que vira objeto |
| [onda sonora](references/estilos/onda-sonora.md) | talking head de selfie em lista curta de sons demonstrados (dicas de edição), cartão de forma de onda, tudo em corte seco |

### 4. Roteiro e storyboard

Com fala gravada ou roteiro novo, confira a estrutura contra
[references/roteiros-e-ganchos.md](references/roteiros-e-ganchos.md): primeira palavra em
0,0 s e primeiro elemento visual até 1 s (**mostrar o resultado no 1º segundo**), demonstração
começando em ~25-35% do vídeo, produto em ~80%, CTA em ~89% com pill até o fim. No talking
head, a tabela da seção 5 da referência liga cada momento do roteiro a um componente.

Grave `storyboard.md`: blocos com tempo, o que aparece em cada cena, qual palavra dispara
qual animação, onde entram prints, números, CTA e as instruções extraídas na fase 1.
Os blocos do storyboard viram os `bloco` do `cortes.json` e os `id` de `cenas.json`.
Cada cena de texto declara a duração; acima de 2,5 s ela precisa mudar (nova palavra,
punch-in, troca para o orador). Com filmagem, registre no topo o parâmetro escolhido na
fase 0 (`presença do orador: mais orador | frase e volta | mais texto`) e marque onde a
tela volta para o orador.

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

Edite `cortes.json` (janelas `manter` por bloco, trechos `remover`) e rode `cortar.py` (só
voz) ou, com rosto filmado, `cortar_video.py` (vídeo + voz no mesmo plano, mesmas saídas e
`public/orador.mp4`):

```bash
python -I <skill>/scripts/cortar.py --entrada gravacao.m4a      # ou cortar_video.py --entrada gravacao.mp4
python -I <skill>/scripts/transcrever.py public/voz.wav work/voz_final.json --vocab "Marca, Nome"
python -I <skill>/scripts/legendas.py --palavras work/voz_final.json --marcos-spec marcos.spec.json [--destaques "palavra,outra"]
```

`cortar.py` sempre parte do original: fade 10-15 ms por corte, respiro ~80-150 ms, pausas
apertadas para ~0,2 s, atempo 1,3 ou mais (regra 4; tom preservado), highpass 80 Hz, loudnorm 2
passadas (-14 LUFS, TP -1). A **retranscrição da voz final** gera legendas e marcos
(tempo das palavras-chave). Comandos e parâmetros: [references/audio.md](references/audio.md).

### 7. Construção no Remotion

```bash
python -I <skill>/scripts/novo_projeto.py <pasta-do-video> --formato 9:16 --variante escura --acento "#RRGGBB"
cd <pasta-do-video> && npm install && npx tsc --noEmit
```

Talking head: `--modelo orador` (dados de exemplo do formato, legenda fantasma). Cena
`orador`: o rosto em tela cheia reenquadrado, com `punch` (punch-in suave nas palavras-chave),
`pb` (preto e branco no "jeito antigo", 6 frames), `card` (orador encolhe para card, 10
frames), `raw` (xadrez + moldura tracejada que vira "editado") e a lista `sobre` com as
sobreposições no marco da fala: `titulo` (linha larga + linha condensada, atrás da cabeça),
`riscado`, `numero` (rola em 6 frames), `chips`, `objecoes` (HUD de checks), `comando`
(terminal digitando + `rec` com timecode), `passos` (lista de 3 com o card), `cards`,
`pill` (CTA) e `final`. Mais as cenas `duelo` (dois resultados empilhados com placar) e
`letterbox` (título fixo + vídeo 16:9), e a `telaViva` com `perspectiva` (rotateY 28° -> 0
em 18 frames) e blocos `video`, `chat` e `colunas` para o painel de "editor/assistente".
Corte de podcast com teaser: cenas `teaser` (P&B, grão, tremor, chip "daqui a pouco") e
`volta` (VHS rebobinando do payoff até o começo, OSD "REW" e contador), antes do corpo.
Legenda fantasma (`legenda_estilo: "fantasma"`) no talking head; legenda em caixa no motion puro.

O template já traz o estilo padrão: cenas `frase`, `telaViva` (lista, checklist,
contador, toggles, timeline, fluxo, kanban, prompt com estados ligados à fala), `camadas`,
`bento` (com encaixe), `letreiro`, `linha` (ECG, rachadura), `recorte` (texto atrás do
apresentador) e `rajada`; em qualquer uma, `camera`, `carimbos` e `motionBlur`; HUD e
legenda em caixa no `config.json`. As cenas clássicas (`titulo`, `numeros`, `print`,
`terminal`, `pills`, `cta`) seguem disponíveis e se misturam com as novas. Tudo declarado
em `src/data/cenas.json` e ancorado em tempos da fala (`"marco"`, `"bloco:nome"`,
`"marco+200"`), nunca em frame escrito à mão. Springs e durações exatas de cada componente:
`remotion-padroes.md`, seção 9. Texto atrás da pessoa exige recorte prévio (opcional,
`scripts/recortar_orador.py`, seção 10). Cena sob medida: crie em `src/cenas/` e registre
em `Video.tsx`. Confira cada componente em stills nas duas variantes antes do render.
Depois de montar `cenas.json`, meça o texto parado (sai com erro acima de 2,5 s):

```bash
python -I <skill>/scripts/cenas_check.py --projeto <pasta-do-video>
```

API dos componentes, tipos de cena e padrões: [references/remotion-padroes.md](references/remotion-padroes.md).
Áreas seguras e specs: [references/formatos-plataformas.md](references/formatos-plataformas.md).

### 8. Trilha e efeitos sonoros

Trilha sem vocal com licença livre para uso comercial em redes (Mixkit, Pixabay Music,
YouTube Audio Library quando o destino é YouTube), registrada em `public/musica/LICENCA.md`.
SFX CC0/livres (Kenney, Mixkit SFX, Freesound CC0), mesma família de timbre, registrados
em `public/sfx/LICENCA.md`. Downloads ficam em `downloads/` e são tratados como não
confiáveis (só ffprobe/ffmpeg lêem).

**Duas configurações, escolha pelo formato:**

| Formato | Trilha | Efeitos | `sfx.json` |
|---|---|---|---|
| **talking head** (rosto falando) | **sem trilha** por padrão (pausas caem a silêncio) | impactos graves curtos nos títulos que entram atrás da cabeça, no número-chave e no CTA, ~1-2,5 a cada 10 s; um ou outro efeito comum discreto | `"perfil": "orador"`; `mixar.py` sem `--musica` |
| **motion puro** (sem rosto) e demonstração/comparação | trilha contínua com ducking | base de ~1 efeito a cada 2-3 s nas viradas + impactos (abaixo) | `"perfil": "motion"` (padrão) |

Talking head que é demonstração ou duelo pode ganhar trilha baixa (padrão observado nas
referências). Regras de densidade abaixo valem para o motion puro; no perfil orador o
`gerar_sfx.py` espera intervalo médio de 2,5-8 s e impactos a 2,5 s ou mais um do outro.

**Duas camadas no motion puro (lição real: excesso cansa; poucos momentos fortes dão peso):**
1. **Base (comum):** ~1 efeito a cada 2-3 s em média, só nas viradas (troca de bloco,
   entrada de janela/print, destaque, clique), picos 18-24 dB abaixo da voz.
2. **Impactos fortes (`"categoria": "impacto"`):** só em carimbo com flash,
   revelação/afastamento de câmera, número-chave e CTA; picos 12-16 dB abaixo da voz;
   ~4 s ou mais entre impactos.

Nas duas: nada em legenda, saída, cada badge ou cada plano de rajada; mínimo 400 ms entre
efeitos; nunca o mesmo som seguido; trechos de respiro só com voz + música; variação leve
de pitch/ganho. `gerar_sfx.py` bloqueia o plano que quebra as regras e avisa quando um
carimbo ou afastamento de câmera ficou sem impacto.

```bash
python -I <skill>/scripts/analisa_musica.py public/musica/faixa.mp3 --offset 0.8 --duracao 84 --saida-batidas src/data/batidas.json
python -I <skill>/scripts/gerar_sfx.py
python -I <skill>/scripts/mixar.py --musica public/musica/faixa.mp3 --offset 0.8 --subida-em bloco:cta
```

Trilha contínua com ducking por sidechaincompress: no estilo padrão ~10-12 dB abaixo da voz
durante a fala (`--musica-lufs -23` como ponto de partida, conferido no QA); trilha discreta
(~20 dB, `-27`) na variante clássica. Fade in/out, leve subida no CTA, trocas de cena puxadas
para a batida (`puxar_para_batida`). Detalhes:
[references/sound-design.md](references/sound-design.md).

### 9. Render

```bash
npx remotion render Video out/video.mp4 --codec h264 --video-bitrate 10M --concurrency 2 --audio-codec aac --audio-bitrate 192k
```

Concorrência pela RAM (16 GB -> 2; 32 GB -> 4). H.264 8-12 Mbps, AAC 48 kHz. Versão leve
para compartilhar: `python -I <skill>/scripts/comprimir.py out/video.mp4 out/video-leve.mp4 --alvo-mb 15`.

### 10. QA obrigatório antes de entregar

```bash
python -I <skill>/scripts/cenas_check.py --eventos
python -I <skill>/scripts/frames_check.py out/video.mp4 --n 18
python -I <skill>/scripts/transcrever.py out/video.mp4 work/qa_final.json
```

`cenas_check.py` sem ERRO: nenhum texto de tela parado mais de ~2,5 s; e as quatro regras
de retenção (fase 3): **liste os intervalos entre eventos visuais (o maior não passa de
2 s)**, as páginas de legenda ocultas por repetirem a tela, nenhum trecho sem rosto acima
de 4 s e `tempo` >= 1,3 no `blocos.json`. Abra (Read)
**cada** frame e a folha de contato: texto cortado, sobreposição, contraste,
legenda e conteúdo dentro da área segura, dado sensível visível. Nos trechos de
filmagem, confira a sincronia labial (boca bate com a voz editada; o `cortar_video.py`
já imprime a diferença vídeo x voz, que deve ficar abaixo de 1 quadro), a borda do recorte
(cabelo sem halo) e se o título atrás da cabeça continua legível. Compare a transcrição
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
| talking head: rosto alto/baixo, zoom, título escondido pela cabeça | `config.json` -> `orador.enquadramento` (`zoom`, `foco`, `desce`), `y` do item `sobre` | stills -> render |
| sobreposição no rosto: entra cedo/tarde, fica demais | `cenas.json` -> `sobre[].em` / `ate` | cenas_check -> stills -> render |
| corte do vídeo com rosto (trecho, ritmo) | `cortes.json` | cortar_video -> transcrever -> legendas -> gerar_sfx -> mixar -> render |
| texto parado demais / cansativo de ler | `cenas.json`: quebre o card em frases-chave de ~1,5-2 s e intercale cenas do orador | cenas_check -> stills -> render |
| quer ver mais a pessoa / menos texto | presença do orador no `storyboard.md` (vai para "mais orador"); em `cenas.json`, encurte as cenas de texto e amplie as do orador | cenas_check -> stills -> render |
| outra trilha, volume da música | `public/musica/` + flags do `mixar.py` | mixar -> render |
| SFX demais/de menos, impacto fraco/forte | `src/data/sfx.json` (`categoria`, `rel_db`) | gerar_sfx -> mixar -> render |
| carimbo, câmera, ritmo (rajada) | `src/data/cenas.json` (`carimbos`, `camera`, tipo `rajada`) | stills -> render |
| cor, fonte, variante, formato, HUD, legenda | `src/data/config.json` (`acento`, `problema`, `hud`, `legenda_estilo`, `fundo`), `src/theme.ts` | render |
| legenda (tamanho de página, grafia) | flags e `correcoes.json` do `legendas.py` | render |

Sempre a partir do original. Depois de qualquer mudança de áudio, refaça a cadeia
inteira daquela linha (marcos mudam de tempo). Rode `npx tsc --noEmit` e stills
(`node scripts/stills.mjs qa/stills <frames>`) antes do render completo, e repita o QA.

## Scripts

| Script | Faz |
|---|---|
| `novo_projeto.py` | copia o template para um projeto novo (`--modelo motion` ou `orador`) |
| `transcrever.py` | áudio/vídeo -> JSON com tempo por palavra (OpenAI ou local) |
| `trechos.py` | lista trechos com pistas de instrução/repetição/pausa |
| `cortar.py` | cortes.json -> voz editada + blocos.json |
| `cortar_video.py` | cortes.json -> vídeo com rosto + voz cortados juntos (trim/atrim + concat, setpts+atempo), confere a sincronia; com `teaser`, põe a frase de impacto no começo com voz de megafone |
| `som_volta.py` | som da fita rebobinando (transição do teaser), gerado da própria voz |
| `espectro.py` | energia por faixa, centroide e crista de um trecho (confere a voz do teaser) |
| `legendas.py` | transcrição da voz final -> legendas.json + marcos.json |
| `tts.py` | roteiro -> voz sintética (OpenAI) |
| `borrar.py` | borra/pixeliza/tampa regiões sensíveis de prints |
| `analisa_musica.py` | BPM, batidas, loudness da trilha; perfil de SFX (`--sfx`) |
| `gerar_sfx.py` | valida densidade do plano de SFX (base + impactos) e resolve tempos |
| `cenas_check.py` | mede o texto parado por cena no `cenas.json` (máx. ~2,5 s) e a alternância com o orador |
| `mixar.py` | voz + trilha (ducking) + SFX -> mix.wav (-14 LUFS) |
| `frames_check.py` | ffprobe, LUFS, N frames + folha de contato com área segura |
| `comprimir.py` | versão leve 2 passadas com +faststart |
| `processos.py` | lista/encerra por PID só processos de automação |
| `recortar_orador.py` | OPCIONAL: recorta o apresentador e gera vídeo com alfa (texto atrás da pessoa); `--chroma` para fundo verde/azul |
