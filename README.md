# video-motion

Skill do [Claude Code](https://claude.com/claude-code) que produz um vídeo curto com motion graphics do zero ao MP4, usando Remotion, ffmpeg e Whisper.

Entradas aceitas:

| Insumo | Exemplo |
|---|---|
| ideia ou texto | "vídeo de 60 s explicando como funciona o meu serviço" |
| áudio gravado | m4a, mp3, wav, ogg |
| vídeo com rosto (talking head) | gravação 9:16 ou 16:9 da pessoa falando (mp4, mov, webm): caminho principal |
| screencast | gravação de tela (mp4, mov, webm) |
| projeto ou produto | pasta de código, URL, app, README |

Saída: MP4 (H.264 + AAC, -14 LUFS) em 9:16, 16:9 ou 1:1, com legenda sincronizada palavra por palavra, animação sincronizada com a fala, trilha com ducking e efeitos sonoros em duas camadas (base nas viradas + impactos fortes nos momentos-chave).

## Estilo padrão

O template traz um kit de motion derivado de referências analisadas em out/2026, todo parametrizado por JSON:

| Componente | O que faz |
|---|---|
| TelaViva | tela de app inventada (lista, checklist, contador, toggles, timeline, fluxo, kanban, prompt) cujos estados mudam no tempo da fala |
| Carimbo | texto em caixa batendo na tela com flash colorido, tremor de câmera e efeito de impacto |
| Camadas3D | planos em perspectiva que explodem e se juntam, com rótulos numerados e chão de grade |
| Câmera virtual | afastar para revelar, aproximar e pan, com motion blur opcional só no movimento |
| CardHalo / GradeBento | cards com halo de luz, borda luminosa e conectores; grade bento com encaixe |
| Tipografia em papéis | frase pesada, número largo/estreito, palavra emocional em serifa itálica, rótulo mono; gradiente, brilho e contorno; entrada por letra, palavra ou máscara |
| HUD | barra de capítulos colorida, título fixo e quadro 4:5 seguro, fora das transições |
| Encaixe | um elemento encolhe e vira parte da próxima tela |
| Legenda em caixa | pequena, frase visível, só a palavra ativa destacada (a legenda grande virou variante) |
| Letreiro, LinhaSVG, Recorte, Rajada | letreiro em contra-direção, ECG/rachadura, texto atrás do apresentador (recorte opcional), cortes de ~0,7 s nos picos da fala |

## Talking head

Para vídeo com rosto, o template tem um modelo próprio (`novo_projeto.py --modelo orador`), também parametrizado por JSON e com os valores de spring e frames medidos em anúncios analisados em out/2026:

| Componente | O que faz |
|---|---|
| Cena `orador` | rosto em tela cheia a partir de fonte 9:16 ou 16:9 (reenquadramento, zoom, espaço acima da cabeça), punch-in nas palavras-chave, preto e branco no "jeito antigo", orador encolhendo para card |
| Texto atrás da pessoa | título de duas larguras, número que rola e palavra riscada entre o fundo e a pessoa (com o recorte com alfa) |
| Legenda fantasma | a frase inteira a 15% de opacidade; cada palavra acende quando é dita, destaque no acento |
| Sobreposições | RAW -> EDITADO (xadrez + moldura com alças), lista de 3 passos ao lado do card, checklist de objeções com chips, terminal de comando + HUD de gravação, cards flutuantes, pill de CTA, card final |
| Duelo e letterbox | dois resultados empilhados com placar; título fixo com vídeo 16:9 no meio |
| Painel em perspectiva | janela de editor/assistente que gira de 28° para 0, com preview do vídeo, chat de comandos e linha do tempo |

O vídeo é cortado junto com a voz (`cortar_video.py`: bordas na grade de quadros, `setpts` + `atempo` no mesmo grafo, sincronia conferida), então o frame N do vídeo cortado é o frame N da timeline. Som do formato: sem trilha, só voz e impactos graves nos títulos. Estruturas de roteiro com proporções de tempo e 18 tipos de gancho: `references/roteiros-e-ganchos.md`.

O fundo de grade continua sendo a assinatura, agora com halos de luz, vinheta, grão e chão em perspectiva opcionais. O estilo anterior (cards de vidro, legenda grande, cross-fade) segue disponível como variante clássica.

## Pesquisa do nicho

Antes de desenhar qualquer cena, a skill pesquisa na web como os melhores criadores e marcas do nicho específico estão fazendo vídeo no ano corrente: formato, gancho, ritmo de corte, estilo de legenda, tipografia, paleta, técnicas de motion, sound design e CTA. São no mínimo ~8 fontes com link e data, gravadas em `pesquisa.md` no projeto, com 2 a 3 direções criativas derivadas dos achados. A direção escolhida e o motivo aparecem no relatório de entrega.

## Catálogo de direções e rodízio

`references/prompt-motion/` reúne direções visuais destiladas dos 234 vídeos do [prompt-motion.com](https://prompt-motion.com) (galeria de motion feito com Claude Opus 5.5, com o prompt de cada um), escritas com as nossas palavras e com o link de cada referência. A cada vídeo, `scripts/rodizio.py sugerir` propõe 3 direções de famílias diferentes que casam com o formato e não foram usadas nos últimos vídeos; `registrar` guarda o histórico em `VIDEO_MOTION_PASTA` (ou `~/.video-motion/`), fora do repositório. `scripts/prompt_motion.py` lê o site na hora: lista por categoria, prompt integral de um item, folha de contato do vídeo e itens novos desde a última coleta.

## Requisitos

| Ferramenta | Uso | Checagem |
|---|---|---|
| Claude Code | executa a skill | `claude --version` |
| Node 18+ | Remotion 4 | `node --version` |
| ffmpeg + ffprobe 6+ | corte, mixagem, QA | `ffmpeg -version` |
| Python 3.10+ com numpy e Pillow | scripts | `python -c "import numpy, PIL"` |
| `OPENAI_API_KEY` (opcional) | Whisper API e TTS | sem a chave: `pip install faster-whisper` (transcrição local, gratuita) |

## Instalação

macOS / Linux:

```bash
git clone https://github.com/MiqueiasBrandaoDev/video-motion ~/.claude/skills/video-motion
```

Windows (PowerShell):

```powershell
git clone https://github.com/MiqueiasBrandaoDev/video-motion "$env:USERPROFILE\.claude\skills\video-motion"
```

O Claude Code carrega a skill na próxima sessão.

## Como acionar

Basta pedir em linguagem natural. Exemplos:

- "faz um vídeo com motion a partir desse áudio" (anexando o arquivo)
- "edita essa gravação com legenda pra Reels"
- "corta esse vídeo meu falando e coloca motion em volta do rosto"
- "cria um vídeo animado explicando o que esse projeto faz" (na pasta do projeto)
- "demo animada do meu app em 16:9 pro YouTube"
- "vídeo de 45 s pra TikTok só com tipografia cinética e música"

## Fluxo (12 fases)

| Fase | O que acontece |
|---|---|
| 0. Entrada | detecta o insumo e o objetivo (plataforma, formato, duração, marca, CTA); pergunta só o que não dá para inferir |
| 1. Conteúdo | transcreve com tempo por palavra e separa locução, instrução falada para o agente e descarte; ou lê o projeto; ou escreve o roteiro numa estrutura medida (resultado no 1º segundo) |
| 2. Pesquisa do nicho | pesquisa web obrigatória, `pesquisa.md` com fontes e direções criativas |
| 3. Direção visual | estilo padrão (UI viva, carimbo, 3D, luz, tipografia em papéis, HUD), acento com significado, paleta da marca ou da pesquisa; rodízio de direções do catálogo para não repetir linguagem |
| 4. Storyboard | blocos com tempo, qual palavra dispara qual animação |
| 5. Assets | prints reais via Playwright, com dados sensíveis borrados antes do uso |
| 6. Voz (e vídeo) | cortes a partir do original, aceleração com tom preservado, loudnorm, retranscrição para legendas e marcos; com rosto filmado, vídeo e voz cortados juntos com sincronia conferida |
| 7. Remotion | projeto gerado do template; cenas declaradas em JSON e ancoradas na fala |
| 8. Trilha e SFX | motion puro: trilha com licença registrada, ducking por sidechain, efeitos em duas camadas (base a cada 2-3 s + impactos fortes); talking head: sem trilha, impactos graves nos títulos; tudo validado por script |
| 9. Render | H.264 8-12 Mbps, AAC 48 kHz, versão leve opcional |
| 10. QA | leitura de frames, folha de contato com área segura, retranscrição do MP4, LUFS e true peak |
| 11. Entrega | MP4, decisões, licenças e encerramento por PID só dos processos que a execução abriu |

Ajustes posteriores (velocidade da fala, trechos, cenas, trilha, cores, formato) são feitos em arquivos JSON, sem reescrever código. A tabela completa está no `SKILL.md`.

## Estrutura

```
SKILL.md          instruções que o Claude Code segue
references/       guias por fase (áudio, pesquisa, roteiros e ganchos, direção visual, Remotion,
                  sound design, formatos, QA, licenças)
references/estilos/  fichas de estilo medidas em referências (dossiê, onda sonora)
references/prompt-motion/  catálogo de direções do prompt-motion.com (direções, índice, blog)
scripts/          Python: transcrever, trechos, cortar, cortar_video, legendas, tts, borrar,
                  analisa_musica, gerar_sfx, mixar, frames_check, comprimir, novo_projeto,
                  processos, cenas_check, prompt_motion, rodizio, recortar_orador (opcional)
template/         projeto Remotion base copiado para cada vídeo (componentes, cenas, dados de exemplo)
```

## Custos e licenças

| Item | Custo |
|---|---|
| Remotion | gratuito para indivíduos e empresas pequenas; licença paga acima disso: [remotion.dev/license](https://www.remotion.dev/license) |
| Whisper API (OpenAI) | ~US$ 0,006/min de áudio; opcional, há fallback local com faster-whisper |
| TTS (OpenAI) | cobrado por uso; opcional |
| Trilha e SFX | não vêm no repositório; a skill orienta a baixar de fontes com licença livre (Mixkit, Pixabay Music, YouTube Audio Library, Kenney, Freesound CC0) e registrar em `public/musica/LICENCA.md` e `public/sfx/LICENCA.md` |

O código desta skill está sob licença MIT (ver `LICENSE`).

## Atualizar

```bash
cd ~/.claude/skills/video-motion && git pull
```

No Windows: `cd "$env:USERPROFILE\.claude\skills\video-motion"; git pull`
