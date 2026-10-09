import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {alfa, cor, fonte, mola, prog, px, revela, SEGURO_TOPO} from '../theme';
import {fr, type Ref} from '../tempo';
import {Rotulo, TextoMarcado} from './CardVidro';
import {Pill} from './Pill';

/**
 * CTA final: rótulo, frase principal grande (com *trecho* em acento e glow pulsando)
 * e uma pill de ação. A música pode subir levemente aqui (mixar.py --subida-em).
 */
export const Cta: React.FC<{
	ini: number;
	principal: string;
	rotulo?: string;
	em?: Ref;
	pill?: {texto: string; icone?: string; em?: Ref};
}> = ({ini, principal, rotulo, em, pill}) => {
	const frame = useCurrentFrame();
	const t = em !== undefined ? fr(em) - ini : 6;
	const p = mola(frame, t - 6, {damping: 12, stiffness: 140});
	const pulso = 0.75 + 0.25 * Math.sin(frame / 7);
	const tPill = pill?.em !== undefined ? fr(pill.em) - ini : t + 12;
	return (
		<AbsoluteFill style={{padding: `${SEGURO_TOPO + 60}px 64px 0`, alignItems: 'center'}}>
			<AbsoluteFill style={{backgroundImage: `radial-gradient(70% 50% at 50% 55%, ${alfa(cor.acento, 0.1)}, transparent 70%)`}} />
			{rotulo ? (
				<div style={revela(frame, 0)}>
					<Rotulo>{rotulo}</Rotulo>
				</div>
			) : null}
			<div
				style={{
					marginTop: px(110),
					textAlign: 'center',
					fontFamily: fonte.display,
					fontWeight: 600,
					fontSize: px(140),
					lineHeight: 1.02,
					letterSpacing: '-.035em',
					color: cor.texto,
					opacity: Math.min(1, p * 1.5),
					transform: `translateY(${(1 - p) * 60}px)`,
					textShadow: `0 0 ${60 * pulso}px ${alfa(cor.acento, 0.25)}`,
				}}
			>
				<TextoMarcado texto={principal} />
			</div>
			{pill ? (
				<div
					style={{
						marginTop: px(70),
						opacity: prog(frame, tPill, 12),
						transform: `translateY(${(1 - prog(frame, tPill, 14)) * 30}px)`,
					}}
				>
					<Pill icone={pill.icone} tam={px(40)} glow={pulso * 1.3}>
						{pill.texto}
					</Pill>
				</div>
			) : null}
		</AbsoluteFill>
	);
};
