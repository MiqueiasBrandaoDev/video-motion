import {loadFont as carregaDisplay} from '@remotion/google-fonts/Manrope';
import {loadFont as carregaCorpo} from '@remotion/google-fonts/Inter';
import {loadFont as carregaMono} from '@remotion/google-fonts/JetBrainsMono';
import {loadFont as carregaFrase} from '@remotion/google-fonts/PlusJakartaSans';
import {loadFont as carregaNumero} from '@remotion/google-fonts/Unbounded';
import {loadFont as carregaEstreita} from '@remotion/google-fonts/BigShoulders';
import {loadFont as carregaEmocional} from '@remotion/google-fonts/InstrumentSerif';
import type {CSSProperties} from 'react';
import {Easing, interpolate, spring} from 'remotion';
import config from './data/config.json';

/*
 * Tokens visuais do vídeo. Regras (ver references/direcao-visual.md, seção "Estilo padrão"):
 * - Fundo quase preto (ou quase branco) com halo; a cor vem dos elementos e da luz emitida.
 * - Acento com significado: config.acento (solução/marca) e config.problema (dor/erro), ou um
 *   acento só com gradiente (config.acento2), brilho e profundidade.
 * - Tipografia em 4 papéis (fonte.frase, fonte.numero/estreita, fonte.emocional, fonte.rotulo).
 *   As famílias "display/corpo" ficam para as cenas clássicas (variante anterior).
 */

// ---------- config tipada (campos novos são opcionais: projetos antigos continuam compilando) ----------
export type RefCfg = number | string;
type Capitulo = {inicio: RefCfg; cor?: string};
export type ConfigVideo = {
	titulo?: string;
	formato?: string;
	fps?: number;
	variante?: string;
	acento?: string;
	acento2?: string;
	problema?: string;
	duracao_s?: number;
	audio?: string;
	puxar_para_batida?: boolean;
	legendas?: boolean;
	legenda_estilo?: 'caixa' | 'grande';
	fundo?: {chao?: boolean; grao?: boolean; halos?: boolean; vinheta?: boolean};
	hud?: {capitulos?: Capitulo[]; titulo?: string; quadro45?: boolean};
};
export const CFG = config as unknown as ConfigVideo;

