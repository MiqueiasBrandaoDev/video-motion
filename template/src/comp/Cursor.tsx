import React from 'react';
import {cor} from '../theme';

/**
 * Cursor (seta preenchida com contorno) com anel de clique.
 * `clique` 0-1 = progresso da animação do clique (0 ou 1 = sem anel).
 */
export const Cursor: React.FC<{x: number; y: number; clique?: number; visivel?: number; tam?: number}> = ({
	x,
	y,
	clique = 0,
	visivel = 1,
	tam = 64,
}) => (
	<div style={{position: 'absolute', left: x, top: y, opacity: visivel, zIndex: 20, pointerEvents: 'none'}}>
		{clique > 0 && clique < 1 ? (
			<div
				style={{
					position: 'absolute',
					left: -40 * clique - 6,
					top: -40 * clique - 6,
					width: 80 * clique + 12,
					height: 80 * clique + 12,
					borderRadius: 999,
					border: `3px solid ${cor.acento}`,
					opacity: 1 - clique,
				}}
			/>
		) : null}
		<svg
			width={tam}
			height={tam}
			viewBox="0 0 24 24"
			style={{transform: `scale(${1 - 0.12 * Math.sin(Math.PI * Math.min(1, clique))})`, transformOrigin: '20% 20%'}}
		>
			<path
				d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"
				fill="#F7F5F2"
				stroke="#111111"
				strokeWidth={1.4}
				strokeLinejoin="round"
			/>
		</svg>
	</div>
);
