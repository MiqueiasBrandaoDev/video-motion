import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {alfa, cor, corDe, papel, px, VARIANTE, W, type Papel} from '../theme';

/*
 * Letreiro: duas linhas de texto gigante correndo em sentidos opostos; a de cima preenchida,
 * a de baixo só em contorno. Funciona sozinho ou atrás do apresentador recortado.
 * LinhaSVG: traço desenhado por strokeDashoffset (batimento/ECG, linha reta, rachadura).
 */

export const Letreiro: React.FC<{
	texto: string;
	texto2?: string;
	y: number;
	tam?: number;
	velocidade?: number;
	papelTexto?: Papel;
	at?: number;
}> = ({texto, texto2, y, tam = px(170), velocidade = 4, papelTexto = 'numero', at = 0}) => {
	const frame = useCurrentFrame();
	const t = Math.max(0, frame - at);
	const entra = interpolate(frame, [at, at + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const sep = '  ·  ';
	const repete = (s: string) => Array.from({length: 8}, () => s).join(sep) + sep;
	const escura = VARIANTE === 'escura';
	const base: React.CSSProperties = {
		...papel[papelTexto],
		fontSize: tam,
		lineHeight: 1,
		whiteSpace: 'nowrap',
		textTransform: 'uppercase',
		position: 'absolute',
		left: 0,
	};
	return (
		<div style={{position: 'absolute', left: 0, width: W, top: y, height: tam * 2.3, overflow: 'hidden', opacity: entra}}>
			<div
				style={{
					...base,
					top: 0,
					transform: `translateX(${-tam * 0.6 - t * velocidade}px)`,
					color: escura ? '#FFFFFF' : cor.texto,
					filter: `drop-shadow(0 0 ${tam * 0.12}px ${alfa(cor.acento, escura ? 0.5 : 0.25)})`,
				}}
			>
				{repete(texto)}
			</div>
			<div
				style={{
					...base,
					top: tam * 1.15,
					transform: `translateX(${-tam * 9 + t * velocidade}px)`,
					// paint-order: o miolo na cor do fundo cobre os contornos internos sobrepostos da fonte
					color: cor.fundo,
					WebkitTextStroke: `${Math.max(4, tam * 0.032)}px ${alfa(escura ? '#FFFFFF' : cor.texto, 0.75)}`,
					paintOrder: 'stroke fill',
				}}
			>
				{repete(texto2 ?? texto)}
			</div>
		</div>
	);
};

/** Caminho de ECG: linha com batimentos a cada `passo` px; `plano` achata a partir de x. */
const caminhoEcg = (largura: number, alturaPico: number, passo: number, plano?: number) => {
	let d = `M 0 0`;
	for (let x = 0; x < largura; x += passo) {
		if (plano !== undefined && x >= plano) {
			d += ` L ${largura} 0`;
			break;
		}
		const a = alturaPico;
		d += ` L ${x + passo * 0.3} 0 L ${x + passo * 0.36} ${-a * 0.18} L ${x + passo * 0.42} 0 L ${x + passo * 0.47} ${a * 0.22} L ${x + passo * 0.52} ${-a} L ${x + passo * 0.58} ${a * 0.42} L ${x + passo * 0.63} 0 L ${x + passo * 0.75} ${-a * 0.12} L ${x + passo * 0.82} 0 L ${x + passo} 0`;
	}
	return d;
};

/** Rachadura: segmentos irregulares saindo de um ponto (determinístico pela semente). */
const caminhosRachadura = (raio: number, semente = 7) => {
	const rnd = (i: number) => {
		const x = Math.sin(i * 12.9898 + semente * 78.233) * 43758.5453;
		return x - Math.floor(x);
	};
	const linhas: string[] = [];
	const n = 7;
	for (let k = 0; k < n; k++) {
		const ang = (k / n) * Math.PI * 2 + rnd(k) * 0.6;
		let x = 0;
		let y = 0;
		let d = 'M 0 0';
		const passos = 4;
		for (let s = 1; s <= passos; s++) {
			const r = (raio * s) / passos;
			const desvio = (rnd(k * 10 + s) - 0.5) * 0.7;
			x = Math.cos(ang + desvio) * r;
			y = Math.sin(ang + desvio) * r;
			d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
		}
		linhas.push(d);
	}
	return linhas;
};

export type FormaLinha = 'ecg' | 'reta' | 'rachadura';

/**
 * Traço animado. `at` = frame local em que começa a desenhar; `dur` = frames para desenhar.
 * ecg: corre pela largura e, a partir de `planaEm` (frame local), vira reta na cor de problema.
 * rachadura: 7 trincas saindo do centro, desenhadas em ~3 frames.
 */
export const LinhaSVG: React.FC<{
	forma: FormaLinha;
	at: number;
	dur?: number;
	planaEm?: number;
	cor?: string;
	largura?: number;
	altura?: number;
	espessura?: number;
	style?: React.CSSProperties;
}> = ({forma, at, dur, planaEm, cor: nomeCor, largura = W, altura = px(260), espessura = 5, style}) => {
	const frame = useCurrentFrame();
	const plano = planaEm !== undefined && frame >= planaEm;
	const c = plano ? corDe('problema') : corDe(nomeCor);
	if (forma === 'rachadura') {
		const p = interpolate(frame, [at, at + (dur ?? 3)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
		const r = Math.min(largura, altura) * 0.5;
		return (
			<svg width={largura} height={altura} viewBox={`${-largura / 2} ${-altura / 2} ${largura} ${altura}`} style={{overflow: 'visible', ...style}}>
				{caminhosRachadura(r).map((d, i) => (
					<path key={i} d={d} fill="none" stroke={VARIANTE === 'escura' ? '#0A0A0C' : '#141416'} strokeWidth={espessura} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
				))}
			</svg>
		);
	}
	const comprimento = largura;
	const desenha = interpolate(frame, [at, at + (dur ?? 24)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const d = forma === 'ecg' ? caminhoEcg(comprimento, altura * 0.42, px(300), plano ? 0 : undefined) : `M 0 0 L ${comprimento} 0`;
	return (
		<svg width={largura} height={altura} viewBox={`0 ${-altura / 2} ${largura} ${altura}`} style={{overflow: 'visible', ...style}}>
			<path d={d} fill="none" stroke={alfa(c, 0.35)} strokeWidth={espessura * 3.2} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - desenha} style={{filter: 'blur(6px)'}} />
			<path d={d} fill="none" stroke={c} strokeWidth={espessura} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - desenha} />
		</svg>
	);
};
