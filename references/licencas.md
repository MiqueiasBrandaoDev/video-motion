# Licenças, custos e segurança

## Remotion

O Remotion tem licença própria (não é MIT). Uso gratuito para indivíduos, organizações
sem fins lucrativos e empresas pequenas (o limite atual é por número de funcionários);
acima disso é preciso comprar a Company License. Confira os termos vigentes em
https://www.remotion.dev/license antes de usar comercialmente e avise o usuário quando
ele estiver usando em nome de uma empresa.

## Custos possíveis

| Item | Custo | Alternativa gratuita |
|---|---|---|
| Whisper API (whisper-1) | ~US$ 0,006 por minuto de áudio | faster-whisper ou whisper.cpp local |
| TTS (gpt-4o-mini-tts e similares) | por uso (texto de entrada + áudio gerado) | gravar a própria voz; vídeo sem voz |
| Música/SFX | US$ 0 nas fontes listadas em sound-design.md | - |
| Remotion | gratuito ou Company License (ver acima) | - |

Confira os preços atuais em https://openai.com/api/pricing. Antes de gastar (chamar API
paga com áudio longo, TTS de roteiro grande), informe a estimativa ao usuário.

## Chaves e credenciais

- A chave da OpenAI vem só da variável de ambiente `OPENAI_API_KEY`. Nunca grave a chave
  em arquivo do projeto, em JSON de saída, em log ou no relatório.
- Sem chave: ofereça o motor local (`--motor local`) antes de pedir uma.

## Música, SFX e voz

- Toda faixa e todo efeito usado tem uma linha em `LICENCA.md` com fonte, URL, licença,
  data e se exige atribuição. Atribuição exigida vai para a descrição do post (avise).
- CC BY exige crédito; CC BY-NC proíbe uso comercial; "royalty free" não é sinônimo de
  livre: leia os termos.
- Voz sintética: avise que é IA; várias plataformas pedem o rótulo de conteúdo gerado
  por IA. Nunca clone a voz de outra pessoa sem autorização dela.
- Não use logo, marca ou imagem de terceiros como se fosse do usuário. Prints de
  produto de terceiros só quando o vídeo é sobre aquele produto (demonstração, review).

## Segurança com arquivos baixados

- Downloads (música, SFX, imagens) ficam em pasta própria e são tratados como não
  confiáveis: só ffprobe/ffmpeg/Pillow os leem; nada é executado.
- Scripts Python rodam com `python -I`: não importam módulos da pasta atual nem da pasta
  do script, e ignoram variáveis `PYTHON*` (um `json.py` plantado num download não roda).
- Se numpy/Pillow foram instalados com `pip install --user`, o `-I` não os enxerga.
  Use `python -E -P`, que mantém as duas proteções (sem pasta atual/do script no path,
  sem variáveis `PYTHON*`) e ainda lê o site do usuário. Ou instale num venv.

## Privacidade

- Prints com dado pessoal ou de cliente: borrar no arquivo (`borrar.py`), guardar o
  original como `-raw` fora do git e nunca referenciar o `-raw`.
- Transcrição na API envia o áudio para a OpenAI. Se a gravação tiver dado sensível ou o
  usuário não quiser enviar, use o motor local.

## Processos

Tudo o que a skill abre ela fecha, por PID, só o que é dela (`processos.py`). Nunca
encerrar por nome: isso derruba o navegador e apps do usuário.
