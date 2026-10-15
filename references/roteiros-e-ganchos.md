# Roteiros e ganchos (fases 1 e 4)

Estruturas de roteiro, proporções de tempo e tipos de gancho medidos em anúncios de vídeo
analisados em out/2026 (talking head com motion por cima, 24 a 60 s, 9:16). Ficam as
**estruturas**: nenhum texto, nome ou produto das referências entra no roteiro do cliente.

## Índice
1. A regra do primeiro segundo
2. Medidas de ritmo
3. Estruturas (A a D) com proporções de tempo
4. Biblioteca de ganchos
5. Do roteiro ao storyboard (talking head)
6. Checklist do roteiro

## 1. A regra do primeiro segundo

**Mostre o resultado no 1º segundo; explique depois.** Nos anúncios que mais circularam, o
primeiro quadro já trazia a prova visível (o produto pronto, um antes/depois, dois
resultados lado a lado, um número grande, o próprio vídeo se desmontando em camadas). Os que
abriam com rosto e frase abstrata ("o futuro de X", "o mercado mudou") ficaram no fim da
tabela, mesmo bem produzidos. Leitura: hipótese forte, não causalidade.

| Faça | Evite |
|---|---|
| primeira palavra em 0,0 s (zero respiro antes da fala) | "Oi, eu sou...", saudação, logo de abertura |
| primeiro elemento visual (título atrás da cabeça, card, janela, número) na tela até 1 s | rosto sozinho por 3 s antes do primeiro elemento |
| prova concreta no gancho: resultado, número, comparação | promessa genérica ("vou te mostrar algo incrível") |
| frase de 4 a 10 palavras | parágrafo antes do ponto |

Na prática: o storyboard marca qual elemento aparece no frame 0-30 e qual palavra o dispara.
`cenas_check.py` não mede isso; confira no QA (fase 10) olhando o frame de 0,5 s.

## 2. Medidas de ritmo

| Medida | Valor observado |
|---|---|
| fala | 2,6 a 3,4 palavras/s (média ~3,0) depois do corte de pausas |
| primeira palavra | 0,0 s |
| duração | 24 a 60 s (mediana ~39 s); os de maior velocidade tinham 55 a 60 s com muita demonstração |
| corte de câmera | quase zero: plano contínuo com cortes de pausa invisíveis (o vídeo é cortado junto com a voz) |
| mudança visual grande (layout, P&B, card, tela cheia) | a cada 3 a 8 s (mediana ~5 s) |
| elemento novo sobre o rosto (título, chip, número, ícone) | a cada 1,5 a 2,5 s, legenda à parte |
| bloco de demonstração em tela cheia | 6 a 14 s seguidos, no meio do vídeo |
| loudness | -14 LUFS em todos |

Duração não pesa contra; o que pesa é densidade de demonstração. Vídeo de 30 s só de rosto
falando perde para um de 60 s que mostra o produto funcionando.

## 3. Estruturas

Proporções = início do bloco em % da duração total (medidas pela palavra-chave na
transcrição). Use como ponto de partida e ajuste ao conteúdo.

### A. Problema -> demonstração -> oferta -> CTA (a mais comum, ~2/3 dos analisados)

| Bloco | Início | Duração | O que aparece |
|---|---|---|---|
| Gancho | 0% | 3-5 s | rosto cheio + título atrás da cabeça (ou card/objeto ao lado do rosto) |
| Problema | ~10% | 5-8 s | P&B no "jeito antigo", número que sobe, palavra riscada, carga de trabalho |
| Demonstração | **~30%** (25-35%) | 6-14 s | tela cheia: painel/editor inventado executando o que a fala descreve (TelaViva), cor de volta |
| Produto / oferta | **~82%** da menção ao nome (bloco começa em 60-70%) | 5-10 s | orador encolhe para card + lista de 3 passos, ou cards flutuando; marca atrás da cabeça |
| CTA | **~89%** | 3-4 s | pill de ação sob a legenda, fica até o fim |
| Card final | últimos 1-2 s | | marca + slogan + endereço + seta |

Duração típica 28-47 s.

### B. Demonstração ao vivo -> corpo comum (versionável)

| Bloco | Tempo | Conteúdo |
|---|---|---|
| Comandos ao vivo | 0-50% | a pessoa dá ordens no imperativo e cada ordem acontece na tela 0,3-1 s depois (terminal de comando + HUD "REC") |
| Virada | ~50% | pergunta de transição ("gostou desse resultado?") |
| Objeção principal | +2 s | resposta curta com indicador visual (medidor, número) |
| Método | +6 s | 3 passos |
| Produto | +4 s | página/oferta |
| Fecho | último | frase-assinatura + CTA |

O corpo (da virada ao fim) pode ser **idêntico** em várias versões; só a demonstração de
abertura muda. É a forma mais barata de produzir variações para teste: grave 4 aberturas e
um corpo.

### C. "E se eu fosse X?" (troca de persona)

Gancho de formato (0-5 s) -> por que antes era caro (5-18 s: orçamento riscado, prazo, valor)
-> "hoje dá pra fazer; quer ver?" -> 2 personas de ~12 s cada, com troca de figurino/cenário
e explicação ilustrada em tela cheia (fundo claro no bloco didático) -> "eu só gravei a fala"
-> CTA. ~60 s. Exige captação planejada (3-4 blocos com roupa e cenário diferentes).

### D. Objeções enumeradas

