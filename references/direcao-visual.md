# Direção visual (fase 3)

## Estilo padrão

Kit derivado de referências analisadas em out/2026 (reels de motion feitos em código, com e
sem rosto). Ficam as **técnicas**: nada de personagem, logo, paleta exata, texto ou nome de
quem fez. A pergunta que o estilo responde: o vídeo parece *produzido* (luz, profundidade,
UI que narra) ou *colado* (cards chapados por cima)?

### Os 10 pontos

| # | Técnica | Componente | Regra |
|---|---|---|---|
| 1 | **UI inventada e viva**: tela de app desenhada em código, simplificada, cujos estados mudam no marco da fala (item marca check, status muda de cor, contador sobe, toggle desliga) | `TelaViva` (cena `telaViva`) | prefira à print quando a print é ilegível em 9:16; um estado novo a cada 0,5-1 s |
| 2 | **Carimbo** como pontuação dramática: texto em caixa com borda, rotação ~-7°, bate de 1,6x para 1x, flash de tela 3 frames, tremor 4 frames, SFX de impacto | `carimbos` em qualquer cena | 1 por bloco, no máximo; a palavra é a conclusão da fala ("ninguém respondeu", "grátis") |
| 3 | **Espaço 3D**: planos em Z que explodem e se juntam, chão de grade em perspectiva | `Camadas3D` (cena `camadas`) | para "anatomia" de algo: camadas, etapas, partes |
| 4 | **Câmera virtual**: afastar para revelar, aproximar, pan; motion blur só no trecho rápido | `camera`/`cameraInicial`/`motionBlur` | afastar é o melhor "revelar" que existe; não mova a câmera em toda cena |
| 5 | **Luz emitida**: halo radial colorido atrás de cada card, borda luminosa, ícone com glow, conectores pontilhados | `CardHalo`, `GradeBento` (cena `bento`) | luz vem da cor de acento; nada de vidro neutro cinza como único recurso |
| 6 | **Tipografia em papéis** (abaixo) com gradiente, brilho e contorno; entrada por letra/palavra/máscara | `TextoMisto`, cena `frase` | rótulo mono pequeno em cima, palavra enorme embaixo |
| 7 | **Elementos fixos** (HUD) fora das transições: barra de capítulos colorida, título fixo, quadro 4:5 seguro | `Hud` (config `hud`) | a barra mostra a estrutura (problema x solução); o título fixo é opcional |
| 8 | **Encaixe**: o elemento atual encolhe e vira parte da próxima tela (vídeo vira preview, celular vira tile) | `Encaixe`, `encaixe` no bento | 6-8 frames, `Easing.bezier(0.2, 0, 0, 1)`; troca o fade genérico |
| 9 | **Legenda pequena em caixa** (~3,5% da altura), frase visível, só a palavra ativa destacada | `LegendaCaixa` (padrão) | a legenda deixa o motion ser protagonista; a grande virou variante |
| 10 | **Ritmo contrastado**: trechos calmos (2-4 s, estado mudando dentro) e rajadas de cortes de ~0,7 s nos picos da fala | cena `rajada` | 1-2 rajadas por minuto; o resto em corte seco entre cenas |

Complementos: `Letreiro` (duas linhas gigantes em sentidos opostos, uma só em contorno),
`LinhaSVG` (batimento/ECG que vira reta, rachadura), `Recorte` (texto atrás do apresentador,
ver `remotion-padroes.md`) e o fundo de grade com halos.

### Fundo

A grade continua sendo a assinatura (escura e clara), agora com luz e profundidade:
2 halos do acento derivando devagar (ciclo de ~10 s) + contra-halo fraco, vinheta nas bordas,
grão fino opcional e chão de grade em perspectiva opcional (`config.fundo`:
`halos`, `chao`, `vinheta`, `grao`). Fundo quase preto (`#08080A`) ou quase branco
(`#F4F3EF`); a cor vem dos elementos e do glow, não de um fundo colorido.

### Paleta: acento com significado

Escolha um dos dois modos e mantenha no vídeo inteiro:

| Modo | Quando | Como |
|---|---|---|
| **Semântico** | o roteiro tem problema x solução (antes/depois, dor/alívio, concorrente/produto) | `acento` = solução/marca; `problema` = dor/erro (vermelho-coral por padrão). O vermelho só aparece na dor: badge "sem resposta", carimbo, alerta, barra de capítulo do problema |
| **Acento único** | não há conflito no roteiro; marca forte de uma cor | só `acento` (+ `acento2` opcional para o fim do gradiente). A riqueza vem do gradiente, do brilho e da profundidade, não de cores novas |

Nunca uma terceira cor decorativa. Avatares de UI inventada usam cores neutras variadas só
para distinguir pessoas.

### Tipografia em papéis

