# Remotion: padrões do template (fase 7)

## Índice
1. Estrutura do projeto
2. Sincronia: referências de tempo
3. `cenas.json`: tipos prontos (estilo padrão e clássico)
4. `prints.json`: janela, zoom, destaque, tampar, clique
5. Componentes
6. Cena sob medida
7. Comandos (studio, typecheck, stills, render)
8. Capturar prints
9. Estilo padrão: receitas (springs e durações)
10. Recorte do apresentador (texto atrás da pessoa)
11. Ritmo: calmo x rajada
12. Talking head: cena orador, sobreposições, duelo, letterbox, painel 3D
13. Técnica avançada (não implementada): HUD de visão computacional

## 1. Estrutura

```
<projeto>/
  cortes.json              plano de edição da voz (cortar.py) ou do vídeo + voz (cortar_video.py)
  marcos.spec.json         palavra -> marco (legendas.py)
  pesquisa.md, storyboard.md
  public/  voz.wav, mix.wav, orador.mp4 + orador-alfa.webm (talking head), prints/, musica/, sfx/ (+LICENCA.md)
  src/
    theme.ts               tokens, fontes, formato, área segura, helpers de movimento
    tempo.ts               referências de tempo -> frame, duração, batidas
    Root.tsx, Video.tsx    composição "Video" e montagem das cenas
    comp/                  estilo padrão: Palco (câmera, Carimbo, Flash, tremor), TelaViva, Camadas3D
                           (+ChaoGrade), GradeBento (+CardHalo), Encaixe, Tipografia (TextoMisto,
                           RotuloMono, Chip), Hud (BarraCapitulos, TituloFixo, Quadro45), Efeitos
                           (Letreiro, LinhaSVG), Recorte, FundoGrade, Legendas (LegendaCaixa, LegendaFantasma)
                           talking head: Orador (CamadaVideo, punch, P&B, card, Xadrez, MolduraSelecao),
                           Sobre (titulo, numero, chips, objecoes, comando, rec, passos, cards, pill, final)
                           clássico: CardVidro (+Rotulo, TextoMarcado), Print, Legendas, Contador,
                           Pill (+FaixaPills), Cursor, Terminal, Cta, Icone, Transicoes
    cenas/                 Kit (frase, telaViva, camadas, bento, letreiro, linha, recorte, rajada),
                           Orador (orador, duelo, letterbox),
                           Titulo, Numeros, PrintCena, Outras, tipos.ts, registro.ts
    data/                  config, cenas, prints, marcos, blocos, legendas, batidas, sfx (.json)
  scripts/stills.mjs       frames avulsos em PNG
  work/ out/ qa/ downloads/  (fora do git)
```

`config.json`: `formato` (9:16 | 16:9 | 1:1), `fps`, `variante`, `acento`, `acento2`,
`problema`, `duracao_s` (quando não há voz), `audio` (arquivo em public/, ex. `mix.wav`),
`puxar_para_batida`, `legendas`, `legenda_estilo` (caixa | grande | fantasma), `legenda_destaques`,
`extra_fim_s` (segundos depois da voz, para o card final), `orador` (`video`, `recorte`,
`enquadramento`: padrões das cenas de talking head), `fundo` (`halos`, `chao`,
`vinheta`, `grao`), `hud` (`capitulos[{inicio, cor}]`, `titulo` com `|` entre linhas, `quadro45`).
Campos novos são opcionais: um config antigo continua funcionando.

Duração da composição: `blocos.json.duracao_s` (voz editada) ou `config.duracao_s`.

## 2. Sincronia

Toda animação é ancorada no tempo da fala. Nunca escreva frame à mão.

| Ref | Vem de | Exemplo |
|---|---|---|
| número | ms na timeline final | `2700` |
| `"nome"` | `marcos.json` (legendas.py) | `"custo"` |
| `"bloco:nome"` | `blocos.json` (cortar.py) | `"bloco:cta"` |
| deslocamento | ms somados/subtraídos | `"custo-150"`, `"bloco:cta+300"` |

`frame = ms / 1000 * fps` (`fr(ref)` em `tempo.ts`). Antecipe a animação 4-8 frames
(~150-250 ms) em relação à palavra: o olho precisa ver o elemento quando o ouvido escuta.
Dentro da cena, `ini` é o frame absoluto de início; use `fr(ref) - ini` para o frame local.

Batida: com `puxar_para_batida: true` e `batidas.json`, o início das cenas é puxado
para a batida imediatamente anterior (até 0,3 s), nunca atrasado.

## 3. `cenas.json`

Cada cena dura até o início da próxima. Cenas do estilo padrão entram em **corte seco** (a
cena anima a própria entrada); cenas clássicas usam cross-fade com blur (6 frames de
sobreposição). `transicao: "corte" | "suave"` sobrescreve. `wipe: true` marca troca de bloco
com a faixa de luz.

**Estilo padrão** (todas aceitam `camera`, `cameraInicial`, `carimbos`, `motionBlur`):

