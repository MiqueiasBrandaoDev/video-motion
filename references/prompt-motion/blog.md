# prompt-motion.com: blog e templates

`fonte de referência` · 5 posts do blog (10/10/2026) e 2 templates, lidos inteiros em 28/10/2026 · reescrito em tópicos com as nossas palavras, citações literais curtas; vídeos e prompts pertencem aos criadores (robots.txt: `ai-train=no`, `use=reference`) · os números dos posts se referem à galeria de 10/10 (~230 entradas de 23/09 a 08/10), não ao catálogo atual de `indice.json`

**Conflitos com o estilo padrão da skill** (`direcao-visual.md`): os posts tratam como sinal de "feito por IA" glow/halo sem função, texto decorativo nos cantos (HUD), crossfade e easing saltitante. O estilo padrão da skill usa halo, carimbo com flash, HUD fixo e, na variante clássica, cross-fade. Ao puxar uma direção deste catálogo, vale o que a ficha da direção diz que troca; fora disso o estilo padrão continua como está.

---

## 1. AI explainer video prompts: what 27 examples get right and wrong
URL: https://prompt-motion.com/blog/ai-explainer-video-prompts
Data: 10 out 2026

- Base: 27 explainers na galeria. Mediana de prompt: 15 palavras (galeria toda: 26). O mais curtido (receita de Negroni, 65 palavras, 1.028 curtidas) vence porque descreve um processo com começo e fim, não um tema.
- Receita 1, processo: o prompt define a sequência visível (do copo vazio ao drink pronto) e o que entra como rótulo (ingredientes + medidas aparecendo conforme entram). A estrutura existe antes de desenhar qualquer frame. Tema solto ("momentos da história da IA") obriga o modelo a escolher quais/quantos/como ligar, e aí o resultado fica genérico.
- Se o assunto não é processo físico, achar a sequência dentro dele: requisição atravessando um sistema, número mudando a cada entrada, linha do tempo com número fixo de paradas.
- Receita 2, lista de cenas: o terceiro mais curtido usa 5 cenas em 30 s (problema do cliente, o que faço, como funciona em 3 passos, uma prova, nome no fim). A contagem de cenas já fixa o ritmo (~6 s por cena).
- Variante conceitual: o vídeo de recursão usa um estilo visual diferente a cada explicação; um conceito pode substituir a lista de cenas.
- Lacunas dos 27 prompts: duração em 8; estilo visual (whiteboard, hand-drawn, pixel art) em 8; narração/música/som em 6; público-alvo em 2; checagem de fatos em 0.
- Fatos: para qualquer número, nome ou data, instruir pesquisa prévia e proibir invenção de números e citações; conferir o resultado manualmente.
- Público: uma linha tipo "para quem tem zero base técnica" define vocabulário, ritmo e o que explicar.
- Som: sem narração, toda ideia precisa ser legível só na tela, o que limita a densidade de um explainer de 30 s. Um dos prompts usou edge-tts (TTS gratuito).
- Matemática: um explainer de derivadas foi feito com Manim.
- Checklist de prompt de explainer: tema+público, sequência em ordem, duração (~5 s por ideia como ponto de partida), estilo+paleta, precisão, som.

---

## 2. How to prompt an AI launch video: lessons from 92 real prompts
URL: https://prompt-motion.com/blog/ai-launch-video-prompts
Data: 10 out 2026

