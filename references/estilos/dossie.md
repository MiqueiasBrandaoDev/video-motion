# Ficha de estilo: dossiê

`ficha de estilo` · motion puro com locução · medido em 26/10/2026 · fase 3 (direção visual): sobrescreve o estilo padrão só nos pontos da seção 9; o resto da skill continua valendo

## 1. Identificação

| Campo | Valor |
|---|---|
| O que é | explicador de dados com locução contínua e sem rosto filmado: texto editorial no topo à esquerda, o dado vira objeto que se constrói no marco da palavra (contador, barras, colunas, mapa por região, grade de pontos, hemiciclo) e objetos de arquivo pontuam os blocos (carimbo de tinta, foto presa com fita, relógio, calendário), sobre fundo de papel cinza com grade |
| Quando usar | conteúdo com números e dois lados em disputa: política e eleição, economia, placar entre partidos, empresas ou times, "os números contam outra história"; 60-110 s; nicho que lê bem como jornalístico ou de arquivo |
| Quando não usar | talking head ou peça em que o rosto é o protagonista; demo de produto ou app (use `telaViva`); conteúdo sem dado para construir na tela; marca que exige fundo escuro ou cor saturada (o cinza médio é parte do estilo); vídeo abaixo de ~15 s (cena média de 7,8 s: cabem 2) |
| Referência | https://www.instagram.com/p/De8acOctc1d/ · @politicaemfocobrs · publicado em 26/10/2026 · 109,58 s · 1080x1920 · 24 fps |
| Método | análise de 26/10/2026: frames a cada 0,5 s, rajadas de 12-24 fps nas transições, whisper-1 por palavra (±0,3 s), ebur128, espectrograma. Tempos medidos a 24 fps e convertidos para 30 fps (x 1,25, arredondado); a 24 fps aparece entre colchetes quando importa |
| Não copiar | pessoas, fotos, prints de veículo, textos de tela, nomes. Fica a técnica |

## 2. Assinaturas

1. Fundo de dossiê: papel cinza `#B6B4B2` com grade escura de 138 px, folhas coladas, poeira e vinheta, derivando ~13 px/s sem parar.
2. Texto editorial no topo à esquerda: lead-in leve e cinza + palavra black (ou dado em condensada na cor do lado); sem legenda da fala.
3. Tudo entra por foco (desfocado -> nítido em 5-6 frames, sem deslocamento); a cena sai por desfoque total, fica 1-10 frames de fundo vazio e a seguinte remonta peça a peça.
4. Duas cores de lado com o mesmo peso (vermelho `#A93C2F` x azul `#284F90`) sobre neutros quentes; passado em cinza `#676763`; pessoas só em foto P&B recortada.
5. O dado vira objeto no marco da palavra (contador em S de 1-1,2 s, barras, colunas, mapa com mergulho, grade de pontos, hemiciclo), pontuado por carimbo de tinta e, nas viradas, clarão + trilha cortada + impacto grave.

## 3. Tokens

### Cor

| Token | Hex medido | Papel |
|---|---|---|
| fundo, centro | `#B6B4B2` | cinza papel quente (mediana do centro do quadro) |
| fundo, topo | `#B2B2AF` | luz de cima |
| fundo, base | `#777673` | escurece para baixo |
| cantos | `#797979` (sup. esq.), `#6D6C69` (inf. dir.) | vinheta: queda de ~35% de luminância nas bordas |
| papéis colados | `#C0BEBC` a `#D3D2D1` | folhas inclinadas e sobrepostas no fundo |
| grade | `#494745` | linha de ~2 px, célula de 138 px |
| poeira | branco | partículas de 3-8 px derivando |
| texto pesado | `#3A3A39` / `#2B2B29` | quase preto quente; nunca `#000` |
| texto leve | `#585857` / `#474746` | lead-in |
| lado A (vermelho tijolo) | texto `#A93C2F`, barra `#B33F2E`, mapa `#B7402F`, carimbo `#A23F3A` | variação de ±8 por canal entre usos |
| lado B (azul royal escuro) | texto `#284F90`, barra `#265295`, mapa `#285297`, pontos `#264F8F`, carimbo `#444E8A` (tinta lavada) | |
| passado | `#676763` | série histórica (anos anteriores) em cinza |
| caixa escura | `#323230` / `#333333` | pílula escura e caixa de CTA, raio ~10 px |
| branco de objeto | papel `#F4EFEC`, print `#F7F6F7`, relógio `#F3F2ED` | |
| marca d'água | `#EFECEA` | mais clara que o fundo |
| fotos | P&B, contraste alto (preto `#141416`) | pessoas e prédios sem cor |

