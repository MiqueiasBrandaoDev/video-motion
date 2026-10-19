import cenasJson from './data/cenas.json';
import {fr, naBatida, type Ref} from './tempo';

/*
 * Regra "nunca ler a mesma coisa duas vezes": quando um título, card ou componente já mostra
 * as palavras que estão sendo ditas, a legenda dessas palavras some naquele trecho.
 *
 * Aqui se levantam, do cenas.json, as janelas em que cada texto de tela fica visível
 * (do "em" do item até o "ate" dele ou o fim da cena) e as palavras significativas de cada uma.
 * Legendas.tsx esconde a página da legenda (2-4 palavras) que tiver palavra já escrita na tela
 * no mesmo frame.
 * scripts/cenas_check.py faz a mesma conta em Python para o relatório.
 * Desligue com config.json -> "legenda_repete": true.
 */

type No = unknown;
export type JanelaTexto = {ini: number; fim: number; palavras: Set<string>; texto: string};

const CHAVES_TEXTO = new Set(['texto', 'texto2', 'linha1', 'linha2', 'rotulo', 'titulo', 'sub', 'marca', 'slogan', 'principal', 'prefixo', 'sufixo', 'rodape']);
const PULAR = new Set(['legenda', 'pb', 'punch', 'camera', 'cameraInicial', 'enquadramento', 'card', 'raw', '_como_usar', 'id', 'tipo', 'inicio', 'video', 'recorte', 'icone']);
const VAZIAS = new Set(['para', 'como', 'mais', 'isso', 'esse', 'essa', 'este', 'esta', 'eles', 'elas', 'voce', 'quando', 'porque', 'entao', 'muito', 'tudo', 'pelo', 'pela', 'sobre', 'aqui', 'onde', 'qual', 'quem', 'dele', 'dela', 'deles', 'numa', 'num',
	'que', 'pra', 'pro', 'com', 'por', 'uma', 'uns', 'dos', 'das', 'nos', 'nas', 'ele', 'ela', 'seu', 'sua', 'meu', 'mas', 'nem', 'foi', 'era', 'vai', 'tem', 'the', 'and']);

/** Normaliza: minúsculas, sem acento, só letras/dígitos/%. */
export const normaliza = (t: string) =>
	t
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.replace(/[^\p{L}\p{N}%]/gu, '');

/** Palavra significativa (>= 3 letras ou com dígito, fora das vazias: "não são" conta), com plural simples tirado. */
export const significativa = (w: string): string | null => {
	const n = normaliza(w);
	if (!n) return null;
	if (!/\d/.test(n) && (n.length < 3 || VAZIAS.has(n))) return null;
	return n.length >= 5 && n.endsWith('s') && !/\d/.test(n) ? n.slice(0, -1) : n;
};

/** Palavras significativas de um texto (quebra em espaço, hífen e barra; tira a marcação *_[]{}~|). */
export const palavrasDe = (texto: string) => {
	const s = new Set<string>();
	for (const w of texto.replace(/[*_[\]{}~|]/g, ' ').split(/[\s\-/]+/)) {
		const x = significativa(w);
		if (x) s.add(x);
	}
	return s;
};

const ehRef = (v: unknown): v is Ref => typeof v === 'number' || typeof v === 'string';

const visita = (no: No, ini: number, fim: number, saida: JanelaTexto[]) => {
	if (Array.isArray(no)) {
		for (const x of no) visita(x, ini, fim, saida);
		return;
	}
	if (!no || typeof no !== 'object') return;
	const o = no as Record<string, unknown>;
	let a = ini;
	let b = fim;
	try {
		if (ehRef(o.em)) a = Math.max(ini, fr(o.em));
		if (ehRef(o.ate)) b = Math.min(fim, fr(o.ate));
	} catch {
		// referência inválida: o componente já acusa o erro; aqui só não conta
	}
	for (const [k, v] of Object.entries(o)) {
		if (PULAR.has(k)) continue;
		if (CHAVES_TEXTO.has(k) && typeof v === 'string' && v.trim()) {
			const palavras = palavrasDe(v);
			if (palavras.size && b > a) saida.push({ini: a, fim: b, palavras, texto: v});
		} else if (typeof v === 'object') {
			visita(v, a, b, saida);
		}
	}
};

const CENAS = (cenasJson as unknown as {cenas: Array<Record<string, unknown>>}).cenas;

/** Janelas (em frames) de todo texto de tela do cenas.json. */
export const JANELAS_TEXTO: JanelaTexto[] = (() => {
	const saida: JanelaTexto[] = [];
	const inicios = CENAS.map((c, i) => (i === 0 ? 0 : naBatida(fr(c.inicio as Ref))));
	CENAS.forEach((c, i) => {
		const fim = i < CENAS.length - 1 ? inicios[i + 1] : 1e9;
		visita(c, inicios[i], fim, saida);
	});
	return saida;
})();

/** Palavras significativas visíveis na tela no frame (fora a legenda). */
export const palavrasNaTela = (frame: number) => {
	const s = new Set<string>();
	for (const j of JANELAS_TEXTO) if (frame >= j.ini && frame < j.fim) for (const w of j.palavras) s.add(w);
	return s;
};

/** A palavra da legenda já está na tela? (todas as partes significativas dela na tela) */
export const repeteNaTela = (palavra: string, naTela: Set<string>) => {
	if (!naTela.size) return false;
	const partes = palavra.split(/[-/]+/).map(significativa).filter((x): x is string => Boolean(x));
	return partes.length > 0 && partes.every((x) => naTela.has(x));
};