- Base: 94 vídeos de lançamento/promo (maior categoria), 92 com prompt. Mediana 26 palavras. O mais curtido (app de impressão de fotos) veio de prompt de 912 palavras. Os 13 prompts acima de 100 palavras: mediana de 56 curtidas; os de 26 palavras ou menos: 5 a 8.
- 26 dos 92 reaproveitam o prompt viral do showreel e só trocam o produto. Problema: o produto vira cenário, o modelo adivinha o que ele faz. Esse grupo teve mediana de 8 curtidas.
- O que os melhores fazem:
  - Nomeiam o que aparece na tela: ex. 9 a 12 fotos reais, 3 a 5 momentos de UI, a frase única que o usuário digita no produto.
  - Bloco de entradas ("peça-me antes de começar"): nome do produto + promessa em uma linha, 3-5 momentos de UI, uma cor de destaque, 10-20 clipes verticais reais, música livre com drop claro. Torna o prompt reutilizável (7 de 92 usam).
  - Look: 14 citam cores/marca, 10 passam URL para estudar. O prompt de 1.344 curtidas começa com pesquisa (estudar designs anteriores da marca, reunir fotos e assets) antes de qualquer design, depois direção, depois regras.
  - Lista de proibições como filtro ("sem slop", sem rótulos de eyebrow, sem look bege "artístico") e pedido de que cada morph seja perfeito.
  - Ideias para ritmo rápido listadas no prompt: SVGs de marca limpos, imagens em tamanhos variados e várias de uma vez, texto com morph, 3D limpo, zooms. Terminar no logo.
  - Tempo: 11 citam batida/BPM; "algo acontece em toda batida" estrutura o corte. Corte na batida distingue launch de slideshow de features.
- Formato: 76 de 94 são paisagem, 12 vertical, 6 quadrado; só 12 de 92 prompts declaram formato. Para feed mobile, escrever "9:16" e os pixels desde o início, para o layout nascer certo.
- Prompt curto melhor: produto+promessa em uma linha; 3-5 momentos reais em ordem; look (hex, uma fonte, claro/escuro); tempo (duração, tempo, mudança a cada batida); o que evitar (glows, explosões de partículas, crossfades, ícones de banco de imagem); final (logo, URL ou uma linha).

---

## 3. AI motion graphics prompts: what 230 real examples show
URL: https://prompt-motion.com/blog/ai-motion-graphics-prompts
Data: 10 out 2026

- Números: mediana 26 palavras (metade central: 18 a 36); maior 2.082. Categorias: launch 94, showreel 78, explainer 27. Assuntos: UI de produto 100, tipografia cinética 97.
- O mesmo prompt de showreel (26 palavras) foi usado 33 vezes: curtidas de 0 a 17.023; mediana 5. 19 rodadas abaixo de 10 curtidas. Causa: o prompt deixa todas as decisões abertas (tema, look, tempo, o que evitar). Nem o modo de esforço máximo uniformizou (rodadas ruins e ótimas).
- Os 19 prompts acima de 100 palavras: mediana 56 curtidas contra 5. Ressalva do próprio site: amostra pequena e viés de audiência.
- As 5 partes que se repetem nos prompts longos melhor recebidos:
  1. Um conceito único ("uma forma, nunca corta": todo estado é o mesmo elemento morfando tamanho, raio e cor, com o conteúdo trocando com blur curto). Sem conceito, sai um tour de efeitos.
  2. Lista de proibições (só 16 prompts têm, mas 4 dos 20 mais curtidos).
  3. Tempo em batida: BPM e número de compassos (ex. 120 BPM, 7 compassos, algo a cada batida) no lugar de "dinâmico".
  4. Método de build: um HTML onde todo frame é função do tempo, capturado frame a frame em navegador headless e misturado para motion blur; evita frames perdidos e deriva de sincronia que acontecem ao gravar a tela de uma animação ao vivo.
  5. Etapa de revisão: renderizar um frame por batida antes do render completo e corrigir sobreposição, aperto, ilegibilidade e frames vazios.