Sem glow, sem halo colorido, sem gradiente em texto. A cor vem só das duas cores de lado.

### Tipografia (quadro 1080x1920)

Famílias prováveis são fontes do Windows; no projeto use o equivalente Google.

| Papel | Família provável -> Google | Peso | Tamanho (px e % da largura) | Tracking | Caixa | Cor |
|---|---|---|---|---|---|---|
| leve (lead-in) | Segoe UI Light -> Open Sans 300, Noto Sans 300 | 300 | 55-60 px (5,1-5,6%) nas cenas; ~100 px (9,3%) na abertura | 0 | frase normal | `#585857` / `#474746` |
| pesada (destaque) | Segoe UI Black -> Open Sans 800, Noto Sans 900, Nunito Sans 900 | 800-900 | 65-75 px (6,0-6,9%); 100-110 px (9,3-10,2%) na abertura | 0 | frase normal | `#3A3A39`, `#A93C2F`, `#284F90` |
| condensada (dado, título curto) | Bahnschrift SemiBold Condensed -> Barlow Condensed 600, Saira Condensed 600, Oswald 500 | 600 | ~140-150 px de corpo (13-13,9%); maiúscula de ~125 px na palavra de resposta | da fonte | frase normal; caixa alta nos carimbos | `#2B2B29`, `#284F90`, `#A93E2E` |
| número fino (placar) | Segoe UI Light -> Open Sans 300 | 300 | dígitos com 235 px de altura (~330 px de corpo, 30,6%); 315 px de largura por número | 0 | - | `#295295`, `#AA3F30` |
| marca d'água | Segoe UI regular/semibold -> Open Sans 600 | 500-600 | maiúscula de ~557 px (29% da altura); vaza as duas laterais | 0 | caixa alta | `#EFECEA` |
| rótulo de dado | Segoe UI -> Open Sans 400 | 400 | 40-45 px (3,7-4,2%) | 0 | frase normal | branco dentro da barra; `#242421` fora |
| rodapé editorial | Segoe UI Black -> Open Sans 800 | 800 | 45-50 px (4,2-4,6%) | 0 | frase normal | `#353333` |
| caixa digitada | Segoe UI -> Open Sans 400 | 400 | ~40 px (3,7%) | 0 | frase normal | branco sobre `#323230` |
| textura do fundo | Courier provável + cursiva | - | ~25 px | - | - | cinza escuro, baixa opacidade |

### Composição

| Item | Valor |
|---|---|
| Alinhamento | à esquerda, margem de 75-85 px (7-8% da largura) |
| Bloco de título | y 170-620 px (9-32% da altura); 1-5 palavras por linha; no máximo 2 linhas de topo por vez |
| Mídia (dado, foto, objeto) | terço central, y ≈ 600-1700 px |
| Rodapé | y 1734-1897 px na referência (zona de UI do Reels); na skill, base do texto em y ≈ 0,86 da altura |
| Hierarquia | linha leve e cinza (lead-in) + palavra pesada escura ou na cor do lado; o dado vai em condensada grande colorida. Contraste por peso (300 x 800-900) e cor, não por tamanho |
| Texto | editado (paráfrase curta), não transcreve a fala |
| Profundidade | sombra suave projetada para baixo, borda difusa, sob cartões, prints, calendário e mapa |

### Fundo

| Camada | Valor |
|---|---|
| Luz | gradiente vertical `#B2B2AF` (topo) -> `#B6B4B2` (centro) -> `#777673` (base) + vinheta de -35% nas bordas; sem halo colorido |
| Grade | `#494745`, ~2 px, célula 138 px |
| Colagem | folhas datilografadas e manuscritas, inclinadas e sobrepostas, `#C0BEBC`-`#D3D2D1`; texto de máquina de escrever e cursiva em baixa opacidade (escreva texto próprio, nunca o da referência) |
| Poeira | partículas brancas de 3-8 px |
| Deriva | 12-14 px/s em x e 7-9 px/s em y (0,40-0,47 e 0,23-0,30 px/frame a 30 fps); a direção muda por cena; grade e folhas podem andar em velocidades diferentes (paralaxe leve) |
| Grão | não confirmado |

## 4. Movimento

### Curvas (equivalência entre motores)