| tipo | campos | uso |
|---|---|---|
| `frase` | `linhas[{texto, em?, papel?, tam?, entrada?, gradiente?, brilho?, numero?}]`, `rotulo?`, `rotuloEm?`, `alinhar?`, `vertical?` | gancho, frase-chave, número que conta, CTA |
| `telaViva` | `tela{titulo, status?{texto, final?}, alerta?{em, cor}, inclinar?, blocos[]}`, `titulo?` | UI inventada que narra: lista, checklist, contador, toggles, timeline, fluxo, kanban, prompt |
| `camadas` | `camadas[{rotulo, icone?, texto?}]`, `explodeEm?`, `juntaEm?`, `numerar?`, `legenda?`, `chao?`, `titulo?` | anatomia em planos 3D |
| `bento` | `tiles[{rotulo, icone?, sub?, cor?, largo?, em?}]`, `colunas?`, `conectores?`, `encaixe?{tile, em}`, `acende?[{tile, em}]` | grade de módulos com halo; com câmera, revelação |
| `letreiro` | `texto`, `texto2?`, `em?`, `tam?`, `velocidade?`, `linhas?` | nome/promessa em duas linhas gigantes contra-direção |
| `linha` | `forma` (ecg, reta, rachadura), `em?`, `planaEm?`, `cor?`, `rotuloLinha?{antes, depois}`, `linhas?` | pulso, queda, ruptura |
| `recorte` | `video?`, `recorte?`, `de?`, `deRecorte?`, `zoom?`, `letreiro?`, `linhas?` | apresentador com texto atrás (motion puro) |
| `orador` | `video?`, `recorte?`, `enquadramento?`, `punch?`, `pb?`, `card?`, `raw?`, `sobre?`, `legenda?` (+ `linhas`/`letreiro` do recorte) | talking head (seção 12) |
| `duelo` | `titulo`, `lados[{rotulo, icone?, cor?, video?, de?, enquadramento?, pb?, legenda?}]`, `placar?[{em, lado}]`, `claro?` | dois resultados empilhados com placar |
| `letterbox` | `titulo`, `selo?{texto, icone?}`, `video?`, `enquadramento?`, `punch?`, `rodape?`, `claro?`, `sobre?` | título fixo + vídeo 16:9 no meio |
| `rajada` | `planos[{tipo, em?, ...}]`, `passo_ms?` (700) | cortes de ~0,7 s nos picos da fala |

Blocos da `telaViva` (`tela.blocos[]`):

| tipo | campos | muda quando |
|---|---|---|
| `lista` | `itens[{titulo, sub?, avatar?, icone?, badge?, status?, estados[{em, status?, texto?}]}]` | cada `estados.em`: badge troca (pop) e a linha acende na cor do status |
| `checklist` | `itens[{texto, em}]` | 10 frames antes: spinner; no `em`: check com pop |
| `contador` | `rotulo`, `de?`, `ate`, `em`, `ateEm?`, `prefixo?`, `sufixo?`, `casas?`, `cor?` | conta de `em` a `ateEm` (ease-out cúbico) |
| `toggles` | `itens[{texto, ligado?, em?}]` | toggle inverte no `em` |
| `timeline` | `trilhas[{rotulo, blocos[[ini, fim] 0-1], cor?}]`, `em`, `ateEm?` | playhead corre; blocos acendem quando a cabeça passa |
| `fluxo` | `nos[{texto, icone?, em, decisao?}]` | nó a nó, conector desenha 8 frames antes |
| `kanban` | `colunas[]`, `card{texto, avatar?}`, `passos[{em, coluna}]` | card desliza de coluna (10 frames) |
| `prompt` | `texto`, `em`, `cps?` (1,6 car/frame), `rotulo?` | digita com cursor; botão pulsa no fim |
| `chat` | `mensagens[{texto, em, ok?, icone?}]`, `cps?` (1,4), `rotulo?` | bolha do comando digita; 6 frames depois do fim, linha de confirmação com check |
| `video` | `arquivo?` (orador.mp4), `proporcao?` (largura/altura), `altura?`, `enquadramento?`, `status?`, `rotulo?` | preview do vídeo no frame da timeline |
| `colunas` | `blocos[]`, `pesos?[]` | blocos lado a lado (ex.: vídeo + chat) |

`tela.perspectiva: {em?, rotY?: 28, rotX?: 6}`: a janela entra girada e endireita em 18 frames
(`spring({damping: 200, mass: 1.2})`).

Status: `ok` (acento/solução), `erro` (problema), `aviso` (acento2), `neutro`.

**Clássicas** (variante anterior):

| tipo | campos | uso |
|---|---|---|
| `titulo` | `linhas[{texto, em?, tam?}]`, `rotulo?`, `alinhar?` | gancho, tipografia cinética, vídeo sem voz |
| `numeros` | `itens[{valor, casas?, prefixo?, sufixo?, rotulo, icone?, em}]`, `legenda?` | punch-in de número com contagem |
| `print` | `janela?` (padrão = id), `apoio?[{rotulo, icone, em}]` | print real com câmera |
| `terminal` | `titulo?`, `linhas[{texto, em, tipo: cmd/saida/ok, icone?}]` | CLI, passos de um agente |
| `pills` | `titulo?`, `itens[{rotulo, icone, em}]` | lista de benefícios/recursos |
| `cta` | `principal`, `em?`, `pill?{texto, icone, em}`, `rotulo?` | chamada final |

Todos aceitam `id`, `inicio`, `rotulo`, `wipe`, `transicao`. Exemplo completo das clássicas:
`template/src/data/cenas-classico.example.json`.

Duração de cena de texto: o intervalo entre duas mudanças na tela (início da cena,
cada `em`/`risco`/`ate`/`escreveEm`) não passa de ~2,5 s; a cena inteira de texto
idealmente fica em ~1,5-2 s quando há orador filmado. Cena longa vira várias cenas
curtas intercaladas com o orador. Cena sob medida que mostra o orador: use um tipo
`filmagem`/`orador`/`video` ou marque `"orador": true` para o validador:

