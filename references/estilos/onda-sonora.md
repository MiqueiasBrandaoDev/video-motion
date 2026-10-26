# Ficha de estilo: onda sonora

`ficha de estilo` · talking head de selfie com cartão de forma de onda · medido em 26/10/2026 · fase 3 (direção visual): sobrescreve o estilo padrão só nos pontos da seção 9; o resto da skill continua valendo

## 1. Identificação

| Campo | Valor |
|---|---|
| O que é | talking head de selfie (câmera frontal, filmagem sem tratamento) com uma camada gráfica por item: cartão grafite no topo com a forma de onda real do som rolando sob uma cabeça de leitura fixa + rótulo com o nome entre aspas. Cada som toca no instante em que o nome é dito. Tudo entra e sai em corte seco; o único movimento de câmera é um zoom literal quando a fala nomeia o zoom |
| Quando usar | lista curta de dicas em que cada item é um som demonstrável (efeitos sonoros, vinhetas, toques, presets de áudio); nicho de edição e criação de conteúdo; 15-30 s; o criador fala direto para a câmera |
| Quando não usar | itens que não são som (o cartão de onda perde o sentido; esta ficha não mediu equivalente visual); peça de marca que pede acabamento de estúdio (o estilo é cru, de celular); item que precisa de mais de ~3,4 s de explicação; sem filmagem do orador |
| Referência | https://www.instagram.com/reels/De7s_OfxeWx/ · @gabii_creative · publicado em 25/10/2026 · 19,27 s · 1080x1920 · 30 fps |
| Método | análise de 26/10/2026: ffprobe, ffmpeg (scene, ebur128, espectrograma por efeito), rastreio do cartão por frame, ajuste de escala do zoom, whisper-1 por palavra (±60 ms). Fonte já em 30 fps: frames sem conversão |
| Não copiar | a pessoa, o @, as frases, a lista de itens. Fica a técnica |

## 2. Assinaturas

1. O som é o conteúdo: cada efeito toca no instante em que o nome é dito, no nível da voz ou acima.
2. Cartão grafite `#1d1e25` no topo com a forma de onda real do som rolando a ~140 px/s sob cabeça de leitura fixa, e o nome em condensada pesada branca entre aspas logo abaixo.
3. Tudo entra e sai em corte seco (zero fade, zero mola); os únicos movimentos são a rolagem da onda e o zoom literal (~1,6x em 9 frames, ease-in, motion blur só no vídeo).
4. Lista sem introdução, fórmula fixa "[verbo] o [item] pra [função]" de ~2,9 s por item, jump cut no silêncio entre itens; o último item puxa o CTA.
5. Visual de celular sem tratamento: selfie, sem trilha, sem cor de acento, legenda de uma palavra branca e pequena a 74% da altura.

## 3. Tokens

### Cor

| Token | Hex medido | Papel |
|---|---|---|
| cartão | `#1d1e25` | grafite azulado opaco (83,7% do interior), sem borda, sombra ou glow |
| onda, corpo | `#424651` | trecho à direita da cabeça de leitura |
| onda, realce | `#9ea0a7` | trecho à esquerda da cabeça (já "selecionado"), mais claro; média da onda `#5a616f` |
| cabeça de leitura | `#fafbfe` | linha vertical de ~4 px, fixa a ~46% da largura do cartão |
| rótulo | `#fbfcfd` | branco quase puro, sem contorno |
| legenda | `#fcfaf7` | sem caixa, sem contorno; sombra não detectável no recorte 3x |
| handle na pill | `#faf6f6` | |
| pill | ~`#303035`, opacidade estimada 80-90% | clareia sobre área escura, escurece sobre área clara |
| fundo | filmagem | ambiente interno sem correção de cor (parede cinza-azulada `#7e7b81`-`#8f9198` na referência); luz real do ambiente, nenhum halo ou glow gráfico |

Sem cor de acento: filmagem + grafite + branco. Profundidade só da filmagem; camadas gráficas chapadas.

### Tipografia (quadro 1080x1920)

