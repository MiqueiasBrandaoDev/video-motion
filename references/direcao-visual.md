# Direção visual (fase 3)

## Assinatura: fundo de grade

`template/src/comp/FundoGrade.tsx`. Grade de linhas finas (célula 72 px) com drift lento,
máscara radial (some nas bordas, foco no centro-alto) e um halo da cor de acento no canto
superior direito, pulsando de leve. Dá profundidade sem competir com o conteúdo.

Parâmetros: `celula` (padrão 72), `halo` ([x, y] 0-1), `drift` (true/false). Para uma
cena mais limpa (CTA, número grande), dá para mudar o halo de lugar por cena.

## Tokens (`template/src/theme.ts`)

| Token | Escura | Clara | Uso |
|---|---|---|---|
| `fundo` | `#0A0A0B` | `#F6F5F2` | fundo (nunca `#000` puro nem `#FFF` puro) |
| `texto` | `#F5F4F2` | `#161616` | títulos, números |
| `suave` | `#B4B2AE` | `#57554F` | texto secundário |
| `apagado` | `#87858A` | `#8D8B85` | rótulos inativos |
| `linha` | branco 9% | preto 10% | bordas |
| `grade` | branco 4,5% | preto 6% | linhas da grade |
| `vidro` | branco 4,5% | branco 72% | card de vidro |
| `vidroOpaco` | `#101012` 92% | branco 96% | card sobre print/grade |
| `codigoFundo` | `#0E0E10` | `#16161A` | terminal (escuro nas duas variantes) |
| `acento` | `config.acento` | `config.acento` | UMA cor por vídeo |
| `acentoTexto` | = acento | acento escurecido 28% | acento usado como texto (contraste no claro) |

Derivados automáticos: `acentoClaro`, `acentoFundo`, `linhaAcento` (45%), `halo`,
`glow(forca)`. Troque só `config.acento` e a variante; o resto acompanha.

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

## Tipografia

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

## Regras anti "cara de IA"

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
