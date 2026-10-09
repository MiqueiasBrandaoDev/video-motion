# Remotion: padrões do template (fase 7)

## Índice
1. Estrutura do projeto
2. Sincronia: referências de tempo
3. `cenas.json`: tipos prontos
4. `prints.json`: janela, zoom, destaque, tampar, clique
5. Componentes
6. Cena sob medida
7. Comandos (studio, typecheck, stills, render)
8. Capturar prints

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
    comp/                  FundoGrade, CardVidro (+Rotulo, TextoMarcado), Print, Legendas,
                           Contador, Pill (+FaixaPills), Cursor, Terminal, Cta, Icone, Transicoes
    cenas/                 Titulo, Numeros, PrintCena, Outras (TerminalCena, Pills, CtaCena), tipos.ts
    data/                  config, cenas, prints, marcos, blocos, legendas, batidas, sfx (.json)
  scripts/stills.mjs       frames avulsos em PNG
  work/ out/ qa/ downloads/  (fora do git)
```

`config.json`: `formato` (9:16 | 16:9 | 1:1), `fps`, `variante`, `acento`, `duracao_s`
(quando não há voz), `audio` (arquivo em public/, ex. `mix.wav`), `puxar_para_batida`,
`legendas`.

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

Cada cena dura até o início da próxima (6 frames de sobreposição com blur). `wipe: true`
marca troca de bloco com a faixa de luz. Em textos, `*trecho*` sai no acento.

| tipo | campos | uso |
|---|---|---|
| `titulo` | `linhas[{texto, em?, tam?}]`, `rotulo?`, `alinhar?` | gancho, tipografia cinética, vídeo sem voz |
| `numeros` | `itens[{valor, casas?, prefixo?, sufixo?, rotulo, icone?, em}]`, `legenda?` | punch-in de número com contagem |
| `print` | `janela?` (padrão = id), `apoio?[{rotulo, icone, em}]` | print real com câmera |
| `terminal` | `titulo?`, `linhas[{texto, em, tipo: cmd/saida/ok, icone?}]` | CLI, passos de um agente |
| `pills` | `titulo?`, `itens[{rotulo, icone, em}]` | lista de benefícios/recursos |
| `cta` | `principal`, `em?`, `pill?{texto, icone, em}`, `rotulo?` | chamada final |

Todos aceitam `id`, `inicio`, `rotulo`, `wipe`.

Duração de cena de texto: o intervalo entre duas mudanças na tela (início da cena,
cada `em`/`risco`/`ate`/`escreveEm`) não passa de ~2,5 s; a cena inteira de texto
idealmente fica em ~1,5-2 s quando há orador filmado. Cena longa vira várias cenas
curtas intercaladas com o orador. Cena sob medida que mostra o orador: use um tipo
`filmagem`/`orador`/`video` ou marque `"orador": true` para o validador:

```bash
python -I <skill>/scripts/cenas_check.py --projeto <pasta-do-video> --orador filmagem --limite 2.5
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
| `FundoGrade` | `celula?`, `halo?[x,y]`, `drift?` |
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
(spring leve), `revela(frame, ini)` (estilo de entrada), `px(v)` (escala por formato),
`alfa(hex, a)`, `tonalidade(hex, f)`, `fmt(v, casas)` (número no locale),
`LIMITE_CONTEUDO` (y máximo de conteúdo, acima da legenda).

Movimento: spring `damping 14, stiffness 160` para entradas; punch-in de número
`damping 11, stiffness 170` saindo de escala 1,3; easing `bezier(0.16, 1, 0.3, 1)`.
Transição entre cenas: 9-12 frames com blur. Nada linear seco, nada acima de ~0,7 s.

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

Registre em `Video.tsx` (acrescente `comparacao: Comparacao` no objeto `REGISTRO`), adicione o tipo em
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