| Papel | Estilo -> Google | Peso | Tamanho (px e %) | Tracking | Caixa | Cor | Posição |
|---|---|---|---|---|---|---|---|
| rótulo do item | grotesca condensada pesada, altura-x alta (~80% da maiúscula), "o" de lados retos, aspas curvas pesadas fazendo parte do texto -> provável Anton; alternativas Big Shoulders Display 800 (papel `estreita`), Oswald 700 (mais leve). Pode ser a fonte "forte" do editor do celular | pesado | corpo estimado 90-100 px (8,3-9,3% da largura); aspas + maiúscula 75 px (3,9% da altura); largura de 158 a 486 px (15-45%) | justo | alta e baixa | `#fbfcfd` | centrado em x 539; topo em y 458 (14-16 px abaixo do cartão) |
| legenda | sem serifa semibold geométrica-humanista, "a" de dois andares (provável fonte nativa da legenda automática do app) -> Figtree 600-700, Inter 600, Plus Jakarta Sans 700 | 600-700 | maiúscula 42 px -> corpo ~58 px (5,4% da largura) | normal | minúsculas como falado, pontuação mantida | `#fcfaf7` | 1 palavra, centro x 540, y ~1416 (73,8% da altura) |
| handle | sem serifa semibold -> Inter 600, Figtree 600 | 600 | altura 30 px -> corpo 38-40 px (3,5-3,7%) | normal | minúsculas | `#faf6f6` | dentro da pill, à direita do avatar |

Hierarquia: rótulo (~100 px, único texto grande) > legenda (~58 px) > handle (~40 px).

### Geometria

| Elemento | Valor |
|---|---|
| Cartão de som | 507-542 x 226-239 px (média 528 x 233: 49% da largura, 12% da altura); topo em y 198-214 (10-11% da altura); centro x ~545; raio ~40 px; a posição varia até 25 px entre cartões (colocação manual, provável recorte de gravação de tela do editor) |
| Dentro do cartão | onda espelhada do próprio arquivo; linhas verticais pontilhadas marcam as bordas do clipe (alças de corte); a onda do clipe seguinte entra pela direita. A forma identifica o som: bloco com cauda; dois losangos (cresce e decai); trem de ~8 picos iguais; pico curto com cauda fina |
| Pill de perfil | ~440 x 150 px, raio total, x 350-790, y 1482-1632 (77-85% da altura); foto circular P&B de ~96 px à esquerda + @ em branco |
| Ausentes | ícones, setas, stickers, prints, emoji, fundo gráfico, barra de progresso |

## 4. Movimento

### Curvas (equivalência entre motores)

| Curva | Remotion | GSAP | CSS |
|---|---|---|---|
| corte seco | sem interpolação (visível de `em` a `ate`) | `gsap.set` no tempo | `display`/`opacity` sem `transition` |
| linear | `Easing.linear` | `none` | `linear` |
| zoom in (ajuste à razão dos incrementos medidos, 0,03 -> 0,15: p(t) = 0,25t + 0,75t²) | `Easing.bezier(0.33, 0.08, 0.67, 0.42)` | `CustomEase.create("zoomIn", "M0,0 C0.333,0.083 0.667,0.417 1,1")`; preset mais próximo `power1.in` | `cubic-bezier(0.33, 0.08, 0.67, 0.42)` |
| in-out cúbico (zoom out, sugerido) | `Easing.inOut(Easing.cubic)` | `power2.inOut` | `cubic-bezier(0.65, 0, 0.35, 1)` |

### Camadas, onda e câmera (30 fps)

| Técnica | Frames | s | Como | Curva |
|---|---|---|---|---|
| entrada e saída de cartão, rótulo, legenda e pill | 0 | 0 | corte seco em 100% dos casos; nenhum fade, escala, slide ou mola | corte |
| rolagem da onda | contínua | - | para a esquerda sob a cabeça fixa, 4,3 / 4,8 / 4,9 px/frame nos 3 cartões medidos (~140 px/s em 1080); parada nos primeiros 7-19 frames do cartão e depois do fim do som; a janela de rolagem coincide com o som (1º cartão: rola 0,43-1,67 s, som 0,77-1,72 s). Aspecto de gravação de tela do editor tocando o efeito | linear |
| zoom in | 9 (f128-f137) | 0,30 | digital, só na camada de vídeo; escala 1,00 -> ~1,6 (pico ruidoso, 1,49-1,75); incremento por frame cresce de 0,03 para 0,15 | zoom in (tabela acima); a análise sugeriu `Easing.in(Easing.cubic)`, mais agressivo |
| segura | ~13 | ~0,43 | escala ~1,5-1,7 com o tremor natural da mão | - |
| zoom out | 12 (f151-f163) | 0,40 | ~1,4 -> 1,03 | não medida (sugestão: in-out cúbico) |
| origem do zoom | - | - | no rosto: x ~0,47, y ~0,57 da altura | - |
| motion blur | rampas: f133-f137 (in), f154-f160 (out) | - | radial/direcional, só no vídeo. Remotion: `CameraMotionBlur` só em volta da `CamadaVideo` (`shutterAngle 180`, `samples 6`, sugestão da análise). HTML: `filter: blur()` 0 -> 6-10 px -> 0 acompanhando a velocidade da escala (aproximação; blur radial real pede canvas ou WebGL) | segue a velocidade |
| camadas durante o zoom | - | - | cartão, rótulo e legenda não escalam | - |
| transição entre itens | 0 | 0 | jump cut seco no silêncio; o enquadramento muda só porque é outra tomada | corte |