```bash
python -I <skill>/scripts/cenas_check.py --projeto <pasta-do-video> --orador filmagem,recorte --limite 2.5
```

Saída: tabela por cena (duração, maior trecho parado, status), AVISO para frase sobre o
orador que fica mais que o limite, card de texto acima de 2x o limite e trecho de mais
de 6 s só de texto num vídeo com orador; ERRO (código 1) para texto parado acima do
limite. Precisão ~0,2 s.

## 4. `prints.json`

```json
{
  "painel": {
    "titulo": "app · painel",
    "planos": [
      {"arquivo": "01-painel.png", "desde": "inicio", "aspecto": 1.6,
       "vista": [0, 0, 1, 1],
       "zooms": [{"em": "custo", "regiao": [0.17, 0.24, 0.27, 0.23], "destaque": true}],
       "ocultar": [[0.8, 0.02, 0.18, 0.04]],
       "tampar": [[0.5, 0.6, 0.2, 0.08]],
       "clique": {"em": "clicar", "ponto": [0.62, 0.41]}},
      {"arquivo": "02-detalhe.png", "desde": "detalhe", "zooms": []}
    ]
  }
}
```

- Regiões `[x, y, largura, altura]` em fração 0-1 do PNG. Para achar: abra o PNG, meça
  em px e divida pela largura/altura (`borrar.py --info` mostra o tamanho).
- `aspecto` = largura/altura do PNG (capturas 1600x1000 em DPR 2 -> 3200x2000 -> 1,6).
- Zoom: câmera vai até a região em 20 frames (easing), Ken Burns lento depois; `destaque`
  desenha contorno no acento e escurece o resto.
- `ocultar` é reforço. O dado sensível já deve sair borrado no arquivo (`borrar.py`).
- `tampar`: card opaco por cima (número que não bate com a fala, área irrelevante).
- PNG ausente vira placeholder com o nome do arquivo (bom para montar antes dos prints).
- Troca de plano: `desde` com referência; transição com blur curto.

## 5. Componentes

| Componente | Props principais |
|---|---|
| `Palco` | `ini`, `camera?`, `cameraInicial?`, `carimbos?`, `motionBlur?`, `origem?` (envelope das cenas do estilo padrão) |
| `Carimbo`, `Flash`, `tremor()`, `poseCamera()` | peças do Palco, usáveis em cena sob medida |
| `TelaViva` | `def` (DefTelaViva), `ini`, `largura`, `entra?` |
| `Camadas3D`, `ChaoGrade` | `def` (DefCamadas3D), `ini`; `base?`, `profundidade?`, `celula?` |
| `GradeBento`, `CardHalo`, `layoutBento()` | `def`, `ini`; `rotulo`, `icone?`, `cor?`, `aceso?` |
| `Encaixe`, `progEncaixe()`, `misturaRet()` | `de`, `para` (retângulos), `at`, `dur?` (8) |
| `TextoMisto`, `RotuloMono`, `Chip`, `parseMisto()` | `texto` com marcação, `at`, `papel?`, `tam?`, `entrada?`, `gradiente?`, `brilho?` |
| `Hud` (`BarraCapitulos`, `TituloFixo`, `Quadro45`) | lê `config.hud`; fica fora das cenas |
| `Letreiro`, `LinhaSVG` | `texto`, `texto2?`, `y`, `tam?`, `velocidade?`; `forma`, `at`, `planaEm?` |
| `Recorte` | `video?`, `recorte?`, `de?`, `deRecorte?`, `zoom?`, `atras?`, `frente?` |
| `LegendaCaixa` | lê `legendas.json`; `tam?` (padrão 58 px) |
| `LegendaFantasma` | lê `legendas.json` e `config.legenda_destaques`; `pos` (rosto, base, esquerda, oculta, y 0-1), `tam?` (62 px) |
| `CamadaVideo` | `arquivo`, `de` (trimBefore), `ret`, `enq`, `escala?`, `pb?`, `transparente?`, `marcacao?` (silhueta sem arquivo) |
| `escalaPunch()`, `nivelPB()`, `progCard()`, `Xadrez`, `MolduraSelecao`, `EtiquetaEstado`, `BordaCard` | peças da cena orador, usáveis em cena sob medida |
| `CamadaSobre`, `SOBRE` | desenha os itens `sobre` de uma camada (atras/frente); registro tipo -> componente |
| `FundoGrade` | `celula?`, `halo?[x,y]`, `drift?`, `halos?`, `chao?`, `vinheta?`, `grao?` (padrão vem de `config.fundo`) |
| `CardVidro` | `destaque?` (0-1), `opaco?`, `style?` |
| `Rotulo`, `TextoMarcado` | texto mono em acento; `*trecho*` em acento |
| `Print` | `janela`, `ini`, `largura`, `proporcao?` |
| `Legendas`, `VeuLegenda` | lê `legendas.json`; `altura?`, `tam?` |
| `Contador` | `item` (ItemNumero), `ini`, `tam?` |
| `Pill`, `FaixaPills` | `icone?`, `fantasma?`, `glow?`; `itens`, `ini` |
| `Cursor` | `x`, `y`, `clique?` (0-1), `visivel?` |
| `Terminal` | `linhas`, `ini`, `titulo?` |
| `Cta` | `principal`, `rotulo?`, `em?`, `pill?` |
| `Icone` | `nome`, `tam?`, `cor?` (mapa lucide em `Icone.tsx`) |
| `Cena`, `Wipe` | envelope de entrada/saída; faixa de luz de troca de bloco |

