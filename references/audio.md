# Áudio da voz (fases 1 e 6)

## Índice
1. Transcrição (OpenAI ou local)
2. Classificar trechos: LOCUÇÃO / INSTRUÇÃO / DESCARTE
3. Plano de cortes (`cortes.json`)
4. O que o `cortar.py` faz (e comandos ffmpeg equivalentes)
5. Retranscrição, legendas e marcos
6. Voz por TTS e vídeo sem voz
7. Vídeo de entrada (talking head com cortar_video.py, screencast)

## 1. Transcrição

```bash
python -I <skill>/scripts/transcrever.py <entrada> work/transcricao.json --idioma pt --vocab "Marca, Nome Próprio, termo"
```

| Motor | Quando | Custo | Observação |
|---|---|---|---|
| `openai` (whisper-1) | `OPENAI_API_KEY` definida | ~US$ 0,006/min (conferir preço) | melhor tempo por palavra; `--vocab` vira prompt de grafia |
| `local` (faster-whisper) | sem chave, ou dado que não pode sair da máquina | gratuito | `pip install faster-whisper`; `--modelo-local small` (bom), `medium` (melhor, mais lento); CPU por padrão (`--dispositivo cuda` só com CUDA 12 + cuBLAS) |

Alternativa local em Node: pacote `@remotion/install-whisper-cpp` (mesma versão do
Remotion), com `installWhisperCpp()`, `downloadWhisperModel()` e `transcribe()` com
`tokenLevelTimestamps: true`; converta a saída para o mesmo formato
(`words[{word,start,end}]` em segundos) antes do `legendas.py`.

Se o download do modelo local ficou incompleto (`model.bin is incomplete`), use
`--pasta-modelos <pasta nova>` para baixar de novo sem mexer no cache existente.

Modelos `gpt-4o-transcribe` não devolvem tempo por palavra: use `whisper-1`.

## 2. Classificar trechos

```bash
python -I <skill>/scripts/trechos.py work/transcricao.json --palavras --saida work/trechos.json
```

As pistas (`[INSTRUÇÃO?]`, `[REPETE?]`, `[HESITA?]`, `[PAUSA]`) são só pistas. Leia o texto:

| Classe | Exemplos | Ação |
|---|---|---|
| LOCUÇÃO | a fala que conta a história | `manter` |
| INSTRUÇÃO PARA O AGENTE | "aqui coloca o print do painel", "nessa parte mostra o número grande", "corta isso", "deixa a música mais alta no final" | vira requisito no storyboard; trecho vai para `remover` |
| DESCARTE | frase recomeçada (fica a última tentativa completa), "é... então...", tosse, silêncio > 0,7 s, erro factual que o usuário corrigiu falando | `remover` ou fora das janelas `manter` |

Use `--palavras` para achar o ponto exato de corte (início da primeira palavra mantida,
fim da última). Corte entre palavras, nunca no meio.

## 3. `cortes.json`

```json
{
  "tempo": "auto", "alvo_silabas_s": 7.4, "tempo_min": 1.3, "tempo_max": 2.0,
  "pausa_max": 0.28, "pos": 0.12, "pre": 0.08, "fade": 0.012,
  "silencio_db": -36, "silencio_min_s": 0.22,
  "manter": [
    {"ini": 0.85, "fim": 8.0, "bloco": "gancho"},
    {"ini": 9.3, "fim": 26.8, "bloco": "dor"}
  ],
  "remover": [
    {"ini": 14.31, "fim": 16.48, "gap": 0.14, "motivo": "tropeço: recomeçou a frase"}
  ]
}
```

- Tempos sempre do **original**. Nunca acelere em cima de um arquivo já acelerado:
  mude `tempo` e rode de novo a partir do original.