| Curva | Remotion | GSAP | CSS (`Easing.bezier` aceita os mesmos 4 números) |
|---|---|---|---|
| ease-out cúbico | `Easing.out(Easing.cubic)` | `power2.out` | `cubic-bezier(0.33, 1, 0.68, 1)` |
| ease-in cúbico | `Easing.in(Easing.cubic)` | `power2.in` | `cubic-bezier(0.32, 0, 0.67, 0)` |
| ease-out exponencial | `Easing.out(Easing.exp)` | `expo.out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| ease-out quadrático | `Easing.out(Easing.quad)` | `power1.out` | `cubic-bezier(0.5, 1, 0.89, 1)` |
| S suave (próximo de smoothstep) | `Easing.inOut(Easing.quad)` | `power1.inOut` | `cubic-bezier(0.45, 0, 0.55, 1)` |
| linear | `Easing.linear` | `none` | `linear` |

### Entradas, saídas e efeitos (30 fps; segundos para o `duration` do GSAP)

| Técnica | Frames [24 fps] | s | Como | Curva |
|---|---|---|---|---|
| entrada de texto (foco) | 5-6 [4-5] | 0,17-0,20 | desfoque -> nítido (1º frame ilegível, blur estimado ≥ 15-20 px) e opacidade 0 -> 1; sem translação nem escala | ease-out cúbico |
| saída de cena (desfoque total) | 5-6 [4-5] | 0,17-0,20 | a cena inteira desfoca e some; blur final não medido (a análise propõe 24 px) | ease-in cúbico |
| fundo vazio entre cenas | 1-10 [1-8] | 0,03-0,33 | só o fundo derivando; o mais longo, de 10 frames, antecede o bloco de tradução (seção 7) | - |
| remontagem | - | - | a cena seguinte entra peça a peça, cada peça no marco da sua palavra | - |
| troca parcial | 3-4 [3] | 0,10-0,13 | o miolo desfoca e troca; o título da sequência fica (1 vez, cobrindo 2 cenas) | ease-in cúbico |
| cartão-pessoa | cartão 1-3 [1-2]; recorte 8-9 [6-7] | 0,27-0,30 | cartão cinza aparece; a foto recortada sobe ~280 px saindo pela borda de cima do cartão; o deslocamento cai ~50% a cada 2 frames; na virada o cartão cresce de ~0,7 para 1,0 em 8-10 [6-8] frames | ease-out exponencial, sem overshoot |
| sublinhado do cartão | 5 [4] | 0,17 | cresce da esquerda | ease-out cúbico |
| clarão | 6-9 [5-7] | 0,20-0,30 | luma média 146 -> 204 de 255 (+58); pico no 1º-2º frame e decai. Equivale a branco a ~53% sobre o fundo (calculado: 58 / (255 - 146)). Sempre junto com trilha cortada e impacto grave (seção 6) | decaimento rápido (curva não medida; aproximação: ease-out exponencial) |
| carimbo | 5 [4] | 0,17 | escala por chave 1,89 -> 1,59 -> 1,26 -> 1,02 -> 1,00 em t = 0; 0,25; 0,5; 0,75; 1; opacidade baixa no 1º frame; rotação ~+3° (horário) | ease-out sem overshoot: use as 5 chaves (`interpolate` de 5 pontos; GSAP `keyframes`); aproximação: ease-out quadrático |
| contador | 30-36 [24-29] | 1,0-1,2 | lento, rápido, lento; vírgula decimal. Medido: aos 3%, 44% e 84% do tempo o valor estava em 4%, 48% e 94% do final | S suave |
| barra de apuração | ~30 [~24] | ~1,0 | enche 20%, 55% e 80% nos frames ≈ 3, 5 e 8 [2, 4, 6], cauda lenta até 100%; o rótulo conta junto | ease-out exponencial |
| barras horizontais e colunas | 12-15 | 0,4-0,5 | crescem da esquerda ou da base; rótulo e avatar por foco | ease-out cúbico |
| grade de pontos | segue o contador | ~1,0 | pontos acendem em ordem de leitura junto com o contador (valor a cada 2 frames [24 fps]: 6, 14, 25, 38, 52, 67, 81) | a do contador |
| mergulho no mapa | 11-13 [9-10] | 0,37-0,43 | escala ~1,0 -> ~1,9 acelerando, depois corte seco para o enquadramento ampliado já parado; regiões fora do foco a ~35% e dessaturadas; textos saem | ease-in cúbico + corte |
| destaque de região | 5-6 | 0,17-0,20 | a região acende na cor do lado com etiqueta-pílula, quando é dita | ease-out cúbico |
| calendário | 5 [4] | 0,17 | rotação -10° -> -5° -> -2° -> 0° + descida; clarão no frame anterior | ease-out (chaves medidas) |
| relógio | contínuo | - | ponteiro vermelho a 126°/s (4,2°/frame a 30 fps); o preto gira mais devagar (proporção não medida) | linear |
| lupa | contínuo | ~3,3 | atravessa o mapa do canto superior esquerdo ao inferior direito | contínuo (curva não medida) |
| foto ou print com fita | cartão 1; revelação 3-4 [2-3]; fita 2-3 [2] depois | ~0,2 | cartão cinza -> imagem revelada de baixo para cima -> 2 tiras de fita escura semitransparente nos cantos de cima, a ±40°, sem animação | corte |
| marca d'água | 7-8 [6] | 0,23-0,27 | fade da palavra gigante atrás de tudo | não medida |
| digitação | 0,63 car/frame (19 car/s); 0,47 car/frame (~14 car/s) nas caixas do CTA | - | cursor "\|" fino, sem pisca observado | linear |
| fade final | 6 [5] | 0,20 | para preto | linear |

### Câmera e o que não acontece

| Item | Valor |
|---|---|
| Câmera | sem câmera global, exceto o mergulho no mapa; o movimento contínuo vem da deriva do fundo |
| Não acontece | translação ou escala na entrada de texto; mola ou overshoot; cross-fade entre cenas (há fundo vazio no meio); corte seco entre cenas; motion blur (o desfoque é transição); glitch, distorção, tremor; flash colorido, tremor ou brilho no carimbo; halo ou glow; legenda da fala |

## 5. Ritmo

| Medida | Valor |
|---|---|
| Cenas | 14 em 109,6 s: uma troca a cada 7,8 s em média (mín. 2,6; máx. 12,8) |
| Trocas | 13 por desfoque total, 1 parcial com título fixo, 1 mergulho dentro da cena do mapa, fade final; nenhum corte seco |
| Elemento novo | ~100 entradas em 109,6 s: ~0,9/s, um a cada ~1,1 s |
| Maior trecho sem elemento novo | 2,5-2,6 s (3 vezes); o quadro nunca para (deriva do fundo e poeira) |
| Rosto x motion | sem rosto filmado; pessoas só em cartão-foto P&B (5 aparições) e 3 fotos de prédio |
| Fala | 281 palavras; 155 ppm brutos; 170 ppm sem as 20 pausas > 0,25 s (9,4 s no total); locução única e contínua |
| Gatilho | o elemento entra de -0,4 a +0,6 s em relação à palavra (-12 a +18 frames a 30 fps), mediana +0,1 s (+3 frames), dentro da precisão do whisper-1 (±0,3 s): a animação nasce no marco da palavra. Em enumeração, cada item acende quando é dito |
| Troca de cena | segue o fim da frase da locução; não há batida confirmada |

## 6. Som

| Item | Valor |
|---|---|
| Loudness | -14,1 LUFS integrado; LRA 2,4 LU; pico real -0,6 dBFS (compressão forte) |
| Voz | locução única; RMS de 50 ms: P50 -15,2 dBFS, P90 -9,9 dBFS |
| Trilha | provável fundo baixo (provável pad ou piano sustentado), 12-20 dB abaixo da voz (RMS -26 a -35 dBFS nas janelas quietas); BPM não confiável |
| Trilha cortada | nas 3 viradas a trilha some nos 0,35-0,45 s que antecedem o clarão (nível -37/-38 dBFS) e só sobra o grave de 60-114 Hz do impacto |
| Impactos graves | 30-90 Hz, ~15-20 em 110 s (um a cada 5,5-7,3 s): carimbos, barras e contadores, trocas e clarões, a palavra de resposta ao gancho (o mais forte: 21 dB acima da banda de voz). Vários com varredura descendente (sub drop) |
| Agudos curtos | 9 eventos de 0,1-0,7 s com pico estreito em 3,0-4,7 kHz; provável tique ou clique de UI, não confirmado |
| Digitação | sem som identificado |
| Na skill | `"perfil": "motion"`; `mixar.py --musica ... --musica-lufs` entre -24 e -27 (ponto de partida para 12-20 dB abaixo da voz, conferir no QA); impactos com o gerador de sub de `sound-design.md` |

## 7. Roteiro

Estrutura da referência (início do bloco em % da duração, medido):

| # | Bloco | Início | O que aparece |
|---|---|---|---|
| 1 | gancho-pergunta: afirmação + contradição ("A ganhou, mas B acabou?") | 0% | cartão-pessoa (até 2 sobrepostos) + 3 linhas por foco: leve, pesada colorida, condensada |
| 2 | método ("peguei os números") | 3% | digitação com cursor + mapa com lupa + rodapé |
| 3 | dado 1 (resultado) | 10% | barra de apuração + barras por lado + delta em contador |
| 4 | virada 1 ("do outro lado") | 19% | clarão + trilha cortada + número grande do lado B |
| 5 | dado 2 (série histórica) | 24% | colunas por ano (passado cinza, atual na cor) + carimbo de conclusão |
| 6 | dado 3 (geografia) | 34% | mapa por região + mergulho + regiões acendendo na fala |
| 7 | "ou seja" | 46% | placar de 2 números finos |
| 8 | "o maior problema" + virada 2 | 51-53% | cartão-pessoa; clarão; título fixo da sequência |
| 9 | dado 4 | 53% | print com fita + grade de pontos; depois hemiciclo |
| 10 | tradução ("traduzindo:") | 66% | fotos com fita + pílula + conector + carimbo |
| 11 | prazo | 74% | relógio + carimbo + caixa de pergunta |
| 12 | resposta ao gancho + virada 3 | 85% | marca d'água + palavra de resposta + clarão + calendário |
| 13 | CTA em 3 tempos: comentar, mandar para alguém, seguir | 90% | caixa escura digitando + pergunta + troca por desfoque |

Esqueletos (propostas a partir das proporções medidas; cada linha é uma cena ou um elemento no marco da fala):

| 15 s | Bloco | Elementos (≤ 2 s entre eles) |
|---|---|---|
| 0,0-3,0 | gancho-pergunta | cartão-pessoa (0,0) -> linha leve (0,0) -> palavra pesada colorida (0,5) -> linha 2 + 2º cartão (1,5) -> condensada (2,4) |
| 3,0-3,3 | virada | desfoque total -> clarão + impacto |
| 3,3-9,0 | dado | barras por lado (3,5; 5,0) -> colchete (6,5) -> delta em contador S de 1 s (7,0) -> linha de apoio leve (8,5) |
| 9,0-12,0 | conclusão | desfoque -> carimbo de tinta + impacto (9,5) -> rodapé (11,0) |
| 12,0-15,0 | CTA | caixa escura digitando (12,0) -> pergunta em 2 linhas (13,0; 14,0) -> fade final |

| 60 s | Bloco | Elementos principais |
|---|---|---|
| 0-3 | gancho-pergunta | cartão-pessoa + 3 linhas por foco |
| 3-6 | método | digitação + objeto com lupa + rodapé |
| 6-11,5 | dado 1 | barra de apuração + barras por lado + delta |
| 11,5 | virada 1 | clarão + trilha cortada + impacto |
| 11,5-20,5 | dado 2 | número grande + colunas por ano + carimbo |
| 20,5-28 | dado 3 | mapa por região + mergulho + regiões acendendo na fala |
| 28-30,5 | "ou seja" | placar de 2 números finos |
| 30,5-32 | "o maior problema" | cartão-pessoa |
| 32 | virada 2 | clarão; título fixo da sequência |
| 32-40 | dado 4 | foto/print com fita + grade de pontos ou hemiciclo |
| 40-44,5 | tradução | fotos com fita + pílula + conector + carimbo |
| 44,5-51 | prazo | relógio + carimbo + caixa de pergunta |
| 51-54,5 | resposta ao gancho | marca d'água + palavra de resposta + clarão (virada 3) + calendário |
| 54,5-60 | CTA | caixa escura digitando + pergunta + "manda para" + "segue" |

Limites por vídeo: 3 clarões e 3 carimbos em 110 s na referência; em 60 s, 2-3 de cada, sempre em conclusão de bloco ou virada.

## 8. Mapa para a skill

### O que já existe

| Técnica | Componente (nome exato) | Parâmetros sugeridos | O que falta |
|---|---|---|---|
| frase de topo em 2 pesos com destaque colorido | cena `frase` (`linhas[{texto, papel, em, entrada}]`, `alinhar: "esquerda"`, `vertical: "topo"`) + marcação do `TextoMisto` (`*lado B*` no acento, `~lado A~` no problema) | `gradiente: false`, `brilho: false`, `tam` para 55-75 px | papéis `leve`/`pesada` e cor plana (hoje `*...*` aplica gradiente e drop-shadow; `~...~`, drop-shadow); entrada `foco` |
| número que conta | `frase` com `numero{valor, de, casas, sufixo, ateEm}`, bloco `contador` da `telaViva`, `Contador` (cena `numeros`) | `ateEm` = marco + 1,0-1,2 s; `casas: 1` | curva em S (hoje `Easing.out(Easing.cubic)`); `frase.numero` força o papel `numero` (Unbounded) com brilho |
| dado em condensada | papel `estreita` (Big Shoulders 800) | - | família Barlow Condensed 600 e caixa normal (hoje caixa alta) |
| carimbo de conclusão | `carimbos` (`Carimbo` do `Palco`, `{texto, em, cor, rot, tam}`) | `cor: "acento"` ou `"problema"`, `rot: 3` | variante tinta (seção 8, abaixo) |
| clarão | `Flash` (`Palco.tsx`, `{at, cor, forca}`) | `cor: "#FFFFFF"`, `forca: 0.5` | hoje dura 3 frames fixos; pede 6-9 com decaimento |
| transição por desfoque | `transicao: "suave"` (`Cena` de `Transicoes.tsx`: entra 12 e sai 9 frames, blur 18/16 px, sobe 50 px) | só como aproximação | sem cross-fade, sem translação, saída 5-6 frames, fundo vazio de 1-10 frames |
| grade com deriva e vinheta | `FundoGrade` (`celula: 138`, `drift: true`, `halos: false`, `vinheta: true`), `config.variante: "clara"` | - | tom `#B6B4B2` (hoje `#F4F3EF`), linha `#494745`, deriva 0,40-0,47 px/frame (hoje 0,18 em x, 0,3 em y), folhas, poeira, luz de topo |
| paleta de 2 lados | modo Semântico: `config.acento` + `config.problema` | `acento: "#284F90"`, `problema: "#A93C2F"` | - (ver conflito de paleta) |
| conector | `LinhaSVG` forma `reta` | cor `#3A3A39`, traço 2-3 px | - |
| pílulas | `Chip` (`Tipografia.tsx`) | - | sem mono e sem caixa alta: `Pilula` |
| mergulho | `camera` / `cameraInicial` | - | a mola da câmera (damping 200, 16 frames) desacelera; o mergulho acelera e termina em corte |
| foto ou print | `Print` / `prints.json` | - | janela com câmera; o estilo pede foto colada com fita (`FotoFita`) |
| digitação | bloco `prompt` da `telaViva`, sobreposição `comando` (só na cena `orador`), `Terminal` | - | nenhum serve para texto solto: entrada `digita` |
| sem legenda | `config.legendas: false` | - | - |
| fade final | `Cena` (saída) | 6 frames para preto | - |