Não acontece: fade, escala, slide ou mola em qualquer camada; flash (a luma média varia só ±9 com o cartão entrando e saindo); glitch, grão, tremor gráfico, distorção; whoosh no zoom; efeito sonoro no corte; som de entrada do cartão.

## 5. Ritmo

| Medida | Valor |
|---|---|
| Planos | 4 planos (6,13 / 2,77 / 3,23 / 7,14 s), média 4,82 s |
| Jump cuts | 3 em 19,27 s (0,16/s), todos em pausa de -53 a -60 dBFS; pausas residuais de 0,2-0,4 s ficam. Scene score 0,14-0,20 (passa no limiar 0,10, não no 0,25) |
| Eventos de camada | 13 em 0-13,9 s (5 entradas e 5 saídas de cartão, zoom in, zoom out, pill): um a cada 1,07 s |
| Legenda | ~2,5 trocas/s |
| Maior trecho sem evento | 5,37 s no CTA (13,90-19,27 s, só legenda e fala); antes do CTA, 2,40 s (cartão com a onda rolando dentro) |
| Rosto x motion | rosto em tela 100% do tempo; cartão no topo 52%; pill 33% |
| Fala | 49 palavras, 156 ppm; ~172 ppm sem as 7 pausas ≥ 150 ms (~1,8 s) |
| Item da lista | 2,48-3,40 s (média ~2,9 s); CTA 4,93 s |
| Cartão | 50-72 frames na tela (1,67-2,40 s), média 60 |
| Gatilho | cartão entra 18-29 frames antes do nome (média 22), no início da frase; 4 dos 5 entram no silêncio antes da 1ª palavra (3 junto com o jump cut), o 1º no frame 0. Som: de -12 a +5 frames do início do nome (mediana -4; 2 dos 5 sons são prováveis). Cartão sai durante a frase da função, 9-36 frames antes do fim dela. Zoom: começa 2 frames antes de "zoom" (in) e 4 frames antes do 2º "zoom" (out). Pill: 1-2 frames depois do início do som de notificação. Legenda: troca a ±2 frames do início da palavra |

## 6. Som

| Item | Valor |
|---|---|
| Loudness | -14,6 LUFS integrado; LRA 4,0 LU; true peak -0,2 dBTP |
| Trilha | nenhuma: pausas a -53/-60 dBFS (piso p10 -46,9 dBFS) |
| Voz | mediana RMS das janelas ativas -17,3 dBFS (50 ms); microfone próximo, sem reverb |
| Efeitos | 5 em 19,3 s (um a cada 3,9 s); cada um é o conteúdo do item (demonstração), tocado por cima da voz |
| Nível (RMS contra a mediana RMS da voz) | bloco de banda larga: -9,9 dBFS (~+7 dB); trem de cliques: -17,6 dBFS (nível da voz); sino: -15,6 dBFS em trecho sem voz (~+2 dB); whoosh e pop prováveis, nível não isolado |
| Timbres | bloco denso 1-8 kHz com harmônicos em 1,1-1,5 kHz; ruído difuso em torno de 1 kHz (whoosh, provável); bloco abafado até ~1,2 kHz com fim seco (pop, provável); cliques de banda larga a cada ~70 ms (~14/s); tom de ~3,0 kHz + parcial de 7,4 kHz nos primeiros 100 ms, decaimento ~0,5 s |
| Sem som | no corte, na entrada do cartão, no zoom, na pill (a pill entra no som de notificação do item, não ganha som próprio) |
| Na skill | `sfx.json` `"perfil": "orador"`; `mixar.py` sem `--musica`; nível dos efeitos na seção 9 |

