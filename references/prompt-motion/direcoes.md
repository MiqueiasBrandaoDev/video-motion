# Direções visuais do prompt-motion.com

`catálogo de direções` · 45 direções de 234 vídeos do prompt-motion.com · coletado em 28/10/2026 · usado na fase 3 pelo `scripts/rodizio.py`

Como usar: o rodízio (`README.md` desta pasta, seção 2) sugere 3 direções; abra a folha de contato da primeira referência e leia a ficha abaixo. Cada ficha diz o que a direção troca no kit de 10 pontos de `../direcao-visual.md`; marca, paleta do cliente, as quatro regras de retenção e a legenda ficam. Encaixe `orador` = a técnica funciona como frase de 1,5-2,5 s entre voltas ao rosto ou como sobreposição sobre o vídeo do orador. Custo em relação ao template: baixo (cenas existentes + JSON), médio (cena sob medida React/SVG), alto (WebGL, física, shader ou ilustração). Hex, BPM e durações das assinaturas vêm das referências; springs e frames em "Como fazer" são ponto de partida a 30 fps. A versão de máquina é `direcoes.json`.

## Índice

| id | nome | família | encaixe | custo | força |
|---|---|---|---|---|---|
| [`verbo-que-faz-o-que-diz`](#verbo-que-faz-o-que-diz) | Verbo que faz o que diz | tipografia | orador, motion, teaser, cta | médio | 5 |
| [`frase-que-vira-estrutura`](#frase-que-vira-estrutura) | Frase que vira estrutura | tipografia | orador, motion, explainer, teaser | médio | 5 |
| [`documento-editorial-fixo`](#documento-editorial-fixo) | Documento editorial fixo | tipografia | orador, produto, explainer, cta | baixo | 4 |
| [`roleta-que-trava-na-resposta`](#roleta-que-trava-na-resposta) | Roleta que trava na resposta | tipografia | orador, produto, teaser, dados | baixo | 3 |
| [`gramatica-de-anime`](#gramatica-de-anime) | Gramática de anime | tipografia | orador, teaser, motion, cta | médio | 4 |
| [`forma-unica-que-morfa`](#forma-unica-que-morfa) | Forma única que morfa | interface | produto, motion, orador, cta | médio | 5 |
| [`caixa-de-selecao-de-editor`](#caixa-de-selecao-de-editor) | Caixa de seleção de editor | interface | orador, produto, explainer, dados | baixo | 4 |
| [`keynote-macro-acento-unico`](#keynote-macro-acento-unico) | Keynote macro com acento único | interface | orador, produto, dados, cta | baixo | 4 |
| [`parede-de-clipes-verticais`](#parede-de-clipes-verticais) | Parede de clipes verticais | celular | orador, produto, teaser, cta | médio | 4 |
| [`contador-que-e-o-relogio-da-historia`](#contador-que-e-o-relogio-da-historia) | Contador que é o relógio da história | dados | orador, explainer, dados, teaser | baixo | 5 |
| [`matriz-de-pontos`](#matriz-de-pontos) | Matriz de pontos que conta e desenha | dados | orador, dados, produto, explainer | médio | 4 |
| [`total-que-se-monta-a-vista`](#total-que-se-monta-a-vista) | Total que se monta à vista | dados | orador, produto, dados, cta | baixo | 4 |
| [`anotacao-a-mao-sobre-o-movimento`](#anotacao-a-mao-sobre-o-movimento) | Anotação à mão sobre o movimento | diagrama | orador, explainer, produto, motion | médio | 5 |
| [`janelas-neo-brutalistas`](#janelas-neo-brutalistas) | Janelas neo-brutalistas | diagrama | orador, explainer, produto, dados | médio | 4 |
| [`fio-vermelho-linha-do-tempo`](#fio-vermelho-linha-do-tempo) | Fio vermelho da linha do tempo | diagrama | orador, explainer, dados, teaser | médio | 4 |
| [`o-objeto-e-o-grafico`](#o-objeto-e-o-grafico) | O objeto do assunto é o gráfico | diagrama | orador, explainer, produto, dados | médio | 4 |
| [`figuras-numeradas-de-livro`](#figuras-numeradas-de-livro) | Figuras numeradas de livro | formas | orador, explainer, motion, teaser | médio | 5 |
| [`bauhaus-primarias`](#bauhaus-primarias) | Bauhaus em primárias | formas | motion, teaser, explainer, cta | médio | 4 |
| [`liquido-que-escorre`](#liquido-que-escorre) | Líquido que escorre | formas | orador, produto, cta, teaser | médio | 4 |
| [`o-video-explica-a-propria-tecnica`](#o-video-explica-a-propria-tecnica) | O vídeo explica a própria técnica | formas | motion, explainer | médio | 3 |
| [`enxame-com-origem-e-destino`](#enxame-com-origem-e-destino) | Enxame com origem e destino | particulas | orador, dados, produto, explainer | médio | 4 |
| [`maquete-clara-explicativa`](#maquete-clara-explicativa) | Maquete clara explicativa | 3d | explainer, produto, dados | alto | 5 |
| [`curta-3d-camera-de-cinema`](#curta-3d-camera-de-cinema) | Curta 3D com câmera de cinema | 3d | motion, teaser | alto | 3 |
| [`colagem-surreal-retro`](#colagem-surreal-retro) | Colagem surreal retrô | foto-colagem | orador, teaser, motion | médio | 5 |
| [`palavra-com-foto-dentro`](#palavra-com-foto-dentro) | Palavra com foto dentro | foto-colagem | orador, produto, teaser, cta | médio | 4 |
| [`gravura-anotada`](#gravura-anotada) | Gravura anotada | foto-colagem | orador, cta, teaser, explainer | médio | 4 |
| [`coisa-que-ganha-vida`](#coisa-que-ganha-vida) | Coisa que ganha vida | personagem | produto, teaser, explainer | alto | 4 |
| [`luz-que-conta-a-historia`](#luz-que-conta-a-historia) | Luz que conta a história | personagem | motion, teaser, explainer | alto | 4 |
| [`pixel-art-de-jogo`](#pixel-art-de-jogo) | Pixel art de jogo | personagem | orador, teaser, motion, explainer | médio | 4 |
| [`codigo-que-narra-a-cena`](#codigo-que-narra-a-cena) | Código que narra a cena | codigo | orador, produto, explainer | baixo | 4 |
| [`codigo-vira-paisagem`](#codigo-vira-paisagem) | Código vira paisagem | codigo | orador, motion, teaser, explainer | médio | 4 |
| [`colisao-que-toca-a-nota`](#colisao-que-toca-a-nota) | Colisão que toca a nota | ritmo-som | motion, teaser | médio | 4 |
| [`canone-em-grade-pop-art`](#canone-em-grade-pop-art) | Cânone em grade pop-art | ritmo-som | orador, teaser, motion, cta | médio | 4 |
| [`legenda-que-manda-no-corte`](#legenda-que-manda-no-corte) | Legenda que manda no corte | ritmo-som | orador, produto, teaser, cta | baixo | 4 |
| [`risografia-sobreimpressa`](#risografia-sobreimpressa) | Risografia sobreimpressa | textura | orador, explainer, motion, cta | médio | 4 |
| [`feixe-de-osciloscopio`](#feixe-de-osciloscopio) | Feixe de osciloscópio | textura | orador, motion, dados, teaser | médio | 4 |
| [`pontilhado-de-um-bit`](#pontilhado-de-um-bit) | Pontilhado de um bit | textura | orador, produto, teaser, motion | médio | 4 |
| [`traco-de-lapis-tremido`](#traco-de-lapis-tremido) | Traço de lápis tremido | textura | orador, explainer, produto, dados | médio | 4 |
| [`ponto-que-costura-cenas`](#ponto-que-costura-cenas) | Ponto que costura as cenas | transicao | orador, motion, teaser, cta | médio | 5 |
| [`cada-objeto-vira-o-proximo`](#cada-objeto-vira-o-proximo) | Cada objeto vira o próximo | transicao | orador, produto, motion, cta | médio | 5 |
| [`generos-de-tv-emprestados`](#generos-de-tv-emprestados) | Gêneros de TV emprestados | transicao | orador, explainer, teaser, motion | alto | 5 |
| [`potencias-de-dez`](#potencias-de-dez) | Potências de dez | camera | produto, explainer, teaser, dados | médio | 4 |
| [`o-site-e-o-cenario`](#o-site-e-o-cenario) | O site é o cenário | camera | orador, produto, cta, teaser | médio | 5 |
| [`chegada-exponencial-com-borrao`](#chegada-exponencial-com-borrao) | Chegada exponencial com borrão | camera | orador, produto, teaser, cta | baixo | 4 |
| [`hud-camera-capitulos`](#hud-camera-capitulos) | Moldura de reel com timecode (clichê) | camera | motion, teaser | baixo | 2 |

Por família: tipografia 5 · interface 3 · celular 1 · dados 3 · diagrama 4 · formas 4 · particulas 1 · 3d 2 · foto-colagem 3 · personagem 3 · codigo 2 · ritmo-som 3 · textura 4 · transicao 3 · camera 4 · encaixe `orador`: 36 de 45.

---

## tipografia

<a id="verbo-que-faz-o-que-diz"></a>

### verbo-que-faz-o-que-diz · Verbo que faz o que diz

`tipografia` · encaixe: orador, motion, teaser, cta · custo médio · força 5 · categorias: kinetic-type, shapes · no template: `frase`, `letreiro`, `rajada`

**O que é.** Tipografia literal. A frase tem um prefixo fixo pequeno e uma palavra enorme que encena o verbo: "estica" estica, "corta" é cortada, "trava" para com tranco. O significado chega pela forma antes da leitura.

**Assinaturas**

- prefixo fixo pequeno no topo e o verbo enorme ocupando o resto do quadro; só o verbo muda (zheke-38deff, 1:1, 15 s)
- grotesca black em caixa alta, alternando condensada e larga; uma cor de destaque (laranja `#FF5A1F` na referência) só nas letras que fazem a ação
- uma frase por segundo e pouco, corte seco na batida, fundo trocando entre creme `#EDE8DE`, azul `#2B35E8` e preto a cada verbo
- squash and stretch nas letras com motion blur; overshoot proposital só no verbo que significa "passar do ponto"

**Quando usar / quando não usar**

- Usar: palavra-chave da fala é um verbo ou adjetivo físico (cortar, travar, crescer, sumir, empilhar, esticar); lista de capacidades; gancho.
- Não usar: conceito abstrato sem gesto (confiança, estratégia); frase longa; mais de 3-4 verbos seguidos (vira catálogo de efeitos).

**Com o orador.** Encaixe direto no "frase e volta": rosto, verbo encenado por 1,5-2 s no marco da palavra, rosto. O prefixo pode ser a parte da frase já dita; a legenda some no trecho (regra 2). Um verbo por bloco, no máximo.

**Como fazer no Remotion.** Parte da cena `frase` (prefixo em `rotulo`, verbo em `linhas[0]` grande) e vira uma cena sob medida `verbo` com `acao` (achata, estica, passa, monta, quebra, pesa). Cada ação é função do frame aplicada por letra: `scaleY`/`scaleX` com `spring({damping: 12, stiffness: 180})` para squash, `translateX` com overshoot para "passa do ponto", blocos caindo com `spring` em stagger de 2 frames para "monta". Letras desalinhadas por rotação com semente fixa (`random(seed + i)` do Remotion) que voltam à base. Fonte variável: `fontVariationSettings` com o peso por `interpolate`. Use `rajada` quando houver 2-3 verbos na mesma frase.

**O que troca no estilo padrão.** Ponto 6 (o verbo sai dos papéis número/frase e ganha comportamento próprio, sem gradiente nem brilho) e, no trecho, o fundo de grade vira cor chapada. Ponto 2 não entra junto: o verbo já é a pontuação.

**Não copiar:** as frases da referência ("I CAN ...", "I'M ..."), o nome do modelo, o ponto laranja como marca, as metaballs e a lente exatamente como estão.

**Referências**

- [Kinetic type showreel](https://prompt-motion.com/zheke-38deff) · @zheke · prefixo fixo pequeno no topo e o verbo enorme encenando: squash and stretch, overshoot, lente que entorta, blocos que se montam
- [Kinetic type self-portrait](https://prompt-motion.com/souravbhar871-61f424) · @souravbhar871 · frases em primeira pessoa: fio embaraçado que vira trajeto, letras tortas que caem e se alinham, palavra extrudada
- [Supademo launch video](https://prompt-motion.com/jhylee95-e1152f) · @jhylee95 · um verbo gigante por recurso com ponto final de cor, carimbado na batida, com um widget pequeno embaixo
- [Motion designer showreel](https://prompt-motion.com/hanifproduktif-54bdee) · @hanifproduktif · cada palavra faz o que diz sobre uma cor chapada diferente
- [Code-only motion design reel](https://prompt-motion.com/johnsavage-ai-b091c0) · @johnsavage_ai · peso da fonte variável deslizando de fino a black dentro da própria palavra

<a id="frase-que-vira-estrutura"></a>

### frase-que-vira-estrutura · Frase que vira estrutura

`tipografia` · encaixe: orador, motion, explainer, teaser · custo médio · força 5 · categorias: kinetic-type, shapes · no template: `frase`, `linha`

**O que é.** Um discurso encenado como construção. Cada frase acrescenta uma peça: a palavra pesada verga a linha de base, outra fica pendurada por cabos, outra gira e vira coluna. No fim a última frase literalmente se apoia nas anteriores.

**Assinaturas**

- fundo verde muito escuro `#102820`, texto creme `#F4E9D5`, um fio dourado `#F2B544` como linha de base (gdgtify-287ddf, 1:1, 20 s)
- serifa de alto contraste para a frase falada, grotesca larga pesada para as palavras que sustentam, mono minúscula no marcador de cue do topo com barra de progresso
- ritmo lento: cada frase altera a estrutura do quadro; rotações e descidas com easing suave, sem overshoot
- única transição: zoom através da contraforma de uma letra (o miolo da letra vira a próxima tela)

**Quando usar / quando não usar**

- Usar: fala com argumento que se acumula (premissa, premissa, conclusão), manifesto, "o que sustenta X".
- Não usar: lista de itens independentes, conteúdo de dados, trecho de rajada.

**Com o orador.** A estrutura vive numa cena que volta: a cada retorno (1,5-2,5 s) ela mostra as peças anteriores e ganha uma nova no marco da palavra; entre as voltas, o rosto. A transição pela contraforma serve para sair da estrutura para o rosto (o vídeo aparece dentro do miolo da letra que escala).

**Como fazer no Remotion.** Cena sob medida em SVG. Cada palavra é um `<g>` com `transform` próprio; a linha de base é um `path` quadrático (`M x0 y Q xm y+f x1 y`) em que a flecha `f` cresce com `spring({damping: 200})` quando a palavra pesada pousa. Pilar: `rotate(90)` por `interpolate` em 12 frames. Persistência: a lista de peças fica no JSON e cada uma é desenhada quando `frame >= em`. Transição: `clipPath` com o contorno da letra escalando de 1 a ~40 em 10 frames sobre `OffthreadVideo`. Barra de cue com `LinhaSVG` reta.

**O que troca no estilo padrão.** Ponto 6 (serifa para a fala e grotesca para o peso, sem gradiente nem brilho), ponto 10 (fica só no regime calmo) e fundo (cor escura chapada, sem grade e sem halos).

**Não copiar:** o texto do discurso, as palavras escolhidas, a combinação exata de verde e dourado, o pôster com metadados da outra referência.

**Referências**

- [Speech built as architecture](https://prompt-motion.com/gdgtify-287ddf) · @Gdgtify · linha dourada que verga sob a palavra pesada, palavra suspensa por cabos, palavra girando 90° para virar pilar, zoom pela contraforma de uma letra
- [Poster breaking its frame](https://prompt-motion.com/pankajkumar-dev-0bee87) · @pankajkumar_dev · pôster tipográfico pressionado pela própria palavra, que inclina, vaza cor e arrebenta a moldura e o grid

<a id="documento-editorial-fixo"></a>

### documento-editorial-fixo · Documento editorial fixo

`tipografia` · encaixe: orador, produto, explainer, cta · custo baixo · força 4 · categorias: kinetic-type, product-ui, code · no template: `frase`, `rajada`, `hud`, `terminal`

**O que é.** O vídeo se comporta como uma página de relatório. O topo não se mexe (marca à esquerda, descrição à direita, rótulo da seção sobre um fio) e o miolo troca frase a frase em corte seco. A hierarquia vem da cor do texto (cinza para o contexto, preto ou branco para o novo), não de efeito.

**Assinaturas**

- vertical 9:16, 23 s; fundo alternando `#1A1A1A` e `#F5F4EF` com grade fina; cinza `#8A8A8A` para o que já foi dito (davidmarcus-a28a60)
- grotesca neo em peso regular, grande, entrelinha justa; nada de 800/900
- troca de palavra por substituição instantânea, sem animação de entrada; lista que cresce para baixo com o item atual aceso
- terminal digitando e uma linha ponto a ponto entre origem e destino como únicos elementos gráficos

**Quando usar / quando não usar**

- Usar: B2B, finanças, jurídico, produto técnico; marca sóbria; roteiro de afirmações curtas.
- Não usar: entretenimento, humor, nicho que pede energia; frase com mais de 6 palavras por tela.

**Com o orador.** Muito bom. O cabeçalho fixo vira a moldura que volta a cada frase: rosto, página com uma frase (1,5-2 s), rosto. A lista acumulada funciona em várias voltas: a cada retorno aparece um item novo aceso e os anteriores em cinza.

**Como fazer no Remotion.** Cena `frase` com `alinhar: esquerda`, papel `frase` trocado para peso 400-500 (Inter ou Geist em `theme.ts`), sem `entrada` (corte). O cabeçalho é um componente fixo pequeno (marca, rótulo da seção e fio) na mesma posição em todas as cenas do bloco. A troca da palavra gigante é uma `rajada` com os `em` da fala. Lista: `telaViva` bloco `lista` restilizado (sem card, sem badge, opacidade 0,4 nos itens passados). Código: `terminal` ou a sobreposição `comando`.

**O que troca no estilo padrão.** Ponto 5 (sem halo nem borda luminosa), ponto 6 (peso regular no lugar de 800, sem gradiente), ponto 7 (o HUD vira o cabeçalho do documento, que mostra a seção real e não decoração) e ponto 2 (sem carimbo). Fundo: grade fina sem halos, alternando escuro e claro por cena.

**Não copiar:** a marca, o símbolo e as frases da referência, os códigos de moeda, o nome dos produtos.

**Referências**

- [Lightspark social promo video](https://prompt-motion.com/davidmarcus-a28a60) · @davidmarcus · 9:16: cabeçalho que nunca se mexe, palavra gigante trocando por substituição, lista com os itens anteriores em cinza, terminal digitando
- [Email tool promo reel](https://prompt-motion.com/melvynx-6cde6c) · @melvynx · narração em legendas entre colchetes, como notas de rodapé de um ensaio, sobre UI e números mínimos
- [Prompting mistakes video tutorial](https://prompt-motion.com/henkvaness-0e06af) · @henkvaness · par de cartões: o que a pessoa digitou, grifado em vermelho, e o que digitar no lugar, como errata editorial

<a id="roleta-que-trava-na-resposta"></a>

### roleta-que-trava-na-resposta · Roleta que trava na resposta

`tipografia` · encaixe: orador, produto, teaser, dados · custo baixo · força 3 · categorias: kinetic-type, product-ui · no template: `frase`, `numero`, `telaViva`

**O que é.** Mecanismo de suspense curto: várias opções passam rápidas e borradas e a certa trava com um tranco. Pode ser rolo vertical, placas que viram, seletor numa fileira ou caracteres embaralhados que se resolvem.

**Assinaturas**

- rolo vertical com motion blur vertical forte, janela de 3 linhas, a do meio nítida ao parar (macrohou-33959d, 16:9, ~3 s por ideia)
- seletor em laranja `#F05A28` que desacelera até a casa certa e vira palavra gigante com sombra extrudada (tankazunori0914-0fc886)
- placas split-flap em mono caixa alta, uma placa por letra, segunda linha na cor de destaque
- cerca de 1 s de giro antes de travar; o resto do quadro parado

**Quando usar / quando não usar**

- Usar: veredito, resposta a uma pergunta que o orador fez, "qual é o melhor", preço revelado, sorteio.
- Não usar: quando a resposta já foi dita antes (perde o suspense); mais de uma vez por vídeo.

**Com o orador.** O orador pergunta, corta para a roleta girando ~0,8 s, ela trava na palavra no marco em que ele diz a resposta, segura ~0,8 s e volta ao rosto. Também serve como sobreposição acima da cabeça, com o rosto falando embaixo.

**Como fazer no Remotion.** Cena sob medida `roleta` com `opcoes[]`, `resposta` e `em`. A posição do rolo é `interpolate(frame, [ini, em], [0, alvo], {easing: Easing.out(Easing.cubic)})` em unidades de linha; o borrão vertical vem de 3 cópias deslocadas no eixo Y com opacidade baixa (ou `motionBlur`). Split-flap: cada letra sorteia caracteres com `random('flap' + i + frame)` até o seu `em` escalonado (2 frames por letra). Embaralhado: o mesmo por caractere. Tranco final: `spring({damping: 14, stiffness: 220})` na escala de 1,08 para 1.

**O que troca no estilo padrão.** Ponto 2 (o tranco substitui o carimbo naquele bloco); tipografia, fundo e legenda ficam.

**Não copiar:** as palavras e respostas das referências, os textos em japonês, os nomes dos produtos, a moldura com timecode do split-flap.

**Referências**

- [Ren app launch video](https://prompt-motion.com/macrohou-33959d) · @macrohou · o veredito como rolo vertical de palavras desfocado que para na resposta, numa cena escura entre cenas claras
- [What day is it](https://prompt-motion.com/tankazunori0914-0fc886) · @tankazunori0914 · seletor varrendo os sete dias da semana com desaceleração até travar no certo, que explode em palavra gigante
- [Crux motion design showreel](https://prompt-motion.com/marouanegazouzi-6071d5) · @marouanegazouzi · letreiro split-flap com a promessa; olhar só as placas, a moldura com timecode em volta é o clichê da galeria

<a id="gramatica-de-anime"></a>

### gramatica-de-anime · Gramática de anime

`tipografia` · encaixe: orador, teaser, motion, cta · custo médio · força 4 · categorias: kinetic-type, characters · no template: `carimbos`, `letreiro`, `recorte`, `camera`

**O que é.** O repertório gráfico do anime de robô e de luta aplicado a qualquer coisa que se junta ou ataca: cada peça apresentada com placa de nome, anúncio em letreiro enorme, peças voando com linhas de velocidade, encaixe com onomatopeia e flash, close dramático e pose final com raios.

**Assinaturas**

- placa de nome inclinada com barra de cor à esquerda e nome em condensada (allforbigfire-86ff3c, 9:16, 25 s)
- letreiro em gótica japonesa ultra pesada itálica, amarelo `#F5C518` com contorno vermelho `#E8312A` e preto, entrando com batida de escala e tremor
- linhas de velocidade radiais no fundo e raios de sol atrás da pose final
- onomatopeia de impacto com flash branco de 2-3 frames no encaixe; inversão preto/branco como clímax (micheleharmonic-77628e)

**Quando usar / quando não usar**

- Usar: humor, conteúdo gamer ou geek, "junta as 3 ferramentas", antes e depois exagerado, revelação de produto com tom brincalhão.
- Não usar: nicho sóbrio (jurídico, saúde), marca premium, mais de 2 vezes no vídeo.

**Com o orador.** Bom para 1,5-2 s: o orador em tela cheia (ou recortado) ganha linhas de velocidade radiais atrás, uma placa de nome inclinada e uma onomatopeia no marco da palavra; depois volta ao enquadramento normal. Sem recorte, as linhas ficam por cima só nas bordas, longe do rosto.

**Como fazer no Remotion.** Linhas de velocidade: SVG com 60-90 triângulos finos radiais a partir do centro, comprimento e opacidade sorteados com semente, girando 1-2° por frame. Raios: `conic-gradient` com faixas alternadas girando. Placa: div inclinada com `clipPath` de paralelogramo que entra deslizando 40 px em 6 frames (`spring({damping: 200})`). Letreiro e onomatopeia: `carimbos` com a fonte trocada (ex.: Dela Gothic One, Mochiy Pop One no Google Fonts) e contorno duplo com `-webkit-text-stroke`; o flash e o tremor do carimbo já existem. Inversão: `filter: invert(1)` por 4-6 frames no clímax.

**O que troca no estilo padrão.** Ponto 2 (o carimbo ganha fonte e contorno de anime e pode bater 2-3 vezes na sequência), ponto 5 (raios e linhas de velocidade no lugar do halo) e ponto 6 no trecho (gótica pesada com contorno no lugar dos 4 papéis). Amarelo, vermelho e azul só se forem da marca; senão o letreiro usa acento, branco e preto.

**Não copiar:** o robô, os veículos, os textos em japonês das referências, o personagem de cabelo espetado, a moeda cromada.

**Referências**

- [Anime robot combining sequence](https://prompt-motion.com/allforbigfire-86ff3c) · @allforbigfire · 9:16: placa de nome para cada veículo, letreiro anunciando a fusão, peças voando sobre linhas de velocidade, onomatopeia de encaixe com flash, pose sobre raios
- [GravityDEX anime hype edit](https://prompt-motion.com/micheleharmonic-77628e) · @MicheleHarmonic · 9:16: uma palavra por golpe com aberração cromática e a inversão preto/branco no clímax
- [Shin Majin-shiki promo](https://prompt-motion.com/majin-appsheet-2d3c1a) · @Majin_AppSheet · título carimbado numa faixa vermelha inclinada sobre raios radiais, como vinheta de anime
- [Fiery samurai kata](https://prompt-motion.com/chrisjdimarco-f068db) · @chrisjdimarco · cada golpe nomeado em kanji vertical; olhar a tipografia, não a silhueta de brasa

---

## interface

<a id="forma-unica-que-morfa"></a>

### forma-unica-que-morfa · Forma única que morfa

`interface` · encaixe: produto, motion, orador, cta · custo médio · força 5 · categorias: product-ui, music, charts · no template: `encaixe`, `telaViva`

**O que é.** O conceito que o blog do site aponta como o do prompt mais bem recebido: todo estado é o mesmo elemento mudando largura, altura, raio e cor, com o conteúdo interno trocando por um desfoque curto. Nada corta, nada aparece do nada; um cursor real dirige cada mudança.

**Assinaturas**

- fundo cinza-quente claro `#ECECE8`, componente preto `#0A0A0A`, branco e um acento; uma fonte de UI (estilo Geist) em médio e bold (twoclipping-5cba86, 1440x1440, 14 s)
- 120 BPM, um evento por batida; último quadro igual ao primeiro (loop)
- molas com overshoot mínimo; indicador de aba com as duas bordas em molas diferentes, a da frente estica
- câmera aproxima para cada estado ocupar o quadro; sem esse zoom (demonugc-4c5753) sobra área vazia e o vídeo perde força

**Quando usar / quando não usar**

- Usar: demo de app, design system, lançamento de feature com 4-12 estados reais de UI, loop para feed.
- Não usar: produto sem estados de UI; estados sem relação entre si (vira morph gratuito).

**Com o orador.** Como sobreposição: uma pílula acima da cabeça (ou abaixo do queixo) morfa entre 2-4 estados no marco da fala (chip, toggle ligado, check concluído). Como frase de 2 s: o rosto encolhe e vira o botão (`Encaixe`), o botão morfa em 2 estados e se abre de volta no rosto.

**Como fazer no Remotion.** Cena sob medida `morfo` com `estados[{em, w, h, raio, cor, conteudo}]`. Cada propriedade = base + soma, para cada estado i, de `spring({frame: frame - em_i, config: {damping: 26, stiffness: 170}}) * (alvo_i - alvo_anterior)`: molas somadas, função pura do frame. Conteúdo: cada estado em camada própria com opacidade e `blur` 6 -> 0 cruzados em 5 frames, saída e entrada com tempos separados. Cursor: componente `Cursor` com keyframes por `interpolate` e `clique` no `em`. Câmera: `scale` no contêiner para o estado preencher ~70% do quadro. Para o orador: `Encaixe` da tela cheia para a pílula.

**O que troca no estilo padrão.** Ponto 1 (a TelaViva deixa de ser janela com blocos e vira um único elemento), ponto 8 (o encaixe vira a linguagem do vídeo inteiro), ponto 5 (sem halo e sem gradiente no chrome) e fundo (cinza-quente liso, sem grade).

**Não copiar:** os rótulos e números das telas da referência, a capa de álbum, a cor de acento.

**Referências**

- [Shape morphing through UI states](https://prompt-motion.com/twoclipping-5cba86) · @twoclipping · 1:1, 120 BPM: a mesma forma preta atravessa uma dúzia de estados de UI e volta ao botão em loop
- [Morphing UI states loop](https://prompt-motion.com/demonugc-4c5753) · @demonugc · mesmo conceito; nas folhas o elemento fica pequeno no quadro, com área vazia em volta: é o que evitar
- [AgentHud project motion video](https://prompt-motion.com/jazzen-chen-4542ae) · @Jazzen_Chen · toda a interface nasce e volta para uma pílula preta no topo da tela
- [Spotify product film](https://prompt-motion.com/brainextends-e19ac3) · @brainextends · palco arredondado com player persistente; a mesma capa atravessa busca, detalhe e zoom sem cortar

<a id="caixa-de-selecao-de-editor"></a>

### caixa-de-selecao-de-editor · Caixa de seleção de editor

`interface` · encaixe: orador, produto, explainer, dados · custo baixo · força 4 · categorias: product-ui, kinetic-type · no template: `orador`, `camera`, `print`

**O que é.** A linguagem visual de quem edita: seleção retangular com 8 alças, etiqueta de tamanho embaixo, painel de propriedades à direita, porcentagem de zoom no canto, cursor com nome de colaborador. Aponta o detalhe que importa e diz por que importa.

**Assinaturas**

- canvas `#EDEBE6` com grade de pontos, frames brancos, seleção e números de impacto em laranja `#F2542D` (kikelopezdesign-7cc9e8, 16:9, 20 s)
- etiqueta de dimensão em pílula de cor sob a seleção; indicador de zoom em % no canto inferior
- painel lateral com rótulo do frame, número de impacto enorme e uma linha de contexto
- câmera contínua de zoom e pan entre frames; zoom out geral no meio e no fim

**Quando usar / quando não usar**

- Usar: portfólio, case, antes e depois de design, "olha esse detalhe", explicar layout, mostrar onde clicar.
- Não usar: conteúdo sem objeto visual para selecionar; público que não conhece editores (a metáfora não lê).

**Com o orador.** Muito bom e barato. A moldura tracejada com 8 alças já existe na cena `orador` (`raw`): use a seleção em volta do rosto ou do objeto que ele mostra, com etiqueta, e no marco da palavra um painel lateral de 2 s com o número. Colchetes em volta de uma palavra do título acima da cabeça também funcionam.

**Como fazer no Remotion.** `MolduraSelecao` (peça da cena `orador`) com cor e etiqueta próprias; para a seleção saltar entre elementos, interpole x, y, largura e altura com `Easing.bezier(0.2, 0, 0, 1)` em 8 frames (mesma curva do `Encaixe`). Canvas de frames: `print` dos frames num plano grande + `camera` (zoom e pan com `spring({damping: 200, mass: 1.2})`). Painel lateral: div fixa à direita com `Contador` ou `numero`. Cursor com rótulo: `Cursor` + pílula.

**O que troca no estilo padrão.** Ponto 5 (sem halo: a ênfase é a seleção de cor sólida), ponto 7 (o HUD vira o chrome do editor, zoom % e painel, só com dado real) e fundo (grade de pontos clara no lugar da grade com halos).

**Não copiar:** o logotipo, os projetos e métricas do portfólio, a cor exata, o nome do colaborador.

**Referências**

- [Design portfolio video reel](https://prompt-motion.com/kikelopezdesign-7cc9e8) · @kikelopezdesign · canvas de editor com zoom entre frames, seleção laranja com etiqueta de tamanho e painel lateral trocando a métrica de impacto
- [TasteSkill dashboard showcase](https://prompt-motion.com/lexnlin-f9b3bd8) · @LexnLin · caixas de seleção com etiqueta mono marcando o detalhe que importa, como um diretor de arte apontando
- [Abstract motion design reel](https://prompt-motion.com/ajith-io-b5626e) · @ajith_io · caixa de transformação com alças e leitura de rotação; ignorar a moldura com timecode do reel
- [Lead Notifi product ad](https://prompt-motion.com/leadnotifi-e83f94) · @leadnotifi · colchetes de seleção enquadrando a palavra do gancho

<a id="keynote-macro-acento-unico"></a>

### keynote-macro-acento-unico · Keynote macro com acento único

`interface` · encaixe: orador, produto, dados, cta · custo baixo · força 4 · categorias: product-ui, charts · no template: `telaViva`, `camera`, `numeros`, `linha`

**O que é.** Contenção de evento de lançamento: uma superfície por vez, câmera em macro deslizando devagar sobre UI inclinada, o resto da interface escurece e só o número em foco ganha o acento. Sem overshoot, sem cor extra.

**Assinaturas**

- azul-noite `#0C0F1A` e `#1A2032`, acento dourado `#E8B84B` único, verde `#34D399` só no estado final (daniel-haida-8691d4, 16:9, 14 s)
- número grande em mono que resolve (dígitos assentando) e curva de gráfico dourada se desenhando
- ease-out forte sem overshoot, chegadas defasadas; o ritmo desacelera no trecho mais sério
- títulos de 2-3 palavras em sans geométrica, entrando por fade discreto

**Quando usar / quando não usar**

- Usar: finanças, SaaS B2B, produto premium, número que precisa de peso.
- Não usar: produto colorido ou infantil, humor, quando não há um número que importe.

**Com o orador.** Insert de 1,5-2 s no marco do número: o painel inclinado com o valor em mono assentando e a curva se desenhando, depois volta ao rosto. Um painel por volta.

**Como fazer no Remotion.** `telaViva` com `tela.perspectiva` (rotY de 28 para ~12, rotX 6) parando inclinada em vez de endireitar até 0, mais `camera` com escala 1,15-1,3 e pan lento. Foco seletivo: camada escura por cima com um furo na região do número (`mask-image: radial-gradient(...)`). Número: bloco `contador` com `Easing.out(Easing.quad)` em mono `tabular-nums`. Curva: `LinhaSVG` com `strokeDashoffset` em 30-40 frames. Medidor: anel SVG com `strokeDasharray`.

**O que troca no estilo padrão.** Ponto 5 (sem halo colorido atrás dos cards: a luz é o foco seletivo), ponto 2 (sem carimbo) e ponto 10 (só regime calmo no trecho). O acento continua sendo o da marca; o dourado é da referência.

**Não copiar:** a marca, os valores, os textos em alemão, o recibo da papelaria.

**Referências**

- [Taxtello bookkeeping app film](https://prompt-motion.com/daniel-haida-8691d4) · @daniel_haida · painel inclinado resolve o lucro em mono e desenha a curva dourada; recibo de papel encaixa na lista; medidor vira anel verde de "em ordem"
- [Frame by Frame launch video](https://prompt-motion.com/notdwd-7de38a) · @notdwd · contenção de keynote em fundo claro: poucas superfícies, uma por vez
- [Amazon wholesale pitch video](https://prompt-motion.com/ceowinkz-7c776b) · @ceowinkz · anúncio que passa de borrado para reconstruído com uma varredura de luz

---

## celular

<a id="parede-de-clipes-verticais"></a>

### parede-de-clipes-verticais · Parede de clipes verticais

`celular` · encaixe: orador, produto, teaser, cta · custo médio · força 4 · categorias: product-ui, phone, music · no template: `telaViva`, `camadas`, `card`

**O que é.** Volume como prova. Dezenas de vídeos verticais reais aparecem juntos (parede inclinada, depois carrossel curvo), a câmera mergulha num deles e ele vira o celular herói. A passagem de claro para escuro nasce do clique num botão: um círculo se abre a partir dele.

**Assinaturas**

- creme `#F4EFEA` no gancho e na UI, quase-preto `#0E0D0D` na parede, laranja `#FF6A3D` só na palavra marcada (twoclipping-6dd14e, 16:9, 20 s)
- corte em todo downbeat; ~2 s por ideia
- carrossel 3D com reflexo no chão (cópia invertida com máscara de degradê)
- número grande entrando com borrão de movimento

**Quando usar / quando não usar**

- Usar: criador de conteúdo, ferramenta de vídeo ou UGC, agência, "já fizemos 300", portfólio de vídeos verticais.
- Não usar: sem clipes reais (parede de placeholders denuncia); produto sem volume para mostrar.

**Com o orador.** O vídeo do orador recua (`Encaixe`) e vira um tile da parede de clipes dele mesmo; a câmera percorre a parede por 1,5-2 s e mergulha de volta no tile do orador, que volta a cobrir a tela. Exige ter os clipes.

**Como fazer no Remotion.** Parede: grade de `OffthreadVideo` (mudos, `trimBefore` variado) num plano com `rotateX(12deg) rotateY(-18deg)` e `perspective 1600`, câmera por `scale/translate` no contêiner. Carrossel: N cards no ângulo `theta_i = i * passo + giro(frame)` com `rotateY(theta) translateZ(R)`; reflexo com `-webkit-box-reflect: below 8px linear-gradient(transparent 60%, rgba(0,0,0,.35))`. Círculo que abre do botão: `clipPath: circle(r at x y)` com `r` de 0 a 150% em 12 frames. Muitos vídeos pesam no render: use poucos clipes em movimento e miniaturas estáticas no fundo.

**O que troca no estilo padrão.** Ponto 3 (camadas 3D viram parede e carrossel de vídeos), ponto 8 (o círculo que abre do botão substitui o encaixe nessa troca) e ponto 5 (sem halo; o reflexo no chão dá a profundidade).

**Não copiar:** os clipes, rostos e marcas da referência, os ganchos escritos, a interface do gerador.

**Referências**

- [UGC ad generator promo](https://prompt-motion.com/twoclipping-6dd14e) · @twoclipping · gancho com palavra marcada, link digitado e botão gerar, parede de clipes com zoom, lista de ganchos com nota, carrossel com reflexo, celular ao lado de métricas
- [Commotion app showreel](https://prompt-motion.com/amol909s-27533e) · @Amol909S · o próprio layout em mosaico do app usado como coreografia de abertura
- [Distilbook motion showreel](https://prompt-motion.com/itisrazak-3ad902) · @itisRazak · carrossel curvo de cards e parede de miniaturas inclinada

---

## dados

<a id="contador-que-e-o-relogio-da-historia"></a>

### contador-que-e-o-relogio-da-historia · Contador que é o relógio da história

`dados` · encaixe: orador, explainer, dados, teaser · custo baixo · força 5 · categorias: kinetic-type, charts, particles · no template: `numero`, `numeros`, `rec`, `telaViva`, `linha`

**O que é.** Em vez de um número que aparece e sai, um contador persiste e anda com a história: o que acontece em um segundo, quantos anos a pessoa tem, quanto falta. Cada marco da fala é um valor do mesmo contador, e a barra de progresso mostra onde estamos.

**Assinaturas**

- número grande em grotesca pesada com a unidade em peso leve ao lado e a frase explicativa em serifa itálica embaixo (nolkeeg-bf062e, 16:9, 45 s)
- barra fina de tempo decorrido na base, avançando junto com o contador
- rótulos mono minúsculos para metadados; contadores correndo rápido e assentando
- fundo quase preto `#050608` com um acento `#E8532A` no rótulo e na barra

**Quando usar / quando não usar**

- Usar: explainer de escala ("em 1 minuto acontecem..."), história de vida, prazo, contagem regressiva, custo acumulado ("quanto você perdeu até agora").
- Não usar: número inventado ou sem fonte; número que não muda com a história.

**Com o orador.** Ótimo. O contador fica como sobreposição fixa (canto superior ou abaixo do queixo, nunca sobre os olhos) e sobe a cada marco da fala; nas voltas em tela cheia (1,5-2 s) o número ocupa o centro com a frase itálica e a barra. O dado precisa de fonte (o blog lembra: nada de número inventado).

**Como fazer no Remotion.** Sobreposição `numero` com `valores[{v, em}]` (rola em 6 frames) no modo orador; em tela cheia, cena `frase` com `numero` + linha itálica (papel emocional) e uma barra cuja largura é `interpolate(frame, [ini, fim], [0, 1])`. Telemetria múltipla: blocos `contador` da `telaViva` em coluna mono, sem janela. ECG: `LinhaSVG` forma `ecg` com o período interpolado (o batimento desacelera). Barra de contexto: `Hud` com uma barra única no lugar da barra de capítulos.

**O que troca no estilo padrão.** Ponto 7 (o HUD mostra o contador e a barra de tempo, que são dado e não decoração) e ponto 6 (unidade em peso leve e frase inteira em serifa itálica, exceção à regra de uma palavra emocional). O resto fica.

**Não copiar:** os números e fatos das referências (checar e citar a própria fonte), a Terra e o Sol renderizados, o título de abertura.

**Referências**

- [What happens in one second](https://prompt-motion.com/nolkeeg-bf062e) · @nolkeeg · um único segundo vira o vídeo: número grande com unidade, frase em serifa itálica e barra de tempo decorrido na base
- [Photon journey from the Sun](https://prompt-motion.com/apoorvjain25-d24184) · @apoorvjain25 · telemetria mono ao vivo de um fóton (anos, profundidade, temperatura, colisões) e barra de trajeto Sol-Terra
- [Cycle of life animation](https://prompt-motion.com/loicrambo-ad6830) · @loicRambo · HUD de idade e batimentos com ECG no canto, que desacelera junto com a vida
- [Black hole time story](https://prompt-motion.com/rebutonepress-810f78) · @RebutonePress · telemetria nos cantos mudando com a narração ao longo de 5 minutos
- [Chaotic Claude POV video](https://prompt-motion.com/kloss-xyz-15182a) · @kloss_xyz · 9:16: barra de contexto da IA que enche e marca o tempo da história
- [Travel visa service promo](https://prompt-motion.com/thismacapital-dfba20) · @thismacapital · mala parada no centro, chip de etapa trocando acima dela e contador avançando até tudo resolver

<a id="matriz-de-pontos"></a>

### matriz-de-pontos · Matriz de pontos que conta e desenha

`dados` · encaixe: orador, dados, produto, explainer · custo médio · força 4 · categorias: charts, product-ui, particles · no template: `numeros`, `frase`

**O que é.** Gráfico de unidades. O número não é só texto: é uma grade de N pontos que o espectador vê, e os mesmos pontos se reorganizam conforme a história (grade, mapa, rosca, barra). Como linguagem de desenho, a mesma matriz faz ícones e barras do produto.

**Assinaturas**

- número grande condensado com legenda em serifa itálica e a grade de pontos embaixo (jesscaroline7-1ff7cb, 9:16, 60 s)
- os pontos interpolam de posição de grade para coordenada de mapa e depois para ângulo de rosca, sem corte
- uma cor só nos pontos (laranja `#EE5A0E` ou branco no escuro); legenda de três categorias com números
- na versão linguagem (manuelogomigo-f33ca9) os pontos acendem em onda e a barra de progresso é feita de pontos com cabeça brilhante

**Quando usar / quando não usar**

- Usar: qualquer número contável (clientes, lugares, votos, casos), proporção ("7 em cada 10"), mapa de alcance.
- Não usar: números muito grandes sem escala declarada (1 ponto = 1.000 precisa estar escrito); dado sem contagem.

**Com o orador.** Frase de 1,5-2 s: grade de 10x10 que acende 70 pontos no marco do "7 em cada 10", com o número ao lado; volta ao rosto. Em voltas seguidas os mesmos pontos podem virar mapa ou rosca, e o espectador reconhece o objeto.

**Como fazer no Remotion.** Cena sob medida `pontos` com `n` e `layouts[{em, tipo: grade | mapa | rosca | barra}]`. Para cada ponto, a posição alvo em cada layout (mapa: pontos amostrados dentro de um path SVG com semente fixa; rosca: ângulo `2π i / n` com raio sorteado numa faixa) interpolada por `spring({damping: 200})` com atraso `i % 30` frames para a onda. Acima de ~2.000 pontos, desenhe em `<canvas>` redesenhado a cada frame; abaixo, SVG serve. Número: `numeros` ou `numero`.

**O que troca no estilo padrão.** Ponto 1 no trecho (o dado vira objeto em vez de UI) e ponto 5 (sem halo atrás de card: a luz é o próprio ponto aceso). Tipografia e paleta da marca ficam.

**Não copiar:** os números do app, o mapa da cidade, a ilustração isométrica, os selos de conquista, a hélice de DNA da marca.

**Referências**

- [Ondefica app motion reel](https://prompt-motion.com/jesscaroline7-1ff7cb) · @jesscaroline7 · 9:16: total de lugares como grade de pontos que se espalha e vira mapa, depois rosca de partículas com o percentual no centro
- [Flowdrive motion showreel](https://prompt-motion.com/manuelogomigo-f33ca9) · @manuelogomigo · ícones, barra de progresso, globo e infinito, todos em matriz de pontos laranja
- [Gene Spectra promo](https://prompt-motion.com/madebyjmayala-b9204d) · @madebyjmayala · hélice de pontos que se desfia em feixes coloridos escoando para uma barra-espectro com a contagem
- [Backlink audit data promo](https://prompt-motion.com/palashbagchi11-0a4b6b) · @PalashBagchi11 · porcentagem gigante ao lado de uma grade de pontos que acende na mesma proporção
- [Dub promo video](https://prompt-motion.com/steventey-0d20e4) · @steventey · globo pontilhado com contador ao vivo dando escala logo na abertura

<a id="total-que-se-monta-a-vista"></a>

### total-que-se-monta-a-vista · Total que se monta à vista

`dados` · encaixe: orador, produto, dados, cta · custo baixo · força 4 · categorias: product-ui, charts · no template: `telaViva`, `numero`, `carimbos`

**O que é.** Argumento de venda como conta que o espectador acompanha. Em vez de dizer o total, a tela soma os itens um a um até o total aparecer; ou o progresso de 8% a 100% é feito de objetos concretos entrando.

**Assinaturas**

- pílula de progresso no canto que sobe a cada objeto que entra no diorama (gabrielbuzziv-4ff0c6, 16:9, 15 s)
- lista que cresce linha a linha com o total subindo, seguida do reframe por dia numa cartela escura (thayto-dev-44b911)
- serifa de display com a segunda palavra em itálico colorido nas frases curtas (roxo `#7A4FA0` na referência)
- entradas em stagger e fade curto; ritmo de slide calmo

**Quando usar / quando não usar**

- Usar: preço, ROI, custo do problema, economia, "tudo que você ganha no plano".
- Não usar: números que não somam de verdade; mais de 6 itens (a conta perde leitura).

**Com o orador.** Ótimo para venda. A lista entra como sobreposição ao lado do rosto, ou em 2-3 voltas de 1,5 s, cada uma com um item novo e o total maior; na última volta o total trava com carimbo e a legenda some (regra 2).

**Como fazer no Remotion.** `telaViva` com blocos `lista` (itens com `estados`) e `contador` encadeados (cada item soma um valor no seu `em`); reframe com cena `frase` escura e `numero`. Diorama de progresso: PNGs em camadas que entram com `entraUI` em ordem, mais pílula com o percentual. Slider: barra + `Cursor` arrastando, valor = `interpolate` da posição do cursor. Fecho: `carimbos` no total.

**O que troca no estilo padrão.** Quase nada: usa a TelaViva (ponto 1) e o carimbo (ponto 2) na conclusão. Muda só o regime do trecho (ponto 10): nada de rajada, a conta precisa de leitura.

**Não copiar:** os preços, planos e marcas das referências, o quarto de bebê, os textos das telas.

**Referências**

- [Enxovaly baby app promo](https://prompt-motion.com/gabrielbuzziv-4ff0c6) · @gabrielbuzziv · quarto isométrico que se mobilia peça por peça enquanto a pílula de progresso vai de 8% a 100%
- [AjustaCV Pro pricing promo](https://prompt-motion.com/thayto-dev-44b911) · @thayto_dev · preço como conta visível: a lista de vagas engorda o total até o plano parecer barato, depois o reframe em centavos por dia
- [Tally product demo](https://prompt-motion.com/visheshbaghell-3aba37) · @VisheshBaghell · texto bagunçado ganha grifos que viram, linha a linha, o dinheiro que faltava na fatura
- [Mascot referral program promo](https://prompt-motion.com/paulo-kombucha-96431c) · @paulo_kombucha · slider de calculadora arrastado pelo cursor, comissão subindo ao vivo
- [AIsa API key promo](https://prompt-motion.com/0xfemyn-e114d3) · @0xfemyn · contador que explode cercado de etiquetas de erro, resolvido por uma única chave

---

## diagrama

<a id="anotacao-a-mao-sobre-o-movimento"></a>

### anotacao-a-mao-sobre-o-movimento · Anotação à mão sobre o movimento

`diagrama` · encaixe: orador, explainer, produto, motion · custo médio · força 5 · categorias: diagrams, product-ui, kinetic-type · no template: `riscado`, `linha`, `orador`

**O que é.** Uma camada de "professor ao lado": traço manuscrito que se desenha no marco da fala, apontando para o que importa, nomeando o que acabou de acontecer, riscando o termo errado. O desenho é sempre sobre algo que já está na tela, nunca decoração solta.

**Assinaturas**

- papel `#EFEDE6` com documentos e post-it inclinados; notas em manuscrita (tipo Caveat) em vermelho-terroso `#A3412E` e verde-escuro (ik-builds-b8bdcf, 16:9, 15 s)
- setas e círculos desenhados por `stroke-dashoffset` logo depois do movimento que comentam
- termo riscado com uma linha e a correção escrita ao lado
- troca brusca de papel claro para fundo escuro na virada, sincronizada com a queda da bateria

**Quando usar / quando não usar**

- Usar: explicar um método, mostrar o "antes" errado, tutorial, comentar uma tela real, humor leve.
- Não usar: marca de luxo ou muito séria; tela já cheia de texto (a anotação vira ruído).

**Com o orador.** Um dos melhores encaixes. Seta e nota manuscrita apontando para o rosto ou para o objeto que ele segura, círculo em volta de um detalhe, palavra riscada acima da cabeça com a correção. Fora dos olhos, entrando 3 frames antes da palavra.

**Como fazer no Remotion.** Componente `Anotacao` com `paths[]` (SVG desenhado à mão, ou gerado com ruído leve de semente fixa nos pontos) e `texto` em fonte manuscrita do Google Fonts (Caveat, Kalam, Patrick Hand). Cada path com `pathLength 1` e `strokeDashoffset` de 1 para 0 em 8-12 frames (`Easing.out(Easing.cubic)`), ponta da seta aparecendo nos 3 últimos frames. Riscado: a sobreposição `riscado` com cor e espessura de caneta. Onion skin: 4-6 cópias da bola com opacidade decrescente nas posições de frames anteriores (função pura).

**O que troca no estilo padrão.** Ponto 2 (a nota manuscrita substitui o carimbo como pontuação), ponto 5 (sem halo) e, na versão em papel, o fundo (papel claro sem grade). Os papéis tipográficos ficam nos títulos; a manuscrita só nas notas.

**Não copiar:** a marca, os textos das notas, a bola verde-água como mascote, a frase do título.

**Referências**

- [Paper-style product launch film](https://prompt-motion.com/ik-builds-b8bdcf) · @ik_builds · papel claro, bola com onion skin, documentos e post-it com setas e notas manuscritas, curva de crescimento que passa do teto riscado
- [Motion designer showreel](https://prompt-motion.com/himanshutwtxs-5f4b43) · @himanshutwtxs · bola quicando com fantasmas e notas à mão, gráfico linear riscado e trocado por ease in-out
- [Motion principles showreel](https://prompt-motion.com/chatgptastra-0d95c7) · @ChatGptAstra · anotações de professor apontando o princípio na hora em que ele acontece
- [Whiteboard skill tutorial](https://prompt-motion.com/lemomo-ai-0d9cff) · @lemomo_ai · marcador de quadro branco desenhando em volta de telas reais de software
- [Distilbook motion showreel](https://prompt-motion.com/itisrazak-3ad902) · @itisRazak · o produto desenhando a explicação a traço de caneta dentro de um player, com legenda acendendo palavra por palavra
- [DistilBook product explainer](https://prompt-motion.com/sudo-kiran-6609ed) · @sudo_kiran · fecho com o problema riscado à mão em cima do próprio slogan

<a id="janelas-neo-brutalistas"></a>

### janelas-neo-brutalistas · Janelas neo-brutalistas

`diagrama` · encaixe: orador, explainer, produto, dados · custo médio · força 4 · categorias: product-ui, diagrams, kinetic-type · no template: `telaViva`, `carimbos`, `passos`, `numeros`

**O que é.** Diagrama de sistema com cara de quadro de avisos: cada entidade é um card chapado de cor pastel com borda preta grossa e sombra sólida deslocada, ligado por conectores. Os passos têm rótulo em pílula, o tempo é uma barra que esvazia e a mudança de estado é um carimbo.

**Assinaturas**

- creme `#FBF8EE` com pastéis rosa `#F07FD6`, ciano `#9EE8F0`, verde `#8EE07A` e amarelo `#F2C94C`; borda preta grossa e sombra sólida deslocada (0xnfrith-5be616, 16:9, 53 s)
- títulos em grotesca condensada extra-bold caixa alta com uma palavra em marca-texto; relógios e rótulos em mono
- barras de lease animando linearmente, como tempo real; carimbo sobre o card na troca de dono
- estrelas-adesivo e listras de alerta como acento; corte seco por capítulo

**Quando usar / quando não usar**

- Usar: explicar arquitetura, processo com estados, regras de negócio, comparação de duas opções; público técnico que gosta de humor gráfico.
- Não usar: marca premium escura, conteúdo emocional.

**Com o orador.** Bom em voltas de 2-2,5 s: um card brutalista com o passo da vez entra com pop no marco da fala, o carimbo bate na conclusão, volta ao rosto. Também como lista lateral (`passos`) com o orador em card.

**Como fazer no Remotion.** Componente `CardBruto` (borda 4 px `#111`, `boxShadow: 8px 8px 0 #111`, raio 6-10) usado por uma cena sob medida que posiciona entidades e conectores (SVG com `strokeDashoffset`). Barras: div com largura por `interpolate` linear entre `em` e `ate`. Carimbo: `carimbos` com fonte condensada. Pílulas de capítulo: `Chip` restilizado. Halftone dos cantos: SVG `pattern` de círculos.

**O que troca no estilo padrão.** Ponto 5 (sombra dura no lugar de halo e glow), ponto 1 (cards brutalistas no lugar da janela escura da TelaViva), fundo (creme liso, sem grade nem halos) e paleta (pastéis por entidade: conflito com "nunca terceira cor"; use tons do acento ou limite a 3 entidades).

**Não copiar:** o nome do produto, as máquinas com esses textos, os adesivos exatos, o magenta da outra referência.

**Referências**

- [Celld job ownership explainer](https://prompt-motion.com/0xnfrith-5be616) · @0xnfrith · máquinas como cards, balde compartilhado como árbitro, barras de lease esvaziando, carimbo de expirado, comparação final com checks
- [Jev engineering showreel](https://prompt-motion.com/polydao-7a572b) · @polydao · deck de janelas com barra de título e número do capítulo, manchas halftone nos cantos, whip-pans com motion blur entre capítulos

<a id="fio-vermelho-linha-do-tempo"></a>

### fio-vermelho-linha-do-tempo · Fio vermelho da linha do tempo

`diagrama` · encaixe: orador, explainer, dados, teaser · custo médio · força 4 · categorias: diagrams, kinetic-type · no template: `linha`, `titulo`, `numero`

**O que é.** História contada em paradas fixas. Um fio fino de uma cor passa por todas as pranchas (desenha o objeto da era, contorna, segue) e no fim recua para mostrar todas as paradas em linha com ícones. Cada prancha tem número, data e título editorial.

**Assinaturas**

- creme `#F3E9D2` alternando com vermelho `#E8432A`, amarelo `#F6B31B` e azul `#1F2C6E` por era; fio vermelho constante (buildfastwithai-53234e, 16:9, 87 s)
- título bilíngue grande (condensada pesada + serifa itálica de apoio), mono pequena no cabeçalho e nas notas
- barra de progresso na base com marcadores por prancha; número da prancha no canto
- ano gigante atrás do título em opacidade baixa (kloss-xyz-fe0c31)

**Quando usar / quando não usar**

- Usar: história de empresa, evolução de um tema, cronologia, "como chegamos aqui"; vídeos de 60-180 s.
- Não usar: menos de 4 paradas; cronologia sem fonte das datas.

**Com o orador.** A régua de anos fica fixa no topo durante o vídeo (inclusive sobre o rosto, como HUD com dado) e o ano do trecho aparece gigante e fantasma atrás da cabeça (`numero` com `camada: atras`); nas voltas de 2 s, a prancha da era com o fio desenhando.

**Como fazer no Remotion.** O fio é um `path` SVG por cena com `strokeDashoffset` encadeado: o fim do fio de uma cena coincide, na mesma coordenada de tela, com o começo da próxima. Pranchas: moldura fixa (cabeçalho, número, barra) com `Sequence` por era. Ano fantasma: `numero` grande a 5-8% de opacidade. Wipe em degraus: grade de retângulos que acendem em diagonal com atraso de 1 frame por (coluna + linha). Linha final: `camera` afastando de 1,4 para 1.

**O que troca no estilo padrão.** Ponto 7 (a barra de capítulos vira a régua de anos), ponto 8 (o fio que continua substitui o encaixe entre cenas) e fundo (cores chapadas por era em vez da grade; conflito de paleta: use variações do acento e neutros por era, não 4 cores novas).

**Não copiar:** escritas, numerais e motivos culturais da referência, as datas e os fatos, o título do filme.

**Referências**

- [Indian civilisation history film](https://prompt-motion.com/buildfastwithai-53234e) · @BuildFastWithAI · pranchas numeradas com cabeçalho editorial; o fio vermelho desenha cada era e vira a linha do tempo final com ícones; wipe em degraus pixelados
- [History of AI timeline](https://prompt-motion.com/kloss-xyz-fe0c31) · @kloss_xyz · capítulos com régua de anos fixa no topo e o ano enorme em baixa opacidade atrás do título
- [Moroccan political history timeline](https://prompt-motion.com/triglyceee-bd5b08) · @TrigLyceee · partidos como pílulas acima e abaixo do eixo do tempo, cisões como ramificações

<a id="o-objeto-e-o-grafico"></a>

### o-objeto-e-o-grafico · O objeto do assunto é o gráfico

`diagrama` · encaixe: orador, explainer, produto, dados · custo médio · força 4 · categorias: diagrams, product-ui, charts · no template: `telaViva`, `linha`, `numeros`

**O que é.** Processo com começo e fim (segundo o blog do site, a receita do explainer mais curtido) mostrado no próprio objeto: o copo é o gráfico, o tubo é o cálculo, o balde é o algoritmo. Um card ou stepper ao lado diz o passo e a medida, e tudo deriva da mesma conta.

**Assinaturas**

- linhas de cota com valor e ângulo presas ao objeto, desenhadas por traço (adamdesgns-478d6d, 16:9, 15 s)
- tabela de cálculo em mono em que os valores rolam por dígito até o resultado na cor de destaque (`#E8B53A` na referência)
- versão receita: copo vazio, nível subindo com easing até a marca de cada ingrediente, card com o número do passo e barra de progresso, ~5 s por etapa (ror-fly-9950f1)
- versão algoritmo: medidor, log e gráfico desenhados pela mesma função do tempo, sem easing decorativo (parkerrex-1a54fe)

**Quando usar / quando não usar**

- Usar: tutorial, receita, cálculo do ofício do público (obra, contabilidade, cozinha, código), "como funciona" com sequência visível.
- Não usar: tema sem processo (o blog mostra que tema solto sai genérico); números não conferidos.

**Com o orador.** Cada passo dito vira uma volta de 1,5-2 s ao objeto, que avança um estágio (o copo ganha uma camada, a cota ganha o valor); entre as voltas, o rosto. O objeto guarda o estado entre as voltas e o espectador vê o progresso.

**Como fazer no Remotion.** Cena sob medida com o objeto em SVG: nível do líquido = retângulo mascarado pelo contorno do copo, com altura por `interpolate` por etapa; cotas = `line` + marcadores + texto entrando por `strokeDashoffset`; cálculo = blocos `contador` da `telaViva` em mono. Stepper: `telaViva` `checklist` ou `timeline`. Algoritmo: uma função determinística `estado(t)` alimenta barras, `terminal` (log) e um `path` em degraus amostrado frame a frame.

**O que troca no estilo padrão.** Ponto 1 (o dado sai da UI e vai para o objeto; a TelaViva fica só como card do passo), ponto 5 (sem halo) e fundo conforme o ofício (papel para receita, escuro técnico para engenharia).

**Não copiar:** o app e o ofício específico da referência, as receitas e medidas (conferir as do cliente), os títulos com sombra de adesivo.

**Referências**

- [Fitters Bible app promo](https://prompt-motion.com/adamdesgns-478d6d) · @Adamdesgns · desenho técnico do ofício: tubo cromado com cotas, rabisco que vira isométrico limpo, caixa tracejada com o cálculo rolando por dígito
- [Negroni recipe animation](https://prompt-motion.com/ror-fly-9950f1) · @Ror_Fly · 1:1: receita em traço à mão, nível do copo subindo até as marcas de medida, card de passo com barra e stepper com checks
- [White Russian recipe animation](https://prompt-motion.com/sarut0bisasuke-cefa43) · @Sarut0biSasuke · copo que enche camada por camada com a checklist da receita marcando ao lado
- [Token bucket rate limiter](https://prompt-motion.com/parkerrex-1a54fe) · @ParkerRex · 1:1: medidor, log e gráfico em degraus sincronizados pela mesma conta
- [Derivative concept explainer](https://prompt-motion.com/linearuncle-5d2bae) · @LinearUncle · lupa que aproxima a curva até ela virar reta
- [Lism CSS 1.0 release video](https://prompt-motion.com/ddryo-loos-300829) · @ddryo_loos · cada conceito técnico vira uma figura medida e anotada, como documentação que se anima

---

## formas

<a id="figuras-numeradas-de-livro"></a>

### figuras-numeradas-de-livro · Figuras numeradas de livro

`formas` · encaixe: orador, explainer, motion, teaser · custo médio · força 5 · categorias: shapes, kinetic-type · no template: `frase`, `linha`, `rajada`

**O que é.** O vídeo como livro de referência: margens, cabeçalho discreto, uma figura por página e uma legenda que nomeia o que se vê. A cor é uma tinta só (ou preto + uma anotação vermelha). O mesmo objeto atravessa as figuras e vai ganhando dimensão.

**Assinaturas**

- papel `#EFEBDF`, preto `#111111` e uma tinta de anotação `#D9452B` (hbcoop-de365c, 16:9, 29 s), ou tudo em cobalto `#2A24C9` (fionntobin-97b7af, 128 BPM)
- legenda com o número da figura em versalete colorido + nome em serifa itálica, centralizada na base; cabeçalho em versalete minúsculo nos cantos superiores
- anotação geométrica fina (raio, diâmetro, coeficiente) desenhada junto ao objeto
- transformação sem corte entre figuras e física crível (quique com perda de energia); ritmo calmo

**Quando usar / quando não usar**

- Usar: explainer conceitual, ciência, educação, marca editorial, "do simples ao complexo".
- Não usar: varejo, promoção agressiva, nicho que pede muita cor.

**Com o orador.** Cada volta é uma página: "Fig. 2 · o problema" com o objeto desenhado por 2 s, rosto, "Fig. 3 · a virada", rosto. A numeração dá estrutura ao vídeo e substitui a barra de capítulos.

**Como fazer no Remotion.** Moldura fixa (cabeçalho em `RotuloMono`, legenda na base com número + `TextoMisto` em serifa itálica) e um `Sequence` por figura. Objetos 2D em SVG: linha que nasce do ponto (`scaleX` de 0 a 1), círculo por `strokeDashoffset`, bola com parábola e coeficiente de restituição calculados por frame, rastro = pontos nas posições de frames anteriores. Halftone em canvas com raio por função de onda. Revoada só com boids pré-calculados com semente (ou dispense). Frase final digitada: bloco `prompt` sem janela.

**O que troca no estilo padrão.** Fundo (papel creme sem grade nem halo), paleta (uma tinta: o acento da marca vira a tinta única), ponto 5 (sem luz emitida), ponto 6 (serifa de livro nas legendas, títulos sem gradiente) e ponto 7 (a numeração de figura substitui a barra de capítulos).

**Não copiar:** o título e o cabeçalho das referências, a frase final, a matriz de glifos e o wordmark.

**Referências**

- [Full Stop figure sequence](https://prompt-motion.com/hbcoop-de365c) · @HBCoop_ · papel creme: um ponto vira linha, círculo, lente, bola com rastro vermelho, revoada e globo; legenda "FIG. n" e frase final datilografada
- [Blue editorial motion showreel](https://prompt-motion.com/fionntobin-97b7af) · @fionntobin · livro suíço de uma tinta cobalto: grade, tipo fragmentado, gráfico que é a música, pictograma, halftone, matriz de glifos
- [Motion designer showreel](https://prompt-motion.com/teslachartz-c58b32) · @TeslaChartz · capítulos numerados como figuras técnicas, toro metade sólido metade malha

<a id="bauhaus-primarias"></a>

### bauhaus-primarias · Bauhaus em primárias

`formas` · encaixe: motion, teaser, explainer, cta · custo médio · força 4 · categorias: kinetic-type, shapes · no template: `letreiro`, `camadas`

**O que é.** Gramática da escola de design aplicada ao motion: três formas primárias com três cores primárias, composição em grade e uma progressão de dimensão (ponto vira linha vira plano vira volume). A tipografia ultra-bold divide o quadro com as formas.

**Assinaturas**

- vermelho `#E5322B`, amarelo `#F2C81F`, azul `#2F3FE0` sobre papel `#F2EEE4` ou quase-preto `#0A0A0C` (lukasersil-0ed38e, 16:9, 15 s, 120 BPM)
- capítulos de ~1,5 s com transição por continuidade de forma (a linha vira barras, as formas viram volumes)
- grotesca larga black em caixa alta; letra substituída por forma (o O vira círculo)
- escalada em atos no pôster: pressão, expansão, ruptura, recomposição (pankajkumar-dev-0bee87, 30 s)

**Quando usar / quando não usar**

- Usar: marca de design, escola, arquitetura, abertura de canal criativo, peça curta de capacidade.
- Não usar: marca com paleta própria forte (as primárias brigam com ela); talking head de nicho comum.

**Com o orador.** Não se aplica bem: a linguagem depende de composição em tela inteira com as três primárias, que brigam com a paleta da marca e com o rosto. Uma prancha isolada de 2 s até funciona, mas perde a progressão, que é a força da direção.

**Como fazer no Remotion.** Formas em SVG; progressão por `interpolate` de propriedades geométricas (linha: círculo achatado em `scaleX`; plano: `rect` crescendo; volume: CSS 3D com faces e `rotateX/rotateY`, ou `Camadas3D`). Grade de formas: posições de `layoutBento()` + `rotateY` escalonado (2 frames) até virar barras. Pôster: div com `rotateX/rotateY` e blocos coloridos fora do `overflow`. Cromo e fluido exigem `@remotion/three` ou vídeo pré-renderizado.

**O que troca no estilo padrão.** Paleta (três primárias no lugar do acento único: conflito direto com "nunca terceira cor"; só com aceite da marca, ou troque por acento + dois neutros), fundo (papel ou preto liso), ponto 5 (sem halo) e ponto 6 (uma grotesca larga black).

**Não copiar:** a moldura com timecode, a palavra do cartão final, o cartão de currículo, as composições exatas.

**Referências**

- [Motion techniques showreel](https://prompt-motion.com/lukasersil-0ed38e) · @lukasersil · ponto, linha, plano, volume, fluido e partícula amarrados pelas três primárias; ignorar a moldura com timecode
- [Motion design showreel](https://prompt-motion.com/samuel-spitz-974923) · @samuel_spitz · geometria Bauhaus chapada em flip até virar barras, contra esfera de cromo líquido
- [Type, form, space showreel](https://prompt-motion.com/web3wesley-7bb108) · @Web3Wesley · grade Bauhaus que se extruda em blocos 3D com bola vermelha quicando por cima
- [Poster breaking its frame](https://prompt-motion.com/pankajkumar-dev-0bee87) · @pankajkumar_dev · pôster com grade e metadados pressionado pela palavra, blocos de cor vazando e colagem final sem moldura

<a id="liquido-que-escorre"></a>

### liquido-que-escorre · Líquido que escorre

`formas` · encaixe: orador, produto, cta, teaser · custo médio · força 4 · categorias: kinetic-type, shapes, diagrams · no template: `frase`, `linha`

**O que é.** Um material só (líquido viscoso da cor da marca) faz todas as ligações: a linha sob o nome pinga, o caminho entre dois pontos é um rastro de gotas, o medidor é um recipiente com bolhas e as integrações se ligam ao centro por braços que se fundem.

**Assinaturas**

- verde-limão `#E2FF1F` com preto `#151515` e off-white `#F0F0EA`, fundos alternando entre os três (leadnotifi-e83f94, 16:9, 45 s)
- grotesca larga extendida em caixa alta, mono minúscula nas legendas, número gigante bold no medidor
- transições por gota e líquido, morph orgânico; anéis de texto girando devagar
- hub central com 6 braços de metaball terminando em pílulas de integração

**Quando usar / quando não usar**

- Usar: marca com cor forte e vibrante, produto de integração ou fluxo, tom jovem.
- Não usar: marca sóbria; cor de marca escura (o líquido precisa de cor clara e saturada para ler).

**Com o orador.** O sublinhado que escorre sob a palavra-chave do título acima da cabeça (1,5 s, pinga 2-3 gotas e some) e o medidor com líquido como sobreposição ao lado do rosto, com o número.

**Como fazer no Remotion.** Filtro goo em SVG (`feGaussianBlur stdDeviation 8` + `feColorMatrix` com alfa `0 0 0 18 -7`) aplicado a um grupo de círculos e retângulos; gotas = círculos que descem com `spring` e se separam quando passam do limiar do filtro. Braços do hub: linhas grossas sob o mesmo filtro. Medidor: círculo com `clipPath`, superfície em onda (`path` com seno do frame) e bolhas com semente. Anéis de texto: `textPath` circular girando.

**O que troca no estilo padrão.** Ponto 5 (o líquido de cor chapada substitui halo e glow), ponto 6 (grotesca larga extendida, sem gradiente) e fundo (cor chapada da marca alternando com preto e off-white).

**Não copiar:** o nome do produto, as saudações em várias línguas, o score e o nome do lead, o verde-limão se não for da marca.

**Referências**

- [Lead Notifi product ad](https://prompt-motion.com/leadnotifi-e83f94) · @leadnotifi · palavra entre colchetes, sublinhado escorrendo, esfera de pontos com contador, medidor com líquido e score, hub com braços líquidos
- [3D motion design showreel](https://prompt-motion.com/sahildesigner23-ee3155) · @sahildesigner23 · metaballs cromadas em simulação sobre laranja: o mesmo material em 3D; olhar só esse plano, não a moldura do reel

<a id="o-video-explica-a-propria-tecnica"></a>

### o-video-explica-a-propria-tecnica · O vídeo explica a própria técnica

`formas` · encaixe: motion, explainer · custo médio · força 3 · categorias: kinetic-type, shapes, music · no template: `linha`, `telaViva`, `bento`

**O que é.** Metalinguagem: o vídeo mostra o método enquanto o executa. Funciona como aula visual de motion (timing, spacing, squash, easing) e como prova de que o movimento é intencional.

**Assinaturas**

- trilhos paralelos com bolinhas e a miniatura da curva ao lado de cada um (linear, ease-in-out, expo-out, back-out, elastic, bounce)
- réguas tipográficas finas (ascendente, altura-x, linha de base) sobre a palavra; legendas técnicas em serifa itálica pequena
- timeline com marcadores na base e playhead avançando
- capítulos de ~1 s em azul-marinho `#10297A` com vermelho e amarelo (vanshwtfff-db0466, 10 s)

**Quando usar / quando não usar**

- Usar: vídeo sobre edição, motion design, animação, ferramentas de vídeo; tutorial "por que isso parece profissional".
- Não usar: qualquer outro nicho: vira enfeite técnico que o público não lê. É um dos padrões mais repetidos da galeria (cerca de 20 itens mostram curva ou keyframes na tela).

**Com o orador.** Só em conteúdo sobre edição ou motion; aí a curva desenhada ao lado do rosto no marco de "ease-out" ou "mola" funciona como frase de 2 s. Em outro nicho não se aplica, por isso não está marcada como `orador`.

**Como fazer no Remotion.** As funções `Easing` do próprio Remotion desenham a miniatura (amostrar `Easing.x(t)` em 40 pontos num `path`) e movem a bolinha com o mesmo `interpolate`, então a curva mostrada é a usada. Réguas: linhas SVG nas alturas das métricas da fonte. Timeline: bloco `timeline` da `telaViva` com o playhead preso ao frame. Recapitulação final: `bento` com stills dos capítulos.

**O que troca no estilo padrão.** Ponto 7 (o HUD vira a explicação técnica, válido só quando é o assunto) e ponto 6 (legendas técnicas em serifa itálica pequena). O resto fica.

**Não copiar:** o nome do modelo no wordmark, os cartões de currículo, a moldura com timecode.

**Referências**

- [Motion designer showreel](https://prompt-motion.com/vanshwtfff-db0466) · @VanshWTFFF · cada letra com um easing diferente e a curva desenhada embaixo; réguas de ascendente e linha de base sobre a palavra
- [Easing and morphing showreel](https://prompt-motion.com/roundtablespace-d3a1be) · @RoundtableSpace · seis bolinhas percorrendo a mesma distância com easings diferentes
- [Swiss-style motion showreel](https://prompt-motion.com/levabashidze-2d713a) · @levabashidze · editor de curva de mola com parâmetros e uma tela falsa de render que recapitula os capítulos
- [3D motion design showreel](https://prompt-motion.com/sahildesigner23-ee3155) · @sahildesigner23 · o fim mostra a timeline de edição do próprio vídeo: camadas, curva de mola e forma de onda
- [Particle sphere motion reel](https://prompt-motion.com/blue-clarity-ef56d0) · @blue_clarity · miniatura da curva ativa no canto e contagem de vértices e partículas legendada
- [Claude motion design showreel](https://prompt-motion.com/rendesr-86be44) · @rendesr · arco de trajetória com marcas de espaçamento sobre régua de frames
- [Type, form, space showreel](https://prompt-motion.com/web3wesley-7bb108) · @Web3Wesley · o nome da curva de easing exibido em cada cena
- [Claude motion designer showreel](https://prompt-motion.com/stephanlivera-df17a2) · @stephanlivera · painel com seis maneiras de ir de A a B, cada uma com sua curva

---

## particulas

<a id="enxame-com-origem-e-destino"></a>

### enxame-com-origem-e-destino · Enxame com origem e destino

`particulas` · encaixe: orador, dados, produto, explainer · custo médio · força 4 · categorias: particles, charts, diagrams · no template: cena nova

**O que é.** A forma de usar partícula que o blog do site aceita: nenhum ponto aparece do nada nem some no nada. O mesmo conjunto de elementos muda de forma para contar a história (volume, categorias, estrutura, pico, marca), e a câmera fica parada.

**Assinaturas**

- azul-marinho `#0A1E3D` com traços em ciano `#5CE1E6`, ouro `#F2D27A` e rosa `#E86A8A` por categoria (ismailfahmi-557268, 16:9, 15 s)
- traços com rastro de velocidade (não pontos redondos) para ler como fluxo
- uma legenda no rodapé trocando a cada 2-3 s, saindo antes da próxima entrar
- contador de menções subindo no canto o tempo todo, ligado ao enxame

**Quando usar / quando não usar**

- Usar: volume de dados, monitoramento, "milhares de X viram um insight", caos que vira ordem, produto que organiza.
- Não usar: partícula como enfeite de fundo ou explosão sem origem (o blog lista explosão de partículas entre os sinais de vídeo feito por IA); números que não existem.

**Com o orador.** Frase de 2 s: os problemas que o orador acabou de listar entram como 30-60 chips ou palavras que giram e são sugados para um ponto que vira a palavra-resposta; volta ao rosto. O enxame não fica atrás do rosto.

**Como fazer no Remotion.** `<canvas>` redesenhado a cada frame a partir de `frame` (sem estado entre frames). Para cada partícula, posições alvo por forma (pontos amostrados dentro de um path SVG ou `Path2D` com semente fixa, layout de grafo pré-calculado em JSON, colunas do histograma) e interpolação entre formas com `spring` defasado por índice. Rastro: segmento entre a posição em `frame` e em `frame - 2`. Vórtice: ângulo crescendo com o inverso do raio. Contador: `numero`.

**O que troca no estilo padrão.** Ponto 5 (a luz vem das partículas, sem halo atrás de card), ponto 1 no trecho (o dado vira enxame) e fundo (escuro liso, sem grade). A paleta de categorias sai do acento e de neutros, não de 4 cores novas.

**Não copiar:** o mapa do país, os números e nomes da referência, a marca e o gradiente do logo.

**Referências**

- [Drone Emprit showreel](https://prompt-motion.com/ismailfahmi-557268) · @ismailfahmi · enxame de traços vira mapa, ganha cor por fonte, vira grafo com a conta suspeita destacada, histograma com pico anotado e logo; contador no canto
- [DistilBook motion explainer](https://prompt-motion.com/sudo-kiran-b055de) · @sudo_kiran · nevasca de páginas com contador, vórtice de linhas de texto sugado pelo logo, mapa conceitual na saída
- [LiteLLM promo reel](https://prompt-motion.com/misbahsy-80eaec) · @MisbahSy · caos de dezenas de APIs colapsando numa única chamada
- [Second brain service promo](https://prompt-motion.com/theviableedge-9065be) · @TheViableEdge · caos de fontes soltas que se resolve numa pasta organizada
- [SuperX feature release teaser](https://prompt-motion.com/robj3d3-b18fad) · @robj3d3 · um único glifo de vidro que se multiplica em enxame

---

## 3d

<a id="maquete-clara-explicativa"></a>

### maquete-clara-explicativa · Maquete clara explicativa

`3d` · encaixe: explainer, produto, dados · custo alto · força 5 · categorias: diagrams · no template: `camadas`, `titulo`

**O que é.** Infográfico de jornal em 3D: tudo em branco e cinza claro, e só o que flui ganha cor (energia amarela, dados azul, calor coral). Uma câmera contínua orbita e aproxima, as peças se separam em explosão ordenada e cada parte ganha um callout com linha.

**Assinaturas**

- fundo `#E6E8EA`, maquete cinza claro, fluxos amarelo `#F2B632`, azul `#3D7BF0` e coral `#E8735F` (mdaman010-e7226a, 98 s, 11 capítulos)
- título condensado bold no canto inferior esquerdo com contador de capítulo e parágrafo curto embaixo
- legenda de cores fixa no canto superior direito
- câmera em órbita e dolly com easing longo; vista explodida em camadas

**Quando usar / quando não usar**

- Usar: explicar infraestrutura, produto físico, processo industrial, "por dentro de"; vídeos de 60-180 s com locução.
- Não usar: prazo curto ou máquina fraca (WebGL e render pesado); vídeo de 15-30 s para feed.

**Com o orador.** Não se aplica: a força é a câmera contínua entre escalas por dezenas de segundos, e picotar em voltas de 2 s quebra a viagem. Como bloco sem rosto curto (até ~4 s, regra 3), só se o render já existir.

**Como fazer no Remotion.** `@remotion/three` com primitivas (caixas, cilindros, `ExtrudeGeometry`) em `MeshStandardMaterial` claro, luz ambiente + direcional com sombra suave; fluxos como `TubeGeometry` com textura de traço deslizando (offset = frame) ou pontos ao longo de curvas; câmera numa spline (`CatmullRomCurve3`) amostrada em `frame / duração`. Callouts e títulos em HTML por cima, na posição projetada do ponto 3D (`vector.project(camera)`). Versão 2,5D barata: `camadas` para a vista explodida + cena `titulo` editorial.

**O que troca no estilo padrão.** Fundo (cinza claro liso), ponto 3 (o espaço 3D vira maquete real), ponto 5 (sem halo; a cor é só do fluxo), ponto 7 (legenda de cores e contador de capítulo no lugar da barra) e ponto 10 (só calmo).

**Não copiar:** os produtos e números de hardware citados, as marcas, o estádio e a liga esportiva.

**Referências**

- [AI data centre 3D film](https://prompt-motion.com/mdaman010-e7226a) · @mdaman010 · 11 capítulos: linha de transmissão, subestação, rack, bandeja, chip explodido, cluster e resfriamento; título editorial no canto e legenda de cores fixa
- [AI data centre 3D tour](https://prompt-motion.com/sayan-shanky-f850d8) · @Sayan_shanky · mesmo tema em maquete branca com legenda de cores, vista explodida e callouts
- [First & 10 yellow line explainer](https://prompt-motion.com/blueoctopusai-dd17bd) · @blueoctopusai · estádio low-poly: a linha virtual passando por baixo dos jogadores e a tela dividida antes e depois

<a id="curta-3d-camera-de-cinema"></a>

### curta-3d-camera-de-cinema · Curta 3D com câmera de cinema

`3d` · encaixe: motion, teaser · custo alto · força 3 · categorias: characters · no template: `letterbox`

**O que é.** Cinema 3D feito em código: personagem ou veículo simples, luz dramática (pôr do sol, noite), câmera com movimento nomeado (perseguição, dolly, contra-plongée) e uma linha de texto calma sobre a ação. O que se aproveita é a direção de câmera e a frase fixa, não o 3D em si.

**Assinaturas**

- roxo `#2A2347`, laranja `#E8853D` e pêssego em nuvens volumosas; sombreamento toon (nft-chen-5f8bb0, 16:9, 14 s)
- título em serifa didone caixa alta empilhado e frase curta em caixa baixa, fixos no centro enquanto a câmera gira
- legenda espaçada em caixa alta no rodapé nomeando a manobra
- sem cortes visíveis no plano-sequência; nos curtos, planos variados com corte de montagem

**Quando usar / quando não usar**

- Usar: vinheta de abertura, peça de marca com tom poético, teaser de jogo.
- Não usar: quase sempre na skill: custo alto, assets 3D, render lento na máquina de 16 GB; talking head.

**Com o orador.** Não se aplica: plano-sequência 3D contínuo, o rosto quebraria a continuidade e o custo não se paga em 2 s.

**Como fazer no Remotion.** `@remotion/three` + `MeshToonMaterial` e modelos por primitivas (ou glTF com licença), câmera numa trilha (`CatmullRomCurve3`) com `lookAt` e roll interpolado por frame, nuvens como esferas agrupadas com semente. Texto em `frase` por cima. Pincelada pede shader de pós-processamento (fora do template). Alternativa viável: renderizar o 3D fora (Blender) e trazer como vídeo no `letterbox`.

**O que troca no estilo padrão.** Fundo, pontos 3 e 4 (câmera 3D real), ponto 5, ponto 7 (sem HUD) e ponto 10 (plano longo): sai praticamente do estilo padrão.

**Não copiar:** o avião e as cores (homenagem a um filme), o pelicano, a pintura famosa, os personagens do episódio, o mascote da loja.

**Referências**

- [Porco Rosso sunset dogfight](https://prompt-motion.com/nft-chen-5f8bb0) · @NFT_Chen · hidroavião sobre o mar ao pôr do sol, câmera de perseguição em espiral, frase serifada fixa e legenda com o nome da manobra
- [Pelican riding a bicycle](https://prompt-motion.com/axtonliu-0b861d) · @AxtonLiu · pelicano de bicicleta no píer com planos aberto, close e contra-plongée
- [Animated space cartoon episode](https://prompt-motion.com/ryzoft-4f85bd) · @Ryzoft · episódio inteiro com letterbox e legendas coloridas por personagem
- [Starry Night cat-spotting game](https://prompt-motion.com/mandelduck-95fd08) · @MandelDuck · caminhada em primeira pessoa dentro de uma pintura com shader de pincelada
- [Shop chatbot mascot promo](https://prompt-motion.com/anas0ra-e57aea) · @anas0ra · diorama de loja flutuante com dolly-in até o mascote e dolly-out no fecho

---

## foto-colagem

<a id="colagem-surreal-retro"></a>

### colagem-surreal-retro · Colagem surreal retrô

`foto-colagem` · encaixe: orador, teaser, motion · custo médio · força 5 · categorias: kinetic-type, photos · no template: `rajada`, `carimbos`, `recorte`

**O que é.** Estado mental como colagem. Recortes de fotos antigas e objetos (estátua, flores, poltronas, nuvens) empilhados com grades em perspectiva e raios de luz, palavras que orbitam e se repetem; a intensidade sobe até o glitch e corta seco para uma imagem calma com uma palavra.

**Assinaturas**

- índigo `#0E1030`, amarelo `#F5D33B`, laranja `#F08A3C`, rosa `#E86AA8` e azul `#3A5BE0` com grão e halftone (gizakdag-cf4ae6, 1080x1920)
- letreiro serifado bold extrudado em camadas coloridas com sombra deslocada; serifa itálica rosa na palavra final
- legendas curtas em etiqueta amarela de fita rotuladora (mono), presas à cena
- cortes rápidos com zoom e rotação contínuos, glitch no clímax e desaceleração brusca para o fecho

**Quando usar / quando não usar**

- Usar: saúde mental, ansiedade, criatividade, "na cabeça de", gancho emocional; criador com tom artístico.
- Não usar: B2B, produto, dados; marca que não aceita estética psicodélica.

**Com o orador.** Bom no trecho da dor: 1,5-2 s de rajada de colagem (2-3 planos de 0,6 s) no marco de "e a cabeça não para", corte seco de volta ao rosto calmo. A etiqueta de fita rotuladora serve como legenda curta sobre o próprio orador. Orador recortado dentro da colagem só se houver alfa.

**Como fazer no Remotion.** `rajada` com planos sob medida: camadas de PNG recortados (acervos em domínio público com CC0, como Met Open Access e Rijksmuseum, registrados conforme `licencas.md`) em parallax por `translate` e `rotate` lentos, grade em perspectiva com `ChaoGrade`, raios com `conic-gradient`. Letreiro extrudado: `text-shadow` empilhado (8-12 camadas de 2 px) + 3 cópias RGB deslocadas 2-4 px com `mixBlendMode: screen`. Etiqueta: div amarela com mono e leve rotação. Glitch: fatias horizontais deslocadas com semente por frame.

**O que troca no estilo padrão.** Fundo (colagem no lugar da grade), ponto 5 (raios de luz no lugar do halo), ponto 6 (serifa extrudada no lugar dos 4 papéis no trecho), ponto 9 (etiqueta de fita como legenda pontual) e paleta (várias cores de colagem: conflito com o acento único; limite ao trecho da dor).

**Não copiar:** a moldura REC com timecode (clichê da galeria), as fotos e o busto exatos, as frases, o horário.

**Referências**

- [Overthinking motion study](https://prompt-motion.com/gizakdag-cf4ae6) · @gizakdag · 9:16, 15 s: perguntas girando em anéis, letreiro extrudado sobre busto com flores, jardim surreal, poltronas sob raio, sofá no espaço com horário, ladrilhos glitch da palavra e o fecho calmo num círculo

<a id="palavra-com-foto-dentro"></a>

### palavra-com-foto-dentro · Palavra com foto dentro

`foto-colagem` · encaixe: orador, produto, teaser, cta · custo médio · força 4 · categorias: photos, product-ui, kinetic-type · no template: `titulo`, `frase`, `recorte`

**O que é.** Tipografia como máscara. A palavra-chave enorme mostra, dentro das letras, a foto ou o vídeo real do assunto; na variante manchete, uma pílula com um rosto ou um produto ocupa o lugar de uma palavra na frase.

**Assinaturas**

- palavra em grotesca neo ocupando ~80% da largura, foto em movimento lento dentro das letras sobre cor chapada (`#1240F0` na referência) (arjunsh1607-93005d, 16:9, 15 s)
- palavra realçada por bloco de cor sólido atrás dela no fecho
- pílula com rosto no meio da linha, da altura da caixa-alta, cantos totalmente arredondados (samuel-yostt-891f87)
- troca da última palavra por desfoque rápido

**Quando usar / quando não usar**

- Usar: portfólio, criador, marca pessoal, produto visual (foto, moda, comida, viagem), gancho com a palavra do tema.
- Não usar: palavra de letras finas (a foto não lê); mídia escura dentro de fundo escuro.

**Com o orador.** Muito bom: a palavra-chave em tela cheia preenchida pelo vídeo do próprio orador (o mesmo frame da timeline, a fala continua) por 1,5 s, e volta para o enquadramento normal; ou a manchete acima da cabeça com o rosto dele numa pílula no lugar de "eu".

**Como fazer no Remotion.** `background-clip: text` não aceita vídeo; use SVG: `<clipPath>` com `<text>` da palavra e, dentro, `OffthreadVideo` ou `Img` recortado por `clipPath="url(#p)"` (ou `mask-image` com a palavra renderizada). O vídeo do orador entra com `trimBefore = ini` para manter a sincronia. Pílula: div com `borderRadius: 999` e mídia em `objectFit: cover`, largura entrando com `spring({damping: 200})`. Wipe em degraus: retângulos escalonados.

**O que troca no estilo padrão.** Ponto 6 (a palavra perde gradiente e brilho e vira janela de mídia) e ponto 5 (sem halo atrás da palavra). O resto fica.

**Não copiar:** os sites, fotos e marcas do portfólio, as métricas, os rostos das referências.

**Referências**

- [Pixelup Labs studio showreel](https://prompt-motion.com/arjunsh1607-93005d) · @arjunsh1607 · palavra gigante com foto mascarada dentro das letras sobre azul elétrico, wipe em degraus de bloco azul; ignorar a moldura com timecode
- [fal motion design showreel](https://prompt-motion.com/influencer-seo-ce8c33) · @influencer_seo · cada palavra de categoria preenchida pela mídia que a plataforma gera
- [ViralGrow product promo](https://prompt-motion.com/samuel-yostt-891f87) · @samuel_yostt · frase-manchete com rostos embutidos em pílula, trocando a palavra final por desfoque
- [Recruiter self-intro reel](https://prompt-motion.com/blushpetal795-0c85c2) · @blushpetal795 · o círculo de cor no lugar de uma letra do nome reaparece como aro da foto

<a id="gravura-anotada"></a>

### gravura-anotada · Gravura anotada

`foto-colagem` · encaixe: orador, cta, teaser, explainer · custo médio · força 4 · categorias: photos, kinetic-type · no template: `orador`, `linha`, `frase`

**O que é.** Contraste entre o antigo e o vetorial: imagem de gravura ou escultura em P&B, recortada sobre branco, e uma anotação geométrica limpa de uma cor que aponta o detalhe. Um ponto da mesma cor fica no mesmo lugar entre os cortes e amarra as cenas.

**Assinaturas**

- branco `#FFFFFF`, preto `#111111` e uma terracota `#D9775B` (lexnlin-038035, 9:16, 14,5 s)
- traço vetorial desenhando o próprio contorno sobre a imagem; asterisco que gira enquanto se desenha
- serifa editorial de peso médio-pesado em caixa baixa, centralizada, com o ponto final na cor
- cortes rápidos imagem a imagem com o ponto mantido no mesmo lugar; zoom lento nas gravuras

**Quando usar / quando não usar**

- Usar: marca editorial, educação, arte, humanidades, produto de IA com tom humanista.
- Não usar: conteúdo de dados ou de UI; nicho que pede cor.

**Com o orador.** Bom e barato: o orador em P&B (`pb`) como se fosse a gravura, com um círculo e uma espiral de uma cor desenhando-se em volta de um detalhe (a mão, o objeto) no marco da palavra, por 1,5-2 s; depois a cor volta. A palavra solta em serifa pode ocupar a tela entre as voltas.

**Como fazer no Remotion.** Cena `orador` com `pb` no trecho + sobreposição SVG sob medida (círculo, espiral gerada por função polar, asterisco de 8 traços) com `pathLength 1` e `strokeDashoffset` em 10-14 frames; o ponto persistente fica na raiz da composição, fora das cenas, para não pular no corte. Gravuras: `Img` de acervo em domínio público, recortada. Palavra: `frase` com fonte serifada (Fraunces, Newsreader).

**O que troca no estilo padrão.** Fundo (branco liso, sem grade), ponto 5 (sem halo), ponto 6 (serifa editorial no lugar da grotesca pesada), e o P&B ganha uso fora do "jeito antigo": aqui ele é a estética do bloco.

**Não copiar:** o asterisco e o ponto como marca (são da identidade do produto anunciado), as gravuras exatas, o slogan final.

**Referências**

- [Engraving-style Claude ad](https://prompt-motion.com/lexnlin-038035) · @LexnLin · 9:16: estudo de proporção, mão com pena, esqueleto de cavalo e busto recebem ponto, círculo, espiral e asterisco em terracota; palavras soltas em serifa
- [Bold Pilot SEO promo](https://prompt-motion.com/utopyaszx-1b2f94) · @utopyaszx · mascote em gravura galopando sobre vermelho no fecho

---

## personagem

<a id="coisa-que-ganha-vida"></a>

### coisa-que-ganha-vida · Coisa que ganha vida

`personagem` · encaixe: produto, teaser, explainer · custo alto · força 4 · categorias: characters · no template: `camadas`

**O que é.** Personificação simples: o objeto que já é o assunto (a letra, o produto, o ícone) ganha dois olhos e duas sobrancelhas, e a história é contada pela atuação deles. Não precisa de corpo nem boca; o arco emocional cabe em 3 closes.

**Assinaturas**

- olhos esféricos brilhantes e sobrancelhas grossas; a emoção muda só pelo ângulo das sobrancelhas e pela direção do olhar (anilraok-eff262, 1080x1920, 42 s)
- closes com profundidade de campo e bokeh; luz quente de mesa
- fecho com frase em serifa com uma palavra itálica colorida e o nome do app em fonte de matriz de pontos
- desenho real recortado com textura de papel aquarelado e balanço leve (abderrahmen-g-9e8ed0)

**Quando usar / quando não usar**

- Usar: app de consumo, produto com mascote, conteúdo infantil ou leve, changelog divertido.
- Não usar: B2B sério; sem tempo para ilustrar ou modelar; talking head.

**Com o orador.** Não se aplica bem: a atuação do objeto precisa de closes e de tempo próprio; ao lado do rosto, compete com a expressão do orador.

**Como fazer no Remotion.** 2D é o caminho viável: objeto em SVG ou PNG e olhos como dois círculos brancos com pupila que segue um alvo (`interpolate` da posição); piscada = `scaleY` 1 -> 0,1 -> 1 em 4 frames com intervalo sorteado por semente; sobrancelhas como `path` com ângulo interpolado por emoção. Balanço: rotação por seno do frame (±3°). Closes: `camera` com escala 2-3 no objeto e `blur` no fundo. 3D (peças de madeira) só com `@remotion/three`.

**O que troca no estilo padrão.** Quase tudo no trecho: fundo e pontos 1, 5 e 6. É linguagem de personagem, não de motion graphics.

**Não copiar:** as peças e a marca do jogo de palavras, o mascote da loja, os desenhos do autor, os doces-personagem.

**Referências**

- [Scrabble tile character story](https://prompt-motion.com/anilraok-eff262) · @Anilraok · 9:16: peças de madeira com olhos marcham para a grade; a letra que ficou de fora passa de preocupada a decidida em closes com bokeh e encontra seu lugar
- [Shop chatbot mascot promo](https://prompt-motion.com/anas0ra-e57aea) · @anas0ra · o produto vira mascote em forma de balão de fala que atende o cliente na porta da loja
- [Sketchbook animals come alive](https://prompt-motion.com/abderrahmen-g-9e8ed0) · @abderrahmen_g · desenhos reais do caderno viram recortes que vivem um dia inteiro, com onomatopeias e zoom que mergulha num detalhe
- [Clay-style music video](https://prompt-motion.com/davidshulmanfl-371638) · @DavidShulmanFL · objetos de tecnologia em massinha e papelão ganham olhos e dançam
- [sweetRegret app update reel](https://prompt-motion.com/thilina-a-891c09) · @thilina_a · 9:16: changelog como desfile de doces-personagem com selo de versão

<a id="luz-que-conta-a-historia"></a>

### luz-que-conta-a-historia · Luz que conta a história

`personagem` · encaixe: motion, teaser, explainer · custo alto · força 4 · categorias: characters · no template: `camadas`, `letterbox`

**O que é.** Narrativa poética em que o tempo e a luz fazem a montagem: o quadro quase não se move, o céu muda de cor, e o ponto de virada é uma luz quente que acende (janela, porta, farol). O texto é uma frase curta por plano, lida com calma.

**Assinaturas**

- céu em gradiente interpolado (pêssego `#F2B98A`, lilás `#7A6AB0`, índigo `#2A2340`), silhuetas `#1A1410`, luz quente `#FFD98A` (x4b47x-9cc84f, 1080x1920, 57 s)
- placa escura pendurada com frase em serifa itálica clara, trocando por fade; uma frase a cada 5-6 s
- silhuetas em 3-4 camadas com parallax lento; fumaça em espiral na chaminé
- recuo final de câmera até a casa ficar pequena na paisagem

**Quando usar / quando não usar**

- Usar: marca de tom afetivo (casa, família, cuidado), vídeo institucional curto, poema, data comemorativa.
- Não usar: feed rápido, produto, dados. As quatro regras de retenção pedem uma mudança real a cada 2 s, e aqui a mudança é lenta: só funciona com luzes acendendo e cortes no ritmo.

**Com o orador.** Não se aplica: a linguagem é contemplativa e de plano longo; intercalar com o rosto a cada 2 s destrói a passagem do tempo, que é a técnica.

**Como fazer no Remotion.** `AbsoluteFill` com gradiente de céu cujas paradas vêm de `interpolateColors(frame, marcos, cores)`; silhuetas em SVG ou PNG em camadas 2D com `translateX` em velocidades diferentes; janela acesa = `rect` com `opacity` e `filter: drop-shadow(0 0 12px #FFD98A)` no `em`; feixe de farol = polígono com gradiente e `mixBlendMode: screen` girando. Chuva, neve e folhas com semente fixa. Placa: `frase` em serifa itálica dentro de div escura. `letterbox` para o cinemascope.

**O que troca no estilo padrão.** Fundo, ponto 5 (a luz quente da cena substitui o halo), ponto 6 (serifa itálica na frase inteira), ponto 9 (sem legenda: a frase da placa é o texto) e ponto 10 (só calmo). Conflito com a regra 1 de retenção se nada mudar a cada 2 s.

**Não copiar:** a casa, o viajante, o robô faroleiro, o poema clássico e as paisagens das referências.

**Referências**

- [Shadow theatre home story](https://prompt-motion.com/x4b47x-9cc84f) · @x4b47x · 9:16: teatro de sombras com cortina, placa escura com frase em serifa itálica, casa cujas janelas acendem, céu do pôr do sol à noite e recuo final
- [Lighthouse keeper silent short](https://prompt-motion.com/kamstudiolabs-0b0824) · @KamStudioLabs · história contada só com luz: o feixe do farol que falha e volta a brilhar, em cinemascope
- [The Last Light animated short](https://prompt-motion.com/faroukzy-9ff23e) · @faroukzy · robô faroleiro entrega o próprio núcleo de luz para reacender o farol na tempestade
- [Four seasons train window](https://prompt-motion.com/itsolelehmann-e47532) · @itsolelehmann · janela de vagão fixa; lá fora as estações passam em parallax e os abajures acendem no inverno
- [Tengwang Pavilion moonlit river](https://prompt-motion.com/demitiyageekzen-7770ad) · @DemitiyaGeekzen · rio do pôr do sol à lua cheia num único plano, com versos em coluna vertical

<a id="pixel-art-de-jogo"></a>

### pixel-art-de-jogo · Pixel art de jogo

`personagem` · encaixe: orador, teaser, motion, explainer · custo médio · força 4 · categorias: characters · no template: `numero`, `carimbos`, `telaViva`

**O que é.** Gamificação visual. A história vira fases com HUD fixo, cada evento é um golpe com nome e número de dano, cada conquista é uma subida de nível. O humor vem de tratar algo sério (mercado, carreira) com a gramática de jogo.

**Assinaturas**

- pixel art noturna com reflexo animado na água; faixa do nome do golpe no topo entre setas (0xevinho-3777d8, 16:9, 20 s)
- números de dano saltando e acumulando com tremor; saldo final em vermelho `#E8452E` com a palavra de quebra
- fonte pixel bitmap em caixa alta; caixa de diálogo amarela `#F7C948` digitando letra a letra (pluginplay-3d4006)
- flash branco de mudança de fase e transição por blocos pixel em stagger

**Quando usar / quando não usar**

- Usar: público gamer, cripto, carreira, "subi de nível", erros que custam caro, humor.
- Não usar: marca sóbria; sem sprites prontos e com prazo curto.

**Com o orador.** Bom em sobreposição: números de dano saltando ao lado do rosto no marco do prejuízo, faixa de nome do golpe no topo, subida de nível com raios quando ele conta a virada; a caixa de diálogo amarela pode substituir a legenda num trecho curto.

**Como fazer no Remotion.** Sprites em PNG com `imageRendering: 'pixelated'` e escala inteira (2x, 3x, 4x); ciclo de sprite = trocar o recorte (`objectPosition`) a cada N frames. Fonte pixel do Google Fonts (Press Start 2P, Silkscreen, VT323). Números de dano: `numero` restilizado ou div que sobe 40 px e some em 18 frames com tremor de semente. Faixa do golpe: `carimbos` sem rotação. Subida de nível: raios com `conic-gradient` + `carimbos`. Gráfico de velas: SVG com retângulos caindo em stagger. Transição: grade de quadrados com atraso por coluna.

**O que troca no estilo padrão.** Ponto 2 (o carimbo vira faixa de golpe e números de dano), ponto 6 (fonte pixel no lugar dos 4 papéis no trecho), ponto 7 (HUD de jogo com dado real: o score é o número da história) e fundo (cenário pixel no lugar da grade).

**Não copiar:** o mago, os nomes dos golpes, a palavra de quebra, os sprites e cenários das referências, o personagem do bumerangue.

**Referências**

- [Pixel wizard crypto animation](https://prompt-motion.com/0xevinho-3777d8) · @0xEvinho · mago lança golpes cada vez maiores com faixa do nome do golpe e números de dano; o golpe final é um gráfico de velas despencando e saldo negativo
- [Personal skills showreel](https://prompt-motion.com/ibrahimwasim240-809370) · @ibrahimwasim240 · currículo como fases: HUD de score e vidas, editor de código com testes passando, kanban como quadro de missões, chefe final, subida de nível
- [Pixel art LLM history](https://prompt-motion.com/pluginplay-3d4006) · @PluginPlay__ · bumerangue que volta mais forte a cada ano, caixa de diálogo amarela por ano, barra de QI crescendo, onomatopeia pixelada

---

## codigo

<a id="codigo-que-narra-a-cena"></a>

### codigo-que-narra-a-cena · Código que narra a cena

`codigo` · encaixe: orador, produto, explainer · custo baixo · força 4 · categorias: code, product-ui · no template: `comando`, `terminal`, `telaViva`

**O que é.** A interface de desenvolvedor como narrador: um cursor que digita a frase e depois se torna o objeto que leva a câmera de uma cena à outra, linhas de log que confirmam cada ação, comentários que dizem o que está acontecendo. Clareza de README.

**Assinaturas**

- fundo claro `#F4F7F8` com grade de pontos discreta, grotesca neo de peso médio, mono pequena nos chips e no comando (lexnlin-6161a6, 16:9, 30 s)
- cursor azul `#1F7FD1` que encolhe, se desloca e reaparece como ponte entre cenas
- chips de código espalhados com nomes de componentes, em vermelho e verde de sintaxe
- fecho com pílula escura de comando de instalação

**Quando usar / quando não usar**

- Usar: ferramenta de dev, IA e agentes, automação, tutorial técnico, lançamento de skill ou CLI.
- Não usar: público sem familiaridade com código; conteúdo emocional.

**Com o orador.** Bom e já existe: a sobreposição `comando` (caixa digitando que vira "feito") narra o que o orador diz, e um log de 2-3 linhas com check ao lado do rosto confirma cada passo. Em tela cheia (1,5-2 s), o cursor digita a frase-chave e pisca no fim.

**Como fazer no Remotion.** `comando`, `terminal` e os blocos `prompt` e `chat` da `telaViva` já fazem a digitação (~1,5 caractere por frame) e o cursor piscando a cada 15 frames. Cursor como guia: barra vertical cuja posição interpola entre o fim do texto e o ponto de entrada da próxima cena em 10-12 frames, na mesma coordenada no último frame de uma cena e no primeiro da seguinte. Log: `terminal` com linhas `ok`. Chips: `pills` com fonte mono.

**O que troca no estilo padrão.** Ponto 8 (o cursor é a transição entre cenas), ponto 7 (o comentário ou o log ocupa o lugar do HUD, com informação real) e fundo claro de editor. O resto fica.

**Não copiar:** os nomes da skill e do pacote, o comando de instalação, as amostras de vídeo da referência.

**Referências**

- [Cinetic skill launch film](https://prompt-motion.com/lexnlin-6161a6) · @LexnLin · cursor de digitação que para de escrever e vira o guia entre cenas; chips de código com nomes de efeitos, régua de timeline sob cada amostra, pílula de comando no fecho
- [Browser automation skill launch](https://prompt-motion.com/hqmank-7c61f1) · @hqmank · navegador fictício ao lado do log do agente, que lista cada passo enquanto o cursor navega e clica
- [org2html product showreel](https://prompt-motion.com/kyonax-on-tech-aabc1d) · @kyonax_on_tech · pipeline de compilador em etapas numeradas gigantes, com o código mudando de forma a cada passo
- [Keyframe motion design reel](https://prompt-motion.com/grace-sunnyy-29bc61) · @Grace_sunnyy · comentário de código no topo de cada cena descrevendo a técnica em execução

<a id="codigo-vira-paisagem"></a>

### codigo-vira-paisagem · Código vira paisagem

`codigo` · encaixe: orador, motion, teaser, explainer · custo médio · força 4 · categorias: code, characters, music · no template: `camera`

**O que é.** Código como cenário, não como texto. Os tokens viram pílulas de cor (como o minimapa de um editor), a profundidade de campo dá escala e a narrativa é física: o erro é um bicho, o cursor é um gigante, a correção é a linha que se desmancha.

**Assinaturas**

- azul-noite `#1C1F45` com pílulas em verde-água `#3BB3A5`, lilás `#8A7FE0` e rosa `#E0607A`; personagem com brilho próprio `#F5C94A` (kamstudiolabs-c9bb28, 16:9)
- profundidade de campo e vinheta escura; câmera que segue o personagem pelo código
- sublinhado ondulado vermelho de erro; linha destacada em vermelho que vira quadradinhos
- nenhuma tipografia legível

**Quando usar / quando não usar**

- Usar: conteúdo para devs com humor, explicar bug ou refatoração sem mostrar código real, abertura de canal tech.
- Não usar: quando o código real importa (tutorial); público não técnico.

**Com o orador.** Frase de 2 s em vídeo tech: o código abstrato com a linha do erro ficando vermelha e se desintegrando no marco de "achei o bug", volta ao rosto. Sem o personagem, fica barato.

**Como fazer no Remotion.** Gerar linhas de código a partir de um JSON de tokens (comprimentos e cores com semente), cada token uma div arredondada; `camera` com escala 1,2-2 e pan, e `blur` por profundidade (linhas em 2-3 planos). Erro: `path` ondulado (seno) sob a linha. Desintegração: a linha vira uma grade de quadrados que se afastam com velocidade sorteada por semente e somem em 20 frames. Personagem: SVG com glow e asas em `scaleY` por seno.

**O que troca no estilo padrão.** Ponto 1 (o editor abstrato no lugar da TelaViva), ponto 5 (brilho só do personagem e do erro) e fundo (azul-noite liso).

**Não copiar:** o vaga-lume, o tom de curta e a trilha da referência, a faixa musical e o ASCII do outro vídeo.

**Referências**

- [Animated short about a bug](https://prompt-motion.com/kamstudiolabs-c9bb28) · @KamStudioLabs · 90 s: editor abstrato em barras coloridas, cursor gigante como antagonista, sublinhado ondulado de erro, linha destacada que se desintegra em quadradinhos
- [UK dubstep track with ASCII visuals](https://prompt-motion.com/rames-jusso-589f80) · @Rames_Jusso · 1:1: o código que toca a música pisca a cada nota e depois se desfaz em arte ASCII pulsando no grave

---

## ritmo-som

<a id="colisao-que-toca-a-nota"></a>

### colisao-que-toca-a-nota · Colisão que toca a nota

`ritmo-som` · encaixe: motion, teaser · custo médio · força 4 · categorias: music, particles, shapes · no template: cena nova

**O que é.** Sincronia audiovisual levada ao limite: cada som que se ouve tem uma causa visível no quadro. A posição dos objetos é calculada de trás para frente a partir dos instantes das notas, então nada é aproximado.

**Assinaturas**

- azul-noite `#0A0F1A` com instrumentos em verde-água `#3FA9B5`, âmbar `#E39A3B`, lilás `#7C5CE0` e coral `#E5566A` (kamstudiolabs-447565, 16:9, 47 s)
- bolas com rastro luminoso em parábola; a barra acende no impacto e decai em poucos frames
- câmera fixa, ritmo ditado só pela música
- título serifado itálico fino e mono minúscula nos metadados

**Quando usar / quando não usar**

- Usar: conteúdo de música, gancho de satisfação para feed, vinheta de canal, peça "oddly satisfying".
- Não usar: vídeo com fala (a trilha precisa ser protagonista); sem controle das notas da trilha.

**Com o orador.** Não se aplica: a técnica exige a trilha em primeiro plano e o quadro inteiro para a física; com voz por cima, as notas viram ruído.

**Como fazer no Remotion.** Extrair os instantes das notas (MIDI da trilha ou onsets com `scripts/analisa_musica.py`) e, para cada nota, resolver a balística inversa: com alvo, instante de impacto, gravidade e tempo de voo fixos, calcula-se o lançamento, e a posição vira função fechada do frame. Barras: brilho = `max(0, 1 - (frame - impacto) / 8)`. Anéis: arcos SVG com `strokeDasharray` girando e física pré-calculada em JSON. Som: só a trilha, sem SFX extra.

**O que troca no estilo padrão.** Tudo no trecho: fundo, ponto 10 (o ritmo é o da música) e ponto 9 (sem legenda). É peça de música, fora do padrão de fala.

**Não copiar:** a peça musical, os instrumentos na mesma disposição, o título, a pergunta-gancho.

**Referências**

- [Collision-driven music machine](https://prompt-motion.com/kamstudiolabs-447565) · @KamStudioLabs · fileiras de metalofone, marimba, baixos e pratos; lançadores nas laterais disparam bolas luminosas; título serifado com timecode e barra de progresso
- [Ball escaping twelve rings](https://prompt-motion.com/kantamk-61f410) · @kantamk · 9:16: bola escapando de doze anéis que giram, contador de anéis restantes, cada quique toca a próxima nota
- [Beat-synced bouncing 3D ball](https://prompt-motion.com/gorden-sun-041f56) · @Gorden_Sun · bola que quica de cogumelo em cogumelo e acende cada um exatamente na batida

<a id="canone-em-grade-pop-art"></a>

### canone-em-grade-pop-art · Cânone em grade pop-art

`ritmo-som` · encaixe: orador, teaser, motion, cta · custo médio · força 4 · categorias: characters, music, kinetic-type · no template: `orador`, `rajada`

**O que é.** Repetição com atraso como linguagem musical: a figura principal aparece em 5 ou 9 painéis, cada um numa dupla de cores, e as cópias repetem o mesmo gesto com defasagem, como um coro. No pico, a grade 3x3 enche o quadro.

**Assinaturas**

- rosa `#F23C8C`, amarelo `#FFD21F`, azul `#2B3FE0`, ciano `#3FD4E0` e preto em painéis chapados com retícula (topi-003-b0e12c, 16:9, 15 s, BPM alto)
- cânone com atraso de ~0,1 s entre cópias (a referência rotula o passo na tela)
- grotesca black arredondada em caixa alta com contorno branco e sombra deslocada nas onomatopeias
- fundo de raios girando, piso quadriculado em perspectiva, rastro onion skin no giro

**Quando usar / quando não usar**

- Usar: humor, música, dança, criador com gesto marcante, "todo mundo faz isso", CTA com energia.
- Não usar: marca sóbria; gesto que não se lê em miniatura.

**Com o orador.** Ótimo como estouro de 1,5 s: o vídeo do próprio orador em grade 3x3 (ou 5 faixas) com duotone diferente por célula e cada célula atrasada 3 frames, no marco de uma frase de efeito ou de um gesto; volta ao enquadramento normal. Sem recorte já funciona (o retângulo do vídeo é a célula).

**Como fazer no Remotion.** Grade de `CamadaVideo` (ou `OffthreadVideo`) do `orador.mp4` com `trimBefore = ini - k * 3` por célula (k = índice), todas mudas (o áudio continua da voz). Duotone por filtro SVG (`feColorMatrix` para cinza + `feComponentTransfer` com `tableValues` das duas cores) ou `grayscale(1)` + `mixBlendMode: multiply` sobre a cor da célula. Retícula: SVG `pattern` de pontos em `multiply`. Onomatopeia: `carimbos` com contorno e sombra. Entra e sai em corte seco (`rajada`).

**O que troca no estilo padrão.** Paleta no trecho (duas cores por célula: conflito com o acento único; use acento e variações tonais dele se a marca exigir), ponto 2 (onomatopeia pop no lugar do carimbo), fundo (cores chapadas) e ponto 10 (é uma rajada).

**Não copiar:** a personagem de anime e a ilustração do autor, o título do reel, os textos em japonês.

**Referências**

- [Anime maid dance showreel](https://prompt-motion.com/topi-003-b0e12c) · @_topi_003 · personagem riggada de uma ilustração: contagem inicial, cinco cópias duotone em cânone com atraso de décimos de segundo, grade 3x3, close nos pés no piso quadriculado, giro com onion skin
- [Talking-head clip edit](https://prompt-motion.com/sab8a-364a5a) · @sab8a · retícula pop art com balão de pensamento aplicada à pessoa filmada

<a id="legenda-que-manda-no-corte"></a>

### legenda-que-manda-no-corte · Legenda que manda no corte

`ritmo-som` · encaixe: orador, produto, teaser, cta · custo baixo · força 4 · categorias: music, photos, kinetic-type · no template: `rajada`, `orador`

**O que é.** Edição dirigida pela voz e pela música ao mesmo tempo: a frase é o elemento central e aparece no ritmo da locução, a imagem de fundo troca na subdivisão da batida e as cenas mudam exatamente no início de cada frase. Não há texto que não seja fala.

**Assinaturas**

- uma sans neutra (Geist) em preto sobre branco, digitando com cursor; palavra destacada com gradiente pastel (`#E879C7` para `#8B7CF6`); sem ponto final na tela (rossaxbt-3085b7, 1:1, 22 s)
- push lento contínuo de 1,0 a 1,04 por cena, herdando o zoom da anterior
- trocas de imagem presas à semicolcheia; trocas de cena no início das frases
- marca-texto âmbar `#F5D9A8` deslizando sob a palavra lida (1stnoel-c20a89)

**Quando usar / quando não usar**

- Usar: locução forte, anúncio de produto visual (imagem, foto, vídeo), lyric, leitura guiada, idiomas.
- Não usar: fala lenta com pausas longas (a grade fica vazia); trilha sem subdivisão clara.

**Com o orador.** É a base da skill um passo adiante: legenda fantasma (a palavra acende quando dita) + troca de enquadramento do orador no início de cada frase (punch-in 1,0 e 1,12 alternados) + b-roll piscando na semicolcheia só nos picos. A palavra de ênfase ganha o gradiente do acento.

**Como fazer no Remotion.** As marcas de palavra já vêm de `transcrever.py` e `legendas.py`; os inícios de frase viram os `em` das cenas `orador` (`punch`) e da `rajada`. Semicolcheia: BPM da trilha (`analisa_musica.py`), passo = 60 / BPM / 4 s, que vira o `passo_ms` da `rajada`. Legenda digitada no centro: `LegendaFantasma` com `pos: 0.5` e `tam` maior, ou `frase` com entrada por palavra presa às marcas. Push herdado: escala = 1 + 0,04 x progresso, começando no valor final da cena anterior. Marca-texto: retângulo atrás da palavra com `scaleX` de 0 a 1 em 4 frames.

**O que troca no estilo padrão.** Ponto 9 (a legenda vira o elemento principal no centro; a variante grande volta a valer no trecho) e ponto 10 (as rajadas seguem a semicolcheia da música, não só os picos da fala). O resto fica.

**Não copiar:** as imagens geradas e os retratos da referência, o nome do modelo, a frase de lançamento, a letra da música.

**Referências**

- [Ora 2 image model launch film](https://prompt-motion.com/rossaxbt-3085b7) · @rossaxbt · 1:1: nome digitando, fotos piscando por baixo da legenda branca a cada semicolcheia, push lento herdado entre cenas, painel de vidro com sliders, explosão de imagens que converge no logo
- [Synced lyrics motion video](https://prompt-motion.com/samaote-5e2fc2) · @samaote · lyric video: a letra entra por verso, em arco sobre o sol, com contagem regressiva até o eclipse
- [Sotto reading app explainer](https://prompt-motion.com/1stnoel-c20a89) · @1stnoel_ · marca-texto âmbar acompanhando a palavra narrada, tradução surgindo abaixo da frase
- [Matra caption app promo](https://prompt-motion.com/gautam-mer1-2ae354) · @gautam_mer1 · 9:16: o vídeo do produto é um talking head legendado palavra a palavra com destaque em pílula

---

## textura

<a id="risografia-sobreimpressa"></a>

### risografia-sobreimpressa · Risografia sobreimpressa

`textura` · encaixe: orador, explainer, motion, cta · custo médio · força 4 · categorias: diagrams, kinetic-type · no template: `frase`, `telaViva`

**O que é.** A estética da impressão em riso: cada cor é uma camada de tinta granulada, levemente fora de registro, e as camadas se multiplicam onde se sobrepõem. Diagramas simples (Venn, seta, faders, círculos numerados) ficam com cara de pôster impresso.

**Assinaturas**

- papel `#EFEAE0` com rosa `#F0569A`, azul `#2A73C0`, amarelo `#F4D21E` e verde `#1F7A3A` (rneayan-474bcf, 16:9, 69 s)
- grão em todas as cores e desalinhamento de 2-3 px entre camadas
- sans pesada em tinta chapada, uma frase por cena, centralizada, entrando por corte ou deslize curto
- cenas de diagrama a cada 4-6 s; formas entram com pop; faders deslizam

**Quando usar / quando não usar**

- Usar: estúdio criativo, educação, cultura, marca jovem e analógica, explicar 2-3 conceitos simples.
- Não usar: marca tech escura ou premium; diagrama denso.

**Com o orador.** Bom: cada volta de 1,5-2 s é um pôster riso com uma frase ou um Venn simples, e a mesma textura de grão pode ir num título acima da cabeça. A sobreimpressão funciona até sobre o vídeo (`multiply`).

**Como fazer no Remotion.** Formas e textos em SVG com filtro de grão (`feTurbulence baseFrequency .9 numOctaves 2` + `feComposite operator="in"` + `feColorMatrix` de limiar), `mixBlendMode: multiply` entre camadas e `translate` de 2-3 px por camada (fixo ou mudando a cada 6 frames para tremer). Semente do `feTurbulence` trocando a cada 3-4 frames para o grão viver. Faders: bloco `toggles` da `telaViva` restilizado, ou divs. Sombra deslocada: cópia da forma em outra tinta com offset.

**O que troca no estilo padrão.** Fundo (papel creme, sem grade nem halo), ponto 5 (sem luz emitida), ponto 6 (sans pesada chapada, sem gradiente) e paleta (2-4 tintas: conflito com o acento único; use o acento como uma das tintas e no máximo uma segunda).

**Não copiar:** o texto em coreano, o dirigível e o nome do estúdio.

**Referências**

- [Risograph studio intro](https://prompt-motion.com/rneayan-474bcf) · @rneayan · 69 s: frases em tinta chapada, padrão de pontos, número grande com fileira de círculos, seta de pipeline, Venn, círculos numerados, faders e um dirigível com sombra deslocada

<a id="feixe-de-osciloscopio"></a>

### feixe-de-osciloscopio · Feixe de osciloscópio

`textura` · encaixe: orador, motion, dados, teaser · custo médio · força 4 · categorias: charts, kinetic-type · no template: `linha`, `frase`

**O que é.** Instrumento de medição como linguagem gráfica. Fundo preto, uma cor de fósforo, e todo elemento é um traço que o feixe percorre: as palavras são contornos, os gráficos são formas de onda, a marca é um desenho de linha contínua. A persistência deixa um rastro que some devagar.

**Assinaturas**

- preto `#050806`, fósforo `#3EE07A`, verde escuro `#1E7A43` no rastro e verde claro `#B8F5C8` no núcleo do traço (rneayan-ea6129, 16:9, 110 BPM)
- texto em contorno sem preenchimento, com glow curto
- leituras de canal no rodapé (tensão por divisão, BPM, tempo decorrido) derivadas do tempo
- troca de frase com fantasma (a anterior ainda visível a ~20%) em vez de corte

**Quando usar / quando não usar**

- Usar: tech, áudio, saúde (batimento), ciência, retrofuturismo; vídeo sobre sinal, ruído, frequência.
- Não usar: marca clara ou colorida; texto longo (contorno fino perde leitura em 9:16).

**Com o orador.** Frase de 1,5-2 s: a palavra-chave traçada pelo feixe sobre preto com a onda correndo embaixo; volta ao rosto. A `LinhaSVG` de ECG já existe: o batimento que vira reta é a mesma linguagem.

**Como fazer no Remotion.** `LinhaSVG` com paths gerados por função (seno, Lissajous `x = sin(a t + d), y = sin(b t)`, quadrada) e `strokeDashoffset`; glow com 2 cópias do traço (uma larga com `blur 6px` a 40% e uma fina nítida). Persistência: 4-6 cópias do traço amostradas em frames anteriores com opacidade decrescente (função pura). Texto em contorno: `-webkit-text-stroke` 2 px com `color: transparent` + `drop-shadow`. Leituras: `RotuloMono` com valores do frame.

**O que troca no estilo padrão.** Fundo (preto liso, sem grade de luz), ponto 5 (o brilho é do traço, não halo atrás de card), ponto 6 (contorno no lugar de preenchimento e gradiente) e paleta (o fósforo deve ser o acento da marca; verde só se for dela).

**Não copiar:** o dirigível, o nome do estúdio e os textos coreanos, a figura de Pi como assinatura.

**Referências**

- [Oscilloscope-style studio motion graphic](https://prompt-motion.com/rneayan-ea6129) · @rneayan · 40 s: frases em contorno luminoso, ruído de sinal na base, Lissajous, número em contorno com pulsos, radar, onda quadrada com anos, dirigível traçado pelo feixe; leituras de canal no rodapé
- [Motion designer showreel](https://prompt-motion.com/eyishazyer-af035b) · @eyishazyer · linhas de relevo empilhadas ondulando sobre um sol, como paisagem sonora
- [Mathematics motion showreel](https://prompt-motion.com/math-files-39c9d0) · @Math_files · Pi desenhado por uma cadeia de epiciclos de Fourier com o espectro ao lado

<a id="pontilhado-de-um-bit"></a>

### pontilhado-de-um-bit · Pontilhado de um bit

`textura` · encaixe: orador, produto, teaser, motion · custo médio · força 4 · categorias: kinetic-type, particles, product-ui · no template: `orador`, `carimbos`

**O que é.** Estética de tela de baixa resolução e papel eletrônico: tons viram padrão de pontos, transições são o flash de atualização do e-ink (inverte e volta), ícones se desfazem em grãos e o texto chega embaralhado e se resolve. Monocromático, com no máximo uma cor de destaque.

**Assinaturas**

- preto `#0A0A0A` e branco `#F2F2F2` com lilás `#8B6CF0` de destaque e uma cena em verde neon `#4CFF1A` (reflex-cloud-72ffe5, 16:9, 120 BPM)
- colchete de rastreamento sobre a imagem com etiqueta mono de dado
- mono e slab em tamanho gigante; texto entra por embaralhamento de caracteres
- versão e-ink: marrom-escuro `#1C1916` virando papel `#F4F1EA`, serifa editorial com segunda linha itálica, sem bounce (bogdandragomir-35e024)

**Quando usar / quando não usar**

- Usar: IA e visão computacional, leitura, newsletter, produto que "vê" ou "decide", marca monocromática.
- Não usar: marca colorida e quente; colchete sem dado (vira o HUD decorativo que o blog condena).

**Com o orador.** O orador em dither por 1-1,5 s (o "jeito antigo" ou "como a máquina vê"), com um colchete de rastreamento no rosto e uma etiqueta com dado real; o flash de refresh do e-ink (inverte 2 frames, preto 1, volta) serve de transição entre rosto e frase.

**Como fazer no Remotion.** Dither: filtro SVG (`feColorMatrix` para cinza + `feComponentTransfer type="discrete"` com 2-4 níveis) sobre o vídeo, mais uma textura de matriz de Bayer em `mixBlendMode: multiply` para o padrão regular; ou canvas com limiar por pixel (mais lento). Colchete: 4 cantos em SVG que interpolam até o alvo em 8 frames + `RotuloMono`. Flash e-ink: `filter: invert(1)` 2 frames, preto 1, normal (o `Flash` do carimbo com outra cor). Grão que dissolve: pontos sorteados com semente que somem por limiar crescente. Embaralhado: caractere sorteado por `random(seed + i + frame)` até o `em` de cada letra.

**O que troca no estilo padrão.** Ponto 2 (o flash de e-ink substitui o flash do carimbo), ponto 5 (sem halo), ponto 6 (mono ou slab gigante, ou serifa editorial), fundo (preto ou papel liso, sem grade) e paleta (monocromia + um destaque).

**Não copiar:** o nome e o símbolo da marca, o rosto de robô, a definição de dicionário, o leitor e-ink da referência.

**Referências**

- [Reflex brand motion reel](https://prompt-motion.com/reflex-cloud-72ffe5) · @reflex_cloud · olho pontilhado com colchete e etiqueta de latência, palavra gigante com definição de dicionário, painéis recuando em fila, contador de frames, texto que se decodifica no fecho
- [Product intro synced to music](https://prompt-motion.com/bogdandragomir-35e024) · @BogdanDragomir · microcápsulas de tinta eletrônica com legenda de figura, ícones se desfazendo em grão, virada do escuro para papel creme, leitor e-ink piscando ao atualizar

<a id="traco-de-lapis-tremido"></a>

### traco-de-lapis-tremido · Traço de lápis tremido

`textura` · encaixe: orador, explainer, produto, dados · custo médio · força 4 · categorias: diagrams, charts · no template: `linha`, `telaViva`, `numero`

**O que é.** Desenho a lápis que nunca fica parado: o traço ferve (muda levemente a cada 2-3 frames), a taxa de quadros é baixa e os elementos surgem em degrau. Dados técnicos ganham cara de caderno, e a legenda é uma tira de papel datilografada presa com fita.

**Assinaturas**

- papel `#E9E9E6`, grafite `#2A2A2A`, azul de caneta `#3B4BC8` nos títulos manuscritos e vermelho `#C8393B` só no limite de risco (nikolajankovic-ce4ff4, 58 s)
- tremor de linha a ~12 fps (troca de semente a cada 2-3 frames de 30)
- mono de máquina de escrever nas legendas e fichas; título manuscrito azul
- ícones de lua, sol, cama e café marcando a passagem do tempo; termômetro sobe e desce com o valor

**Quando usar / quando não usar**

- Usar: fintech e produto técnico que quer parecer humano, explainer narrado em primeira pessoa, "como eu penso".
- Não usar: marca de luxo ou de alto brilho; trecho que precisa de rajada.

**Com o orador.** A tira de papel com fita vira a legenda do trecho sobre o vídeo do orador; nas voltas de 2 s, o diagrama a lápis (termômetro, fluxo de 3 caixas) com o valor mudando. O tremor fica só nos desenhos, nunca no rosto.

**Como fazer no Remotion.** Filtro SVG `feTurbulence` + `feDisplacementMap` (scale 2-3) nos traços, com `seed = Math.floor(frame / 3)` (determinístico); traços desenhados por `strokeDashoffset` em degraus (`Math.floor(prog * 6) / 6`). Fonte manuscrita (Gochi Hand, Kalam) e mono de máquina (Special Elite, Courier Prime). Tira de papel: div com sombra leve, rotação de ±1° e dois retângulos semitransparentes de fita nos cantos; texto digitando (bloco `prompt` sem janela). Termômetro: SVG com nível por `numero` ou `interpolate`.

**O que troca no estilo padrão.** Ponto 9 (legenda em tira de papel no lugar da caixa), ponto 5 (sem halo), ponto 6 (manuscrita + mono de máquina) e fundo (papel cinza-claro liso).

**Não copiar:** o protocolo financeiro, os valores e o texto em primeira pessoa, o endereço de carteira.

**Referências**

- [DeFi Saver stop-motion explainer](https://prompt-motion.com/nikolajankovic-ce4ff4) · @_nikolajankovic · 58 s em primeira pessoa: endereço que ramifica, termômetro com a linha do usuário e a de risco, noite com pessoa dormindo, manhã com café; legendas em tira de papel com fita
- [Replica symmetry breaking whiteboard](https://prompt-motion.com/tak3sh8-be5012) · @tak3sh8 · quadro branco em que a matriz de blocos se subdivide em hachuras coloridas passo a passo

---

## transicao

<a id="ponto-que-costura-cenas"></a>

### ponto-que-costura-cenas · Ponto que costura as cenas

`transicao` · encaixe: orador, motion, teaser, cta · custo médio · força 5 · categorias: kinetic-type, shapes, music · no template: `frase`, `encaixe`

**O que é.** O conceito único que o blog do site recomenda: um elemento só, sempre na tela, que liga uma ideia à outra. Ele muda de papel (letra, dado, forma, transição) mas nunca some, então cada cena nasce da anterior.

**Assinaturas**

- off-white quente `#EFEBE3`, quase-preto `#141414` e um laranja `#FF4F1F` só no ponto (ultimaxbt-bbebf5, 16:9, 15 s)
- o gráfico e o ponto usam a mesma função de mola (overshoot curto, pico anotado)
- o círculo que enche o quadro escala além dos quatro cantos antes de virar fundo
- alternância creme e preto a cada cena; último quadro igual ao primeiro (loop)

**Quando usar / quando não usar**

- Usar: marca com um sinal gráfico simples (ponto, bola, círculo), abertura, vídeo curto de conceito, loop para feed.
- Não usar: marca sem relação com o ponto (vira mascote gratuito); vídeo longo (o ponto cansa depois de ~30 s).

**Com o orador.** Bom e distinto: o ponto é a ponte entre frase e rosto. Ele é o pingo da palavra-chave, cresce até encher o quadro e abre revelando o orador (máscara circular), depois encolhe para um canto do enquadramento enquanto ele fala, e volta a ser o ponto da próxima frase, sempre na mesma posição de tela entre os cortes.

**Como fazer no Remotion.** O ponto fica fora das cenas, na raiz da composição, com posição e raio por `spring` somadas entre marcos (`pontos[{em, x, y, r}]`); as cenas posicionam o texto para que o pingo coincida com o ponto. Círculo que revela o orador: `clipPath: circle(r at x y)` no `OffthreadVideo` com `r` até ~120% da diagonal. Gráfico de mola: a mesma função `spring` amostrada em 60 pontos num `path`. Anel de palavras: letras com `rotateY` por ângulo e `perspective`. Halftone: SVG de círculos com raio em função da distância ao ponto.

**O que troca no estilo padrão.** Ponto 8 (o ponto substitui o encaixe e o corte seco como transição), ponto 5 (sem halo: o ponto é a única cor) e fundo (creme e preto lisos alternando). Os papéis tipográficos ficam, sem gradiente.

**Não copiar:** o texto do cartão final, o nome do modelo, o laranja se não for o acento da marca, o ponto como logotipo das referências.

**Referências**

- [Orange dot motion system](https://prompt-motion.com/ultimaxbt-bbebf5) · @ultimaxbt · o exemplo do blog: pingo do i, gráfico de mola com o pico anotado, círculo que enche a tela, anel de palavras orbitando, halftone, cartão final e volta ao início em loop
- [Claude self-intro motion graphic](https://prompt-motion.com/1littlecoder-9fef89) · @1littlecoder · linha branca desenha um ponto de interrogação cujo ponto é de cor; ele vira linha de base, ponto final e ponto decimal
- [Geometric motion designer showreel](https://prompt-motion.com/leonkohli-6dc01b) · @LeonKohli · bola de cor com rastro atravessa os capítulos e termina como ponto final do nome
- [Recruiter self-intro reel](https://prompt-motion.com/blushpetal795-0c85c2) · @blushpetal795 · o círculo no lugar de uma letra do nome reaparece como aro da foto
- [White ball UI motion loop](https://prompt-motion.com/rossaxbt-94583b) · @rossaxbt · bola branca que é cursor, peso e transição numa UI em plano-sequência, com recuo final e loop
- [Engraving-style Claude ad](https://prompt-motion.com/lexnlin-038035) · @LexnLin · ponto terracota mantido no mesmo lugar da tela entre cortes de gravuras

<a id="cada-objeto-vira-o-proximo"></a>

### cada-objeto-vira-o-proximo · Cada objeto vira o próximo

`transicao` · encaixe: orador, produto, motion, cta · custo médio · força 5 · categorias: product-ui, music, photos · no template: `encaixe`, `card`, `camera`

**O que é.** Transição como ideia, não como efeito: em vez de cortar ou fazer crossfade, um objeto da cena atual (a forma da foto, o botão, a cor) cresce, se transforma ou cobre o quadro e vira a cena seguinte. O vídeo inteiro parece uma tomada só.

**Assinaturas**

- off-white `#EEEDE8` e preto `#0B0B0C` com um laranja `#E2552B`; fotos e vídeo real como conteúdo (twoclipping-221cab, 1440x1440, 29 s)
- flood de ~0,3 s entre cenas: a forma preta cobre o quadro e contrai na cena seguinte
- uma ação por batida a 120 BPM; molas de passo fechado
- texto sobe de uma linha de máscara e troca dentro da forma que morfa; último quadro igual ao primeiro

**Quando usar / quando não usar**

- Usar: lançamento com jornada (do digital ao físico), app de foto, e-commerce, vídeo de 15-30 s em que a sequência de telas já existe.
- Não usar: cenas sem relação visual (forçar o match fica pior que o corte).

**Com o orador.** Como transição entre frase e rosto: a forma que fecha a frase (o ponto final, o botão, a pílula) escala além dos quatro cantos em ~8 frames e vira a janela que revela o orador; na saída do rosto, o enquadramento encolhe e vira o card da próxima cena (`Encaixe`). Uma por bloco, não a cada volta.

**Como fazer no Remotion.** Encadear as cenas num único `Sequence` com springs somadas. Flood: div preta com raio 50% escalando a partir do objeto (origem no centro dele) até cobrir o quadro (escala pela distância ao canto mais longe) em 8-10 frames, e contraindo na próxima cena. Íris: SVG de 6 lâminas (polígonos girando em torno do centro) ou `clipPath: polygon` interpolado. Grade para bento: `layoutBento()` com retângulos interpolados por `misturaRet()`. Vidro: `backdropFilter: blur(16px)` + borda clara.

**O que troca no estilo padrão.** Ponto 8 (o match de forma substitui o encaixe de 6-8 frames e o corte seco), ponto 10 (no trecho, sem rajada: plano contínuo) e ponto 5 (sem halo; vidro e sombra dão a profundidade).

**Não copiar:** as fotos geradas, o wordmark, a página de produto e o preço da referência, a parede filmada.

**Referências**

- [Photo print app launch film](https://prompt-motion.com/twoclipping-221cab) · @twoclipping · 1:1, 120 BPM: íris de 6 lâminas, grade de fotos que vira bento, slider de vidro que muda a luz, celular e notebook, página de produto, botão de pedido e o quadro real na parede; loop
- [Food craving launch film](https://prompt-motion.com/ultimaxbt-2ddf1e) · @ultimaxbt · botão de enviar que vira uma panela e depois inunda a tela de verde, cada cena brotando de um objeto da anterior
- [UGC ad generator promo](https://prompt-motion.com/twoclipping-6dd14e) · @twoclipping · botão da UI que abre um círculo e vira a cena escura
- [QuickDesign brand promo](https://prompt-motion.com/quickdesignio-dd93d0) · @quickdesignio · transição em mosaico de quadrados que vira o próprio logo pixelado

<a id="generos-de-tv-emprestados"></a>

### generos-de-tv-emprestados · Gêneros de TV emprestados

`transicao` · encaixe: orador, explainer, teaser, motion · custo alto · força 5 · categorias: characters, code, photos · no template: `orador`, `recorte`, `terminal`, `teaser`, `volta`

**O que é.** Troca de linguagem como piada e como estrutura. Cada trecho empresta a gramática completa de um gênero conhecido (tipografia, cor, movimento típico, moldura) e a mudança de gênero marca a mudança de ideia. O espectador reconhece o gênero em um quadro.

**Assinaturas**

- barra de pilha de chamadas no topo com os gêneros já visitados e a profundidade à direita (emollick-8661a8, 16:9, 75 s)
- tipografia por gênero: grotesca corporativa, fonte pixel, serifa itálica de documentário, letras infladas infantis, serifa dourada de trailer, mono de terminal, Times padrão no caso base
- rótulo numerado do gênero no canto e contador recorrente da piada (sab8a-364a5a)
- dentro de cada gênero, o movimento típico dele (rolagem de jogo, Ken Burns de natureza, zoom de trailer)

**Quando usar / quando não usar**

- Usar: explicação em camadas, humor, criador com tom irônico, conteúdo sobre mídia e marketing, "como cada um faria isso".
- Não usar: marca séria; sem tempo para produzir 4-8 cenas sob medida (cada gênero é uma cena).

**Com o orador.** Muito bom com recorte: a cada ideia, o orador recortado entra num fundo de gênero (sépia de desenho antigo, mangá P&B com linhas de velocidade, carta holográfica, pop art com retícula) por 1,5-2,5 s com o rótulo do gênero e volta ao cenário real. Sem recorte, o gênero fica na moldura em volta do vídeo (TV antiga, player de documentário, terminal).

**Como fazer no Remotion.** Cena-moldura com a barra de gêneros fixa e um `Sequence` por gênero, cada um com sua estética: terminal (`terminal`), VHS (`teaser`, `volta` e as peças de `Fita.tsx`: grão, scanlines, RGB), trailer (letreiro dourado com `text-shadow` em camadas), 8-bit (fonte pixel + sprites), mangá (`pb` + linhas radiais + balão). No orador: `recorte` com fundos por gênero e filtros CSS (`sepia`, `grayscale` + `contrast`, retícula SVG).

**O que troca no estilo padrão.** Tudo dentro de cada gênero (é a ideia); ficam a legenda (ponto 9) e as regras de retenção. Paleta e tipografia mudam por gênero: conflito declarado com o acento único, justificado pelo conceito.

**Não copiar:** os personagens (boneca, mascote, apresentador), a marca do editor de vídeo, o texto sobre recursão, a mesma sequência de gêneros.

**Referências**

- [Recursion explained in genres](https://prompt-motion.com/emollick-8661a8) · @emollick · recursão: barra de call stack no topo com a profundidade; cada chamada um gênero, o caso base em HTML cru, e a volta revisitando os gêneros
- [Talking-head clip edit](https://prompt-motion.com/sab8a-364a5a) · @sab8a · talking head: cada ideia citada redesenha a pessoa num gênero, com rótulo numerado, legenda palavra a palavra e contador da palavra-vício
- [Chain.wtf pitch video](https://prompt-motion.com/spearwtf-3c1fd1) · @SPEARwtf · o pitch inteiro como comercial de TV de madrugada: botão 3D clicado, letreiro de LED, carimbo e letra miúda irônica

---

## camera

<a id="potencias-de-dez"></a>

### potencias-de-dez · Potências de dez

`camera` · encaixe: produto, explainer, teaser, dados · custo médio · força 4 · categorias: product-ui, charts, diagrams · no template: `camera`, `print`, `motionBlur`

**O que é.** O zoom como narrativa de escala. A câmera nunca corta: mergulha num detalhe até ele ficar abstrato (pixels), depois recua até o objeto inteiro virar um ponto num contexto maior, e volta para outro dispositivo. Mostra que o produto funciona do micro ao macro.

**Assinaturas**

- preto `#05070A` com verde `#1FBF8F` e vermelho `#E0485A` de mercado e azul `#6C8CFF` de seleção (dale-vaz-cc612a, 16:9, 47 s)
- zooms com easing longo e sem corte; ritmo contemplativo
- indicador de escala no canto acompanhando o zoom
- nascimento a partir de um traço de luz no preto

**Quando usar / quando não usar**

- Usar: produto com interface densa, "do detalhe ao todo", plataforma com várias telas, abertura de explainer de escala.
- Não usar: UI simples (o zoom não tem para onde ir); vídeo curto de feed (o mergulho precisa de 5-10 s).

**Com o orador.** Não se aplica bem: o valor é a continuidade da câmera por muitos segundos; picotada em voltas de 2 s vira só zoom. Um mergulho único de ~3 s saindo do celular que o orador segura (print) até a tela é o máximo.

**Como fazer no Remotion.** Montar a UI densa como um componente grande (ou `print` em alta resolução) e animar a câmera em escala logarítmica: escala = `Math.exp(interpolate(frame, marcos, logs_das_escalas))`, com `translate` compensando para manter o ponto focal; `motionBlur` só nos trechos rápidos. Pixels: `imageRendering: pixelated` no zoom extremo. Campo estelar: SVG ou canvas com estrelas de semente fixa e paralaxe por camada. Indicador: `RotuloMono` com o valor da escala.

**O que troca no estilo padrão.** Ponto 4 (a câmera vira o vídeo inteiro, contra "não mova a câmera em toda cena"), ponto 10 (um plano longo no lugar de calmo x rajada) e ponto 8 (sem encaixe: é a mesma tomada).

**Não copiar:** o terminal de trading, os números de mercado, a marca, o slogan.

**Referências**

- [Sahi trading terminal reveal](https://prompt-motion.com/dale-vaz-cc612a) · @dale_vaz · 47 s: traço de luz no preto abre o terminal, mergulho até os pixels da vela, afastamento até a tela virar estrela, volta num celular deitado
- [Black hole time story](https://prompt-motion.com/rebutonepress-810f78) · @RebutonePress · câmera que se aproxima do buraco negro em escala crescente por minutos, com telemetria nos cantos
- [Sketchbook animals come alive](https://prompt-motion.com/abderrahmen-g-9e8ed0) · @abderrahmen_g · zoom que mergulha num detalhe do desenho até ele virar a próxima cena
- [Psychedelic hypnotic eye showreel](https://prompt-motion.com/monokern-ade5b6) · @monokern · zoom infinito num túnel de olhos repetidos: a versão em loop, que cansa rápido

<a id="o-site-e-o-cenario"></a>

### o-site-e-o-cenario · O site é o cenário

`camera` · encaixe: orador, produto, cta, teaser · custo médio · força 5 · categorias: product-ui, music · no template: `camera`, `print`, `card`, `encaixe`

**O que é.** Um mundo só, montado com a interface real, e uma câmera só, que recua, rola, mergulha e empurra, nunca dois movimentos ao mesmo tempo. Na versão 3D, a página fica deitada como cenário físico e a câmera voa rente a ela com foco raso.

**Assinaturas**

- página clara `#F9FBFB` e `#F2F3F6` com acentos coral `#E8704A` e azul `#8DB6E6`; título final com segunda linha em serifa itálica fina (twoclipping-d89be5, 14,5 s)
- página inclinada em torno de 56° em perspectiva; blur por distância ao ponto focal
- elementos que se levantam (translateZ + rotateX) quando a câmera passa, com leve mola
- versão 2D: tudo cravado em 120 BPM, três cortes secos no drop e match cut de volta ao card (antonio-kodheli-490109)

**Quando usar / quando não usar**

- Usar: lançamento de site, landing ou app web, portfólio, galeria, SaaS com página bonita.
- Não usar: site feio ou genérico (a câmera expõe); sem capturas em alta resolução.

**Com o orador.** Bom pela versão 2D: o vídeo do orador é um card do próprio site (depoimento, player da página); ele recua até o card na grade, a câmera passeia 1,5-2 s pela página e mergulha de volta no card, que cobre a tela de novo. Sincronia mantida com `trimBefore`.

**Como fazer no Remotion.** 2D: `print` da página inteira (captura full-page em DPR 2) num contêiner e `camera` com chaves por batida (`scale/translate`, `spring({damping: 200, mass: 1.2})`); o card do orador é um `OffthreadVideo` na coordenada do card da página, e o recuo é um `Encaixe` da tela cheia para esse retângulo. 3D: contêiner com `perspective 1400`, página com `rotateX(56deg)`, câmera = `translateY` e `translateZ` interpolados; cada bloco com `blur` proporcional à distância ao plano de foco e `rotateX` próprio para levantar (o blur encarece o render).

**O que troca no estilo padrão.** Ponto 4 (câmera contínua sobre o mundo é a linguagem), ponto 3 (a página real substitui as camadas 3D genéricas), ponto 8 (match cut entre card e tela cheia), ponto 5 (sem halo) e fundo (a própria página).

**Não copiar:** as páginas, marcas e textos das referências (inclusive a do próprio prompt-motion), os vídeos da galeria dentro dos cards.

**Referências**

- [Landing page 3D scroll](https://prompt-motion.com/twoclipping-d89be5) · @twoclipping · landing clara deitada sobrevoada com profundidade de campo rasa; cards e chips se levantam quando a câmera passa; mergulho no hero, que pousa como card sob um título de duas linhas
- [Prompt Motion site promo](https://prompt-motion.com/antonio-kodheli-490109) · @antonio_kodheli · o vídeo vira card, o card vira tela cheia e volta ao lugar; marca-texto varrendo uma frase; pílula copiar que vira copiado e depois URL
- [Design portfolio video reel](https://prompt-motion.com/kikelopezdesign-7cc9e8) · @kikelopezdesign · portfólio navegado como arquivo de editor: zoom e pan entre frames
- [White ball UI motion loop](https://prompt-motion.com/rossaxbt-94583b) · @rossaxbt · todos os componentes num contêiner grande e uma única transform de câmera; recuo final mostra o mapa inteiro e faz loop

<a id="chegada-exponencial-com-borrao"></a>

### chegada-exponencial-com-borrao · Chegada exponencial com borrão

`camera` · encaixe: orador, produto, teaser, cta · custo baixo · força 4 · categorias: product-ui, music · no template: `camera`, `motionBlur`, `rajada`

**O que é.** Disciplina de movimento de keynote: o elemento entra já em velocidade e desacelera de forma exponencial até parar no lugar, e o borrão acompanha a direção e a velocidade (não é um blur genérico). A câmera nunca fica parada; no drop, cortes secos.

**Assinaturas**

- fundo claro `#FDFDFB` com azul-marinho `#294376`, azul `#2F6BFF` e verde `#4ED6A0` (notdwd-7de38a, 1080x1080, 12 s)
- ease-out exponencial em todas as entradas; borrão proporcional à velocidade e na direção do deslocamento
- cursor que gira para a direção do deslocamento e cresce no hover
- whip-tilt com flash azul claro; fecho em cartão preto com o nome

**Quando usar / quando não usar**

- Usar: lançamento de produto, sting curto, CTA, vídeo que parece lento no estilo padrão.
- Não usar: conteúdo calmo e contemplativo; quando o espectador precisa ler o que está se movendo.

**Com o orador.** Bom e barato: frases e cards chegam por whip com borrão direcional em 6-8 frames, e a troca rosto para frase pode ser um whip-pan (o rosto sai borrado para um lado, a frase entra do outro). Vale também nos punch-ins do orador, com chegada exponencial no lugar da mola.

**Como fazer no Remotion.** Easing `Easing.out(Easing.exp)` (ou `Easing.bezier(0.16, 1, 0.3, 1)`) nas entradas; borrão direcional: o `motionBlur` ligado só nos frames de velocidade alta, ou 3-5 cópias deslocadas ao longo do vetor de velocidade com opacidade baixa quando quiser direção pura. Whip: `camera` com `translateX` de ±120% em 6 frames + flash de 2 frames (`Flash` do carimbo com cor clara). Cursor: `Cursor` com rotação = `atan2(vy, vx)` e escala 1,15 no hover.

**O que troca no estilo padrão.** Ponto 4 (câmera em movimento em toda entrada, contra "não mova a câmera em toda cena"; limite aos trechos de produto e CTA), ponto 8 (whip no lugar do encaixe), e as molas de `entraUI` dão lugar à curva exponencial. O resto fica.

**Não copiar:** o ícone, o nome e a interface do produto, o texto da lição.

**Referências**

- [Frame by Frame launch video](https://prompt-motion.com/notdwd-7de38a) · @notdwd · 1:1, 12 s: cabeçalho sobe de uma névoa azul, ícone com quadrados orbitando, barra de menu, caixa de prompt de vidro, cards de vidro e cartão final preto com o nome
- [Jev engineering showreel](https://prompt-motion.com/polydao-7a572b) · @polydao · whip-pans horizontais com motion blur forte entre capítulos
- [UGC ad generator promo](https://prompt-motion.com/twoclipping-6dd14e) · @twoclipping · whip com motion blur até o clipe herói e empurrões curtos de câmera

<a id="hud-camera-capitulos"></a>

### hud-camera-capitulos · Moldura de reel com timecode (clichê)

`camera` · encaixe: motion, teaser · custo baixo · força 2 · categorias: kinetic-type, shapes, music · no template: `rec`, `hud`

**O que é.** Moldura técnica persistente (cantos de visor, timecode correndo, BPM, capítulo numerado) em volta de um reel que muda de técnica a cada compasso. Sugere precisão e bastidor, mas na galeria virou o que o modelo produz quando o prompt não decide nada.

**Assinaturas**

- cantoneiras finas nos 4 cantos, rótulos mono minúsculos nos cantos superiores e inferiores, timecode correndo
- BPM, fps e contador de compasso como texto fixo
- capítulos de ~1-2 s trocando a cor de fundo a cada compasso
- presente em ~50 dos 234 vídeos (51 citam a moldura nas técnicas); 71 itens usam a frase do prompt genérico de showreel

**Quando usar / quando não usar**

- Usar: só quando os números são verdadeiros e fazem parte do assunto: bastidor real de gravação, vídeo sobre edição, contagem regressiva real.
- Não usar: como enfeite, em vídeo de produto, como "cara de profissional" (o blog cita dois criadores chamando isso de sinal típico de vídeo feito por IA).

**Com o orador.** O template já tem a versão para talking head (`rec`: REC, timecode e capítulo); vale para gravação crua de verdade (bastidor, "sem edição") e para o trecho antes do "editado". Fora disso, não: por isso não está marcada como `orador`.

**Como fazer no Remotion.** Sobreposição `rec` com `capitulos` e `inicioTimecode`, ou `Hud` com `quadro45`; timecode derivado do frame (nunca relógio). Se usar, deixe só os rótulos com informação real (o capítulo é o bloco do roteiro, o BPM é o da trilha medida) e tire o resto.

**O que troca no estilo padrão.** Ponto 7 (substitui a barra de capítulos pela moldura de visor). Conflito: o estilo padrão já tem HUD fixo (ponto 7) e o blog condena texto decorativo nos cantos; o ponto 7 da skill continua como está, esta ficha só registra o limite.

**Não copiar:** nada específico de um autor: o problema é o padrão em si.

**Referências**

- [Claude motion designer showreel](https://prompt-motion.com/stephanlivera-df17a2) · @stephanlivera · o exemplar mais completo: cantoneiras, timecode, fps, BPM e contador de compasso em volta dos capítulos
- [Crux motion design showreel](https://prompt-motion.com/marouanegazouzi-6071d5) · @marouanegazouzi · REC, timecode, resolução, fps e BPM e rótulo de capítulo em todos os planos
- [Abstract motion design reel](https://prompt-motion.com/ajith-io-b5626e) · @ajith_io · contador de compasso que transforma o reel numa sessão de trabalho ao vivo
- [Claude motion design reel](https://prompt-motion.com/tequilafunks-97f6c9) · @tequilafunks · HUD de timecode e BPM amarrando capítulos de princípios
- [Claude motion design showreel](https://prompt-motion.com/ayushunleashed-ece3e3) · @ayushunleashed · ficha técnica: cada capítulo etiquetado no HUD e cronometrado no BPM
- [Motion designer portrait showreel](https://prompt-motion.com/ndhabarde11-f155b4) · @ndhabarde11 · 9:16: um capítulo por técnica rotulado como ficha de render

---

## Anti-padrões da galeria

Contagens sobre as 234 análises da coleta de 28/10/2026 (busca por termo nas técnicas, no resumo, no movimento e na paleta de cada análise; aproximadas, um vídeo pode cair em várias linhas).

### O que se repete e cansa

| Padrão | Na galeria | Por que cansa | No lugar |
|---|---|---|---|
| moldura de reel com cantoneiras, timecode, BPM e capítulo numerado | ~50 (51 citam nas técnicas; 42 vêm do prompt genérico de showreel) | texto nos cantos que sugere precisão sem informação; o blog cita criadores chamando isso de sinal típico de vídeo feito por IA | HUD só com dado real (`contador-que-e-o-relogio-da-historia`, régua de anos de `fio-vermelho-linha-do-tempo`) ou nenhum; a ficha `hud-camera-capitulos` registra o limite |
| prompt genérico de showreel ("mostre que motion designer incrível você é") | 71 itens contêm a frase; o blog contou 33 rodadas até 10/10, mediana de 5 curtidas | o prompt não decide tema, look, tempo nem o que evitar, e o modelo entrega um tour de efeitos | um conceito único nomeado antes de começar (`ponto-que-costura-cenas`, `forma-unica-que-morfa`, `cada-objeto-vira-o-proximo`) |
| tour de técnicas em capítulos de 1-2 s, um princípio por capítulo | 54 citam capítulos | cada capítulo é uma ideia solta; nada nasce do anterior | cada plano nasce do anterior por forma, tipo ou cor; capítulo só quando o roteiro tem blocos |
| glow, neon, halo e bokeh sem função | 49 | o blog: atalho para parecer rico, decoração quando nada pede | luz que vem de algo da cena (janela que acende, ponto aceso, traço de fósforo) ou foco seletivo |
| partícula e explosão sem origem (confete, faísca, chuva) | 43 citam partícula; 15 explosões, confete ou faísca | o blog: movimento que não sai de nem vai para um elemento da tela é enchimento | `enxame-com-origem-e-destino`: o mesmo conjunto sai de algo e vira algo |
| fade, crossfade e dissolve entre cenas | 34 | o blog: transição que ninguém desenhou | corte seco com entrada própria, encaixe, match de forma, flood que cobre e contrai |
| troca de cor de fundo a cada capítulo | 25 | vira slideshow de cores sem relação com a fala | o fundo muda quando a ideia muda (virada de claro para escuro em `anotacao-a-mao-sobre-o-movimento`) |
| aberração cromática, RGB split e glitch em todo título | 23 | o template revisado do showreel proíbe RGB split; repetido, vira assinatura de galeria | só no pico de um trecho (`colagem-surreal-retro`, `gramatica-de-anime`) |
| easing saltitante (overshoot, elastic, bounce em tudo) | 24 citam | o blog: overshoot em tudo fica cartunesco | molas com overshoot mínimo; overshoot só onde é o significado (o verbo "passar do ponto") |
| curva de easing, keyframes e régua tipográfica na tela | ~20 | metalinguagem que só interessa a quem faz motion | só em vídeo sobre edição (`o-video-explica-a-propria-tecnica`) |
| esfera ou globo de pontos girando | 17 | o "3D de showreel" mais comum; o template 3D do site proíbe um objeto girando devagar como ideia inteira | pontos que contam algo (`matriz-de-pontos`) |
| acento laranja sobre creme (com azul elétrico) | laranja em 107; laranja + creme em 64; com azul elétrico em 23 | é a cara da galeria e do próprio modelo; tira a identidade do cliente | o acento da marca do cliente, sempre (regra da skill) |

### O que o blog aponta como cara de IA

Itens banidos nos prompts que o blog analisou (`blog.md`, seção 4), com o substituto que este catálogo oferece:

| Sinal | No lugar |
|---|---|
| glow e neon (7 prompts banem) | luz com origem na cena; foco seletivo (`keynote-macro-acento-unico`) |
| "qualquer coisa que pareça template" (7) | um conceito único por vídeo; a direção do rodízio é escolhida para o roteiro, não aplicada como pacote |
| explosões de partículas (6) | `enxame-com-origem-e-destino` |
| holds longos, frames congelados, tempo morto (6) | regra 1 de retenção da skill (algo muda a cada 2 s); hold acima de ~1 s só se há leitura |
| crossfades (5) | `cada-objeto-vira-o-proximo`, `ponto-que-costura-cenas`, encaixe ou corte seco |
| easing saltitante (3) | molas com overshoot pequeno; a mesma mola no objeto e no gráfico que o acompanha |
| gradientes genéricos e em chrome de UI (3) | cor chapada; gradiente só no texto de destaque, se a marca pedir |
| efeitos 3D gratuitos (3) | 3D só quando a ideia é espacial (`maquete-clara-explicativa`, `o-site-e-o-cenario`) |
| stock footage e UI kits (3) | print real e UI inventada a partir da tela real do produto |
| texto decorativo nos cantos, leituras estilo HUD (2) | HUD só com dado da história |
| `Math.random` (2) | `random(seed)` do Remotion; todo frame reproduzível |

### Conflitos com o estilo padrão

Registro, sem alterar `../direcao-visual.md`. Fora de uma direção puxada pelo rodízio, o estilo padrão continua como está.

- **Ponto 5 (luz emitida) e fundo com halos derivando**: o blog trata glow e halo sem função como o sinal mais banido. A maioria das fichas deste catálogo troca o ponto 5 (halo) por luz com origem, cor chapada ou foco seletivo.
- **Ponto 7 (HUD fixo) e sobreposição `rec`**: o blog condena texto decorativo nos cantos. A barra de capítulos da skill mostra a estrutura do roteiro (dado); o `rec` com timecode é o mais próximo do clichê da galeria e só se justifica em gravação crua de verdade.
- **Ponto 2 (carimbo com flash e tremor de 4 frames)**: o template revisado do showreel proíbe camera shake. O tremor do carimbo é curto e pontual; várias fichas o substituem por tranco, nota manuscrita ou flash de e-ink.
- **Variante clássica (cross-fade com blur de 6-12 frames)**: o blog lista crossfade entre os sinais de vídeo feito por IA. O estilo padrão já usa corte seco; a variante clássica é que fica em conflito.
- **Tipografia em papéis (rótulo mono pequeno + uma palavra em serifa itálica)**: o blog não condena, mas é a combinação mais repetida da galeria (mono minúscula em 57 análises, serifa itálica de contraponto em 41). Várias fichas trocam o ponto 6 para fugir desse uniforme.
- **Gradiente no texto e pill com gradiente no talking head**: o blog aponta gradiente genérico (sobretudo em chrome de UI) como sinal; o gradiente acento -> acento2 da skill é sutil, mas fica registrado.
- **Acento único ("nunca terceira cor")**: `bauhaus-primarias`, `janelas-neo-brutalistas`, `risografia-sobreimpressa`, `canone-em-grade-pop-art`, `generos-de-tv-emprestados` e `fio-vermelho-linha-do-tempo` pedem 2-4 cores; cada ficha diz como reduzir para acento + neutros quando a marca exigir.
