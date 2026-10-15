import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {alfa, cor, CFG, H, VARIANTE} from '../theme';
import {ChaoGrade} from './Camadas3D';

/**
 * Fundo assinatura da skill: grade de linhas finas (célula 72px) com drift lento e máscara
 * radial, mais luz e profundidade (estilo padrão):
 *   halos     2 halos do acento que derivam devagar (ciclo de ~10 s), mais um contra-halo fraco
 *   chao      chão de grade em perspectiva na base (config.fundo.chao ou prop)
 *   vinheta   bordas escurecidas (clareadas na variante clara)
 *   grao      ruído fino animado (opcional; custo baixo)
 * Funciona nas variantes escura e clara. Props sobrescrevem config.fundo.
 */
export const FundoGrade: React.FC<{
	celula?: number;
	halo?: [number, number];
	drift?: boolean;
	halos?: boolean;
	chao?: boolean;
	vinheta?: boolean;
	grao?: boolean;
}> = ({celula = 72, halo = [0.78, 0.12], drift = true, ...over}) => {
	const frame = useCurrentFrame();
	const opc = {halos: true, chao: false, vinheta: true, grao: false, ...CFG.fundo, ...stripUndef(over)};
	const escura = VARIANTE === 'escura';
	const dx = drift ? (frame * 0.18) % celula : 0;
	const dy = drift ? (frame * 0.3) % celula : 0;
	const pulso = 0.85 + 0.15 * Math.sin(frame / 50);
	const forca = escura ? 0.2 : 0.14;
	const mascara = 'radial-gradient(85% 60% at 50% 40%, #000 35%, transparent 100%)';
	// deriva lenta dos halos
	const hx = halo[0] * 100 + Math.sin(frame / 95) * 6;
	const hy = halo[1] * 100 + Math.cos(frame / 120) * 4;
	const h2x = 18 + Math.cos(frame / 110) * 7;
	const h2y = 72 + Math.sin(frame / 90) * 5;
	return (
		<AbsoluteFill style={{backgroundColor: cor.fundo, overflow: 'hidden'}}>
			{opc.halos ? (
				<AbsoluteFill
					style={{
						background: [
							`radial-gradient(60% 34% at ${hx}% ${hy}%, ${alfa(cor.acento, forca * pulso)}, transparent 70%)`,
							`radial-gradient(55% 30% at ${h2x}% ${h2y}%, ${alfa(cor.acento2, forca * 0.55)}, transparent 72%)`,
							`radial-gradient(90% 45% at 50% 50%, ${alfa(cor.acento, forca * 0.25)}, transparent 80%)`,
						].join(', '),
					}}
				/>
			) : (
				<AbsoluteFill style={{background: `radial-gradient(70% 34% at ${halo[0] * 100}% ${halo[1] * 100}%, ${alfa(cor.acento, 0.13 * pulso)}, transparent 62%)`}} />
			)}
			<AbsoluteFill
				style={{
					backgroundImage: `linear-gradient(${cor.grade} 1px, transparent 1px), linear-gradient(90deg, ${cor.grade} 1px, transparent 1px)`,
					backgroundSize: `${celula}px ${celula}px`,
					backgroundPosition: `${dx}px ${dy}px`,
					maskImage: mascara,
					WebkitMaskImage: mascara,
				}}
			/>
			{opc.chao ? <ChaoGrade base={H} profundidade={H * 0.22} celula={110} forca={0.7} /> : null}
			{opc.vinheta ? (
				<AbsoluteFill
					style={{
						background: escura
							? 'radial-gradient(120% 80% at 50% 45%, transparent 55%, rgba(0,0,0,.55) 100%)'
							: 'radial-gradient(120% 80% at 50% 45%, transparent 60%, rgba(214,210,200,.45) 100%)',
					}}
				/>
			) : null}
			{opc.grao ? <Grao frame={frame} /> : null}
		</AbsoluteFill>
	);
};

const stripUndef = <T extends object>(o: T): Partial<T> =>
	Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<T>;

const RUIDO =
	"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>";

const Grao: React.FC<{frame: number}> = ({frame}) => (
	<AbsoluteFill
		style={{
			backgroundImage: `url("${RUIDO}")`,
			backgroundSize: '240px 240px',
			backgroundPosition: `${(frame * 73) % 240}px ${(frame * 151) % 240}px`,
			opacity: VARIANTE === 'escura' ? 0.07 : 0.05,
			mixBlendMode: 'overlay',
		}}
	/>
);
