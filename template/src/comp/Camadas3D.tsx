import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame} from 'remotion';
import {alfa, AREA, cor, corDe, FPS, MOLAS, papel, px, VARIANTE, W} from '../theme';
import {fr, type Ref} from '../tempo';
import {Icone} from './Icone';
import {Chip} from './Tipografia';

/*
 * Camadas3D: pilha de planos de vidro em perspectiva (perspective + preserve-3d + translateZ)
 * que explodem e se juntam por spring (~8 frames, damping 200). Cada plano pode ter um chip
 * numerado mono ("01 · FUNDO") e um ícone em círculo de vidro. Chão de grade em perspectiva.
 * Use para "anatomia" de algo: camadas de um sistema, etapas de um método, partes de um produto.
 */

export type DefCamada = {rotulo: string; icone?: string; texto?: string};
export type DefCamadas3D = {
	camadas: DefCamada[];
	explodeEm?: Ref;
	juntaEm?: Ref;
	numerar?: boolean;
	legenda?: string;
	chao?: boolean;
	cor?: string;
};

/**
 * Chão de grade em perspectiva: plano deitado (rotateX 72°) cuja borda próxima fica em `base` (y)
 * e que some no horizonte ~`profundidade` px acima. A grade anda devagar em direção à câmera.
 */
export const ChaoGrade: React.FC<{cor?: string; base?: number; profundidade?: number; celula?: number; forca?: number; movimento?: boolean}> = ({
	cor: c = cor.acento,
	base,
	profundidade = px(380),
	celula = 90,
	forca = 1,
	movimento = true,
}) => {
	const frame = useCurrentFrame();
	const escura = VARIANTE === 'escura';
	const linha = alfa(c, (escura ? 0.3 : 0.26) * forca);
	const alto = profundidade * 3.2;
	const yBase = base ?? AREA.base;
	const mascara = 'linear-gradient(180deg, transparent 0%, #000 45%, #000 100%)';
	return (
		<div style={{position: 'absolute', left: 0, width: W, top: yBase - alto, height: alto, perspective: px(800), perspectiveOrigin: '50% 0%', overflow: 'hidden', pointerEvents: 'none'}}>
			<div
				style={{
					position: 'absolute',
					left: -W,
					right: -W,
					top: 0,
					bottom: 0,
					transform: 'rotateX(72deg)',
					transformOrigin: '50% 100%',
					backgroundImage: `linear-gradient(${linha} 2px, transparent 2px), linear-gradient(90deg, ${linha} 2px, transparent 2px)`,
					backgroundSize: `${celula}px ${celula}px`,
					backgroundPosition: `50% ${movimento ? (frame * 1.2) % celula : 0}px`,
					maskImage: mascara,
					WebkitMaskImage: mascara,
				}}
			/>
			<div style={{position: 'absolute', left: '15%', right: '15%', bottom: profundidade * 0.55, height: px(200), background: `radial-gradient(50% 50% at 50% 50%, ${alfa(c, escura ? 0.3 : 0.16)}, transparent 70%)`, filter: 'blur(12px)'}} />
		</div>
	);
};

