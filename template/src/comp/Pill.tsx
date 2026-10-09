import React from 'react';
import {useCurrentFrame} from 'remotion';
import {cor, fonte, mola, prog, px} from '../theme';
import {fr, type Ref} from '../tempo';
import {Icone} from './Icone';

/** Pill/badge de contorno com glow. Nunca preenchida com cor sólida. `fantasma` = sem glow, secundária. */
export const Pill: React.FC<{
	children: React.ReactNode;
	icone?: string;
	style?: React.CSSProperties;
	glow?: number;
	fantasma?: boolean;
	tam?: number;
}> = ({children, icone, style, glow = 1, fantasma = false, tam = px(34)}) => (
	<div
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: tam * 0.4,
			fontFamily: fonte.mono,
			fontWeight: 500,
			fontSize: tam,
			padding: `${tam * 0.42}px ${tam * 0.9}px`,
			borderRadius: 999,
			border: `1.5px solid ${fantasma ? cor.linha : cor.linhaAcento}`,
			background: 'transparent',
			color: fantasma ? cor.suave : cor.texto,
			boxShadow: fantasma ? 'none' : `inset 0 1px 0 ${cor.brilhoInterno}, ${cor.glow(glow)}`,
			whiteSpace: 'nowrap',
			...style,
		}}
	>
		{icone ? <Icone nome={icone} tam={tam * 1.05} cor={fantasma ? cor.suave : cor.acento} /> : null}
		{children}
	</div>
);

export type ItemPill = {rotulo: string; icone?: string; em: Ref};

/**
 * Faixa de pills que entram com spring no tempo falado (`em`) e ficam acesas
 * enquanto são o item atual. `ini` = frame absoluto do início da cena.
 * Dica de sound design: um grupo de pills leva no máximo UM efeito, nunca um por pill.
 */
export const FaixaPills: React.FC<{itens: ItemPill[]; ini: number; style?: React.CSSProperties; tam?: number}> = ({
	itens,
	ini,
	style,
	tam = px(30),
}) => {
	const frame = useCurrentFrame();
	const tempos = itens.map((i) => fr(i.em) - ini);
	return (
		<div style={{display: 'flex', flexWrap: 'wrap', gap: 16, ...style}}>
			{itens.map((it, i) => {
				const t = tempos[i] - 4;
				const p = mola(frame, t);
				const ativo = frame >= t && (i === itens.length - 1 || frame < tempos[i + 1] - 4);
				const brilho = ativo ? prog(frame, t, 8) : 0;
				return (
					<div
						key={`${it.rotulo}-${i}`}
						style={{
							opacity: frame < t ? 0 : Math.min(1, p * 1.5),
							transform: `translateY(${(1 - p) * 24}px) scale(${0.85 + 0.15 * p})`,
						}}
					>
						<Pill icone={it.icone} tam={tam} fantasma={brilho < 0.5} glow={brilho}>
							{it.rotulo}
						</Pill>
					</div>
				);
			})}
		</div>
	);
};
