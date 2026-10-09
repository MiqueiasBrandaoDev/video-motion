import React, {useMemo} from 'react';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import legendasJson from '../data/legendas.json';
import {cor, fonte, H, px, SEGURO_BASE, VARIANTE} from '../theme';

const legendas = legendasJson as Caption[];

/**
 * Legenda palavra por palavra (2-4 palavras por página, quebras já marcadas com
 * pageBreakAfter por scripts/legendas.py). Palavra ativa na cor de acento com spring leve.
 * Fica acima da área segura de baixo da plataforma (SEGURO_BASE).
 */
export const Legendas: React.FC<{altura?: number; tam?: number}> = ({altura = px(300), tam = px(70)}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const ms = (frame / fps) * 1000;

	const {pages} = useMemo(
		() => createTikTokStyleCaptions({captions: legendas, combineTokensWithinMilliseconds: 100000}),
		[],
	);

	const idx = pages.findIndex((p, i) => {
		const fim = i < pages.length - 1 ? pages[i + 1].startMs : p.startMs + 4000;
		return ms >= p.startMs - 60 && ms < fim;
	});
	if (idx < 0) return null;
	const pagina = pages[idx];
	const ultimo = pagina.tokens[pagina.tokens.length - 1];
	const fimPagina = idx < pages.length - 1 ? pages[idx + 1].startMs : ultimo.toMs + 1500;
	// a página some se ficar parada muito depois da última palavra (pausas longas)
	const someEm = Math.min(fimPagina, ultimo.toMs + 900);
	const entra = spring({frame: frame - Math.round(((pagina.startMs - 60) / 1000) * fps), fps, config: {damping: 18, stiffness: 220}});
	const sai = interpolate(ms, [someEm - 120, someEm], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const corBase = VARIANTE === 'escura' ? '#F6F1EC' : cor.texto;

	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: H - SEGURO_BASE - altura,
					height: altura,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '0 70px',
					opacity: sai,
				}}
			>
				<div
					style={{
						fontFamily: fonte.display,
						fontWeight: 600,
						fontSize: tam,
						lineHeight: 1.12,
						letterSpacing: '-.015em',
						textAlign: 'center',
						color: corBase,
						textShadow: cor.legendaSombra,
						transform: `translateY(${(1 - entra) * 22}px) scale(${0.96 + 0.04 * entra})`,
						opacity: Math.min(1, entra * 1.4),
						maxWidth: 940,
					}}
				>
					{pagina.tokens.map((t, i) => {
						const ativo = ms >= t.fromMs - 40 && ms < (pagina.tokens[i + 1]?.fromMs ?? Infinity) - 40;
						const jaFoi = ms >= t.fromMs - 40;
						const pop = spring({
							frame: frame - Math.round(((t.fromMs - 40) / 1000) * fps),
							fps,
							config: {damping: 11, stiffness: 260, mass: 0.6},
						});
						return (
							<span
								key={`${t.fromMs}-${i}`}
								style={{
									display: 'inline-block',
									marginLeft: i > 0 ? '0.32em' : 0,
									color: ativo ? cor.acentoTexto : corBase,
									opacity: jaFoi ? 1 : 0.55,
									transform: `scale(${ativo ? 1 + 0.08 * pop : 1})`,
									transformOrigin: '50% 75%',
									padding: '0 0.04em',
								}}
							>
								{t.text.trim()}
							</span>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Véu atrás da legenda: escurece (ou clareia) o terço inferior para garantir contraste. */
export const VeuLegenda: React.FC = () => (
	<AbsoluteFill
		style={{
			pointerEvents: 'none',
			background:
				VARIANTE === 'escura'
					? 'linear-gradient(180deg, transparent 62%, rgba(10,10,11,.78) 72%, rgba(10,10,11,.9) 100%)'
					: 'linear-gradient(180deg, transparent 62%, rgba(246,245,242,.8) 72%, rgba(246,245,242,.92) 100%)',
		}}
	/>
);