## 7. Roteiro

Estrutura da referência:

| Bloco | Tempo | O que aparece | Fala |
|---|---|---|---|
| item 1 | 0,0 s, sem introdução | cartão + rótulo já no frame 0 | "[verbo] o [item] pra [função]" |
| itens 2 a N | 2,5-3,4 s cada | jump cut no silêncio + cartão; som no nome; cartão sai durante a função | mesma fórmula, sem variação |
| item de movimento | 1 dos 5 | demonstração literal: a palavra do movimento dispara o zoom no rosto | a função nomeia o movimento |
| último item | | conecta ao CTA: o som de notificação faz a pill de perfil aparecer, que fica até o fim | |
| CTA | ~4,9 s | rosto + legenda + pill | pedido de seguir com o benefício |

Um item por dentro (30 fps, a partir do jump cut): frame 0 cartão + rótulo -> frames 18-29 nome dito e som (onda já rolando) -> frame ~60 cartão sai -> frames ~75-102 fim da frase e próximo jump cut.

Esqueletos (propostas; cada linha lista os eventos visuais com ≤ 2 s entre eles):

| 15 s | Bloco | Eventos |
|---|---|---|
| 0,0-2,9 | item 1 | cartão + rótulo (0,0); nome e som (~0,6); cartão sai (~2,0) |
| 2,9-5,8 | item 2 | jump cut + cartão (2,9); nome e som (~3,6); cartão sai (~4,9) |
| 5,8-8,7 | item 3 (movimento) | jump cut + cartão (5,8); zoom in na palavra (~7,0); zoom out (~7,6); cartão sai (~7,8) |
| 8,7-11,6 | item 4 (notificação) | jump cut + cartão (8,7); nome e som + pill de perfil (~9,5); cartão sai (~10,7) |
| 11,6-15,0 | CTA | rosto + legenda + pill; punch-in em ~12,4 e ~14,0 (regra 1) |

| 60 s | Bloco | Eventos |
|---|---|---|
| 0-3,4 | item 1 | cartão no frame 0 |
| 3,4-54,4 | itens 2 a 16, ~3,4 s cada | mesmo item por dentro; ~1 item de movimento em cada 5 (proporção da referência) |
| último item | notificação | pill de perfil no som |
| 54,4-60 | CTA | rosto + legenda + pill; punch-in a cada ≤ 2 s |

A referência tem 19,27 s e 5 itens; o esqueleto de 60 s estende a mesma fórmula sem medida própria.

## 8. Mapa para a skill

### O que já existe

| Técnica | Componente (nome exato) | Parâmetros sugeridos | O que falta |
|---|---|---|---|
| talking head em tela cheia | cena `orador` (`video`, `enquadramento`) | `enquadramento: {"zoom": 1, "foco": 0.57}`; sem `desce` (sem fundo de grade aparente) | - |
| jump cut no silêncio | `cortar_video.py` (`cortes.json` com um `manter` por item; `blocos.json`) | `tempo` ≥ 1,3 | - |
| sem trilha | `sfx.json` `"perfil": "orador"`; `mixar.py` sem `--musica` | - | - |
| animação no marco da palavra | `legendas.py --marcos-spec` -> `marcos.json` | um marco por nome de item e um por palavra de movimento | - |
| legenda de 1 palavra | `legendas.py --max-palavras 1` + `legenda_estilo: "fantasma"` com `"legenda": 0.74` na cena | provisório | entrada de 3 frames (sobe 12 px, blur) em vez de corte; Plus Jakarta Sans 800 62 px em vez de 600-700 58 px: `legenda_estilo: "palavra"` |
| zoom literal | `punch: [{"em": "<zoom1>-70", "escala": 1.6, "ate": "<zoom2>-130"}]` na cena `orador` | provisório | mola de 12 frames que desacelera em vez de ease-in de 9; sem motion blur. O `motionBlur` do `Palco` segue a `camera` e borraria cartão e legenda: não use |
| rótulo em corte seco | `linhas` da cena `orador` (`{texto, em, papel: "estreita", entrada: "nenhuma", gradiente: false}`), uma cena `orador` por estado (com cartão, sem cartão) | provisório, sem o cartão | o papel `estreita` força caixa alta (a referência usa alta e baixa); as linhas ficam no topo da área útil, não 14-16 px abaixo de um cartão |
| corte seco entre cenas | `transicao: "corte"` (padrão do kit), `entrada: "nenhuma"` no texto | - | itens `sobre` entram 3 frames antes com animação e saem com blur de 6 frames: `corte: true` |
| pill de CTA | sobreposição `pill` (`texto`, `icone`, `y`) | - | hoje é gradiente do acento com pop 14/220 e glow: `estilo: "perfil"` |
| evento no CTA | `punch` (escala padrão 1,12, mola de 12 frames) | um punch a cada ≤ 2 s | - |

