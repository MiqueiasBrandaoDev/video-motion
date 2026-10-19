import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {alfa, H, papel, px, W} from '../theme';

/*
 * Efeitos de "fita" do teaser e da volta (cold open / flash-forward):
 *   Grao        grão de filme animado (feTurbulence, semente muda a cada frame)
 *   Vinheta     cantos escuros
 *   Scanlines   linhas de varredura de tela de tubo/VHS
 *   Tracking    faixas de ruído horizontal correndo pela tela (fita fora de trilha)
 *   FiltroRGB   <svg> com o filtro de separação de canais (aberração cromática) para `filter: url(#id)`
 *   Triangulos  ícone de rebobinar/avançar (dois triângulos, desenhados; nada de emoji)
 *   OSD         texto de tela de videocassete (mono, branco, com brilho leve)
 */

/** Tremor determinístico (px e graus) para o frame; `forca` 1 = leve (~3 px). */
export const tremor = (frame: number, forca = 1, semente = 'tremor') => {
	// muda a cada 2 frames (câmera na mão, não vibração)
	const k = Math.floor(frame / 2);
	return {
		x: (random(`${semente}-x-${k}`) - 0.5) * px(6) * forca,
		y: (random(`${semente}-y-${k}`) - 0.5) * px(6) * forca,
		r: (random(`${semente}-r-${k}`) - 0.5) * 0.35 * forca,
	};
};

export const Grao: React.FC<{forca?: number; id?: string}> = ({forca = 0.35, id = 'vm-grao'}) => {
	const frame = useCurrentFrame();
	if (forca <= 0) return null;
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity: Math.min(1, forca), mixBlendMode: 'overlay'}}>
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
				<filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
					<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={(frame % 61) + 1} stitchTiles="stitch" />
					<feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1" />
					<feComponentTransfer>
						<feFuncR type="linear" slope="2.2" intercept="-0.6" />
						<feFuncG type="linear" slope="2.2" intercept="-0.6" />
						<feFuncB type="linear" slope="2.2" intercept="-0.6" />
					</feComponentTransfer>
				</filter>
				<rect width={W} height={H} filter={`url(#${id})`} />
			</svg>
		</AbsoluteFill>
	);
};

export const Vinheta: React.FC<{forca?: number}> = ({forca = 0.55}) =>
	forca <= 0 ? null : (
		<AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse 75% 62% at 50% 44%, transparent 55%, rgba(0,0,0,${forca}) 100%)`}} />
	);

export const Scanlines: React.FC<{forca?: number; passo?: number}> = ({forca = 0.22, passo = 6}) =>
	forca <= 0 ? null : (
		<AbsoluteFill
			style={{
				pointerEvents: 'none',
				backgroundImage: `repeating-linear-gradient(180deg, rgba(0,0,0,${forca}) 0px, rgba(0,0,0,${forca}) ${passo / 2}px, transparent ${passo / 2}px, transparent ${passo}px)`,
			}}
		/>
	);

/** Faixas de tracking: `n` faixas de ruído horizontal descendo; `p` 0..1 é o avanço da volta. */
export const Tracking: React.FC<{p: number; forca?: number; n?: number; id?: string}> = ({p, forca = 1, n = 2, id = 'vm-tracking'}) => {
	const frame = useCurrentFrame();
	if (forca <= 0) return null;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<svg width={0} height={0} style={{position: 'absolute'}}>
				<filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
					<feTurbulence type="fractalNoise" baseFrequency="0.004 0.55" numOctaves={1} seed={(frame % 37) + 3} />
					<feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.6 1.6 1.6 0 -2.1" />
				</filter>
			</svg>
			{Array.from({length: n}, (_, i) => {
				const alt = H * (0.05 + 0.04 * random(`trk-h-${i}`));
				const y = ((p * (1.4 + i * 0.5) + i * 0.47 + 0.08 * random(`trk-${i}-${Math.floor(frame / 2)}`)) % 1.15) * H - alt;
				return (
					<div key={i} style={{position: 'absolute', left: -px(20), width: W + px(40), top: y, height: alt, opacity: 0.85 * forca, mixBlendMode: 'screen'}}>
						<svg width={W + px(40)} height={alt} style={{display: 'block'}}>
							<rect width="100%" height="100%" filter={`url(#${id})`} />
						</svg>
						<div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent, rgba(255,255,255,${0.16 * forca}) 50%, transparent)`}} />
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

/** Filtro SVG de aberração cromática: vermelho para a direita, azul para a esquerda (`d` px). */
export const FiltroRGB: React.FC<{id: string; d: number}> = ({id, d}) => (
	<svg width={0} height={0} style={{position: 'absolute'}}>
		<filter id={id} x="-2%" y="0" width="104%" height="100%" colorInterpolationFilters="sRGB">
			<feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
			<feOffset in="r" dx={d} dy={0} result="r2" />
			<feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
			<feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
			<feOffset in="b" dx={-d} dy={0} result="b2" />
			<feBlend in="r2" in2="g" mode="screen" result="rg" />
			<feBlend in="rg" in2="b2" mode="screen" />
		</filter>
	</svg>
);

/** Dois triângulos: `sentido` -1 = rebobinar (apontam para a esquerda), 1 = avançar. */
export const Triangulos: React.FC<{tam: number; cor?: string; sentido?: -1 | 1}> = ({tam, cor = '#FFFFFF', sentido = -1}) => {
	const w = tam * 0.62;
	const pts = (x0: number) => (sentido < 0 ? `${x0 + w},0 ${x0 + w},${tam} ${x0},${tam / 2}` : `${x0},0 ${x0},${tam} ${x0 + w},${tam / 2}`);
	return (
		<svg width={w * 2} height={tam} viewBox={`0 0 ${w * 2} ${tam}`} style={{display: 'block', overflow: 'visible'}}>
			<polygon points={pts(0)} fill={cor} />
			<polygon points={pts(w)} fill={cor} />
		</svg>
	);
};

/** Texto de OSD de videocassete. */
export const OSD: React.FC<{children: React.ReactNode; tam?: number; style?: React.CSSProperties}> = ({children, tam = px(46), style}) => (
	<div
		style={{
			...papel.rotulo,
			fontWeight: 700,
			letterSpacing: '.12em',
			fontSize: tam,
			color: '#FFFFFF',
			textShadow: `0 0 ${px(10)}px ${alfa('#FFFFFF', 0.55)}, ${px(2)}px ${px(2)}px 0 rgba(0,0,0,.55)`,
			display: 'flex',
			alignItems: 'center',
			gap: px(16),
			whiteSpace: 'nowrap',
			...style,
		}}
	>
		{children}
	</div>
);