| Papel | Fonte padrão | Uso | Estilo |
|---|---|---|---|
| frase | Plus Jakarta Sans 800 | frases-chave, legenda, rótulos de card | tracking -0,035em, 1-6 palavras |
| número | Unbounded 800 (larga) ou Big Shoulders 800 (estreita, papel `estreita`) | número-chave, palavra de impacto, letreiro | gradiente texto -> acento + brilho; entra por máscara ou por letra |
| emocional | Instrument Serif Italic | **uma** palavra por frase, a que carrega a emoção ("perde", "apagão", "dorme") | na cor do acento, com brilho; marcação `_palavra_` |
| rótulo | JetBrains Mono 600 | rótulo acima da palavra grande, chips, status | caixa alta, tracking 0,24-0,3em, pequeno |

Marcação no texto (`TextoMisto`): `*acento*` (gradiente + brilho), `_emocional_`,
`[contorno]`, `{numero}`, `~problema~`. Alternativas por nicho: frase -> Manrope 800 ou
Figtree 800; número -> Syne 800; emocional -> Playfair Display Italic (mais larga).

### O que evitar no estilo padrão

| Não | Sim |
|---|---|
| card de vidro cinza chapado como único recurso | card escuro com halo da cor, borda luminosa e glow |
| print ilegível encolhido em 9:16 | TelaViva com os 3-4 dados que a fala cita |
| fade/cross-fade genérico entre todas as cenas | corte seco + entrada própria da cena, ou encaixe |
| câmera mexendo em toda cena, motion blur ligado sempre | câmera só para revelar/aproximar; blur só no trecho rápido |
| carimbo em toda frase | 1 carimbo por bloco, na conclusão |
| duas palavras emocionais na mesma frase, serifa em frase inteira | uma palavra emocional |
| legenda grande protagonista disputando com o motion | legenda em caixa pequena |
| terceira cor, gradiente arco-íris | acento (+ problema) com gradiente e luz |
| emoji como ícone | ícone em traço estilo lucide com glow |
| personagem, logo ou paleta copiados de uma referência | a técnica, com a marca e a paleta do cliente |

Texto parado continua com limite de ~2,5 s (seção "Texto de tela" abaixo).

---

## Variante clássica

O estilo anterior continua disponível: cenas `titulo`, `numeros`, `print`, `terminal`,
`pills`, `cta`, legenda grande (`legenda_estilo: "grande"`), cross-fade com blur. Use quando
o cliente pedir um visual mais sóbrio/editorial ou quando o vídeo for essencialmente print
real de produto. As regras abaixo valem para ela (e as de acento, contraste e texto de tela
valem para as duas).

## Assinatura: fundo de grade

`template/src/comp/FundoGrade.tsx`. Grade de linhas finas (célula 72 px) com drift lento,
máscara radial (some nas bordas, foco no centro-alto) e um halo da cor de acento no canto
superior direito, pulsando de leve. Dá profundidade sem competir com o conteúdo.

Parâmetros: `celula` (padrão 72), `halo` ([x, y] 0-1), `drift` (true/false). Para uma
cena mais limpa (CTA, número grande), dá para mudar o halo de lugar por cena.

## Tokens (`template/src/theme.ts`)

| Token | Escura | Clara | Uso |
|---|---|---|---|
| `fundo` | `#08080A` | `#F4F3EF` | fundo (nunca `#000` puro nem `#FFF` puro) |
| `texto` | `#F5F4F2` | `#141416` | títulos, números |
| `suave` | `#B4B2AE` | `#57554F` | texto secundário |
| `apagado` | `#87858A` | `#8D8B85` | rótulos inativos |
| `linha` | branco 9% | preto 10% | bordas |
| `grade` | branco 5% | preto 7% | linhas da grade |
| `vidro` | branco 4,5% | branco 72% | card de vidro |
| `vidroOpaco` | `#101012` 92% | branco 96% | card sobre print/grade |
| `codigoFundo` | `#0E0E10` | `#16161A` | terminal (escuro nas duas variantes) |
| `acento` | `config.acento` | `config.acento` | cor da marca/solução |
| `acento2` | `config.acento2` | idem | fim do gradiente (padrão: acento clareado) |
| `problema` | `config.problema` | escurecido | só a dor/erro no modo semântico |
| `superficie`, `superficie2` | `#0C0C10`, `#14141A` | branco, `#F1F0EC` | janela e linhas da TelaViva, cards do bento |
| `acentoTexto` | = acento | acento escurecido 28% | acento usado como texto (contraste no claro) |

Derivados automáticos: `acentoClaro`, `acentoFundo`, `linhaAcento` (45%), `halo`,
`glow(forca)`, `gradTexto`, `gradAcento`, `corDe(nome)` (acento | solucao | problema | neutro | hex),
`brilho(cor, forca)`. Troque só `config.acento` e a variante; o resto acompanha.