### A construir quando for usar

Valores medidos, salvo os marcados com (p), propostos na análise sem medida direta.

| Componente | O que faz | Parâmetros (30 fps) |
|---|---|---|
| sobreposição `som` (cartão de forma de onda) | camada frente, fora do envelope do punch; cartão + onda + cabeça + alças + rótulo | campos: `arquivo` (sfx em `public/sfx/`), `rotulo`, `em` (padrão 22 frames antes do marco do nome), `toca` (marco do nome, o mesmo instante do evento no `sfx.json`), `ate` (padrão `em` + 60 frames), `y` 0,105, `largura` 0,49, `altura` 0,12. Visual: `#1d1e25` opaco, raio 40 px, sem borda nem sombra; onda espelhada `#424651`, trecho à esquerda da cabeça `#9ea0a7`; cabeça branca de 4 px a 46% da largura; linhas pontilhadas verticais de 2 px (p) nas bordas do clipe. Movimento: entra e sai em corte; onda parada até `toca` - 10 frames (p), depois rola linear a 4,7 px/frame até o fim do som e para. Rótulo: condensada pesada 90-100 px, branco, aspas curvas, centrado 14-16 px abaixo do cartão. HTML: SVG ou `<canvas>` com `translateX` linear (`ease: "none"`) |
| script de picos (ex. `onda_sfx.py`) | lê o sfx e grava os picos da forma de onda em JSON para o cartão | ~200 picos/s (p); lê só com ffmpeg (arquivo baixado é não confiável) |
| `toca` no `cenas_check.py` | o início da rolagem conta como evento visual da regra 1 | acrescentar `toca` às chaves de tempo (`CHAVES_TEMPO`) |
| `legenda_estilo: "palavra"` | página de 1 palavra, troca em corte seco no início da palavra | Figtree ou Inter 600-700, 58 px, `#fcfaf7`, sem caixa, sem destaque de cor, pontuação mantida, y 0,74; sombra opcional `0 2px 6px rgba(0,0,0,.35)` (p) quando o fundo atrás da legenda for claro |
| `punch` com `curva`, `entra`, `sai`, `blur` | zoom literal no marco da palavra de movimento | `{em, escala: 1.6, ate, entra: 9, sai: 12, curva: "in", blur: true}`; entrada com a curva de zoom in (seção 4); saída de 12 frames (in-out cúbico (p)); origem no `foco` (x 0,47, y 0,57); motion blur só na `CamadaVideo` enquanto a escala muda; sobreposições e legenda fora do envelope |
| `pill` com `estilo: "perfil"` | pílula escura com avatar e @ que entra como notificação | `{tipo: "pill", estilo: "perfil", avatar, texto, em, y: 0.81, corte: true}`; ~440 x 150 px, raio total, `#303035` a 80-90%, avatar circular de 96 px (P&B opcional), texto 38-40 px semibold branco; entra 1-2 frames depois do início do som de notificação e fica até o fim |
| `corte: true` nos itens `sobre` | entrada e saída em 0 frames | sem a antecipação animada de 3 frames nem o blur de saída |
| categoria `demonstracao` no `gerar_sfx.py` | efeito que é o conteúdo, no nível da voz ou acima | `rel_db` -6..+3 (p) relativo à voz (medido: 0 a +7 dB em RMS); `alinhar: "inicio"` no marco do nome; fora da conta de 1/3 de impactos; aceita efeito sobre a fala; o validador pede um cartão `som` com o mesmo `toca` |

## 9. Conflitos com as regras padrão