- Estrutura do prompt de 474 palavras (12.103 curtidas), parafraseada, em seções com tags:
  - inputs: o que o modelo deve pedir ao usuário antes (8-12 estados de UI, preto e branco ou um acento, música ~120 BPM livre de direitos).
  - direction: referência de nível Dribbble; um elemento sem cortes; cursor conduz cada mudança com cliques e arrastos reais; canvas cinza-quente claro; componentes preto e branco; uma fonte de UI (Geist); molas com overshoot mínimo; câmera dá zoom para cada estado preencher o quadro; último frame igual ao primeiro (loop). Proibido: easing saltitante, rajadas de partículas, glows, gradientes em chrome de UI, ícones com traços incompatíveis, tempo morto, aparência de template.
  - structure: 120 BPM, 7 compassos, uma encadeada de estados (botão, loader, check, dynamic island, player, slider que estica ao arrastar além do máximo, toggle na batida, indicador de aba líquido, gráfico que se desenha com tooltip, ⌘K, toast, volta ao botão).
  - build: HTML 1440x1440; estilos calculados só a partir do tempo em seek(t), sem transições CSS, timers ou estado entre frames; molas em forma fechada (soma de uma mola por mudança de alvo, para continuar função pura do tempo); as duas bordas do indicador de aba em molas diferentes para a borda da frente esticar; arrasto = manipulação direta (valor segue o cursor, solta e volta de onde estava); analisar a música com numpy para grade de batidas e iniciar no downbeat, sons de UI no pico medido; render com Playwright, 4 subframes por frame misturados via ffmpeg tmix, 60 fps; um frame por batida antes do render final.
  - gotchas: não usar will-change em algo que a câmera escala (texto borra); texto que troca dentro de container que morfa precisa de entrada/saída separadas; último frame idêntico ao primeiro incluindo posição e velocidade do cursor, ou o loop engasga.
  - start: pedir os inputs e mostrar a lista de estados na grade de batidas antes de escrever código.
- O site publicou versão reescrita do prompt de showreel com essas 5 partes (ver seção 6).

---

## 4. Why AI motion graphics look AI-made, and the prompt lines that fix it
URL: https://prompt-motion.com/blog/make-ai-motion-graphics-look-less-ai
Data: 10 out 2026

- Prompts com lista de proibições: 16 de 230 (12 criadores); mediana de 56 curtidas contra 7 da galeria (ressalva: quem escreve lista também escreve prompt detalhado).
- Itens mais banidos (contagem de prompts): glows incluindo neon 7; "qualquer coisa que pareça template" 7; explosões de partículas 6; holds longos/frames congelados/tempo morto 6; crossfades 5; easing saltitante 3; gradientes 3; efeitos 3D 3; stock footage ou UI kits 3; texto nos cantos 2; Math.random 2.
- Por que cada um entrega "feito por IA":
  - Glows/partículas/lens flare: atalhos para parecer rico; viram decoração quando nada pede. Regra citada: banir movimento "not connected to an element already on screen". Se a explosão não sai de algo nem vai para algo, é enchimento.
  - Crossfade/blur-in: transição que ninguém desenhou. Substituir por transição que é a ideia (todo estado é o mesmo elemento morfando; um ponto laranja liga todas as cenas).
  - Easing saltitante: overshoot em tudo fica cartunesco. Mantém molas, mas com overshoot pequeno.
  - Texto nos cantos (rótulos, marcadores de frame, leituras estilo HUD): sugere detalhe sem informação. Dois criadores o chamam de "typical ai made giveaways".
  - Tempo morto: holds acima de ~1 s só se o espectador precisa ler.
  - "Anything that looks like a template": item guarda-chuva que dá o padrão de exigência para efeitos não listados.
  - Math.random: afeta o build; render diferente a cada execução, frame corrigido muda. Banir mantém cada frame reproduzível.
- Como escrever a própria lista: começar pelos tells comuns; rodar uma vez e anotar o que veio sem pedir; dizer o que fazer no lugar ("sem crossfades: cada cena cresce da anterior"); fechar com o padrão ("parece template"); manter curta (5 a 9 itens em uma linha).
- Exemplo completo (vídeo do ponto laranja, ~15 s, 16:9): conceito de um ponto laranja que liga todas as cenas (toggle de UI, ponto sobre o "i" de Motion, gráfico de mola com +22%, círculo que enche o quadro, quadrado preto que vira pílula, palavras orbitando, campo de halftone, cartão final, retorno ao toggle). Paleta: off-white quente, quase-preto, um laranja. 1920x1080, 60 fps, seek(t). Detalhes úteis: gráfico e ponto usam a mesma função de mola; letras animadas individualmente; forma que enche a tela escala além dos quatro cantos; texto de saída e de entrada com timing separado; sincronizar clique, pouso, pico do gráfico, trocas de forma e título final a batidas medidas; pedir os inputs e mostrar mapa de batidas + 4 stills antes do vídeo completo.

