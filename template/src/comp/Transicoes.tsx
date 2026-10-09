import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {alfa, cor, H, prog, suaviza, W} from '../theme';

/**
 * Envelope de cena: entra com blur + subida, sai com blur + leve zoom.
 * Transições curtas (8-12 frames). `dur` = duração do Sequence em frames.
 */
export const Cena: React.FC<{children: React.ReactNode; dur: number; entra?: number; sai?: number}> = ({
	children,
	dur,
	entra = 12,
	sai = 9,
}) => {
	const frame = useCurrentFrame();
	const pIn = entra <= 1 ? 1 : prog(frame, 0, entra);
	const pOut = sai <= 1 ? 0 : interpolate(frame, [dur - sai, dur], [0, 1], {easing: suaviza, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const blur = (1 - pIn) * 18 + pOut * 16;
	return (
		<AbsoluteFill
			style={{
				opacity: pIn * (1 - pOut),
				filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
				transform: `translateY(${(1 - pIn) * 50}px) scale(${1 + pOut * 0.04})`,
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

/** Wipe de troca de bloco: faixa de luz na cor de acento varrendo a tela de cima para baixo (~16 frames). */
export const Wipe: React.FC = () => {
	const frame = useCurrentFrame();
	const p = prog(frame, 0, 16, suaviza);
	const faixa = Math.round(H * 0.14);
	const y = interpolate(p, [0, 1], [-faixa * 1.5, H + faixa * 0.2]);
	const op = interpolate(frame, [0, 4, 12, 16], [0, 1, 0.8, 0], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity: op}}>
			<div
				style={{
					position: 'absolute',
					left: 0,
					width: W,
					top: y,
					height: faixa,
					background: `linear-gradient(180deg, transparent, ${alfa(cor.acento, 0.1)} 40%, ${alfa(cor.acentoClaro, 0.32)} 50%, ${alfa(cor.acento, 0.1)} 60%, transparent)`,
				}}
			/>
		</AbsoluteFill>
	);
};
