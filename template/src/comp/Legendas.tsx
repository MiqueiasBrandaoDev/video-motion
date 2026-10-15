import React, {useMemo} from 'react';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import legendasJson from '../data/legendas.json';
import {alfa, BASE_LEGENDA, cor, fonte, H, papel, px, SEGURO_BASE, VARIANTE, W, ZONA_LEGENDA} from '../theme';

const legendas = legendasJson as Caption[];

/** Página de legenda ativa no instante `ms` (ou null). */
const usePagina = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const ms = (frame / fps) * 1000;
	const {pages} = useMemo(() => createTikTokStyleCaptions({captions: legendas, combineTokensWithinMilliseconds: 100000}), []);
	const idx = pages.findIndex((p, i) => {
		const fim = i < pages.length - 1 ? pages[i + 1].startMs : p.startMs + 4000;
		return ms >= p.startMs - 60 && ms < fim;
	});
	if (idx < 0) return null;
	const pagina = pages[idx];
	const ultimo = pagina.tokens[pagina.tokens.length - 1];
	const fimPagina = idx < pages.length - 1 ? pages[idx + 1].startMs : ultimo.toMs + 1500;
	const someEm = Math.min(fimPagina, ultimo.toMs + 900);
	return {pagina, someEm, ms, frame, fps};
};

/**
 * Legenda em caixa (estilo padrão): pequena (~3,5% da altura), frase inteira da página
 * visível dentro de uma caixa escura com borda fina e um traço de gradiente do acento
 * embaixo e à direita (sombra dura colorida). Palavras ainda não ditas em cinza, já ditas
 * em branco e só a palavra ativa destacada no acento. Troca de página em corte seco.
 * Ganha a cena: a legenda deixa o motion ser protagonista.
 */
export const LegendaCaixa: React.FC<{tam?: number}> = ({tam = px(58)}) => {
	const pg = usePagina();
	if (!pg) return null;
	const {pagina, someEm, ms} = pg;
	const escura = VARIANTE === 'escura';
	const sai = interpolate(ms, [someEm - 80, someEm], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const deslocamento = Math.max(6, Math.round(tam * 0.12));
	const centroY = BASE_LEGENDA - ZONA_LEGENDA / 2;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', left: 0, width: W, top: centroY, display: 'flex', justifyContent: 'center', transform: 'translateY(-50%)', opacity: sai}}>
				<div style={{position: 'relative', maxWidth: W - px(150)}}>
					<div
						style={{
							position: 'absolute',
							inset: 0,
							transform: `translate(${deslocamento}px, ${deslocamento}px)`,
							borderRadius: 6,
							background: cor.gradAcento,
							boxShadow: `0 0 18px ${alfa(cor.acento, 0.35)}`,
						}}
					/>
					<div
						style={{
							position: 'relative',
							padding: `${tam * 0.26}px ${tam * 0.62}px ${tam * 0.3}px`,
							borderRadius: 6,
							background: escura ? '#0B0C0E' : '#FFFFFF',
							border: `1.5px solid ${escura ? 'rgba(255,255,255,.16)' : 'rgba(20,20,20,.14)'}`,
							...papel.frase,
							fontSize: tam,
							lineHeight: 1.15,
							letterSpacing: '-.02em',
							textAlign: 'center',
						}}
					>
						{pagina.tokens.map((t, i) => {
							const ativo = ms >= t.fromMs - 40 && ms < (pagina.tokens[i + 1]?.fromMs ?? Infinity) - 40;
							const jaFoi = ms >= t.fromMs - 40;
							return (
								<span
									key={`${t.fromMs}-${i}`}
									style={{
										marginLeft: i > 0 ? '0.26em' : 0,
										color: ativo
											? escura
												? cor.acentoClaro
												: cor.acentoTexto
											: jaFoi
												? escura
													? '#F5F4F2'
													: cor.texto
												: escura
													? '#6E6E78'
													: '#A3A19B',
										textShadow: ativo && escura ? `0 0 16px ${alfa(cor.acento, 0.55)}` : undefined,
									}}
								>
									{t.text.trim()}
								</span>
							);
						})}
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/**
 * Variante clássica (config.legenda_estilo = "grande").
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