Helpers (`theme.ts`): `prog(frame, ini, dur)` (0-1 com easing), `mola(frame, ini, cfg?)`
(spring leve), `revela(frame, ini)` (entrada clássica), `entraUI(frame, ini)` (entrada do
estilo padrão), `molaKit(frame, ini, 'ui' | 'pop' | 'carimbo' | 'camera' | 'camadas')`,
`MOLAS`, `easingEncaixe`, `papel` (estilos dos 4 papéis tipográficos), `corDe(nome)`,
`brilho(cor)`, `px(v)` (escala por formato), `alfa(hex, a)`, `tonalidade(hex, f)`,
`fmt(v, casas)`, `LIMITE_CONTEUDO` (y máximo de conteúdo, acima da legenda), `AREA`
(área útil do estilo padrão: abaixo do HUD, acima da legenda), `HUD`, `QUADRO45`.

Movimento clássico: spring `damping 14, stiffness 160` para entradas; punch-in de número
`damping 11, stiffness 170` saindo de escala 1,3; easing `bezier(0.16, 1, 0.3, 1)`.
Transição entre cenas clássicas: 9-12 frames com blur. Estilo padrão: seção 9. Nada linear
seco, nada acima de ~0,7 s.

## 6. Cena sob medida

```tsx
// src/cenas/Comparacao.tsx
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CardVidro, Rotulo} from '../comp/CardVidro';
import {mola, revela, SEGURO_LADO, SEGURO_TOPO} from '../theme';
import {fr} from '../tempo';
import type {PropsCena} from './tipos';

export const Comparacao: React.FC<PropsCena<any>> = ({def, ini}) => {
  const frame = useCurrentFrame();
  const tDepois = fr(def.depoisEm) - ini;
  const p = mola(frame, tDepois - 6);
  return (
    <AbsoluteFill style={{padding: `${SEGURO_TOPO + 60}px ${SEGURO_LADO}px 0`}}>
      <div style={revela(frame, 0)}><Rotulo>{def.rotulo}</Rotulo></div>
      <CardVidro style={{marginTop: 40}}>antes</CardVidro>
      <CardVidro destaque={p} style={{marginTop: 24, opacity: p}}>depois</CardVidro>
    </AbsoluteFill>
  );
};
```

Registre em `Video.tsx` (acrescente `comparacao: Comparacao` no `Object.assign(REGISTRO, ...)`), adicione o tipo em
`cenas/tipos.ts` se quiser checagem, e use `{"tipo": "comparacao", ...}` no `cenas.json`.
Para um vídeo de fundo (talking head, screencast), use `<OffthreadVideo src={staticFile(...)} />`
com `startFrom` em frames. Para alternar frase e orador sem perder a sincronia labial,
corte o vídeo com os mesmos trechos da voz (`blocos.json`, mesmo `tempo`) para que o
frame N do arquivo seja o frame N da timeline, e comece cada cena do orador no frame
absoluto dela (`ini`).

## 7. Comandos

```bash
npx tsc --noEmit                                   # sempre antes de renderizar
node scripts/stills.mjs qa/stills 0 45 120 300     # frames avulsos (rápido)
npx remotion studio                                # preview interativo (anote o PID e feche ao terminar)
npx remotion render Video out/video.mp4 --codec h264 --video-bitrate 10M --concurrency 2 --audio-codec aac --audio-bitrate 192k
```

`--concurrency`: ~1 por 6-8 GB de RAM livre (16 GB -> 2). Se o render travar ou a
máquina engasgar, baixe para 1. O bundle e o Chrome headless saem sozinhos ao fim do
render; confira com `processos.py --listar`.

## 8. Capturar prints

App web/local com Playwright (Node), resolução de tela de notebook em DPR 2:

```js
// capturar.mjs  (npm i -D playwright && npx playwright install chromium)
import {chromium} from 'playwright';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({viewport: {width: 1600, height: 1000}, deviceScaleFactor: 2});
  await page.goto(process.argv[2], {waitUntil: 'networkidle'});
  await page.screenshot({path: process.argv[3]});
} finally {
  await browser.close(); // sempre: não deixe Chrome headless aberto
}
```

Com o Playwright MCP: `browser_resize` para 1600x1000, navegar, `browser_take_screenshot`,
e `browser_close` ao terminar. Salve como `NN-nome-raw.png`, borre com `borrar.py` para
`NN-nome.png` e confira o resultado abrindo a imagem.

## 9. Estilo padrão: receitas

Valores a 30 fps, medidos quadro a quadro nas referências analisadas em out/2026. Todos
saem de `MOLAS` em `theme.ts`; mude lá para mudar o vídeo inteiro.