- `tempo`: **`"auto"` é o padrão**: acelera a fala até a **velocidade-alvo de 7,4 sílabas/s**,
  nunca abaixo de 1,3x (regra 4 do SKILL.md, pedido do Miquéias em out/2026: abaixo disso a fala
  parece lenta no feed). O tom é preservado pelo atempo.

  | Ponto | Como |
  |---|---|
  | métrica | sílabas faladas da fala mantida ÷ duração dela com as pausas já apertadas (soma dos trechos do corte, sem os respiros das pontas): o que o ouvinte recebe |
  | sílabas | português, por núcleo vocálico (ditongo conta 1, hiato 2); números por extenso ("2027" = 8, "37,5%" = 13); sigla lida quando é pronunciável (DAS = 1) e soletrada quando não é (IBS = i-bê-esse = 4). Regras no topo de `scripts/velocidade.py` |
  | alvo | 7,4 = média dos dois vídeos aprovados de 19/10/2026 (6,74 e 8,05 síl/s medidos na voz final, feitos a 1,3x) |
  | fator | alvo ÷ medida, limitado a `tempo_min` (1,3) e `tempo_max` (2,0; `null` = sem teto). Fala já rápida fica no piso e sai acima do alvo; fala lenta ganha mais que 1,3 |
  | teto | com o alvo fixo, a velocidade final é a mesma qualquer que seja o fator, e a inteligibilidade só cai perto de 9-10 síl/s (teste abaixo); o que piora com o fator é o atempo, estável até 1,9x e pior em 2,1x. O teto de 2,0 só atua em fala abaixo de ~3,7 síl/s |
  | fonte | transcrição do ORIGINAL com tempo por palavra (`work/transcricao.json` da fase 1A; outro caminho com `--transcricao`); contam as palavras dentro de `manter` e fora de `remover` |
  | registro | o `blocos.json` grava o fator usado (`tempo`) e o objeto `velocidade` (medida, alvo, resultado previsto, piso/teto) |

  Medir antes de cortar (mesma conta do `cortar.py`) e conferir depois:

  ```bash
  python -I <skill>/scripts/velocidade.py work/transcricao.json --de 0 --ate 21.1 --audio gravacao.m4a [--listar]
  python -I <skill>/scripts/velocidade.py work/voz_final.json --sem-aperto
  ```

  Sem `--audio`, a duração é estimada pelas pausas entre palavras, que o whisper-1 costuma esconder
  (deu 4-6% mais lento que a conta real nas tomadas de teste). A contagem segue a grafia do Whisper:
  na retranscrição da voz acelerada ele às vezes escreve "pro" no lugar de "para o" e "EUA" no lugar
  de "Estados Unidos", e a medida cai 5-8% sem a fala ter mudado; para conferir, divida as sílabas da
  transcrição do original pela duração da retranscrição.

  Sobrescrever: `"alvo_silabas_s"` (8,0 mais rápido, 6,8 mais calmo), `"tempo_max"` para limitar,
  ou um número fixo (`"tempo": 1.4`), que continua valendo como antes. Voz TTS: número 1,0-1,1 (já
  vem no ritmo; os scripts avisam abaixo de 1,3, ignore nesse caso). Acima de 1,6x o script avisa
  para ouvir (sílabas embolando, timbre metálico); acima de 2,0 o atempo vai em cadeia (cada estágio
  <= 2,0). Teste de teto (out/2026, tomada lenta de 5,4 síl/s): o Whisper errou 1-2 de 48 palavras
  até 1,7x e 7-8 a partir de 1,9x (~10 síl/s); em tomadas mais rápidas os erros começaram mais cedo,
  na mesma faixa de 9-10 síl/s finais. A periodicidade da voz (indicador de artefato do atempo) fica
  estável de 1,3x a 1,9x e cai em 2,1x.
- `pausa_max`: pausas naturais até esse valor ficam; maiores viram `pos + pre` (~0,2 s
  antes do atempo, ~0,17 s depois).
- `silencio_db`: -36 dB serve para gravação limpa; se a sala tiver ruído, suba para -32;
  se a voz for baixa e as sílabas finais sumirem, desça para -40.
- `bloco`: o nome do bloco do storyboard. O `blocos.json` gerado traz o início de cada
  bloco na timeline final, usado pelas cenas como `"bloco:nome"`.

## 4. O que o `cortar.py` faz

```bash
python -I <skill>/scripts/cortar.py --entrada gravacao.m4a [--projeto .] [--plano cortes.json] [--transcricao work/transcricao.json]
```

1. `ffmpeg -i entrada -vn -ac 1 -ar 48000 -c:a pcm_s16le work/orig.wav`
2. `silencedetect=noise=-36dB:d=0.22` -> ilhas de fala; recorta pelas janelas `manter`
3. Tira `remover`, junta pausas curtas, põe respiro
4. `tempo: "auto"`: sílabas da fala mantida ÷ duração dos trechos -> fator para o alvo (seção 3);
   imprime a medida, o alvo, o fator e se bateu no piso/teto
5. Grafo: `atrim` + `asetpts` + `afade` in/out (12 ms) por trecho -> `concat` -> `atempo=<tempo>` -> `highpass=f=80`
   (o grafo vai para `work/cortes_grafo.txt` e é lido com `-/filter_complex` no ffmpeg 7+)
6. `loudnorm` 2 passadas: mede (`print_format=json`) e aplica com `measured_*` e `linear=true`,
   alvo `I=-14:TP=-1:LRA=11`
7. Grava `public/voz.wav` (48 kHz mono) e `src/data/blocos.json` (duração, `tempo`, `velocidade`, blocos, mapa de trechos)

Comandos úteis à parte:

```bash
# ouvir/conferir um trecho do original
ffmpeg -ss 14.0 -to 17.0 -i gravacao.m4a -c copy work/trecho.m4a
# medir loudness
ffmpeg -i public/voz.wav -af ebur128=peak=true -f null -
# remover ruído de fundo leve (só se precisar; teste antes)
ffmpeg -i entrada.wav -af "afftdn=nf=-25" saida.wav
```

## 5. Retranscrição, legendas e marcos

Os tempos mudam depois de cortar e acelerar. Retranscreva a voz final:

```bash
python -I <skill>/scripts/transcrever.py public/voz.wav work/voz_final.json --vocab "Marca, Nome"
python -I <skill>/scripts/legendas.py --palavras work/voz_final.json --listar     # ver palavras e tempos
python -I <skill>/scripts/legendas.py --palavras work/voz_final.json --marcos-spec marcos.spec.json --correcoes correcoes.json
```

