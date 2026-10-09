import {loadFont as carregaDisplay} from '@remotion/google-fonts/Manrope';
import {loadFont as carregaCorpo} from '@remotion/google-fonts/Inter';
import {loadFont as carregaMono} from '@remotion/google-fonts/JetBrainsMono';
import type {CSSProperties} from 'react';
import {Easing, interpolate, spring} from 'remotion';
import config from './data/config.json';

/*
 * Tokens visuais do vídeo. Regras (ver references/direcao-visual.md):
 * - UM acento por vídeo (config.acento). Nada de segundo acento, gradiente arco-íris ou roxo-azul genérico.
 * - 1 fonte display + 1 de corpo + 1 mono para números/rótulos. Troque os imports acima para mudar.
 * - Peso de título moderado (500-600). Nunca 800/900 em título grande.
 */

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
export const VARIANTE: Variante = config.variante === 'clara' ? 'clara' : 'escura';
const ACENTO = config.acento || '#F2A33A';

const PALETAS = {
	escura: {
		fundo: '#0A0A0B', // nunca #000
		texto: '#F5F4F2',
		suave: '#B4B2AE',
		apagado: '#87858A',
		linha: 'rgba(255,255,255,.09)',
		grade: 'rgba(255,255,255,.045)',
		vidro: 'rgba(255,255,255,.045)',
		vidroOpaco: 'rgba(16,16,18,.92)',
		brilhoInterno: 'rgba(255,255,255,.10)',
		sombra: '0 24px 60px rgba(0,0,0,.5)',
		codigoFundo: '#0E0E10',
		codigoTexto: '#F5F4F2',
		legendaSombra: '0 4px 24px rgba(0,0,0,.95), 0 2px 6px rgba(0,0,0,.9)',
		acento: ACENTO,
		acentoTexto: ACENTO,
	},
	clara: {
		fundo: '#F6F5F2',
		texto: '#161616',
		suave: '#57554F',
		apagado: '#8D8B85',
		linha: 'rgba(20,20,20,.10)',
		grade: 'rgba(20,20,20,.06)',
		vidro: 'rgba(255,255,255,.72)',
		vidroOpaco: 'rgba(255,255,255,.96)',
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
export const cor = {
	...base,
	acentoClaro: tonalidade(ACENTO, 0.18),
	acentoFundo: tonalidade(ACENTO, -0.35),
	linhaAcento: alfa(ACENTO, 0.45),
	halo: alfa(ACENTO, VARIANTE === 'escura' ? 0.12 : 0.1),
	glow: (forca = 1) => `0 6px ${30 * forca}px ${alfa(ACENTO, 0.35 * forca)}`,
};

// ---------- tipografia ----------
const display = carregaDisplay('normal', {weights: ['500', '600'], subsets: ['latin', 'latin-ext']});
const corpo = carregaCorpo('normal', {weights: ['400', '500', '600'], subsets: ['latin', 'latin-ext']});
const mono = carregaMono('normal', {weights: ['400', '500', '600'], subsets: ['latin', 'latin-ext']});

export const fonte = {
	display: `${display.fontFamily}, system-ui, sans-serif`,
	corpo: `${corpo.fontFamily}, system-ui, sans-serif`,
	mono: `${mono.fontFamily}, ui-monospace, Consolas, monospace`,
};

// ---------- formato e área segura ----------
type Formato = '9:16' | '16:9' | '1:1';
export const FORMATO: Formato = (['9:16', '16:9', '1:1'] as const).includes(config.formato as Formato)
	? (config.formato as Formato)
	: '9:16';

const FORMATOS = {
	// seguro: margens que a interface da plataforma cobre (ver references/formatos-plataformas.md)
	'9:16': {W: 1080, H: 1920, seguroTopo: 200, seguroBase: 250, seguroLado: 64, escala: 1},
	'16:9': {W: 1920, H: 1080, seguroTopo: 80, seguroBase: 90, seguroLado: 120, escala: 0.82},
	'1:1': {W: 1080, H: 1080, seguroTopo: 70, seguroBase: 90, seguroLado: 70, escala: 0.8},
} as const;

export const {W, H, seguroTopo: SEGURO_TOPO, seguroBase: SEGURO_BASE, seguroLado: SEGURO_LADO, escala: ESCALA} =
	FORMATOS[FORMATO];
export const FPS = config.fps || 30;

/** Tamanho tipográfico escalado pelo formato (valores pensados para 9:16). */
export const px = (v: number) => Math.round(v * ESCALA);

/** Altura reservada para a legenda (acima da área segura de baixo). */
export const ZONA_LEGENDA = config.legendas ? px(300) : 0;
/** Coordenada Y máxima para conteúdo de cena: nada passa daqui (legenda + interface da plataforma). */
export const LIMITE_CONTEUDO = H - SEGURO_BASE - ZONA_LEGENDA;

// ---------- movimento ----------
export const suaviza = Easing.bezier(0.16, 1, 0.3, 1);
export const suaviza2 = Easing.bezier(0.23, 1, 0.32, 1);

/** Progresso 0..1 com easing a partir de `ini`, durando `dur` frames. Nunca linear seco. */
export const prog = (frame: number, ini: number, dur = 18, ease = suaviza) =>
	interpolate(frame, [ini, ini + dur], [0, 1], {easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** Spring padrão (pop leve, sem quicar demais). */
export const mola = (frame: number, ini: number, cfg?: {damping?: number; stiffness?: number; mass?: number}) =>
	spring({frame: frame - ini, fps: FPS, config: {damping: 14, stiffness: 160, mass: 0.8, ...cfg}});

/** Revelação: sobe `dist` px, escala .985 -> 1, opacidade. */
export const revela = (frame: number, ini: number, dist = 38, dur = 20): CSSProperties => {
	const p = prog(frame, ini, dur);
	return {opacity: p, transform: `translate3d(0, ${(1 - p) * dist}px, 0) scale(${0.985 + 0.015 * p})`};
};

/** Número formatado no idioma do vídeo. */
export const LOCALE = 'pt-BR';
export const fmt = (v: number, casas = 0) =>
	v.toLocaleString(LOCALE, {minimumFractionDigits: casas, maximumFractionDigits: casas});
