# Trilha e efeitos sonoros (fase 8)

## Duas configurações

Medido em anúncios analisados em out/2026 (loudness -14 LUFS em todos):

| | Talking head (rosto falando) | Motion puro / demonstração / comparação |
|---|---|---|
| trilha | **nenhuma por padrão**: as pausas caem a silêncio (diferença fala-pausa de 13-34 dB) | contínua, baixa, com ducking (seção Mix) |
| efeitos | impactos graves curtos (sub 20-60 Hz) quando um título entra atrás da cabeça, no número-chave e no CTA: ~1-2,5 a cada 10 s; um ou outro efeito comum discreto (troca para editado, check, pill) | base de ~1 a cada 2-3 s nas viradas + impactos (seção "Duas camadas") |
| whoosh | quase nunca (só em troca de cenário/persona) | troca de bloco |
| `sfx.json` | `"perfil": "orador"` | `"perfil": "motion"` (padrão) |
| `gerar_sfx.py` espera | intervalo médio 2,5-8 s, impactos a 2,5 s ou mais | intervalo médio 2-5 s, impactos a 4 s ou mais, no máx. 1/3 impactos |
| mix | `mixar.py` sem `--musica` | `mixar.py --musica ... --musica-lufs -23` |

Talking head que é demonstração longa, duelo ou troca de persona pode ganhar trilha baixa
(foi o padrão nesses casos). Sem trilha, cada som aparece: menos efeitos, mais graves.

Exemplo de plano do perfil orador: `template/src/data/sfx-orador.example.json` (6 efeitos em
16 s: 3 impactos nos títulos/número, 3 comuns discretos).

## Trilha

**Escolha.** Sem vocal (vocal briga com a voz e com a legenda). BPM que combine com o
ritmo de corte: 95-120 para explicação/produto, 120-130 para energia alta, 70-90 para
tom calmo. Energia constante e moderada: faixa muito densa (RMS alto e constante) compete
com a voz. Confira com:

```bash
python -I <skill>/scripts/analisa_musica.py downloads/musica/candidata.mp3
python -I <skill>/scripts/transcrever.py downloads/musica/candidata.mp3 work/vocal_check.json --motor local
```

Se a transcrição da faixa devolver palavras de verdade, há vocal: descarte.

**Fontes com licença livre para uso comercial em redes** (sempre ler os termos atuais e
copiar o trecho relevante, com data, para `public/musica/LICENCA.md`):

| Fonte | Observação |
|---|---|
| Mixkit (Stock Music Free License) | redes sociais, anúncios online, YouTube; não permite Content ID nem TV/rádio; sem atribuição |
| Pixabay Music (Pixabay Content License) | uso comercial; algumas faixas registradas em Content ID geram aviso no YouTube (o autor libera) |
| YouTube Audio Library | só para vídeos no YouTube; algumas faixas exigem atribuição na descrição |
| Free Music Archive / Incompetech | conferir a licença de CADA faixa (CC BY exige crédito; NC proíbe uso comercial) |

Música "em alta" do app (Reels/TikTok) não entra no arquivo: o usuário adiciona na
plataforma, se quiser.

**Download seguro.** Cada download em pasta própria (`downloads/musica/`, `downloads/sfx/`),
tratado como não confiável: só ffprobe/ffmpeg leem; nunca execute nada que venha junto.
Copie para `public/` só o que for escolhido, com nome limpo. Se a fonte bloquear acesso
sem navegador (HTTP 403), use outra fonte ou peça o arquivo ao usuário.

## Mix

```bash
python -I <skill>/scripts/mixar.py --musica public/musica/faixa.mp3 --offset 0.8 \
  --subida-em bloco:cta --subida-db 3
```

- Estilo padrão: **trilha contínua, presente nas pausas**, ~10-12 dB abaixo da voz durante
  a fala com ducking. Ponto de partida: `--musica-lufs -23`; ouça os trechos de fala e as
  pausas no QA e ajuste de 1 em 1 dB (voz brigando com a música? `-24`/`-25`).
- `--musica-lufs -27` (padrão do script): trilha discreta, ~20 dB abaixo da voz durante a
  fala (variante clássica, ou nicho sóbrio). Música sumindo? `-25`.
- Ducking: `sidechaincompress=threshold=0.05:ratio=3:attack=15:release=350` com a voz como chave.
- Fade-in 1 s, fade-out 1,5 s; subida de +3 dB a partir do CTA (0,3 s antes).
- `--offset`: escolha o segundo da faixa em que o vídeo começa para que uma batida forte
  caia no início e as trocas de bloco caiam perto de batidas. Gere `batidas.json` com o
  mesmo offset e ligue `puxar_para_batida` no `config.json`.
- Saída: `public/mix.wav`, loudnorm 2 passadas, -14 LUFS / TP -1. Em `config.json`,
  `"audio": "mix.wav"`.

## SFX

**Fontes.** Kenney (Interface Sounds, UI Audio: CC0, sem atribuição), Mixkit Sound Effects
(Free License), Freesound filtrando por CC0 (conferir a licença de cada arquivo).

