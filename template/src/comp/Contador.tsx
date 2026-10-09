import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {cor, fmt, fonte, mola, prog, px} from '../theme';
import {fr, type Ref} from '../tempo';
import {CardVidro} from './CardVidro';
import {Icone} from './Icone';

export type ItemNumero = {
	valor: number;
	casas?: number;
	prefixo?: string;
	sufixo?: string;
	rotulo: string;
	icone?: string;
	em: Ref;
};

/**
 * Número que entra em punch-in (escala 1,3 -> 1 com spring) e conta de 0 até `valor`
 * em ~0,8 s a partir do instante falado. O número DEVE bater com o que a fala diz
 * e com o print (ver references/qa.md). `ini` = frame absoluto do início da cena.
 */
export const Contador: React.FC<{item: ItemNumero; ini: number; style?: React.CSSProperties; tam?: number}> = ({
	item,
	ini,
	style,
	tam = px(112),
}) => {
	const frame = useCurrentFrame();
	const at = fr(item.em) - ini;
	const p = mola(frame, at - 5, {damping: 11, stiffness: 170});
	const v = interpolate(frame, [at - 5, at + 18], [0, item.valor], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: (t) => 1 - Math.pow(1 - t, 3),
	});
	const unidade: React.CSSProperties = {fontSize: tam * 0.48, color: cor.acentoTexto, letterSpacing: '-.02em'};
	return (
		<CardVidro
			opaco
			destaque={prog(frame, at, 10)}
			style={{
				padding: '22px 26px',
				opacity: frame >= at - 6 ? Math.min(1, p * 1.6) : 0,
				transform: `scale(${1.3 - 0.3 * p})`,
				...style,
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 12,
					fontFamily: fonte.mono,
					fontSize: px(23),
					color: cor.apagado,
					letterSpacing: '.16em',
					textTransform: 'uppercase',
				}}
			>
				{item.icone ? <Icone nome={item.icone} tam={px(26)} cor={cor.acento} /> : null} {item.rotulo}
			</div>
			<div
				style={{
					fontFamily: fonte.mono,
					fontWeight: 600,
					fontSize: tam,
					lineHeight: 1,
					letterSpacing: '-.05em',
					color: cor.texto,
					marginTop: 10,
					fontVariantNumeric: 'tabular-nums',
					whiteSpace: 'nowrap',
				}}
			>
				{item.prefixo ? <span style={{...unidade, marginRight: 12}}>{item.prefixo}</span> : null}
				{fmt(v, item.casas ?? 0)}
				{item.sufixo ? <span style={{...unidade, marginLeft: 12}}>{item.sufixo}</span> : null}
			</div>
		</CardVidro>
	);
};
