import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Rotulo} from '../comp/CardVidro';
import {Contador} from '../comp/Contador';
import {cor, fonte, FORMATO, px, revela, SEGURO_LADO, SEGURO_TOPO} from '../theme';
import type {CenaNumeros, PropsCena} from './tipos';

/** Números falados em punch-in com contagem. 9:16 empilha; 16:9 e 1:1 ficam lado a lado. */
export const Numeros: React.FC<PropsCena<CenaNumeros>> = ({def, ini}) => {
	const frame = useCurrentFrame();
	const lado = FORMATO !== '9:16' || def.itens.length > 1;
	return (
		<AbsoluteFill style={{padding: `${SEGURO_TOPO + 60}px ${SEGURO_LADO}px 0`}}>
			{def.rotulo ? (
				<div style={revela(frame, 0)}>
					<Rotulo>{def.rotulo}</Rotulo>
				</div>
			) : null}
			<div style={{marginTop: px(80), display: 'flex', flexDirection: lado ? 'row' : 'column', gap: 22}}>
				{def.itens.map((it, i) => (
					<Contador key={i} item={it} ini={ini} style={{flex: 1}} tam={def.itens.length > 1 ? px(96) : px(150)} />
				))}
			</div>
			{def.legenda ? (
				<div style={{marginTop: 36, fontFamily: fonte.corpo, fontSize: px(34), color: cor.suave, ...revela(frame, 20)}}>
					{def.legenda}
				</div>
			) : null}
		</AbsoluteFill>
	);
};