// ---------- cor ----------
const hexParaRgb = (hex: string): [number, number, number] => {
	const h = hex.replace('#', '');
	const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
/** Cor hex com alfa, em rgba(). */
export const alfa = (hex: string, a: number) => {
	const [r, g, b] = hexParaRgb(hex);
	return `rgba(${r},${g},${b},${a})`;
};
/** Mistura a cor com preto (f<0) ou branco (f>0). */
export const tonalidade = (hex: string, f: number) => {
	const alvo = f < 0 ? 0 : 255;
	const k = Math.abs(f);
	const [r, g, b] = hexParaRgb(hex).map((c) => Math.round(c + (alvo - c) * k));
	return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
};

export type Variante = 'escura' | 'clara';
export const VARIANTE: Variante = CFG.variante === 'clara' ? 'clara' : 'escura';
const ACENTO = CFG.acento || '#F2A33A';
const ESCURA = VARIANTE === 'escura';

const PALETAS = {
	escura: {
		fundo: '#08080A', // quase preto, nunca #000
		texto: '#F5F4F2',
		suave: '#B4B2AE',
		apagado: '#87858A',
		linha: 'rgba(255,255,255,.09)',
		grade: 'rgba(255,255,255,.05)',
		vidro: 'rgba(255,255,255,.045)',
		vidroOpaco: 'rgba(16,16,18,.92)',
		superficie: '#0C0C10', // fundo de janela/card do estilo padrão
		superficie2: '#14141A', // linha/bloco dentro da janela
		brilhoInterno: 'rgba(255,255,255,.10)',
		sombra: '0 24px 60px rgba(0,0,0,.5)',
		codigoFundo: '#0E0E10',
		codigoTexto: '#F5F4F2',
		legendaSombra: '0 4px 24px rgba(0,0,0,.95), 0 2px 6px rgba(0,0,0,.9)',
		acento: ACENTO,
		acentoTexto: ACENTO,
	},
	clara: {
		fundo: '#F4F3EF',
		texto: '#141416',
		suave: '#57554F',
		apagado: '#8D8B85',
		linha: 'rgba(20,20,20,.10)',
		grade: 'rgba(20,20,20,.07)',
		vidro: 'rgba(255,255,255,.72)',
		vidroOpaco: 'rgba(255,255,255,.96)',
		superficie: '#FFFFFF',
		superficie2: '#F1F0EC',
		brilhoInterno: 'rgba(255,255,255,.9)',
		sombra: '0 20px 50px rgba(20,20,20,.12)',
		codigoFundo: '#16161A', // terminal continua escuro na variante clara
		codigoTexto: '#F5F4F2',
		legendaSombra: '0 3px 18px rgba(246,245,242,.95), 0 1px 4px rgba(246,245,242,.9)',
		acento: ACENTO,
		// acento escurecido para ter contraste como texto sobre fundo claro
		acentoTexto: tonalidade(ACENTO, -0.28),
	},
} as const;

const base = PALETAS[VARIANTE];
const ACENTO2 = CFG.acento2 || tonalidade(ACENTO, 0.45);
const PROBLEMA = CFG.problema || '#E5604A';
export const cor = {
	...base,
	acentoClaro: tonalidade(ACENTO, 0.18),
	acentoFundo: tonalidade(ACENTO, -0.35),
	linhaAcento: alfa(ACENTO, 0.45),
	halo: alfa(ACENTO, ESCURA ? 0.12 : 0.1),
	glow: (forca = 1) => `0 6px ${30 * forca}px ${alfa(ACENTO, 0.35 * forca)}`,
	/** Fim do gradiente do acento (config.acento2 ou o acento clareado). */
	acento2: ACENTO2,
	/** Cor de problema/erro (config.problema). Só para a dor; a solução usa o acento. */
	problema: PROBLEMA,
	problemaTexto: ESCURA ? PROBLEMA : tonalidade(PROBLEMA, -0.22),
	/** Gradiente de texto padrão: do texto para o acento (claro no escuro, escuro no claro). */
	gradTexto: ESCURA
		? `linear-gradient(180deg, #FFFFFF 10%, ${tonalidade(ACENTO, 0.55)} 100%)`
		: `linear-gradient(180deg, #141416 10%, ${tonalidade(ACENTO, -0.3)} 100%)`,
	/** Gradiente do acento (pills, barras, trechos marcados). */
	gradAcento: ESCURA
		? `linear-gradient(90deg, ${ACENTO}, ${ACENTO2})`
		: `linear-gradient(90deg, ${tonalidade(ACENTO, -0.25)}, ${tonalidade(ACENTO2, -0.3)})`,
};

/** Cor semântica por nome: 'acento' | 'solucao' | 'problema' | 'neutro' | hex. */
export const corDe = (nome?: string): string => {
	if (!nome || nome === 'acento' || nome === 'solucao' || nome === 'ok') return ACENTO;
	if (nome === 'problema' || nome === 'erro') return PROBLEMA;
	if (nome === 'neutro') return ESCURA ? '#8A8A93' : '#6E6C66';
	if (nome === 'acento2') return ACENTO2;
	return nome;
};
/** Mesma cor, mas legível como texto na variante atual. */
export const corTextoDe = (nome?: string) => {
	const c = corDe(nome);
	return ESCURA ? tonalidade(c, 0.12) : tonalidade(c, -0.3);
};
/** Glow de uma cor (box-shadow). */
export const brilho = (c: string, forca = 1) =>
	`0 0 ${14 * forca}px ${alfa(c, (ESCURA ? 0.55 : 0.35) * Math.min(1, forca))}, 0 0 ${48 * forca}px ${alfa(c, (ESCURA ? 0.22 : 0.14) * Math.min(1, forca))}`;

// ---------- tipografia ----------
const sub = {subsets: ['latin', 'latin-ext'] as Array<'latin' | 'latin-ext'>};
const display = carregaDisplay('normal', {weights: ['500', '600'], ...sub});
const corpo = carregaCorpo('normal', {weights: ['400', '500', '600'], ...sub});
const mono = carregaMono('normal', {weights: ['400', '500', '600', '700'], ...sub});
const frase = carregaFrase('normal', {weights: ['500', '700', '800'], ...sub});
const numero = carregaNumero('normal', {weights: ['700', '800'], ...sub});
const estreita = carregaEstreita('normal', {weights: ['700', '800'], ...sub});
const emocional = carregaEmocional('italic', {weights: ['400'], ...sub});

export const fonte = {
	// clássico (cenas titulo/numeros/print/terminal/pills/cta)
	display: `${display.fontFamily}, system-ui, sans-serif`,
	corpo: `${corpo.fontFamily}, system-ui, sans-serif`,
	mono: `${mono.fontFamily}, ui-monospace, Consolas, monospace`,
	// estilo padrão: 4 papéis
	frase: `${frase.fontFamily}, system-ui, sans-serif`,
	numero: `${numero.fontFamily}, system-ui, sans-serif`,
	estreita: `${estreita.fontFamily}, Impact, sans-serif`,
	emocional: `${emocional.fontFamily}, Georgia, serif`,
	rotulo: `${mono.fontFamily}, ui-monospace, Consolas, monospace`,
};

export type Papel = 'frase' | 'numero' | 'estreita' | 'emocional' | 'rotulo';
/** Estilo base de cada papel tipográfico. */
export const papel: Record<Papel, CSSProperties> = {
	frase: {fontFamily: fonte.frase, fontWeight: 800, letterSpacing: '-.035em', lineHeight: 1.02},
	numero: {fontFamily: fonte.numero, fontWeight: 800, letterSpacing: '-.045em', lineHeight: 0.98, fontVariantNumeric: 'tabular-nums'},
	estreita: {fontFamily: fonte.estreita, fontWeight: 800, letterSpacing: '-.005em', lineHeight: 0.9, textTransform: 'uppercase'},
	emocional: {fontFamily: fonte.emocional, fontStyle: 'italic', fontWeight: 400, letterSpacing: '-.01em', lineHeight: 1},
	rotulo: {fontFamily: fonte.rotulo, fontWeight: 600, letterSpacing: '.28em', textTransform: 'uppercase', lineHeight: 1.2},
};

// ---------- formato e área segura ----------
type Formato = '9:16' | '16:9' | '1:1';
export const FORMATO: Formato = (['9:16', '16:9', '1:1'] as const).includes(CFG.formato as Formato)
	? (CFG.formato as Formato)
	: '9:16';

const FORMATOS = {
	// seguro: margens que a interface da plataforma cobre (ver references/formatos-plataformas.md)
	'9:16': {W: 1080, H: 1920, seguroTopo: 200, seguroBase: 250, seguroLado: 64, escala: 1},
	'16:9': {W: 1920, H: 1080, seguroTopo: 80, seguroBase: 90, seguroLado: 120, escala: 0.82},
	'1:1': {W: 1080, H: 1080, seguroTopo: 70, seguroBase: 90, seguroLado: 70, escala: 0.8},
} as const;

export const {W, H, seguroTopo: SEGURO_TOPO, seguroBase: SEGURO_BASE, seguroLado: SEGURO_LADO, escala: ESCALA} =
	FORMATOS[FORMATO];
export const FPS = CFG.fps || 30;

/** Tamanho tipográfico escalado pelo formato (valores pensados para 9:16). */
export const px = (v: number) => Math.round(v * ESCALA);

/** Legenda em caixa (padrão) ou grande (variante clássica). */
export const LEGENDA_ESTILO: 'caixa' | 'grande' = CFG.legenda_estilo === 'grande' ? 'grande' : 'caixa';
/** Quadro 4:5 seguro dentro do 9:16 (sobrevive ao corte do feed). */
export const QUADRO45 = FORMATO === '9:16' && Boolean(CFG.hud?.quadro45);
const Q45_TOPO = Math.round((H - (W * 5) / 4) / 2); // 285 no 9:16
const Q45_BASE = H - Q45_TOPO; // 1635

/** Altura reservada para a legenda (acima da área segura de baixo). */
export const ZONA_LEGENDA = CFG.legendas ? (LEGENDA_ESTILO === 'caixa' ? px(190) : px(300)) : 0;
/** Base (y) da faixa da legenda. */
export const BASE_LEGENDA = QUADRO45 ? Math.min(H - SEGURO_BASE, Q45_BASE) : H - SEGURO_BASE;
/** Coordenada Y máxima para conteúdo de cena: nada passa daqui (legenda + interface da plataforma). */
export const LIMITE_CONTEUDO = BASE_LEGENDA - ZONA_LEGENDA;

/** Altura do HUD fixo (barra de capítulos + título fixo) no topo. */
const ALTURA_BARRA = CFG.hud?.capitulos?.length ? px(44) : 0;
const ALTURA_TITULO = CFG.hud?.titulo ? px(168) : 0;
export const TOPO_AREA = QUADRO45 ? Math.max(SEGURO_TOPO, Q45_TOPO) : SEGURO_TOPO;
export const HUD = {barraY: TOPO_AREA + px(6), tituloY: TOPO_AREA + ALTURA_BARRA + px(12), altura: ALTURA_BARRA + ALTURA_TITULO};
/** Área útil das cenas do estilo padrão: abaixo do HUD e acima da legenda. */
export const AREA = {
	topo: TOPO_AREA + HUD.altura + px(28),
	base: LIMITE_CONTEUDO - px(16),
	lado: SEGURO_LADO,
	get altura() {
		return this.base - this.topo;
	},
	largura: W - 2 * SEGURO_LADO,
};

// ---------- movimento ----------
export const suaviza = Easing.bezier(0.16, 1, 0.3, 1);
export const suaviza2 = Easing.bezier(0.23, 1, 0.32, 1);
/** Easing do encaixe (elemento vira parte da próxima tela). */
export const easingEncaixe = Easing.bezier(0.2, 0, 0, 1);

/** Progresso 0..1 com easing a partir de `ini`, durando `dur` frames. Nunca linear seco. */
export const prog = (frame: number, ini: number, dur = 18, ease = suaviza) =>
	interpolate(frame, [ini, ini + dur], [0, 1], {easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** Spring padrão (pop leve, sem quicar demais). */
export const mola = (frame: number, ini: number, cfg?: {damping?: number; stiffness?: number; mass?: number}) =>
	spring({frame: frame - ini, fps: FPS, config: {damping: 14, stiffness: 160, mass: 0.8, ...cfg}});

/** Molas do estilo padrão (valores medidos nas referências; ver references/remotion-padroes.md). */
export const MOLAS = {
	/** entrada de UI: sem overshoot, 5-6 frames */
	ui: {config: {damping: 200}, durationInFrames: 6},
	/** pop de badge/chip: overshoot leve */
	pop: {config: {damping: 14, stiffness: 220, mass: 0.6}},
	/** carimbo: batida rígida */
	carimbo: {config: {stiffness: 400, damping: 18, mass: 0.6}},
	/** câmera virtual: 12-18 frames, sem overshoot */
	camera: {config: {damping: 200, mass: 1.2}, durationInFrames: 16},
	/** camadas 3D explodindo/juntando: ~6-8 frames */
	camadas: {config: {damping: 200}, durationInFrames: 8},
} as const;
export const molaKit = (frame: number, ini: number, tipo: keyof typeof MOLAS) =>
	spring({frame: frame - ini, fps: FPS, ...MOLAS[tipo]});

/** Entrada de UI do estilo padrão: opacidade, escala .94 -> 1, sobe 20 px, blur 6 -> 0 (5-6 frames). */
export const entraUI = (frame: number, ini: number, dist = 20): CSSProperties => {
	const p = molaKit(frame, ini, 'ui');
	return {
		opacity: frame < ini ? 0 : p,
		transform: `translate3d(0, ${(1 - p) * dist}px, 0) scale(${0.94 + 0.06 * p})`,
		filter: p < 0.99 ? `blur(${(1 - p) * 6}px)` : undefined,
	};
};

/** Revelação: sobe `dist` px, escala .985 -> 1, opacidade. */
export const revela = (frame: number, ini: number, dist = 38, dur = 20): CSSProperties => {
	const p = prog(frame, ini, dur);
	return {opacity: p, transform: `translate3d(0, ${(1 - p) * dist}px, 0) scale(${0.985 + 0.015 * p})`};
};

/** Número formatado no idioma do vídeo. */
export const LOCALE = 'pt-BR';
export const fmt = (v: number, casas = 0) =>
	v.toLocaleString(LOCALE, {minimumFractionDigits: casas, maximumFractionDigits: casas});