| Elemento | Receita |
|---|---|
| entrada de UI (janela, card, linha, tile) | `spring({damping: 200}, durationInFrames: 6)`: opacidade 0 -> 1, escala .94 -> 1, sobe 20 px, blur 6 -> 0 (`entraUI`). Itens em stagger de 2 frames; blocos da janela de 3 em 3 |
| badge/chip trocando de estado | `spring({damping: 14, stiffness: 220, mass: .6})`, escala .8 -> 1 (leve overshoot) |
| carimbo | `spring({stiffness: 400, damping: 18, mass: .6})`, escala 1,6 -> 1, rotação -7°; flash da cor 0,28 -> 0 em 3 frames; tremor de câmera 4 frames (amplitude 9 px caindo); SFX de impacto no mesmo `em`. Texto se ajusta para caber em 84% da largura |
| câmera virtual | `spring({damping: 200, mass: 1.2}, durationInFrames: 16)` de chave em chave; afastar = `cameraInicial: {escala: 1.1-1.2}` + `camera: [{em, escala: 1}]`; aproximar = escala 1,04-1,15 |
| motion blur | `CameraMotionBlur shutterAngle 180, samples 6`, ligado só enquanto a mola da câmera < 0,985. Medido: +4 s num trecho de 3,2 s com 16 frames de câmera em movimento (concorrência 2); nos frames parados não custa nada |
| camadas 3D | `perspective 2000`, `rotateY(-24° ± 4°) rotateX(8°)` girando devagar; explodir/juntar `spring({damping: 200}, 8 frames)`; passo por camada: Z 130 px, X 34 px, Y -26 px. Chips das camadas de trás só aparecem explodidas |
| chão de grade | plano `rotateX(72°)`, origem na borda de baixo, `perspective 800`, células de 90 px andando 1,2 px/frame, máscara que some no horizonte |
| bento | tiles em stagger de 3 frames com `entraUI(.., 24)`; conectores (2 pontos) acendem 4 frames depois do par; `acende` dá pulso de 12 frames; encaixe do tile: 8 frames com `easingEncaixe`, os outros tiles entram 2 frames depois |
| encaixe | `Easing.bezier(0.2, 0, 0, 1)`, 6-8 frames; interpola x, y, largura, altura e raio; conteúdo escala uniforme (sem distorcer texto) |
| texto por palavra | `spring({damping: 200}, 8 frames)`, atraso 2 frames por palavra: sobe 30 px, escala .9 -> 1, blur 8 -> 0 |
| texto por letra | idem, atraso 1 frame por letra: escala .6 -> 1 + blur (~10 frames numa palavra de 8 letras) |
| texto por máscara | linha sobe de 110% para 0 dentro de `overflow: hidden` em 6 frames (`damping 200`); padrão do papel número/estreita |
| contador | `interpolate` com `Easing.out(Easing.cubic)` em 30-45 frames (ou até `ateEm`); separador de milhar do locale |
| gradiente em texto | `background-image` + `background-clip: text` + `color: transparent`; brilho com `filter: drop-shadow(0 0 .22em cor)` (no claro: sombra curta e fraca) |
| contorno | `-webkit-text-stroke` + `paint-order: stroke fill` com o miolo na cor do fundo (esconde os contornos internos que fontes variáveis sobrepõem) |
| letreiro | duas linhas, 4 px/frame, a de baixo em sentido oposto e só contorno; texto repetido 8x (sem módulo, não "pula") |
| LinhaSVG | `pathLength 1` + `strokeDashoffset` 1 -> 0 em 30 frames (ECG) ou 3 frames (rachadura); `planaEm` troca para reta na cor de problema |
| barra de capítulos | segmento do capítulo atual enche linearmente até o próximo; concluídos cheios na cor (`problema` sólido, solução em gradiente) |
| legenda em caixa | 58 px (~3% de 1920), frase da página visível; não dita em cinza, dita em branco, ativa no acento com brilho; sombra dura de 7 px com o gradiente do acento; troca de página em corte (some em 80 ms) |

Área útil: `AREA.topo` (abaixo do HUD) até `AREA.base` (acima da legenda em caixa). Com
`hud.quadro45`, o conteúdo fica no 4:5 central (y 285 a 1635 no 9:16) e sobrevive ao corte
do feed.

Stills de conferência: `node scripts/stills.mjs qa/stills <frames>` (1 bundle, ~3 s por
frame). Olhe cada componente nas duas variantes antes do render completo.

## 10. Recorte do apresentador (texto atrás da pessoa)

Medido em 2026-10-19 (16 GB, outra renderização rodando junto): `birefnet-portrait` em 1080p
com `--regiao` ficou em ~55 s por quadro e 7,4 GB de RAM; foi abortado. Nessa máquina, com
outra coisa pesada rodando, dispense o recorte (títulos acima da cabeça, `y` ~0,11 com
`enquadramento.desce`) ou teste antes 30 quadros com `u2net_human_seg`.

Só com rosto filmado. O empilhamento é fixo: fundo (vídeo original) -> texto/letreiro/janela
-> pessoa recortada (`<OffthreadVideo transparent>`). Fluxo:

1. Corte o vídeo do apresentador com os mesmos trechos e o mesmo `tempo` da voz (frame N do
   arquivo = frame N da timeline).
2. Gere o recorte com alfa (OPCIONAL, pesado):

