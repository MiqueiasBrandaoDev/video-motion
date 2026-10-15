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

## 1. Estrutura

```
<projeto>/
  cortes.json              plano de edição da voz (cortar.py)
  marcos.spec.json         palavra -> marco (legendas.py)
  pesquisa.md, storyboard.md
  public/  voz.wav, mix.wav, prints/, musica/ (+LICENCA.md), sfx/ (+LICENCA.md)
  src/
    theme.ts               tokens, fontes, formato, área segura, helpers de movimento
    tempo.ts               referências de tempo -> frame, duração, batidas
    Root.tsx, Video.tsx    composição "Video" e montagem das cenas
    comp/                  estilo padrão: Palco (câmera, Carimbo, Flash, tremor), TelaViva, Camadas3D
                           (+ChaoGrade), GradeBento (+CardHalo), Encaixe, Tipografia (TextoMisto,
                           RotuloMono, Chip), Hud (BarraCapitulos, TituloFixo, Quadro45), Efeitos
                           (Letreiro, LinhaSVG), Recorte, FundoGrade, Legendas (LegendaCaixa)
                           clássico: CardVidro (+Rotulo, TextoMarcado), Print, Legendas, Contador,
                           Pill (+FaixaPills), Cursor, Terminal, Cta, Icone, Transicoes
    cenas/                 Kit (frase, telaViva, camadas, bento, letreiro, linha, recorte, rajada),
                           Titulo, Numeros, PrintCena, Outras, tipos.ts, registro.ts
    data/                  config, cenas, prints, marcos, blocos, legendas, batidas, sfx (.json)
  scripts/stills.mjs       frames avulsos em PNG
  work/ out/ qa/ downloads/  (fora do git)
```

`config.json`: `formato` (9:16 | 16:9 | 1:1), `fps`, `variante`, `acento`, `acento2`,
`problema`, `duracao_s` (quando não há voz), `audio` (arquivo em public/, ex. `mix.wav`),
`puxar_para_batida`, `legendas`, `legenda_estilo` (caixa | grande), `fundo` (`halos`, `chao`,
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
| `recorte` / `orador` | `video?`, `recorte?`, `de?`, `deRecorte?`, `zoom?`, `letreiro?`, `linhas?` | apresentador com texto atrás |
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

Só com rosto filmado. O empilhamento é fixo: fundo (vídeo original) -> texto/letreiro/janela
-> pessoa recortada (`<OffthreadVideo transparent>`). Fluxo:

1. Corte o vídeo do apresentador com os mesmos trechos e o mesmo `tempo` da voz (frame N do
   arquivo = frame N da timeline).
2. Gere o recorte com alfa (OPCIONAL, pesado):

```bash
pip install "rembg[cpu]"     # uma vez; rembg[gpu] se houver GPU
python -I <skill>/scripts/recortar_orador.py public/orador.mp4 public/orador-alfa.webm --modelo birefnet-portrait
# só um trecho (mais rápido): --de 12.0 --ate 18.5  -> na cena use "deRecorte" = frame de 12,0 s
```

   Saída: WebM VP9 `yuva420p` (lido pelo Remotion). `--prores` gera também `.mov` ProRes 4444.
   Custo na CPU: ~0,3-1,5 s por quadro em 1080x1920. Alternativas mais estáveis entre quadros:
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
