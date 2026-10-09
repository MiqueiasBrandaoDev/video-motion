# Trilha e efeitos sonoros (fase 8)

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

- `--musica-lufs -27` (padrão): com o ducking, a música fica ~20 dB abaixo da voz durante
  a fala e respira nas pausas. Voz baixa demais na mixagem? `-29`. Música sumindo? `-25`.
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

| Momento | Som típico |
|---|---|
| troca de bloco (wipe) | whoosh de ar curto |
| entrada de print/janela | swoosh suave |
| contorno/destaque em região | glass/ping discreto |
| clique do cursor | click |
| punch-in de número | impacto macio (maximize/punch) |
| fim de contador | blip único (não um tick por número) |
| grupo de badges/pills | UM pop para o grupo |
| CTA | chime/confirmação |

## Regras de densidade (lição real)

O primeiro corte de um vídeo real tinha efeito em quase tudo e o resultado cansou. As regras:

- ~1 efeito a cada 2-3 s em média; 25-35 num vídeo de 80-90 s.
- Só nas viradas: troca de bloco, entrada de print, destaque, clique, punch-in de número, CTA.
- Nada em legenda, saída de elemento, cada badge, cada linha de terminal.
- Mínimo 400 ms entre dois efeitos; no máximo 3 em qualquer janela de 5 s.
- Nunca o mesmo arquivo duas vezes seguidas.
- Respiros: frases de peso (dor, revelação, "zero comandos") só com voz + música.
- Pico de cada efeito 18-24 dB abaixo do pico da voz (`rel_db` -18 a -24).
- Variação leve: pitch -2..+2 semitons, ganho +-1-3 dB entre ocorrências.

## Plano (`src/data/sfx.json`)

```json
{
  "pasta": "public/sfx",
  "respiros": [["dor", "dor+4000"], ["naoDigitei-200", "comando+600"]],
  "eventos": [
    {"em": "bloco:dor-150", "arquivo": "whoosh-a.ogg", "rel_db": -20, "semitons": 0, "evento": "troca de bloco: gancho -> dor"},
    {"em": "custo+60", "arquivo": "glass-a.ogg", "rel_db": -23, "semitons": 0, "evento": "contorno no card de custo"}
  ]
}
```

`em` é o instante do **pico** do efeito, igual ao instante da animação que ele acompanha
(para whoosh de wipe: ~150 ms antes do início do bloco). O `gerar_sfx.py` mede o pico
interno de cada arquivo e o `mixar.py` posiciona para o pico cair no tempo certo.

```bash
python -I <skill>/scripts/gerar_sfx.py          # ERRO bloqueia, AVISO orienta
```

Depois do render, ouça os trechos com mais efeitos e confira no QA se nenhum some sob
a voz nem salta acima dela.