```bash
pip install "rembg[cpu]"     # uma vez; rembg[gpu] se houver GPU
python -E -P <skill>/scripts/recortar_orador.py public/orador.mp4 public/orador-alfa.webm --regiao 0.33,0,0.5,1
# -E -P (não -I) quando o rembg está no site do usuário; modelo padrão u2net_human_seg (~1 GB de RAM).
# --modelo birefnet-portrait só com GPU ou 32 GB+: ~970 MB, ~7,5 GB de RAM na CPU e muito mais lento.
# só um trecho (mais rápido): --de 12.0 --ate 18.5  -> na cena use "deRecorte" = frame de 12,0 s
```

   Saída: WebM VP9 `yuva420p` (lido pelo Remotion). `--prores` gera também `.mov` ProRes 4444.
   Os quadros vão por pipe (nada de PNG no disco) e o script confere no fim se o WebM tem um
   quadro para cada quadro lido; se não tiver, sai com ERRO (uma rodada antiga entregou 605 de
   1575 quadros sem aviso). Fonte 16:9 reenquadrada em 9:16: passe `--regiao x,y,l,a` (fração)
   com a fatia que aparece no vídeo e uma folga para punch-in e card (ex.: `0.30,0,0.55,1`); o
   arquivo continua do tamanho da entrada e o resto sai transparente.
   Custo na CPU: ~0,35-1,5 s por quadro com `u2net_human_seg` (medido: 1182 quadros em 512 s com
   `--regiao 0.33,0,0.5,1`, ~1 GB de RAM; o modelo é a parte cara; em
   notebook o tempo sobe com a temperatura). 1 min a 30 fps = 10-40 min: rode em segundo plano.
   Windows: se o serviço WMI travar, o import do onnxruntime fica parado sem erro; o script já
   contorna (desliga a consulta WMI do `platform`). Alternativas mais estáveis entre quadros:
   RobustVideoMatting ou BiRefNet em lote; o formato de saída é o mesmo.
3. Na cena: `{"tipo": "recorte", "video": "orador.mp4", "recorte": "orador-alfa.webm",
   "letreiro": {...}, "linhas": [...]}`. Sem os arquivos, a cena desenha uma silhueta de
   marcação para conferir o layout. Com vídeo e sem recorte, o texto fica por cima (sem
   profundidade).

Confira nos frames: borda do cabelo sem halo, texto atrás aparecendo dos dois lados da
cabeça, sincronia labial.

## 11. Ritmo: calmo x rajada

O vídeo alterna dois regimes:

| Regime | Duração | Como |
|---|---|---|
| calmo | cenas de 2-4 s | uma tela por cena, com algo mudando a cada 0,5-1 s (estado, contador, carimbo, câmera) |
| rajada | 3-6 planos de ~0,7 s | cena `rajada` com `planos` em corte seco, nos picos da fala (lista de 3 passos, enumeração, "sem X, sem Y, sem Z") |

No `cenas.json`, a rajada é uma cena só:

```json
{"id": "passos", "tipo": "rajada", "inicio": "bloco:passos", "planos": [
  {"tipo": "frase", "em": "bloco:passos", "linhas": [{"texto": "3 passos", "papel": "estreita"}]},
  {"tipo": "frase", "em": "mapeia-150", "rotulo": "passo 01", "linhas": [{"texto": "*Mapeia*", "papel": "numero", "entrada": "letra"}]},
  {"tipo": "recorte", "em": "conecta-150", "video": "orador.mp4", "zoom": 1.35}
]}
```

Sem `em`, os planos entram a cada `passo_ms` (700). Com filmagem, intercale o orador em
zoom 1,0 e 1,35 (simula câmera B). Uma ou duas rajadas por minuto; o resto em corte seco
entre cenas calmas. Som: UM efeito para a rajada inteira (ou nenhum), nunca um por plano.

## 12. Talking head

Projeto com `novo_projeto.py --modelo orador`. Entrada: `public/orador.mp4` e `public/voz.wav`
saídos do `cortar_video.py` (mesmo plano de cortes, frame N do vídeo = frame N da timeline) e,
opcional, `public/orador-alfa.webm` do `recortar_orador.py`. Sem os arquivos, as cenas
desenham uma silhueta de marcação para conferir o layout.

### Enquadramento (`config.orador.enquadramento` ou `enquadramento` da cena)

| Campo | Efeito |
|---|---|
| `x`, `y` | posição do recorte (object-position 0-1); com fonte 16:9 em 9:16, `x` escolhe a fatia horizontal |
| `zoom` | escala sobre o "cobrir a tela" (1 = só cobre; 1,1-1,3 fecha no rosto) |
| `foco` | altura do rosto (0-1), origem do zoom e do punch-in; `0` = zoom a partir do topo |
| `desce` | abre espaço acima da cabeça (fração da altura): o vídeo de fundo desce e a borda funde com o fundo de grade em 12% da altura; a pessoa recortada desce junto, nítida. Para fonte 16:9 sem respiro: 0,10-0,18 |

Testado com fonte 1920x1080 a 59,94 fps: `{"x": 0.53, "zoom": 1.1, "foco": 0, "desce": 0.12}`.
`duelo` e `letterbox` usam só o `enquadramento` da própria cena (janela 16:9).

### Cena `orador`: receitas (anúncios analisados em out/2026, 30 fps)