`marcos.spec.json` liga nomes a palavras (as âncoras das animações):

```json
{"gancho": "perde",
 "custo": {"palavra": "custo", "depois_de": "gancho"},
 "valor": {"palavra": "4,79", "ocorrencia": 1},
 "fimLink": {"palavra": "link", "borda": "fim"}}
```

Porcentagem: o `text` do Whisper traz "30%", mas a lista de palavras vem só com "30" (o "%"
some). Recoloque com `trocas` (`{"30": "30%"}`) ou, quando o mesmo número aparece com e sem
"por cento", com `sequencias` presas à palavra anterior (`["gera", "50"] -> ["gera", "50%"]`).
Nome próprio que o Whisper ouve como palavra comum vai em
`--vocab` e, se ainda errar, em `trocas`/`sequencias`.

`correcoes.json` só corrige grafia ou erro evidente do Whisper (marca escrita errada,
número quebrado em palavras). Na dúvida, ouça o trecho isolado antes de corrigir.

```json
{"trocas": {"Cloud": "Claude"},
 "sequencias": [{"de": ["4", "e", "79", "dólares"], "para": ["4,79", "dólares"]}]}
```

## 6. TTS e vídeo sem voz

```bash
python -I <skill>/scripts/tts.py --texto roteiro.txt --saida work/voz_tts.wav --voz alloy \
  --instrucoes "tom de conversa, ritmo ágil, pt-BR natural"
```

Depois trate como gravação: `cortar.py` com `tempo` 1,0-1,1 e `manter` cobrindo tudo.
Avise que a voz é sintética; várias plataformas pedem sinalizar conteúdo gerado por IA.

Sem voz: tipografia cinética + música. Use `config.duracao_s`, `legendas: false`,
`marcos.json` escrito à mão a partir do roteiro (ritmo de leitura ~3 palavras/s, frase
na tela por 1,2-2 s) e `mixar.py --sem-voz --duracao <s>`.

## 7. Vídeo de entrada

**Talking head (caminho principal com rosto).** Transcreva o próprio vídeo, classifique os
trechos (seção 2) e corte **imagem e som juntos** com o mesmo `cortes.json`:

```bash
python -I <skill>/scripts/transcrever.py gravacao.mp4 work/transcricao.json --vocab "Marca, Nome"
python -I <skill>/scripts/trechos.py work/transcricao.json --palavras
python -I <skill>/scripts/cortar_video.py --entrada gravacao.mp4      # -> public/orador.mp4, public/voz.wav, blocos.json
python -I <skill>/scripts/transcrever.py public/voz.wav work/voz_final.json
python -I <skill>/scripts/legendas.py --palavras work/voz_final.json --marcos-spec marcos.spec.json --destaques "palavra,outra"
# opcional, texto atrás da pessoa:
python -E -P <skill>/scripts/recortar_orador.py public/orador.mp4 public/orador-alfa.webm         # rembg (pesado; -E -P se o rembg está no site do usuário)
python -E -P <skill>/scripts/recortar_orador.py public/orador.mp4 public/orador-alfa.webm --chroma "#64DB08"   # fundo verde
```

O que o `cortar_video.py` garante:

| Ponto | Como |
|---|---|
| mesmo plano da voz | usa `cortar.planejar()` (ilhas de fala, `manter`, `remover`, pausas, respiros) |
| sem deriva entre corte e boca | cada borda é arredondada para a grade de quadros da fonte; o vídeo corta por número de quadro (`trim=start_frame:end_frame`) e o áudio no mesmo instante (`atrim`) |
| aceleração junta | `setpts=PTS/tempo` no vídeo e `atempo=tempo` no áudio, depois do `concat=v=1:a=1`; com `tempo: "auto"` o fator é medido só no corpo e o teaser usa o mesmo (ou o `tempo` numérico próprio dele) |
| saída estável | fps fixo (30), lado maior até 1920 px, H.264 CRF 18 com GOP de 1 s (busca rápida do OffthreadVideo), voz normalizada embutida |
| conferência | conta os quadros do vídeo e compara com a duração da voz; erro acima de 1 quadro |

Teste da rodada de desenvolvimento: gravação 16:9 a 59,94 fps, 30,2 s, 8 trechos, `tempo`
1,2 -> 16,33 s; diferença vídeo x voz +2,9 ms. Com o tempo do original queimado em cada quadro,
o quadro mostrado em 8 palavras ficou a 12-46 ms do instante original da palavra, sem crescer
ao longo dos cortes.

O recorte com alfa sai do **vídeo já cortado** (mesmo número de quadros). Gravação em fundo
verde: corte a versão verde com o mesmo `cortes.json` (`--video-saida work/orador-verde.mp4`) e
recorte por chroma. Screencast: extraia frames-chave como prints (`ffmpeg -ss t -i tela.mp4 -frames:v 1 print.png`)
ou use o trecho em `<OffthreadVideo>` dentro de uma janela de vidro, com zoom por região.