Escolha da variante: escura para tech, produto digital, noite, premium; clara para
saúde, educação, finanças pessoais, comida, jurídico, quando o nicho for claro na
pesquisa. Prints muito claros num vídeo escuro funcionam bem dentro da janela de vidro.

## Acento

1. **Marca do usuário existe** (logo, site, guia): extraia dos pixels, não chute.

```python
from PIL import Image
from collections import Counter
im = Image.open("logo.png").convert("RGB").resize((200, 200))
for rgb, n in Counter(im.getdata()).most_common(12):
    if sum(rgb) > 720 or sum(rgb) < 40:  # ignora branco e preto de fundo
        continue
    print("#%02X%02X%02X" % rgb, n)
```

   Do site: capture com Playwright e rode o mesmo código, ou leia as variáveis CSS.
2. **Sem marca:** o acento vem da pesquisa do nicho (fase 2), escolhendo o que se
   destaca sem fugir do nicho.
3. Contraste: o acento como texto precisa de contraste >= 4,5:1 com o fundo. Na variante
   clara isso é automático via `acentoTexto`; confira mesmo assim nos frames.

## Tipografia (clássica)

3 famílias, carregadas por `@remotion/google-fonts` no topo de `theme.ts`:

| Papel | Padrão | Alternativas por nicho |
|---|---|---|
| display (títulos, legenda) | Manrope 500/600 | Inter Tight, Space Grotesk (tech), DM Sans, Instrument Sans, Bricolage Grotesque (criativo), uma serifa como Fraunces/Newsreader (editorial, jurídico, gastronomia) |
| corpo | Inter 400-600 | DM Sans, Geist |
| mono (números, rótulos, terminal) | JetBrains Mono | Geist Mono, IBM Plex Mono |

Regras: título em 500-600 (nunca 800/900 grande), letter-spacing levemente negativo em
título grande (-0,03em), rótulo mono em caixa alta com espaçamento (0,16-0,18em),
números em mono com `tabular-nums`. Para trocar: mude o import (`@remotion/google-fonts/<Familia>`)
e os pesos/subsets em `theme.ts`.

## Regras anti "cara de IA" (clássica)

| Não | Sim |
|---|---|
| emoji como ícone | SVG em traço estilo lucide (`comp/Icone.tsx`, copie paths de lucide.dev, licença ISC) |
| gradiente arco-íris, roxo-azul genérico | um acento só, sobre neutros |
| botão/pill preenchido de cor sólida | pill de contorno com glow suave |
| título 800/900 gigante gritando | peso moderado, hierarquia por tamanho e cor |
| tudo entrando linear ao mesmo tempo | spring/easing, entrada no tempo da fala |
| brilho, partícula, lens flare decorativo | profundidade por vidro, sombra, halo discreto |
| mockup inventado do produto | print real, com dado sensível borrado |
| texto longo na tela | 2-6 palavras por elemento; o resto é fala/legenda |
| card pequeno parado 5-8 s com tela vazia em volta | frase-chave grande no centro por ~1,5-2 s, depois muda ou volta ao orador |

## Composição

- Uma ideia por cena. O olho precisa saber para onde olhar em 0,3 s.
- Conteúdo dentro da área segura e acima da zona da legenda (`LIMITE_CONTEUDO` no theme).
- 9:16: coluna única, margem lateral 64 px. 16:9: aproveite a horizontal (print + coluna).
- Hierarquia: rótulo mono pequeno em acento -> título/elemento principal -> apoio.
- Movimento de câmera em print (zoom + Ken Burns) substitui corte quando a cena é longa.

## Texto de tela

Lição real (reel de palestra): cards "não interessa X (riscado) / interessa Y" ficaram
5-8 s parados, pequenos e com espaço vazio no meio, enquanto o orador seguia falando.
Feedback do espectador: dá preguiça, a pessoa lê a mesma coisa várias vezes e não presta
atenção nem no texto nem na fala. A correção que funcionou: frase curta e grande por
~1,5-2 s e volta para o orador.

| Regra | Valor |
|---|---|
| tempo máximo de um texto parado (fora a legenda) | ~2,5 s; depois muda (nova palavra, punch-in, ícone que reage) ou sai |
| frase-chave | 2-6 palavras, grande (ocupa a largura útil), no centro, entra no marco da palavra falada |
| com filmagem do orador | alterna frase-chave (~1,5-2 s) e orador; a dosagem vem da "presença do orador" escolhida na fase 0 |
| texto x legenda | o texto de tela destaca a ideia; não repete por segundos o que a legenda já mostra |
| espaço vazio | nada de card pequeno no meio de tela vazia: ou a frase ocupa a tela, ou a tela é do orador |

`scripts/cenas_check.py` mede isso no `cenas.json` antes do render.
