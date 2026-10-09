import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Rotulo} from '../comp/CardVidro';
import {Cta} from '../comp/Cta';
import {FaixaPills} from '../comp/Pill';
import {Terminal} from '../comp/Terminal';
import {cor, fonte, px, revela, SEGURO_LADO, SEGURO_TOPO} from '../theme';
import type {CenaCta, CenaPills, CenaTerminal, PropsCena} from './tipos';

/** Terminal digitando no tempo da fala (demo de CLI, passos de um agente, comandos). */
export const TerminalCena: React.FC<PropsCena<CenaTerminal>> = ({def, ini}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{padding: `${SEGURO_TOPO + 40}px ${SEGURO_LADO}px 0`}}>
			{def.rotulo ? (
				<div style={revela(frame, 0)}>
					<Rotulo>{def.rotulo}</Rotulo>
				</div>
			) : null}
			<Terminal linhas={def.linhas} ini={ini} titulo={def.titulo} style={{marginTop: 30}} />
		</AbsoluteFill>
	);
};

/** Lista de pills/badges acendendo no tempo da fala, com título opcional. */
export const Pills: React.FC<PropsCena<CenaPills>> = ({def, ini}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{padding: `${SEGURO_TOPO + 60}px ${SEGURO_LADO}px 0`}}>
			{def.rotulo ? (
				<div style={revela(frame, 0)}>
					<Rotulo>{def.rotulo}</Rotulo>
				</div>
			) : null}
			{def.titulo ? (
				<div
					style={{
						marginTop: px(40),
						fontFamily: fonte.display,
						fontWeight: 500,
						fontSize: px(84),
						lineHeight: 1.06,
						letterSpacing: '-.03em',
						color: cor.texto,
						...revela(frame, 3, 40),
					}}
				>
					{def.titulo}
				</div>
			) : null}
			<FaixaPills itens={def.itens} ini={ini} style={{marginTop: px(60)}} tam={px(36)} />
		</AbsoluteFill>
	);
};

/** CTA final. */
export const CtaCena: React.FC<PropsCena<CenaCta>> = ({def, ini}) => (
	<Cta ini={ini} principal={def.principal} rotulo={def.rotulo} em={def.em} pill={def.pill} />
);