| Elemento | Receita |
|---|---|
| punch-in | `punch: [{em, escala: 1.12, ate?}]`; `spring({damping: 200}, 12 frames)` de chave em chave, origem no `foco` |
| preto e branco | `pb: [{de, ate}]`: `grayscale` 0 -> 1 em 6 frames, volta em 8, `contrast(1 + .1g)`; títulos do trecho em branco puro (`"pb": true`) |
| orador vira card | `card: {em, ate?, ret?}`: interpola x, y, largura, altura e raio da tela cheia até o card (padrão canto inferior direito, 40% da largura, raio 28) com `spring({damping: 200}, 10 frames)`; borda no acento com glow; a legenda vai para a esquerda enquanto o card está ativo |
| RAW -> EDITADO | `raw: {em, editadoEm, rotulo, rotuloFinal, moldura?}`: xadrez de transparência (`conic-gradient`, célula 64 px) atrás da pessoa, moldura tracejada com 8 alças, etiqueta clara; no `editadoEm` o xadrez some em 6 frames, a etiqueta troca para "✓ ..." no gradiente do acento com pop `{damping 14, stiffness 220, mass .6}` e sai 1,2 s depois. Sem recorte, o vídeo encolhe para dentro da moldura e volta a cobrir a tela na edição |

Cada bloco do roteiro pode ser uma cena `orador` (corte seco): o vídeo não pula, porque cada
cena começa o arquivo em `trimBefore = ini`.

### Sobreposições (`sobre`)

Cada item: `{tipo, em, ate?, camada?}`. Entra ~3 frames antes da palavra; em `ate` sai com
opacidade, blur 8 px e sobe 10 px em 6 frames. `camada: "atras"` fica entre o fundo e a
pessoa (exige o recorte; sem ele, fica por cima, então posicione acima da cabeça).

| tipo | campos | camada | receita |
|---|---|---|---|
| `titulo` | `rotulo?`, `linha1?`, `linha2?`, `y?` (0,10), `tam?`, `pb?`, `riscaEm?` | atrás | linha 1 Plus Jakarta 800 104 px desce de -20 px com blur em 4 frames; linha 2 Big Shoulders 800 196 px, gradiente branco -> acento, entra 3 frames depois com `scaleY 1,3 -> 1` e blur em 5 frames |
| `riscado` | os do `titulo` | atrás | igual + barra na linha 2: `scaleX 0 -> 1` em 8 frames (`Easing.out(cubic)`), -3°, cor de problema com glow (padrão 10 frames depois da entrada, ou `riscaEm`) |
| `numero` | `valores[{v, em}]`, `prefixo?`, `sufixo?`, `rotulo?`, `y?`, `tam?`, `casas?` | atrás | Unbounded 800 330 px; a cada valor, o antigo sobe (0 -> -60%) e some com blur 6 px, o novo sobe de 60% -> 0, os dois em 6 frames com `bezier(.2, 0, 0, 1)`, sobrepostos |
| `chips` | `itens[{texto, em}]`, `y?` (0,6), `numerar?` | frente | chips numerados ligados por traço; pop `spring({damping: 12, stiffness: 260})` 0,6 -> 1; o último aceso fica sólido no gradiente do acento. Esconda a legenda na cena (`"legenda": "oculta"`) para não repetir as palavras |
| `objecoes` | `rotulo?`, `total?`, `checks[refs]`, `y?`, `cor?` | frente | HUD no topo: círculos 46 px; no check, fundo na cor, traço do check 20 -> 0 em 6 frames, escala 0,6 -> 1 com spring 12/260 |
| `comando` | `texto`, `rotulo?`, `feitoEm?`, `rotuloFeito?`, `y?` (0,66) | frente | caixa escura "COMANDO › texto█": 1,5 caractere por frame (~45/s), cursor em bloco piscando a cada 15 frames; em `feitoEm` o rótulo vira "COMANDO · FEITO" com check |
| `rec` | `estado?` (rec), `rotulo?`, `capitulos?[{em, texto}]`, `inicioTimecode?`, `y?` | frente | "● REC [BRUTO] 00:00:SS:FF" (bolinha piscando a cada 6 frames) + capítulo à direita trocando com crossfade de 4 frames. Não use junto com título no topo (colidem) |
| `passos` | `rotulo?`, `titulo` ("linha" e "*linha*" separadas por barra vertical), `itens[{titulo, sub?, icone?, em}]`, `y?`, `iconeGrande?` | frente | com `card` na cena: coluna à esquerda (título 92 px, itens com tile de ícone 84 px); item ativo pelo marco ganha caixa de vidro no acento, os outros a 42%; tile grande do ícone ativo com 2 anéis pulsando `1 + .03 sin(f/10)` |
| `cards` | `itens[{numero?, titulo, sub?}]`, `y?` | frente | 2-3 cards 290x450, borda branca 4 px, ±8°; sobem 80 px girando 6° a mais com `spring({damping: 16, stiffness: 180})`, stagger 4; flutuam `sin(f/20) * 6` |
| `pill` | `texto`, `icone?` (arrowDown), `y?` (0,68) | frente | pill com gradiente do acento (exceção documentada à regra da pill de contorno: no talking head o CTA é o único elemento sólido), pop 14/220, glow pulsando |
| `final` | `marca`, `rotulo?`, `slogan?`, `url?` | frente | tela cheia escura com halo; marca por máscara, slogan, endereço, seta para baixo; a legenda some sozinha. Use `config.extra_fim_s` (1-1,5 s) |

`cenas_check.py` mede o texto parado de cada sobreposição de texto (do `em` ao `ate` ou ao fim
da cena); HUD (`rec`, `objecoes`, `pill`, `final`) e `passos` ficam de fora.

### Legenda que não repete a tela (regra 2)