HUD fixo no topo com N círculos ("objeções ○○○○○"). Cada objeção é dita na voz do público
("eu não consigo X porque...") e respondida com a demonstração de X; o círculo ganha check.
Ciclos de ~5 s. Funciona com 3 a 6 objeções.

### Comparação direta (duelo)

Dois resultados lado a lado (vertical: um em cima do outro) com nome e placar. É gancho e
prova ao mesmo tempo; nos analisados, a peça que mais circulou era um duelo. Cena `duelo`.

## 4. Biblioteca de ganchos

Fórmulas genéricas. Preencha com o assunto do cliente; nunca copie a frase de uma referência.

| # | Tipo | Fórmula | Visual dos 3 primeiros segundos |
|---|---|---|---|
| 1 | Duelo | "Quem faz [tarefa] melhor: A ou B? Vamos tirar a limpo." | dois resultados lado a lado com nome (cena `duelo`) |
| 2 | Anatomia | "Este [vídeo/produto] tem N partes." | o objeto se desmonta em camadas no 1º segundo (cena `camadas`) |
| 3 | Ordem ao vivo | começa direto no imperativo, sem apresentação | o pedido acontece na tela em menos de 1 s (`comando` + `rec`) |
| 4 | Antes caro, agora trivial | "[Tarefa] custava [tempo/dinheiro]." | número grande atrás da cabeça (`numero`) |
| 5 | Novo formato | "Este é um formato novo de [X] e você vai ver muito." | chip de status + troca de cenário |
| 6 | Objeção do público | "Ah, mas eu não [faço X] porque..." | HUD de checklist vazio (`objecoes`) |
| 7 | Pensamento do espectador | "Você vê [X] e pensa: nunca vou conseguir." | card com a frase entre aspas |
| 8 | Prova + desafio | "[Peça] foi 100% feita com [método]. Dá pra perceber?" | a peça rodando atrás da pessoa |
| 9 | Olha isto | "Olha esse [trecho/resultado]." | o trecho em janela ao lado do rosto |
| 10 | Cena cotidiana | "Sabe quando você [ação comum]?" | o objeto da cena ao lado do rosto (mensagem, nota, post salvo) |
| 11 | Carga invisível | "Quem faz [X] sozinho faz o trabalho de N pessoas." | rótulos de funções acendendo (`chips`) |
| 12 | Segmentação | "Se você é [perfil], esta é a melhor notícia do ano." | título de duas larguras (`titulo`) |
| 13 | Contraintuitivo | "Seu cliente não [hábito esperado], ele [outro hábito]." | o objeto esperado some ou é riscado (`riscado`) |
| 14 | Régua mudou | "Antes bastava N. Agora precisa de N×10." | número que rola subindo (`numero`) |
| 15 | Dado concreto | "[Coisa] saiu de X% para Y%." | antes -> depois (`raw` ou placar) |
| 16 | Gap de capacidade | "Você tem N ideias; sua produção entrega N/2." | número + "SÓ N" |
| 17 | Mecanismo | "Sabe por que [X] funciona como profissional?" | HUD técnico (caixas de detecção, medidas) |
| 18 | Frustração com ferramenta | "Você abre [programa] e já quer fechar?" | P&B + janela cheia de botões (`pb` + TelaViva) |

Regra observada: em nenhum dos analisados o gancho era saudação, nome ou promessa genérica.

## 5. Do roteiro ao storyboard (talking head)

1. Escreva o roteiro na estrutura escolhida, com o tempo-alvo de cada bloco (seção 3).
2. Para cada frase, marque **a palavra que dispara** o elemento (vira marco no
   `marcos.spec.json`) e o componente:

| Momento do roteiro | Componente (cena `orador`, lista `sobre`) |
|---|---|
| gancho com número/tempo/valor | `titulo` (2 larguras) ou `numero` atrás da cabeça |
| "o jeito antigo", a dor | `pb` na cena + `titulo` com `pb: true`; `riscado` na palavra negada |
| antes -> depois | `raw` (xadrez + moldura -> editado) |
| método, etapas | `card` + `passos` |
| lista de objeções | `objecoes` (HUD) + `chips` |
| número que cresce | `numero` com vários `valores` |
| ordem/pedido ao vivo | `comando` + `rec` |
| módulos, entregáveis | `cards` |
| demonstração longa | cena `telaViva` com `perspectiva` e blocos `video` + `chat` + `timeline` |
| comparação | cena `duelo` |
| gravação horizontal com título fixo | cena `letterbox` |
| CTA | `pill` (no "toque/clique") + `final` nos últimos 1-2 s |

3. Separe o vídeo em blocos (`cortes.json` -> `bloco`); cada bloco vira uma cena `orador`
   (corte seco; o vídeo não pula porque cada cena começa no frame da timeline).
4. Uma mudança visual grande a cada 3-8 s e um elemento novo a cada 1,5-2,5 s. Texto sobre
   o rosto sai em até ~2,5 s (`ate`) ou muda (`cenas_check.py` mede).

## 6. Checklist do roteiro

- [ ] Primeira palavra em 0,0 s e primeiro elemento visual até 1 s.
- [ ] O gancho mostra resultado/prova, não promete.
- [ ] Demonstração começa em ~25-35% do vídeo.
- [ ] Nome do produto/oferta perto de ~80%; CTA em ~89%, com pill até o fim.
- [ ] Cada bloco tem a palavra que dispara cada elemento.
- [ ] Nenhuma frase, nome ou marca copiados de referência.