### A construir quando for usar

Valores medidos, salvo os marcados com (p), propostos na análise sem medida direta. Cada componente aceita `em` ancorado na fala, como o resto do `cenas.json`.

| Componente | O que faz | Parâmetros (30 fps) |
|---|---|---|
| `FundoDossie` (ou `FundoGrade` com `tom`, `linha`, `papeis`, `poeira`, `luzTopo`, `velocidade`) | papel cinza, grade escura, folhas coladas inclinadas, poeira, gradiente vertical e vinheta forte, tudo derivando | `tom` `#B6B4B2`; `celula` 138; `linha` `#494745` 2 px; `luzTopo` `#B2B2AF` -> base `#777673`; vinheta -35%; deriva 0,40-0,47 px/frame em x e 0,23-0,30 em y, direção sorteada por cena; folhas 6-10 a ±3-8° (p); poeira 40-60 pontos de 3-8 px (p) |
| entrada `foco` (em `TextoMisto` e `entraUI`) | desfoque -> nítido + opacidade, sem deslocamento | 5-6 frames; blur 20 -> 0 px; ease-out cúbico |
| `transicao: "desfoque"` | a cena inteira desfoca e some; fundo vazio; a seguinte remonta peça a peça; variante parcial com título fixo | saída 5-6 frames, blur 0 -> 24 px (p), ease-in cúbico; vazio de 1-10 frames; sem cross-fade |
| `Clarao` (ou `Flash` com `dur`) + `silencio` no `mixar.py` | clarão branco com decaimento + trilha cortada antes dele | branco a ~0,5 -> 0 em 6-9 frames; trilha cai a -37/-38 dBFS nos 0,35-0,45 s anteriores (duck de -25 dB (p)); impacto grave dentro do silêncio |
| papéis `leve` e `pesada` + cor plana | dois pesos da mesma humanista na mesma linha; cor do lado sem gradiente nem brilho | `leve` Open Sans 300 `#585857`; `pesada` Open Sans 800 `#3A3A39`; marcação `texto leve **pesado**` (p) |
| contador `curva: "s"` + papel `condensada` | count-up em S em condensada colorida | 30-36 frames, S suave; Barlow Condensed 600, ~140-150 px |
| carimbo `estilo: "tinta"` | moldura sem preenchimento, canto pouco arredondado, tinta com falhas, condensada caixa alta | 469-547 x 133-136 px (43-51% da largura); escala pelas 5 chaves em 5 frames; +3°; sem `Flash`, tremor, sombra ou brilho; impacto grave no mesmo `em` |
| `CartaoPessoa` | foto P&B recortada (PNG com alfa) sobre cartão cinza escuro, saindo pela borda de cima; sublinhado na cor do lado; até 2 lado a lado com ~20% de sobreposição | cartão fade de 1-3 frames; foto sobe 280 px em 8-9 frames, ease-out exponencial; escala 0,7 -> 1 opcional (virada); sublinhado 17 px x 41% da largura, cresce da esquerda em 5 frames; `grayscale(1) contrast(1.25)` (p) |
| `Avatar` | rosto P&B em círculo com anel na cor do lado (ou cinza escuro neutro) | 75-90 px; anel 4-6 px; entrada `foco` |
| `BarrasPlacar` | barra de apuração em contorno que enche com rótulo contando + barras horizontais por lado com avatar e rótulo branco interno + colchete + delta | apuração 965 x 93 px, ~30 frames, ease-out exponencial; barras 12-15 frames da esquerda; colchete por `foco`; delta no contador em S |
| `GraficoColunas` | colunas por ano, cada uma no marco do ano falado; passado `#676763`, atual na cor; avatar no topo, valor acima, ano em pílula clara | coluna 12-15 frames de baixo para cima, ease-out cúbico; avatar e valor por `foco` 3 frames depois (p) |
| `MapaUF` | mapa por região (malha com licença checada, ex. IBGE), 2 cores, divisas brancas, sombra; `mergulho`, `destaques[{regiao, em, rotulo}]`, `lupa` | 748 x 731 px; mergulho 11-13 frames, 1 -> 1,9, ease-in cúbico + corte; fora do foco a 35% e dessaturado; destaque `foco` 5-6 frames + etiqueta-pílula; lupa cruza em ~3,3 s |
| `GradePontos` | N pontos que acendem em ordem de leitura presos ao contador | ~121 pontos (12 x 10 + 1) em 937 x 693 px; ponto acende no frame em que o contador passa do índice dele (pop de 3 frames (p)) |
| `Hemiciclo` | assentos em arcos concêntricos; grupos coloridos a partir da esquerda | 81 assentos; cinza por padrão; grupo acende no marco com rótulo `foco` |
| `FotoFita` | foto ou print colado com 2 tiras de fita nos cantos de cima; sombra | cartão 1 frame -> revelação de baixo para cima 3-4 -> fitas 2-3 frames depois, sem animação; fita escura semitransparente a ±40° (cor `#2E2E2E` a 70% e 22% da largura do cartão (p)); print 783 x 295 px (72%) |
| `Relogio` | relógio analógico, ponteiros girando | ~312 px; ponteiro vermelho 4,2°/frame linear; aro escuro, mostrador `#F3F2ED` |
| `Calendario` | folha de calendário que cai girando | 326 x 361 px, cabeçalho vermelho; rotação -10° -> 0° + descida em 5 frames (descida de 40 px (p)); clarão no frame anterior opcional |
| `MarcaDagua` | palavra gigante clara atrás do conteúdo, vazando as laterais | maiúscula de ~557 px (29% da altura), `#EFECEA`, caixa alta, fade de 7-8 frames |
| entrada `digita` + `CaixaDigitada` | máquina de escrever com cursor fino para texto solto; caixa escura opcional (CTA) que desliza sobre a linha | 0,47-0,63 car/frame; cursor "\|" de ~3 px sem pisca; caixa `#323230`, raio 10 px, texto branco 40 px |
| `Pilula` (variante de `Chip`) | pílula sem mono e sem caixa alta | clara: cinza translúcido + texto escuro; escura: `#323230` + branco; texto 40 px em frase normal |
| camada `rodape` | frase-resumo editorial na base, independente da legenda | pesada 45-50 px, `#353333`, `foco`; base em y ≈ 0,86 da altura (fora da UI do Reels) |

