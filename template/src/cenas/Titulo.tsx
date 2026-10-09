import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Rotulo, TextoMarcado} from '../comp/CardVidro';
import {alfa, cor, fonte, mola, prog, px, SEGURO_LADO, SEGURO_TOPO} from '../theme';
import {fr} from '../tempo';
import type {CenaTitulo, PropsCena} from './tipos';

/**
 * Tipografia cinética: cada linha entra no instante em que é falada (`em`), subindo
 * com blur curto. Trechos *marcados* saem em acento com glow. Sem `em`, entra em cascata.
 * Bom para gancho (2 primeiros segundos) e para vídeos sem voz.
 */
export const Titulo: React.FC<PropsCena<CenaTitulo>> = ({def, ini}) => {
	const frame = useCurrentFrame();
	const centro = def.alinhar === 'centro';
	return (
		<AbsoluteFill
			style={{
				padding: `${SEGURO_TOPO + 60}px ${SEGURO_LADO + 16}px 0`,
				alignItems: centro ? 'center' : 'flex-start',
				textAlign: centro ? 'center' : 'left',
			}}
		>
			{def.rotulo ? (
				<div style={{opacity: prog(frame, 2, 14)}}>
					<Rotulo>{def.rotulo}</Rotulo>
				</div>
			) : null}
			<div style={{marginTop: px(54)}}>
				{def.linhas.map((l, i) => {
					const at = l.em !== undefined ? Math.max(2, fr(l.em) - ini - 6) : 3 + i * 8;
					const p = prog(frame, at, 16);
					const m = mola(frame, at);
					const marcada = l.texto.includes('*');
					const tam = px(128) * (l.tam ?? 1);
					return (
						<div
							key={i}
							style={{
								fontFamily: fonte.display,
								fontWeight: 500,
								fontSize: tam,
								lineHeight: 1.04,
								letterSpacing: '-.03em',
								color: cor.texto,
								opacity: p,
								filter: p < 0.98 ? `blur(${(1 - p) * 10}px)` : undefined,
								transform: `translateY(${(1 - m) * 46}px) scale(${0.97 + 0.03 * m})`,
								transformOrigin: centro ? '50% 100%' : '0% 100%',
								textShadow: marcada ? `0 0 ${50 * m}px ${alfa(cor.acento, 0.35)}` : undefined,
							}}
						>
							<TextoMarcado texto={l.texto} />
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
