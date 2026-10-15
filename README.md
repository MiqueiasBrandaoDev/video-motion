# video-motion

Skill do [Claude Code](https://claude.com/claude-code) que produz um vídeo curto com motion graphics do zero ao MP4, usando Remotion, ffmpeg e Whisper.

Entradas aceitas:

| Insumo | Exemplo |
|---|---|
| ideia ou texto | "vídeo de 60 s explicando como funciona o meu serviço" |
| áudio gravado | m4a, mp3, wav, ogg |
| vídeo | talking head, screencast (mp4, mov, webm) |
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

O fundo de grade continua sendo a assinatura, agora com halos de luz, vinheta, grão e chão em perspectiva opcionais. O estilo anterior (cards de vidro, legenda grande, cross-fade) segue disponível como variante clássica.

## Pesquisa do nicho

Antes de desenhar qualquer cena, a skill pesquisa na web como os melhores criadores e marcas do nicho específico estão fazendo vídeo no ano corrente: formato, gancho, ritmo de corte, estilo de legenda, tipografia, paleta, técnicas de motion, sound design e CTA. São no mínimo ~8 fontes com link e data, gravadas em `pesquisa.md` no projeto, com 2 a 3 direções criativas derivadas dos achados. A direção escolhida e o motivo aparecem no relatório de entrega.

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
- "cria um vídeo animado explicando o que esse projeto faz" (na pasta do projeto)
- "demo animada do meu app em 16:9 pro YouTube"
- "vídeo de 45 s pra TikTok só com tipografia cinética e música"

## Fluxo (12 fases)

| Fase | O que acontece |
|---|---|
| 0. Entrada | detecta o insumo e o objetivo (plataforma, formato, duração, marca, CTA); pergunta só o que não dá para inferir |
| 1. Conteúdo | transcreve com tempo por palavra e separa locução, instrução falada para o agente e descarte; ou lê o projeto; ou escreve o roteiro |
| 2. Pesquisa do nicho | pesquisa web obrigatória, `pesquisa.md` com fontes e direções criativas |
| 3. Direção visual | estilo padrão (UI viva, carimbo, 3D, luz, tipografia em papéis, HUD), acento com significado, paleta da marca ou da pesquisa |
| 4. Storyboard | blocos com tempo, qual palavra dispara qual animação |
| 5. Assets | prints reais via Playwright, com dados sensíveis borrados antes do uso |
| 6. Voz | cortes a partir do original, aceleração com tom preservado, loudnorm, retranscrição para legendas e marcos |
| 7. Remotion | projeto gerado do template; cenas declaradas em JSON e ancoradas na fala |
| 8. Trilha e SFX | trilha com licença registrada, ducking por sidechain, efeitos em duas camadas (base a cada 2-3 s + impactos fortes) validados por script |
| 9. Render | H.264 8-12 Mbps, AAC 48 kHz, versão leve opcional |
| 10. QA | leitura de frames, folha de contato com área segura, retranscrição do MP4, LUFS e true peak |
| 11. Entrega | MP4, decisões, licenças e encerramento por PID só dos processos que a execução abriu |

Ajustes posteriores (velocidade da fala, trechos, cenas, trilha, cores, formato) são feitos em arquivos JSON, sem reescrever código. A tabela completa está no `SKILL.md`.

## Estrutura

```
SKILL.md          instruções que o Claude Code segue
references/       guias por fase (áudio, pesquisa, direção visual, Remotion, sound design, formatos, QA, licenças)
scripts/          Python: transcrever, trechos, cortar, legendas, tts, borrar, analisa_musica,
                  gerar_sfx, mixar, frames_check, comprimir, novo_projeto, processos,
                  cenas_check, recortar_orador (opcional)
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