## 9. Conflitos com as regras padrão

| Regra da skill | O estilo faz | Resolução |
|---|---|---|
| Regra 1: evento a cada 2 s no máximo | elemento novo a cada ~1,1 s, mas 3 trechos de 2,5-2,6 s | continua valendo: ponha avatar, pílula, sublinhado ou rótulo nesses trechos; a deriva do fundo não conta como evento (`cenas_check.py --eventos`) |
| Regra 2: nunca ler duas vezes | sem legenda; o texto de tela é paráfrase | continua valendo para card x card: nenhum texto repete o anterior |
| Regra 3: voltar para a pessoa (≤ 4 s sem rosto) | sem rosto filmado | não se aplica (o `cenas_check.py` só mede quando há cena de orador); o cartão-pessoa abre os blocos no lugar do rosto |
| Regra 4: fala a 1,3x | locução a 155 ppm brutos, 170 sem pausas | continua valendo para voz gravada (`cortar.py`, `tempo` ≥ 1,3) |
| Legenda (padrão `caixa` no motion puro) | nenhuma legenda da fala | sobrescreve: `config.legendas: false`; o texto editorial faz o papel |
| Densidade de SFX (`gerar_sfx.py`, perfil `motion`) | impactos são a maioria (~15-20 de ~24-29 eventos, contando os agudos prováveis) e pelo menos 4 pares a menos de 4 s (1,75-2,4 s, em volta das viradas) | `"perfil": "motion"` com `--min-gap-impacto 1.7` (menor intervalo medido: 1,75 s) e o AVISO de mais de 1/3 aceito; `rel_db` de impacto dentro de -20..-10 (fora é ERRO); o da resposta ao gancho no teto (-10). Continuam: 400 ms entre efeitos, nunca o mesmo arquivo seguido, carimbo sempre com impacto |
| Paleta (acento único ou Semântico com vermelho só na dor) | duas cores de lado com o mesmo peso | sobrescreve o sentido: `acento` = um lado, `problema` = o outro, os dois em texto, barra, mapa e carimbo. Continua: nenhuma terceira cor (o cinza do passado é neutro), nenhum gradiente arco-íris |
| Fundo e luz (grade `#08080A`/`#F4F3EF`, halos, glow, cards com halo) | papel cinza médio, sem halo nem glow | sobrescreve: `FundoDossie`; `halos: false`, `brilho: false`, `gradiente: false` em tudo |
| Transição (corte seco no kit; cross-fade na clássica) | desfoque total + fundo vazio + remontagem | sobrescreve: `transicao: "desfoque"` em todas as cenas |
| Texto de tela (frase de 2-6 palavras, grande, no centro; nada parado > 2,5 s) | topo à esquerda, 1-5 palavras por linha, 55-75 px; o título fica a cena inteira (até 12,8 s) enquanto o dado se monta embaixo | sobrescreve posição e tamanho; o título pode ficar a cena toda porque a cena muda a cada ≤ 2 s (o `cenas_check.py` mede o intervalo entre mudanças da cena e passa) |
| Tipografia em 4 papéis (Plus Jakarta 800, Unbounded, serifa itálica, mono) | humanista em 2 pesos + condensada DIN; sem serifa, sem mono | sobrescreve: papéis `leve`, `pesada`, `condensada`; não use `_emocional_` nem rótulo mono |
| Carimbo padrão (-7°, 1,6x, mola 400/18, flash, tremor) | +3°, 1,9x, sem overshoot, sem flash, sem tremor | sobrescreve: carimbo `estilo: "tinta"`; continua 1 por bloco, na conclusão |
| Sincronia (antecipar 4-8 frames) | mediana +3 frames depois da palavra | continua valendo: a diferença cabe na precisão do whisper-1 usado na medição (±9 frames) |

