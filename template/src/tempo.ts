import batidasJson from './data/batidas.json';
import blocosJson from './data/blocos.json';
import config from './data/config.json';
import marcosJson from './data/marcos.json';
import {FPS} from './theme';

/*
 * Sincronia: tudo que anima é ancorado em tempo da FALA (ms na timeline final),
 * nunca em frame escrito à mão. frame = ms / 1000 * fps.
 *
 * Referência de tempo (Ref):
 *   1234              -> ms
 *   "nomeDoMarco"     -> marcos.json (gerado por scripts/legendas.py a partir das palavras)
 *   "bloco:cta"       -> blocos.json (gerado por scripts/cortar.py)
 *   "marco+200"       -> com deslocamento em ms (+ ou -)
 */
export type Ref = number | string;

const marcos = marcosJson as Record<string, number>;
const blocos = (blocosJson as {blocos: Record<string, number>}).blocos ?? {};

export const ms = (ref: Ref): number => {
	if (typeof ref === 'number') return ref;
	const m = /^(bloco:)?([\w.-]+?)([+-]\d+)?$/.exec(ref.trim());
	if (!m) throw new Error(`referência de tempo inválida: ${ref}`);
	const [, ehBloco, nome, desl] = m;
	const tabela = ehBloco ? blocos : marcos;
	const base = tabela[nome];
	if (base === undefined) throw new Error(`${ehBloco ? 'bloco' : 'marco'} ausente: ${nome} (em "${ref}")`);
	return base + (desl ? parseInt(desl, 10) : 0);
};

/** ms -> frame */
export const f = (v: number) => Math.round((v / 1000) * FPS);
/** Ref -> frame absoluto */
export const fr = (ref: Ref) => f(ms(ref));

/**
 * Duração total: voz editada (blocos.json) ou config.duracao_s (vídeo sem voz / teste),
 * mais config.extra_fim_s (card final depois da última palavra; o orador.mp4 acaba antes).
 */
export const DURACAO_S =
	((blocosJson as {duracao_s?: number}).duracao_s || config.duracao_s || 10) + ((config as {extra_fim_s?: number}).extra_fim_s ?? 0);
export const DURACAO_FRAMES = Math.ceil(DURACAO_S * FPS);

// Batidas da trilha (scripts/analisa_musica.py). Puxa a troca de cena para a batida
// imediatamente ANTERIOR (até 0,3 s), para nunca atrasar em relação à fala.
const BATIDAS = ((batidasJson as {batidas_s?: number[]}).batidas_s ?? []).map((s) => f(s * 1000));
const JANELA_BATIDA = Math.round(0.3 * FPS);
export const naBatida = (frame: number) => {
	if (!config.puxar_para_batida || !BATIDAS.length) return frame;
	const antes = BATIDAS.filter((b) => b <= frame && frame - b <= JANELA_BATIDA);
	return antes.length ? antes[antes.length - 1] : frame;
};
