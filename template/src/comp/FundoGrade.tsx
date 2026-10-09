import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {alfa, cor, VARIANTE} from '../theme';

/**
 * Fundo assinatura da skill: grade de linhas finas (célula 72px) com drift lento,
 * máscara radial suave e um halo da cor de acento. Funciona nas variantes escura e clara.
 * `celula` e `halo` (posição 0-1 do halo) são ajustáveis por cena se precisar.
 */
export const FundoGrade: React.FC<{celula?: number; halo?: [number, number]; drift?: boolean}> = ({
	celula = 72,
	halo = [0.82, 0.04],
	drift = true,
}) => {
	const frame = useCurrentFrame();
	const dx = drift ? (frame * 0.18) % celula : 0;
	const dy = drift ? (frame * 0.3) % celula : 0;
	const pulso = 0.85 + 0.15 * Math.sin(frame / 50);
	const forca = VARIANTE === 'escura' ? 0.13 : 0.11;
	const mascara = 'radial-gradient(85% 60% at 50% 38%, #000 40%, transparent 100%)';
	return (
		<AbsoluteFill style={{backgroundColor: cor.fundo}}>
			<AbsoluteFill
				style={{
					backgroundImage: `linear-gradient(${cor.grade} 1px, transparent 1px), linear-gradient(90deg, ${cor.grade} 1px, transparent 1px)`,
					backgroundSize: `${celula}px ${celula}px`,
					backgroundPosition: `${dx}px ${dy}px`,
					maskImage: mascara,
					WebkitMaskImage: mascara,
				}}
			/>
			<AbsoluteFill
				style={{
					background: `radial-gradient(70% 34% at ${halo[0] * 100}% ${halo[1] * 100}%, ${alfa(cor.acento, forca * pulso)}, transparent 62%), radial-gradient(60% 30% at 10% 70%, ${alfa(cor.acento, forca * 0.35)}, transparent 70%)`,
				}}
			/>
		</AbsoluteFill>
	);
};