---

## 5. Remotion vs HyperFrames vs plain HTML for AI motion graphics
URL: https://prompt-motion.com/blog/remotion-vs-hyperframes
Data: 10 out 2026

- Dos 233 vídeos, só 56 dizem como renderizaram: HTML/canvas puro com Playwright 23 (mediana 12 curtidas, usado para tudo), Remotion 13 (mediana 5; launch em 10 de 13), HyperFrames 10 (mediana 24; launch em 6 de 10), Three.js 5 (3D), outros 5 (Manim, Blender, Python+ffmpeg). Os 177 que não disseram: mediana 7. O site avisa para não escolher ferramenta por curtidas.
- Princípio comum aos três: navegador headless carrega a animação, vai a um instante exato, tira screenshot, repete; ffmpeg codifica. Como cada frame é função do tempo, máquina lenta não perde frame nem sai da batida.
- HTML puro + Playwright: uma página e uma função seek(t); script Playwright percorre os tempos; ffmpeg junta. Sem dependências além dessas, qualquer técnica web (CSS, SVG, canvas, WebGL). Limitação: o prompt precisa dizer como construir (11 prompts citam seek(, 9 citam Playwright). 7 prompts renderizam alguns subframes por frame e misturam no ffmpeg para motion blur. Frase típica: canvas only, sem libs, todo frame função pura do tempo.
- Remotion: framework React; cada cena é um componente que lê o número do frame; tem studio de preview com inputs ajustáveis. Usado quase só em launch/produto: se o produto já é React, reaproveita componentes e estilos reais. Limitação: não é open source no sentido usual; algumas empresas precisam de licença paga, checar antes de uso comercial.
- HyperFrames (HeyGen): renderiza HTML para MP4 com Chrome headless + FFmpeg; Apache 2.0; projetado para agentes escreverem; vídeo descrito em HTML com data attributes, sem React; funciona com GSAP. Meio-termo entre os dois. O mais curtido do grupo (1.415) é promo de app de produtos de bebê.
- Three.js: 3D real com luz e câmera móvel; captura igual; para motion design plano só adiciona complexidade.
- Quando usar: setup mais simples = HTML+Playwright; produto em React = Remotion (checar licença); renderer pensado para agentes sem React = HyperFrames; 3D = Three.js; matemática = Manim (um explainer com TTS gratuito teve 258 curtidas).
- Sempre nomear a ferramenta no prompt; sem método de build o modelo escolhe um diferente a cada vez e o resultado não se repete.

---

## 6. Template "The showreel prompt"
URL: https://prompt-motion.com/templates/showreel
Data: não exibida na página. Recomendação do site: Opus 5.5 com esforço máximo. Original usado em 49 vídeos de 49 criadores.

Diretivas que a versão melhorada acrescenta ao original de uma linha (parafraseadas):
1. Conceito único escolhido pelo modelo e nomeado em uma linha antes de começar (ex. "tinta vira tipografia vira arquitetura"); comprometer-se com ele.
2. Cada plano nasce do anterior: forma, tipo e cor se transformam na próxima cena, sem corte nem fade.
3. Um só typeface (Geist, Inter ou display bold do Google Fonts), no máximo 3 cores mais preto e branco, uma linguagem de câmera consistente.
4. Mostrar alcance com cinco momentos de tempo igual: tipografia cinética, morph de formas, passagem 2D para 3D, momento de dado/UI, título final.
5. Lista de proibições: explosões de partículas, glows, lens flares, camera shake, RGB split, crossfades, gradientes genéricos, easing saltitante, holds acima de meio segundo, aparência de template.
6. Estrutura em batida: 120 BPM, algo a cada batida. Primeiro compasso é o gancho, depois uma técnica por compasso encadeada, último compasso cheio é o momento mais forte, meio compasso final é o título; frame final igual ao primeiro (loop).
7. Build: um HTML 1920x1080, tudo em window.seek(t), sem animações CSS, timers nem estado entre frames.
8. Easing de mola e exponencial como funções do tempo; blur segue velocidade e direção em movimentos rápidos.
9. Trilha sonora escrita em código com Web Audio API (OfflineAudioContext): kick em cada batida, riser até o último compasso, hit em cada troca de cena; exportar WAV e fazer mux.
10. Render com Playwright a 60 fps, 3 subframes por frame misturados com ffmpeg tmix (motion blur).
11. Revisão: um frame por batida antes do render completo; corrigir poluição, fora de batida, sobreposição, ilegibilidade.
12. Fluxo: dizer o conceito e mostrar storyboard batida a batida, depois construir sem mais perguntas e entregar o MP4.

Serve para: peça curta (15 s) de demonstração de capacidade, reel, abertura de marca, base para launch quando o produto vira o conceito.

---

## 7. Template "The 3D template" (real-time three.js)
URL: https://prompt-motion.com/templates/realtime
Data: não exibida. Recomendação: Opus 5.5 com esforço máximo. 5 prompts da galeria têm versão melhorada baseada nele.

Diretivas (parafraseadas):
1. Escolher o "plano assinatura" primeiro (aqui: recuo de câmera em que corredores de cartões formam as letras da marca vistas de cima) e construir tudo rumo a ele.
2. Estilo: luz do dia suave, muito branco, preto e branco, Geist, um acento laranja.
3. Câmera de cinema, não orbit controls: cada plano usa um movimento nomeado (dolly, crane, orbit, push-in, rack focus), com ease-in/out; câmera nunca atravessa geometria.
4. Luz e material: luz chave, de preenchimento e de recorte com sombras suaves, environment map, névoa para profundidade, materiais PBR com rugosidade variada, tone mapping ACES; nada com cara de material padrão.
5. Movimento reativo: o que é atingido se move, o que está perto acende; molas ou física simples, nunca tween linear.
6. Proibido: material e iluminação padrão, rótulos de texto flutuantes, glow em tudo, um objeto girando devagar como ideia inteira, aparência de demo técnica.
7. Lista de planos de ~3 s (macro com rack focus, dolly para trás revelando centenas de cartões numa parede curva com onda de luz, crane sobre a parede, um cartão que desencaixa e vira com peso, plano assinatura, fecho no wordmark+URL).
8. Build: um HTML autocontido, three.js por CDN, sem build step; modelar tudo em código, sem modelos baixados; MeshPhysicalMaterial, PMREM com RoomEnvironment, sombras suaves, ACES, antialias; profundidade de campo só onde precisa; 60 fps em laptop.
9. Modo ?render em que cada frame é calculado do tempo (aleatoriedade com seed, sem relógio) para captura via Playwright em 1920x1080.
10. Capturar um frame por plano, olhar e corrigir o que estiver chapado, serrilhado, atravessando ou ilegível.
11. Armadilhas: ajustar shadow bias (senão listras), near/far apertados (senão cintilação), semear todo random (senão render difere do preview).
12. Fluxo: descrever plano assinatura e lista de planos em poucas linhas, construir sem perguntar, entregar HTML + MP4 de 20 s.

Serve para: peça 3D (espaço de produto, galeria, wordmark revelado), explicador espacial, hero de lançamento com câmera.

---

## Regras transferíveis (para agente que monta vídeo em Remotion)

1. Definir um conceito único e nomeá-lo em uma linha antes de qualquer cena; cada plano deve nascer do anterior por transformação de forma/tipo/cor, não por corte ou fade. https://prompt-motion.com/templates/showreel
2. Para explainer, achar a sequência com começo e fim dentro do tema (processo, requisição, número mudando, linha do tempo) e fixar a ordem antes de desenhar. https://prompt-motion.com/blog/ai-explainer-video-prompts
3. Orçamento de tempo: ~5 s por ideia em explainer; 5 cenas em 30 s é um esqueleto testado (problema, solução, 3 passos, prova, assinatura). https://prompt-motion.com/blog/ai-explainer-video-prompts
4. Fatos com número, nome ou data: pesquisar antes, nunca inventar números ou citações, e listar a fonte no relatório final. https://prompt-motion.com/blog/ai-explainer-video-prompts
5. Declarar o público (ex. "sem base técnica") antes de roteirizar; isso define vocabulário e ritmo. https://prompt-motion.com/blog/ai-explainer-video-prompts
6. Em vídeo de lançamento, o briefing mínimo é: produto + promessa em uma linha, 3 a 5 momentos reais de tela em ordem, cores em hex, uma fonte, claro/escuro, final (logo/URL/uma linha). Se faltar, perguntar antes de construir. https://prompt-motion.com/blog/ai-launch-video-prompts
7. Fixar formato e resolução no início (16:9 1920x1080, 9:16 1080x1920, 1:1) porque o layout depende disso desde o primeiro frame. https://prompt-motion.com/blog/ai-launch-video-prompts
8. Estudar a marca/URL e levantar assets reais antes de desenhar; usar telas e fotos reais do produto em vez de ilustração genérica. https://prompt-motion.com/blog/ai-launch-video-prompts
9. Sincronizar com grade de batidas: escolher BPM, contar compassos, algo muda a cada batida; começar no downbeat e colocar sons no pico medido da faixa. https://prompt-motion.com/blog/ai-motion-graphics-prompts
10. Todo frame é função pura do tempo: sem transições CSS, timers nem estado entre frames. No Remotion isso é o padrão: usar useCurrentFrame e interpolate/spring, sem setTimeout nem CSS animation. https://prompt-motion.com/blog/remotion-vs-hyperframes
11. Proibir Math.random sem seed; qualquer aleatoriedade deve ter seed fixa para o frame ser reproduzível. https://prompt-motion.com/blog/make-ai-motion-graphics-look-less-ai
12. Manter uma lista de proibições curta (5 a 9 itens): glows, explosões de partículas, crossfades, easing saltitante, texto decorativo nos cantos, tempo morto, "parece template"; para cada item, definir o substituto. https://prompt-motion.com/blog/make-ai-motion-graphics-look-less-ai
13. Todo movimento deve sair de um elemento já na tela e ir a algum lugar; efeito sem origem e destino é enchimento. https://prompt-motion.com/blog/make-ai-motion-graphics-look-less-ai
14. Molas com overshoot mínimo em vez de bounce; gráfico e objeto que o acompanha usam a mesma função de mola; molas em forma fechada permitem somar uma mola por mudança de alvo mantendo função pura do tempo. https://prompt-motion.com/blog/ai-motion-graphics-prompts
15. Texto que sai e texto que entra precisam de timing separado; forma que preenche a tela escala além dos quatro cantos; evitar will-change em elementos que a câmera escala. https://prompt-motion.com/blog/make-ai-motion-graphics-look-less-ai
16. Se o vídeo faz loop (reels), o último frame deve igualar o primeiro, incluindo posição e velocidade do cursor. https://prompt-motion.com/blog/ai-motion-graphics-prompts
17. Motion blur real: renderizar 3 a 4 subframes por frame e misturar (ffmpeg tmix); blur segue velocidade e direção. https://prompt-motion.com/templates/showreel
18. QA antes do render final: exportar um frame por batida/plano, olhar, e corrigir poluição, sobreposição, ilegibilidade, frames vazios e fora de batida. https://prompt-motion.com/templates/showreel
19. Em 3D: câmera com movimento nomeado (dolly, crane, push-in, rack focus) e easing, sem orbit controls; luz chave/preenchimento/recorte, environment map, PBR, ACES; shadow bias e near/far apertados; desenhar o plano assinatura primeiro. https://prompt-motion.com/templates/realtime
20. Escolha de renderer: Remotion se o produto é React e a licença permite (checar licença comercial); HyperFrames (Apache 2.0, HTML+GSAP) como alternativa sem React; HTML+Playwright como mais simples; Three.js para 3D real. Sempre registrar a escolha no plano. https://prompt-motion.com/blog/remotion-vs-hyperframes
21. Fluxo de trabalho: apresentar conceito + storyboard/mapa de batidas (e stills-chave) antes de construir o vídeo completo; só depois renderizar sem mais perguntas. https://prompt-motion.com/blog/make-ai-motion-graphics-look-less-ai