| Regra da skill | O estilo faz | Resolução |
|---|---|---|
| Regra 1: evento a cada 2 s no máximo | 5,37 s sem evento no CTA; cartões de até 2,40 s | continua valendo: no CTA, punch-in a cada ≤ 2 s; cartão com no máximo 60 frames na tela até o `toca` contar como evento (a construir) |
| Regra 2: nunca ler duas vezes | a legenda mostra o nome do item enquanto o rótulo também mostra | continua valendo: o `textoTela.ts` esconde a página que tem palavra escrita na tela (`rotulo` já está nas chaves lidas); com página de 1 palavra, só a palavra do nome some |
| Regra 3: voltar para a pessoa | rosto 100% do tempo | cumpre sem ajuste |
| Regra 4: fala a 1,3x | 156 ppm brutos, ~172 sem pausas | continua valendo (`cortar_video.py`, `tempo` ≥ 1,3) |
| Legenda (`fantasma` no talking head) | 1 palavra, corte seco, sem destaque, 58 px, y 0,74 | sobrescreve: `legenda_estilo: "palavra"` (a construir); até lá, `fantasma` + `--max-palavras 1` sem `legenda_destaques` |
| SFX (`gerar_sfx.py`): comum -26..-16, impacto -20..-10 (ERRO fora) | efeitos de 0 a +7 dB sobre a voz | as escalas diferem (a medida é RMS contra a mediana RMS da voz; o `rel_db` é pico contra pico da voz). Provisório: categoria `transicao` (aceita -16..-4) com `rel_db: -4` e `alinhar: "inicio"`, conferindo no QA que o efeito fica no nível da voz; definitivo: `demonstracao`. Intervalo médio entre efeitos de ~3,0 s (calculado dos inícios medidos) cabe no perfil `orador` (2,5-8 s). Continua: 400 ms entre efeitos, nunca o mesmo arquivo seguido |
| Impactos graves do perfil `orador` (~1-2,5 a cada 10 s) | nenhum impacto | sobrescreve: sem impacto; o único som além da voz é o item demonstrado |
| Paleta (acento único ou Semântico) | nenhuma cor de acento | sobrescreve: `config.acento` continua obrigatório no template, mas sem uso visível (sem `legenda_destaques`, sem `*acento*`, sem pill padrão, sem carimbo) |
| Texto de tela (frase de 2-6 palavras, grande, no centro, no marco) | rótulo de 1-2 palavras no topo, acoplado ao cartão, 1,67-2,40 s na tela | sobrescreve posição e tamanho; continua: entra no marco e fica abaixo de 2,5 s |
| Estilo padrão (fundo de grade, halos, cards com glow, carimbo, HUD, TelaViva) | nada disso; vídeo cru | sobrescreve: só o vídeo, o cartão, o rótulo, a legenda e a pill |
| Punch padrão (1,12 com mola em palavra-chave) | zoom só quando a fala nomeia o zoom, ~1,6x, ease-in, com blur | sobrescreve no item de movimento; o punch padrão fica só para cumprir a regra 1 no CTA |

## 10. QA do estilo (verificável em frame)

- [ ] Corte seco: no frame anterior à entrada o cartão, o rótulo e a pill não existem; no frame da entrada estão inteiros e opacos (sem fade nem escala intermediária). Idem na saída.
- [ ] Cartão: topo em y ≈ 0,105 da altura, largura ≈ 49%, cor `#1d1e25` sem borda nem sombra; rótulo branco entre aspas curvas 14-16 px abaixo, centrado.
- [ ] Onda: entre dois frames do trecho que toca, deslocamento de 4,3-4,9 px; cabeça de leitura parada a ~46% da largura do cartão; trecho à esquerda mais claro.
- [ ] Sincronia: o cartão entra 18-29 frames antes do frame do nome; o som começa a até ~12 frames do nome; a pill aparece 1-2 frames depois do som de notificação.
- [ ] Legenda: uma palavra por vez, branca, ~58 px, centro em y ≈ 0,74, sem caixa; troca a ±2 frames do início da palavra.
- [ ] Zoom literal: escala ~1,6 no pico, motion blur só nos frames de rampa; cartão, rótulo e legenda com o mesmo tamanho antes e durante o zoom.
- [ ] Jump cuts só em pausa (RMS abaixo de -50 dBFS) e sem efeito sonoro no corte; nenhuma trilha nas pausas.
- [ ] `cenas_check.py --eventos` sem intervalo acima de 2 s, inclusive no CTA.
