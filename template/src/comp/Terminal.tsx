import React from 'react';
import {useCurrentFrame} from 'remotion';
import {cor, fonte, prog, px, revela} from '../theme';
import {fr, type Ref} from '../tempo';
import {Icone} from './Icone';

export type LinhaTerminal = {texto: string; em: Ref; tipo?: 'cmd' | 'saida' | 'ok'; icone?: string};

/** Digita `txt` a `cps` caracteres por frame a partir do frame `at`. */
export const digita = (frame: number, at: number, txt: string, cps = 2.2) =>
	txt.slice(0, Math.max(0, Math.floor((frame - at) * cps)));

/**
 * Janela de terminal: linhas digitadas no tempo da fala.
 * cmd = prompt com "›" na cor de acento; saida = texto suave; ok = passo com ícone e "ok" no fim.
 * O terminal é escuro também na variante clara (contraste de código).
 */
export const Terminal: React.FC<{
	linhas: LinhaTerminal[];
	ini: number;
	titulo?: string;
	style?: React.CSSProperties;
	tam?: number;
}> = ({linhas, ini, titulo = 'terminal', style, tam = px(32)}) => {
	const frame = useCurrentFrame();
	const fonteCodigo = '#F5F4F2';
	const suaveCodigo = '#A9A7A3';
	return (
		<div
			style={{
				background: cor.codigoFundo,
				borderRadius: 14,
				border: '1.5px solid rgba(255,255,255,.09)',
				boxShadow: `${cor.sombra}, inset 0 1px 0 rgba(255,255,255,.08)`,
				overflow: 'hidden',
				...revela(frame, 2, 46),
				...style,
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '16px 24px',
					borderBottom: '1px solid rgba(255,255,255,.09)',
					fontFamily: fonte.mono,
					fontSize: px(22),
					color: suaveCodigo,
				}}
			>
				<div style={{display: 'flex', gap: 10}}>
					{[0, 1, 2].map((i) => (
						<div key={i} style={{width: 14, height: 14, borderRadius: 99, background: 'rgba(255,255,255,.14)'}} />
					))}
				</div>
				<span>{titulo}</span>
				<Icone nome="terminal" tam={px(24)} cor={suaveCodigo} />
			</div>
			<div style={{padding: '26px 28px 30px', fontFamily: fonte.mono, fontSize: tam, lineHeight: 1.6, color: fonteCodigo}}>
				{linhas.map((l, i) => {
					const at = fr(l.em) - ini - 4;
					const p = prog(frame, at, 8);
					if (frame < at) return <div key={i} style={{height: tam * 1.6}} />;
					if (l.tipo === 'ok') {
						const feito = frame >= at + 12;
						return (
							<div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, opacity: p, transform: `translateX(${(1 - p) * -24}px)`}}>
								<Icone nome={l.icone ?? 'check'} tam={tam} cor={cor.acento} />
								<span>{digita(frame, at, l.texto, 3)}</span>
								<span style={{flex: 1}} />
								<span style={{color: feito ? cor.acentoClaro : suaveCodigo, fontSize: tam * 0.8}}>{feito ? 'ok' : '...'}</span>
							</div>
						);
					}
					return (
						<div key={i} style={{opacity: p, color: l.tipo === 'saida' ? suaveCodigo : fonteCodigo, whiteSpace: 'pre-wrap'}}>
							{l.tipo === 'saida' ? null : <span style={{color: cor.acento}}>› </span>}
							{digita(frame, at, l.texto)}
						</div>
					);
				})}
			</div>
		</div>
	);
};