export const Camadas3D: React.FC<{def: DefCamadas3D; ini: number; titulo?: boolean}> = ({def, ini, titulo = false}) => {
	const frame = useCurrentFrame();
	const c = corDe(def.cor);
	const escura = VARIANTE === 'escura';
	const n = def.camadas.length;
	const tEx = def.explodeEm !== undefined ? fr(def.explodeEm) - ini : 6;
	const tJu = def.juntaEm !== undefined ? fr(def.juntaEm) - ini : Infinity;
	const sEx = frame >= tEx ? spring({frame: frame - tEx, fps: FPS, ...MOLAS.camadas}) : 0;
	const sJu = frame >= tJu ? spring({frame: frame - tJu, fps: FPS, ...MOLAS.camadas}) : 0;
	const k = sEx * (1 - sJu); // 0 = juntas, 1 = explodidas
	const entrada = spring({frame: frame - 1, fps: FPS, config: {damping: 200}, durationInFrames: 10});
	// giro lento contínuo: dá volume mesmo parado
	const giro = -24 + Math.sin(frame / 40) * 4;
	const topoTitulo = titulo ? px(150) : 0;
	const livre = AREA.altura - topoTitulo - (def.legenda ? px(90) : 0);
	const LW = Math.min(px(420), AREA.largura * 0.44);
	const LH = Math.min(LW * 1.5, livre * 0.66);
	const passoZ = px(130);
	const passoX = px(34);
	const passoY = -px(26);
	const cy = AREA.topo + topoTitulo + livre * 0.47;
	return (
		<AbsoluteFill>
			{def.chao !== false ? <ChaoGrade cor={c} base={Math.min(AREA.base + px(60), cy + LH * 0.95)} profundidade={px(360)} /> : null}
			<div style={{position: 'absolute', left: W / 2, top: cy, perspective: 2000, perspectiveOrigin: '50% 40%'}}>
				<div
					style={{
						transformStyle: 'preserve-3d',
						transform: `rotateY(${giro}deg) rotateX(8deg) scale(${0.9 + 0.1 * entrada})`,
						opacity: entrada,
					}}
				>
					{def.camadas.map((cam, i) => {
						const rel = i - (n - 1) / 2;
						const z = rel * passoZ * k;
						const x = rel * passoX * k;
						const y = rel * passoY * k;
						const frente = i === n - 1;
						const acesa = 0.45 + 0.4 * k;
						return (
							<div
								key={i}
								style={{
									position: 'absolute',
									left: -LW / 2,
									top: -LH / 2,
									width: LW,
									height: LH,
									borderRadius: px(26),
									transform: `translate3d(${x}px, ${y}px, ${z}px)`,
									border: `2px solid ${alfa(c, acesa)}`,
									background: escura
										? `linear-gradient(160deg, ${alfa(c, 0.1)}, ${alfa(c, 0.02)} 45%, ${alfa('#FFFFFF', 0.02)})`
										: `linear-gradient(160deg, ${alfa('#FFFFFF', 0.75)}, ${alfa(c, 0.06)})`,
									boxShadow: `0 0 ${24 + 30 * k}px ${alfa(c, (escura ? 0.25 : 0.16) + 0.15 * k)}, inset 0 0 40px ${alfa(c, 0.08)}`,
									backfaceVisibility: 'visible',
								}}
							>
								<div style={{position: 'absolute', left: px(22), top: px(22), opacity: frente ? 1 : k}}>
									<Chip cor={c} solido tam={px(19)}>
										{def.numerar !== false ? `${String(i + 1).padStart(2, '0')} · ` : ''}
										{cam.rotulo}
									</Chip>
								</div>
								{cam.icone ? (
									<div
										style={{
											position: 'absolute',
											...(i % 2 ? {right: -px(30)} : {left: -px(30)}),
											top: LH * (0.22 + (i % 3) * 0.2),
											width: px(84),
											height: px(84),
											borderRadius: 999,
											border: `2px solid ${alfa(c, 0.7)}`,
											background: escura ? alfa('#0B0B10', 0.6) : alfa('#FFFFFF', 0.85),
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											boxShadow: `0 0 22px ${alfa(c, 0.45)}`,
										}}
									>
										<Icone nome={cam.icone} tam={px(40)} cor={escura ? '#FFFFFF' : c} />
									</div>
								) : null}
								{cam.texto ? (
									<div
										style={{
											position: 'absolute',
											left: px(24),
											right: px(24),
											bottom: LH * 0.12,
											...papel.frase,
											fontSize: px(54),
											lineHeight: 0.95,
											textTransform: 'uppercase',
											backgroundImage: cor.gradTexto,
											WebkitBackgroundClip: 'text',
											backgroundClip: 'text',
											color: 'transparent',
											opacity: frente ? 1 : 0.5 + 0.5 * k,
										}}
									>
										{cam.texto}
									</div>
								) : null}
							</div>
						);
					})}
				</div>
			</div>
			{def.legenda ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: cy + LH / 2 + px(70), textAlign: 'center', ...papel.rotulo, fontSize: px(26), color: escura ? '#E8E6F0' : cor.texto, opacity: k}}>
					{def.legenda}
				</div>
			) : null}
		</AbsoluteFill>
	);
};