## 10. QA do estilo (verificável em frame)

- [ ] Fundo: amostra do centro a ±8 por canal de `#B6B4B2`, base mais escura (~`#777673`), grade de 138 px visível; nenhum pixel de texto `#000`; nenhum halo colorido.
- [ ] Entrada por foco: no 2º frame da entrada o texto está borrado e já na posição final (mesmo x/y do 6º frame); no 6º frame, nítido.
- [ ] Troca de cena: entre a saída e a 1ª peça da cena seguinte há 1-10 frames só de fundo; nenhum frame mostra duas cenas sobrepostas.
- [ ] Clarão: luma média sobe ~+58/255 no frame do clarão e volta em 6-9 frames; o RMS da trilha cai a ~-37 dBFS nos 0,35-0,45 s anteriores.
- [ ] Texto de topo à esquerda com margem de 75-85 px, dentro de y 170-620; só as duas cores de lado além dos neutros; nenhum drop-shadow ou gradiente em texto.
- [ ] Contador: no frame do meio da contagem o valor está entre 40% e 60% do final (ease-out daria ~85%).
- [ ] Carimbo: 1º frame com escala ~1,9 e opacidade baixa, 5º frame em 1,0, +3°; fundo estável nos frames vizinhos (sem tremor nem flash).
- [ ] Rodapé com base acima de y ≈ 0,86 da altura; nenhuma legenda da fala; `cenas_check.py --eventos` sem intervalo acima de 2 s.
