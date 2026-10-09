import React from 'react';
import {getStaticFiles, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import printsJson from '../data/prints.json';
import {alfa, cor, fonte, mola, prog, suaviza2} from '../theme';
import {fr, type Ref} from '../tempo';
import {Cursor} from './Cursor';
import {Icone} from './Icone';

type Regiao = [number, number, number, number];
type Zoom = {em: Ref; regiao: number[]; destaque?: boolean};
export type Plano = {
	arquivo: string;
	desde: Ref | 'inicio';
	titulo?: string;
	vista?: number[];
	zooms?: Zoom[];
	aspecto?: number; // largura/altura do PNG (padrão 1,6 = 3200x2000)
	ocultar?: number[][]; // regiões borradas no vídeo (reforço; o PNG já deve vir borrado)
	tampar?: number[][]; // regiões cobertas por card opaco
	clique?: {em: Ref; ponto: number[]};
};
type Janela = {titulo?: string; planos: Plano[]};

const PRINTS = printsJson as unknown as Record<string, Janela>;
const TRANS = 20; // frames de movimento de câmera

const existe = (arquivo: string) => getStaticFiles().some((f) => f.name === `prints/${arquivo}`);

/** Região -> enquadramento [x, y, L, Lh] respeitando a proporção do viewport. */
const enquadra = (r: number[] | undefined, a: number, A: number): Regiao => {
	const [x, y, w, h] = r ?? [0, 0, 1, 1];
	const L = Math.min(1, Math.max(w, (h * A) / a) * (r ? 1.1 : 1));
	const Lh = (L * a) / A;
	const cx = x + w / 2;
	const cy = y + h / 2;
	const nx = Math.min(1 - L, Math.max(0, cx - L / 2));
	const ny = Lh >= 1 ? (1 - Lh) / 2 : Math.min(1 - Lh, Math.max(0, cy - Lh / 2));
	return [nx, ny, L, Lh];
};

const mistura = (a: Regiao, b: Regiao, p: number): Regiao => [
	a[0] + (b[0] - a[0]) * p,
	a[1] + (b[1] - a[1]) * p,
	a[2] + (b[2] - a[2]) * p,
	a[3] + (b[3] - a[3]) * p,
];

/** Um plano: PNG com câmera (zoom por tempo falado), Ken Burns lento, contorno de destaque e cursor. */
const PlanoPrint: React.FC<{plano: Plano; ini: number; t0: number; VW: number; VH: number}> = ({plano, ini, t0, VW, VH}) => {
	const frame = useCurrentFrame();
	const A = VW / VH;
	const a = plano.aspecto ?? 1.6;
	const chaves: Array<{t: number; v: Regiao; z?: Zoom}> = [{t: t0, v: enquadra(plano.vista, a, A)}];
	for (const z of plano.zooms ?? []) chaves.push({t: fr(z.em) - ini - 6, v: enquadra(z.regiao, a, A), z});
	let v = chaves[0].v;
	let zAtivo: Zoom | undefined;
	let tAtivo = t0;
	for (let i = 1; i < chaves.length; i++) {
		const c = chaves[i];
		if (frame >= c.t) {
			v = mistura(v, c.v, prog(frame, c.t, TRANS, suaviza2));
			zAtivo = c.z;
			tAtivo = c.t;
		}
	}
	// Ken Burns: aproximação lenta e contínua em torno do centro do enquadramento
	const kb = 1 + 0.035 * Math.min(1, Math.max(0, frame - tAtivo) / 150);
	const L = v[2] / kb;
	const Lh = v[3] / kb;
	const cx = v[0] + v[2] / 2;
	const cy = v[1] + v[3] / 2;
	const vx = Math.min(1 - L, Math.max(0, cx - L / 2));
	const vy = Lh >= 1 ? (1 - Lh) / 2 : Math.min(1 - Lh, Math.max(0, cy - Lh / 2));
	const iw = VW / L;
	const ih = iw / a;
	const left = -vx * iw;
	const top = -vy * ih;
	const realce = zAtivo?.destaque ? prog(frame, tAtivo + 8, 12) : 0;

	let cursor: React.ReactNode = null;
	if (plano.clique) {
		const tc = fr(plano.clique.em) - ini;
		const px = left + plano.clique.ponto[0] * iw;
		const py = top + plano.clique.ponto[1] * ih;
		const mov = interpolate(frame, [tc - 14, tc + 2], [0, 1], {easing: suaviza2, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
		const cl = interpolate(frame, [tc + 2, tc + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
		cursor = (
			<Cursor
				x={interpolate(mov, [0, 1], [VW - 60, px])}
				y={interpolate(mov, [0, 1], [VH - 40, py])}
				clique={cl}
				visivel={prog(frame, tc - 16, 6)}
			/>
		);
	}

	return (
		<div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: cor.codigoFundo}}>
			{existe(plano.arquivo) ? (
				<Img src={staticFile(`prints/${plano.arquivo}`)} style={{position: 'absolute', left, top, width: iw, height: ih}} />
			) : (
				<div
					style={{
						position: 'absolute',
						inset: 0,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 16,
						border: `2px dashed ${cor.linhaAcento}`,
						fontFamily: fonte.mono,
						color: '#A9A7A3',
						fontSize: 30,
					}}
				>
					<Icone nome="layout" tam={64} cor={cor.acento} />
					<div>print pendente</div>
					<div style={{color: cor.acentoClaro}}>public/prints/{plano.arquivo}</div>
				</div>
			)}
			{(plano.ocultar ?? []).map((o, i) => (
				<div
					key={`o${i}`}
					style={{
						position: 'absolute',
						left: left + o[0] * iw - 4,
						top: top + o[1] * ih - 4,
						width: o[2] * iw + 8,
						height: o[3] * ih + 8,
						borderRadius: 8,
						backdropFilter: 'blur(14px)',
						background: 'rgba(40,38,40,.55)',
					}}
				/>
			))}
			{(plano.tampar ?? []).map((o, i) => (
				<div
					key={`t${i}`}
					style={{
						position: 'absolute',
						left: left + o[0] * iw,
						top: top + o[1] * ih,
						width: o[2] * iw,
						height: o[3] * ih,
						borderRadius: 10,
						background: cor.vidroOpaco,
						border: `1px solid ${cor.linha}`,
					}}
				/>
			))}
			{zAtivo?.destaque && realce > 0 ? (
				<div
					style={{
						position: 'absolute',
						left: left + zAtivo.regiao[0] * iw - 6,
						top: top + zAtivo.regiao[1] * ih - 6,
						width: zAtivo.regiao[2] * iw + 12,
						height: zAtivo.regiao[3] * ih + 12,
						borderRadius: 14,
						border: `3px solid ${cor.acento}`,
						boxShadow: `0 0 0 2000px rgba(10,10,11,${0.28 * realce}), 0 0 28px ${alfa(cor.acento, 0.55)}`,
						opacity: realce,
					}}
				/>
			) : null}
			{cursor}
		</div>
	);
};

/**
 * Janela de print: card de vidro com barra de janela, entra com spring, troca de plano
 * com blur curto. `janela` indexa src/data/prints.json. `ini` = frame absoluto do início da cena.
 * `largura` em px; altura do viewport = largura / `proporcao` (padrão 16:10).
 */
export const Print: React.FC<{
	janela: string;
	ini: number;
	largura: number;
	proporcao?: number;
	style?: React.CSSProperties;
	entra?: number;
}> = ({janela, ini, largura, proporcao = 1.6, style, entra = 4}) => {
	const frame = useCurrentFrame();
	const VW = largura;
	const VH = Math.round(largura / proporcao);
	const def = PRINTS[janela];
	const planos = def?.planos ?? [];
	const tPlano = (p: Plano) => (p.desde === 'inicio' ? 0 : fr(p.desde) - ini - 8);
	let atual = 0;
	planos.forEach((p, i) => {
		if (frame >= tPlano(p)) atual = i;
	});
	const pEntra = mola(frame, entra, {damping: 16, stiffness: 120});
	const plano = planos[atual];
	const t0 = plano ? tPlano(plano) : 0;
	const troca = atual > 0 ? prog(frame, t0, 14) : 1;

	return (
		<div
			style={{
				width: VW,
				opacity: Math.min(1, pEntra * 1.4),
				transform: `translateY(${(1 - pEntra) * 70}px) scale(${0.92 + 0.08 * pEntra})`,
				transformOrigin: '50% 0%',
				...style,
			}}
		>
			<div
				style={{
					borderRadius: 20,
					border: `1.5px solid ${cor.linhaAcento}`,
					background: cor.vidro,
					backdropFilter: 'blur(12px)',
					boxShadow: `${cor.sombra}, inset 0 1px 0 ${cor.brilhoInterno}, 0 0 50px ${alfa(cor.acento, 0.14)}`,
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						height: 50,
						display: 'flex',
						alignItems: 'center',
						gap: 10,
						padding: '0 20px',
						borderBottom: `1px solid ${cor.linha}`,
						background: cor.vidroOpaco,
					}}
				>
					{[0, 1, 2].map((i) => (
						<div key={i} style={{width: 13, height: 13, borderRadius: 99, background: cor.linha}} />
					))}
					<div style={{flex: 1, textAlign: 'center', fontFamily: fonte.mono, fontSize: 21, color: cor.suave, marginRight: 60}}>
						{plano?.titulo ?? def?.titulo ?? ''}
					</div>
				</div>
				<div style={{position: 'relative', width: VW, height: VH, overflow: 'hidden'}}>
					{plano ? (
						<div
							style={{
								position: 'absolute',
								inset: 0,
								opacity: troca,
								filter: troca < 0.98 ? `blur(${(1 - troca) * 12}px)` : undefined,
								transform: `scale(${0.96 + 0.04 * troca})`,
							}}
						>
							<PlanoPrint plano={plano} ini={ini} t0={t0} VW={VW} VH={VH} />
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};