`src/textoTela.ts` levanta do `cenas.json` toda janela de texto de tela (chaves `texto`,
`texto2`, `linha1`, `linha2`, `rotulo`, `titulo`, `sub`, `marca`, `slogan`, `principal`,
`prefixo`, `sufixo`, `rodape`, do `em` do item até o `ate` dele ou o fim da cena) e as palavras
significativas (3+ letras fora das vazias, sem acento, plural simples tirado, hífen quebra:
"super-heróis" casa com "super-herói"). Em cada frame, a página da legenda (2-4 palavras) que
tiver palavra já escrita na tela some. `"legenda_repete": true` no config desliga. O
`cenas_check.py` faz a mesma conta e lista as páginas ocultas.

### Legenda fantasma

`legenda_estilo: "fantasma"`: a página inteira (2-4 palavras do `legendas.py`) aparece a 15%;
cada palavra acende quando é dita (opacidade 0,15 -> 1, sobe 12 px, blur 4 -> 0,
`spring({damping: 200}, 3 frames)`). Destaque no acento clareado: `legendas.py --destaques
"a,b"` ou `config.legenda_destaques`. Plus Jakarta Sans 800, 62 px, sombra suave, sem caixa.
Posição por cena (`legenda`): `rosto` (y 60%, padrão do orador), `esquerda` (com o card),
`base`, `oculta`, ou um y 0-1; aceita lista `[{em, pos}]`. A legenda em caixa continua o
padrão do motion puro.

### Duelo, letterbox e painel 3D

- `duelo`: fundo claro, título em caixa alta, dois players 16:9 (raio 26) com ícone, nome e
  placar (o líder ganha a cor e o anel); `lados[].pb` deixa um lado em P&B; `lados[].legenda`
  vira etiqueta no canto do player. Legenda fantasma padrão em y 0,84 (dentro do 2º player).
- `letterbox`: faixa clara com título condensado (o tamanho se ajusta à largura), selo de
  ícone + 2 linhas, vídeo 16:9 em y 37%, rodapé opcional (`*trecho*` no acento escurecido).
  Reaproveita gravação horizontal sem reenquadrar.
- Painel de editor/assistente: cena `telaViva` com `tela.perspectiva` e blocos `colunas` ->
  `video` + `chat`, mais `timeline`. A janela gira de 28° para 0 em 18 frames.

### Teaser e volta (cold open / flash-forward)

Estrutura e regras: `roteiros-e-ganchos.md`, seção 3.E. Exemplo: `references/teaser.example.json`.
O `cortar_video.py` monta `orador.mp4` e `voz.wav` como `[teaser][volta][corpo]` e grava os blocos
`teaser`, `volta`, `payoff` (onde a frase do teaser reaparece no corpo).

| Cena | Campos | Comportamento |
|---|---|---|
| `teaser` | `rotulo`, `grao` (0,35), `tremor` (0), `vinheta` (0,6), `pb` (1), `aproxima` (0,05), `punch`, `video`, `de`, `enquadramento` | orador em P&B com contraste +18%, grão de filme animado (feTurbulence, semente por frame), tremor de câmera na mão (muda a cada 2 frames, ~3 px com `tremor: 1`), zoom lento, chip "▶▶ rótulo" no topo piscando a cada 0,5 s. Legenda fantasma na posição `rosto` |
| `volta` | `de` ("bloco:payoff"), `ate` (fim da cena), `rotulo` ("REW"), `forca` (1), `pbInicial` (1), `enquadramento` | rebobina o `orador.mp4` do payoff até o 1º quadro do corpo com easing in-out cúbico (cada frame mostra `trimBefore = fonte - frame`); defeitos VHS com intensidade em sino (pico no meio): deslocamento e skew por frame, aberração cromática (filtro SVG, 3-12 px), scanlines, 2 faixas de tracking, grão; OSD "◀◀ REW" e contador regressivo mm:ss; P&B 1 -> 0,8 -> 0 (cor volta em 92%); flash branco de 0,5 nos 3 últimos frames. Legenda oculta |

Efeitos reaproveitáveis em `comp/Fita.tsx`: `Grao`, `Vinheta`, `Scanlines`, `Tracking`,
`FiltroRGB`, `Triangulos` (ícone de rebobinar/avançar desenhado em SVG), `OSD`, `tremor()`.

## 13. Técnica avançada (não implementada): HUD de visão computacional

Visto em anúncios analisados em out/2026: caixas de detecção com rótulo e confiança, mapa de
profundidade colorido com escala "perto/longe", contagem de pontos, esqueleto da mão com 21
pontos e objetos presos à mão. Não vem no template porque exige pré-processamento pesado e
dependências opcionais. O caminho, se o cliente pedir:

1. Pré-processar fora do Remotion, sobre o `orador.mp4` já cortado (para os quadros baterem):
   MediaPipe Hands/Pose (landmarks por quadro, exportar JSON `[{frame, pontos: [[x, y], ...]}]`)
   e Depth Anything (mapa de profundidade como vídeo em tons de cinza, mesmo fps).
2. No Remotion: importar o JSON e desenhar com SVG `<circle>`/`<line>` no `useCurrentFrame()`;
   o mapa de profundidade entra como `<OffthreadVideo>` com `mixBlendMode: 'screen'` e um filtro
   de cor.
3. Caixas de detecção: `border: 1px solid` no acento, rótulo mono 16 px, número com count-up.
4. Custo: MediaPipe roda em CPU em tempo real; Depth Anything em CPU leva segundos por quadro
   (use GPU ou só o trecho que aparece). Confira a licença de cada modelo antes (ver `licencas.md`).
