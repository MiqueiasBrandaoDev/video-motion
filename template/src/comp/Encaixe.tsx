import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {easingEncaixe} from '../theme';

/*
 * Encaixe: um elemento interpola posição, tamanho e raio até virar parte da próxima tela
 * (vídeo vira o preview de uma janela, celular vira um tile do grid). 6-8 frames com
 * Easing.bezier(0.2, 0, 0, 1). O conteúdo é escalado de forma uniforme (sem distorcer texto).
 */

export type Retangulo = {x: number; y: number; w: number; h: number; raio?: number};

/** Progresso 0..1 do encaixe a partir do frame local `at`. */
export const progEncaixe = (frame: number, at: number, dur = 8) =>
	interpolate(frame, [at, at + dur], [0, 1], {easing: easingEncaixe, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const misturaRet = (a: Retangulo, b: Retangulo, p: number): Required<Retangulo> => ({
	x: a.x + (b.x - a.x) * p,
	y: a.y + (b.y - a.y) * p,
	w: a.w + (b.w - a.w) * p,
	h: a.h + (b.h - a.h) * p,
	raio: (a.raio ?? 0) + ((b.raio ?? 0) - (a.raio ?? 0)) * p,
});

/**
 * Moldura que sai de `de` e encaixa em `para`. `children` é desenhado no tamanho de `para`
 * e escalado uniformemente enquanto a moldura anda. `moldura` = estilo da caixa (borda, fundo, glow).
 */
export const Encaixe: React.FC<{
	de: Retangulo;
	para: Retangulo;
	at: number;
	dur?: number;
	moldura?: React.CSSProperties;
	children?: React.ReactNode;
}> = ({de, para, at, dur = 8, moldura, children}) => {
	const frame = useCurrentFrame();
	const p = progEncaixe(frame, at, dur);
	const r = misturaRet(de, para, p);
	const esc = Math.min(r.w / para.w, r.h / para.h);
	return (
		<div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: r.raio, overflow: 'hidden', ...moldura}}>
			<div
				style={{
					position: 'absolute',
					left: (r.w - para.w * esc) / 2,
					top: (r.h - para.h * esc) / 2,
					width: para.w,
					height: para.h,
					transform: `scale(${esc})`,
					transformOrigin: '0 0',
				}}
			>
				{children}
			</div>
		</div>
	);
};