**Kit coerente.** Uma família de timbre: por exemplo, interface macia (drop, glass,
select, toggle) + um whoosh de ar curto para troca de bloco. Nada de cartoon, 8-bit ou
"cash register" num vídeo sério. Meça o kit:

```bash
python -I <skill>/scripts/analisa_musica.py --sfx "public/sfx/*.ogg"
```

Centróides parecidos e ataques curtos = família coerente. Tenha 2 variações para os sons
que se repetem (whoosh-a/whoosh-b, pop-a/pop-b) para alternar.

| Momento | Som típico | Camada |
|---|---|---|
| troca de bloco (wipe, corte seco de cena) | whoosh de ar curto | comum |
| entrada de print/janela/TelaViva | swoosh suave | comum |
| contorno/destaque em região, toggle, status que muda | glass/ping discreto | comum |
| clique do cursor | click | comum |
| fim de contador | blip único (não um tick por número) | comum |
| grupo de badges/pills, rajada inteira | UM pop para o grupo | comum |
| **carimbo** (com flash e tremor) | impacto seco com corpo grave (stamp, punch, hit) | **impacto** |
| **câmera se afasta e revela** (bento, grid, sistema inteiro) | impacto grave + ar (boom curto, riser que corta) | **impacto** |
| **número-chave** (o número que é a tese do vídeo) | impacto macio com grave | **impacto** |
| **CTA** (carimbo final, chamada) | impacto ou chime encorpado | **impacto** |

## Duas camadas e densidade no motion puro (lição real)

O primeiro corte de um vídeo real tinha efeito em quase tudo e o resultado cansou. As
referências analisadas em out/2026 mostraram o outro lado: poucos momentos-chave com som
forte dão peso que nenhuma quantidade de whoosh dá. O padrão junta os dois:

**Camada 1, base (comum).** Continua igual:
- ~1 efeito a cada 2-3 s em média (contando as duas camadas); 25-35 num vídeo de 80-90 s.
- Só nas viradas: troca de bloco, entrada de janela/print, destaque, clique, CTA.
- Pico 18-24 dB abaixo do pico da voz (`rel_db` -18 a -24).

**Camada 2, impactos fortes (`"categoria": "impacto"`).**
- Só nos momentos-chave: carimbo com flash, revelação/afastamento de câmera, número-chave, CTA.
- Mais altos: pico 12-16 dB abaixo da voz (`rel_db` -12 a -16).
- Poucos: ~4 s ou mais entre dois impactos (`--min-gap-impacto`, padrão 4) e no máximo
  ~1/3 dos efeitos do vídeo. Impacto repetido vira ruído e perde a força.
- O impacto cai no MESMO `em` do carimbo/da câmera; o `gerar_sfx.py` avisa quando um
  carimbo ou afastamento de câmera do `cenas.json` fica sem impacto (até 250 ms).

**Valem para as duas camadas:**
- Nada em legenda, saída de elemento, cada badge, cada linha de terminal, cada plano de rajada.
- Mínimo 400 ms entre dois efeitos (`--min-gap`, padrão 0,4); no máximo 3 em qualquer janela de 5 s.
- Nunca o mesmo arquivo duas vezes seguidas.
- Respiros: frases de peso (dor, revelação, "zero comandos") só com voz + música.
- Variação leve: pitch -2..+2 semitons, ganho +-1-3 dB entre ocorrências.

## Plano (`src/data/sfx.json`)

```json
{
  "pasta": "public/sfx",
  "respiros": [["dor", "dor+4000"], ["naoDigitei-200", "comando+600"]],
  "eventos": [
    {"em": "bloco:dor-150", "arquivo": "whoosh-a.ogg", "rel_db": -20, "semitons": 0, "evento": "troca de bloco: gancho -> dor"},
    {"em": "ninguem", "arquivo": "impacto-a.ogg", "categoria": "impacto", "rel_db": -14, "semitons": 0, "evento": "carimbo + flash"},
    {"em": "custo+60", "arquivo": "glass-a.ogg", "rel_db": -23, "semitons": 0, "evento": "contorno no card de custo"},
    {"em": "sistema", "arquivo": "impacto-b.ogg", "categoria": "impacto", "rel_db": -13, "semitons": -1, "evento": "câmera se afasta e revela"}
  ]
}
```

Sem `categoria`, o evento é `comum`. O kit precisa de 2 sons de impacto da mesma família
(impacto-a/impacto-b) para alternar.

`em` é o instante do **pico** do efeito, igual ao instante da animação que ele acompanha
(para whoosh de wipe: ~150 ms antes do início do bloco). O `gerar_sfx.py` mede o pico
interno de cada arquivo e o `mixar.py` posiciona para o pico cair no tempo certo.

```bash
python -I <skill>/scripts/gerar_sfx.py                       # ERRO bloqueia, AVISO orienta
python -I <skill>/scripts/gerar_sfx.py --min-gap-impacto 3   # vídeo curto com 2 viradas fortes
```

Depois do render, ouça os trechos com mais efeitos e confira no QA se nenhum some sob
a voz nem salta acima dela.
