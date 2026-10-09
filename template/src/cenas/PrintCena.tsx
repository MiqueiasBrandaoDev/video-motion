import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Rotulo} from '../comp/CardVidro';
import {FaixaPills} from '../comp/Pill';
import {Print} from '../comp/Print';
import {FORMATO, LIMITE_CONTEUDO, px, revela, SEGURO_LADO, SEGURO_TOPO, W} from '../theme';
import type {CenaPrint, PropsCena} from './tipos';

const BARRA_JANELA = 50;
const PROPORCAO = 1.6;

/**
 * Print real do produto numa janela, com zooms/destaques/clique de prints.json e pills de apoio.
 * 9:16: pills abaixo do print. 16:9 e 1:1: pills numa coluna ao lado.
 * O tamanho do print é calculado para nunca invadir a zona da legenda (LIMITE_CONTEUDO).
 */
export const PrintCena: React.FC<PropsCena<CenaPrint>> = ({def, ini}) => {
	const frame = useCurrentFrame();
	const vertical = FORMATO === '9:16';
	const temApoio = Boolean(def.apoio?.length);
	const topo = SEGURO_TOPO + 36 + (def.rotulo ? px(26) + px(36) : 0);
	const alturaLivre = LIMITE_CONTEUDO - topo - 20 - (vertical && temApoio ? 120 : 0);
	const larguraLivre = W - 2 * SEGURO_LADO - (!vertical && temApoio ? 420 : 0);
	const largura = Math.floor(Math.min(larguraLivre, (alturaLivre - BARRA_JANELA) * PROPORCAO));
	return (
		<AbsoluteFill style={{padding: `${SEGURO_TOPO + 36}px ${SEGURO_LADO}px 0`}}>
			{def.rotulo ? (
				<div style={revela(frame, 0)}>
					<Rotulo>{def.rotulo}</Rotulo>
				</div>
			) : null}
			<div
				style={{
					marginTop: px(36),
					display: 'flex',
					flexDirection: vertical ? 'column' : 'row',
					alignItems: vertical ? 'flex-start' : 'center',
					justifyContent: vertical ? 'flex-start' : 'center',
					gap: 40,
				}}
			>
				<Print janela={def.janela ?? def.id} ini={ini} largura={largura} proporcao={PROPORCAO} />
				{temApoio ? (
					<FaixaPills itens={def.apoio!} ini={ini} style={vertical ? {} : {flexDirection: 'column', alignItems: 'flex-start'}} />
				) : null}
			</div>
		</AbsoluteFill>
	);
};
