import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alfa, AREA, cor, corDe, entraUI, papel, prog, px, VARIANTE, W} from '../theme';
import {fr, type Ref} from '../tempo';
import {Encaixe, progEncaixe} from './Encaixe';
import {Icone} from './Icone';

/*
 * CardHalo: card com halo radial colorido atrás do ícone, borda luminosa (box-shadow colorido +
 * borda semitransparente) e rótulo em caixa alta. GradeBento: grade de CardHalo com stagger,
 * conectores pontilhados entre vizinhos e, opcionalmente, um tile que chega por encaixe
 * (começa ocupando a área inteira e encolhe até o slot) para a câmera "se afastar" e revelar o grid.
 */

export const CardHalo: React.FC<{
	rotulo: string;
	icone?: string;
	sub?: string;
	cor?: string;
	aceso?: number;
	tam?: number;
	style?: React.CSSProperties;
}> = ({rotulo, icone, sub, cor: nomeCor, aceso = 1, tam = 1, style}) => {
	const c = corDe(nomeCor);
	const escura = VARIANTE === 'escura';
	return (
		<div
			style={{
				position: 'relative',
				width: '100%',
				height: '100%',
				borderRadius: px(26),
				overflow: 'hidden',
				background: escura ? `linear-gradient(180deg, ${alfa(c, 0.06)}, ${cor.superficie} 70%)` : cor.superficie,
				border: `2px solid ${alfa(c, 0.35 + 0.45 * aceso)}`,
				boxShadow: `0 0 ${10 + 14 * aceso}px ${alfa(c, (escura ? 0.35 : 0.22) * aceso)}, inset 0 0 ${30 * aceso}px ${alfa(c, 0.1 * aceso)}`,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: px(18) * tam,
				...style,
			}}
		>
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: '42%',
					width: '130%',
					height: '110%',
					transform: 'translate(-50%, -50%)',
					background: `radial-gradient(closest-side, ${alfa(c, (escura ? 0.38 : 0.2) * aceso)}, transparent)`,
					filter: 'blur(14px)',
				}}
			/>
			{icone ? (
				<Icone
					nome={icone}
					tam={px(84) * tam}
					cor={c}
					espessura={1.6}
					style={{position: 'relative', filter: `drop-shadow(0 0 ${10 * aceso}px ${alfa(c, 0.8)})`}}
				/>
			) : null}
			<div style={{position: 'relative', ...papel.frase, fontSize: px(34) * tam, letterSpacing: '-.01em', textTransform: 'uppercase', color: cor.texto, textAlign: 'center', lineHeight: 1.05, padding: `0 ${px(10)}px`}}>
				{rotulo}
			</div>
			{sub ? <div style={{position: 'relative', ...papel.rotulo, fontSize: px(18) * tam, color: cor.apagado, letterSpacing: '.16em'}}>{sub}</div> : null}
		</div>
	);
};

export type DefTile = {rotulo: string; icone?: string; sub?: string; cor?: string; largo?: boolean; em?: Ref};
export type DefGradeBento = {
	tiles: DefTile[];
	colunas?: number;
	conectores?: boolean;
	encaixe?: {tile: number; em?: Ref};
	acende?: Array<{tile: number; em: Ref}>;
};

type Celula = {x: number; y: number; w: number; h: number; col: number; lin: number; span: number};

/** Layout linha a linha (tile `largo` ocupa 2 colunas), centralizado na área útil. */
export const layoutBento = (tiles: DefTile[], colunas: number, largura: number, alturaMax: number) => {
	const gap = px(26);
	const cw = (largura - gap * (colunas - 1)) / colunas;
	const cels: Celula[] = [];
	let col = 0;
	let lin = 0;
	for (const t of tiles) {
		const span = t.largo ? Math.min(2, colunas) : 1;
		if (col + span > colunas) {
			col = 0;
			lin++;
		}
		cels.push({x: col * (cw + gap), y: 0, w: span * cw + (span - 1) * gap, h: 0, col, lin, span});
		col += span;
	}
	const linhas = lin + 1;
	const ch = Math.min(cw * 0.95, (alturaMax - gap * (linhas - 1)) / linhas);
	cels.forEach((c) => {
		c.y = c.lin * (ch + gap);
		c.h = ch;
	});
	return {cels, gap, altura: linhas * ch + (linhas - 1) * gap};
};

const Conector: React.FC<{x: number; y: number; vertical: boolean; c: string; vis: number}> = ({x, y, vertical, c, vis}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: vertical ? 'column' : 'row', gap: px(6), opacity: vis}}>
		{[0, 1].map((i) => (
			<div key={i} style={{width: px(10), height: px(10), borderRadius: 99, background: c, boxShadow: `0 0 10px ${c}`}} />
		))}
	</div>
);

export const GradeBento: React.FC<{def: DefGradeBento; ini: number}> = ({def, ini}) => {
	const frame = useCurrentFrame();
	const colunas = def.colunas ?? 3;
	const largura = AREA.largura;
	const {cels, gap, altura} = layoutBento(def.tiles, colunas, largura, AREA.altura);
	const x0 = (W - largura) / 2;
	const y0 = AREA.topo + (AREA.altura - altura) / 2;
	const c = corDe('acento');
	const enc = def.encaixe;
	const tEnc = enc ? (enc.em !== undefined ? fr(enc.em) - ini : 8) : -1;
	// os demais tiles entram 2 frames depois do encaixe começar
	const base = enc ? tEnc + 2 : 2;
	const tAcende = (i: number) => {
		const a = def.acende?.filter((x) => x.tile === i).map((x) => fr(x.em) - ini) ?? [];
		return a.length ? a : null;
	};

	return (
		<div style={{position: 'absolute', inset: 0}}>
			{def.conectores !== false
				? cels.flatMap((a, i) =>
						cels.map((b, j) => {
							if (j <= i) return null;
							const vis = prog(frame, base + Math.max(i, j) * 3 + 4, 8);
							if (a.lin === b.lin && a.col + a.span === b.col)
								return <Conector key={`${i}-${j}`} x={x0 + a.x + a.w + gap / 2} y={y0 + a.y + a.h / 2} vertical={false} c={c} vis={vis} />;
							if (b.lin === a.lin + 1 && a.col === b.col)
								return <Conector key={`${i}-${j}`} x={x0 + a.x + Math.min(a.w, b.w) / 2} y={y0 + a.y + a.h + gap / 2} vertical c={c} vis={vis} />;
							return null;
						}),
					)
				: null}
			{def.tiles.map((t, i) => {
				const cel = cels[i];
				const ac = tAcende(i);
				const aceso = ac ? Math.max(0.35, ...ac.map((ta) => (frame >= ta ? 1 : 0.35))) : 1;
				const pulso = ac ? Math.max(0, ...ac.map((ta) => (frame >= ta && frame < ta + 12 ? 1 - (frame - ta) / 12 : 0))) : 0;
				if (enc && enc.tile === i) {
					const para = {x: x0 + cel.x, y: y0 + cel.y, w: cel.w, h: cel.h, raio: px(26)};
					const de = {x: AREA.lado, y: AREA.topo, w: AREA.largura, h: AREA.altura, raio: px(40)};
					const p = progEncaixe(frame, tEnc, 8);
					return (
						<Encaixe key={i} de={de} para={para} at={tEnc} dur={8}>
							<CardHalo rotulo={t.rotulo} icone={t.icone} sub={t.sub} cor={t.cor} aceso={1 - 0.2 * p + pulso * 0.3} />
						</Encaixe>
					);
				}
				const at = t.em !== undefined ? fr(t.em) - ini : base + i * 3;
				return (
					<div key={i} style={{position: 'absolute', left: x0 + cel.x, top: y0 + cel.y, width: cel.w, height: cel.h, ...entraUI(frame, at, 24)}}>
						<CardHalo rotulo={t.rotulo} icone={t.icone} sub={t.sub} cor={t.cor} aceso={Math.min(1.3, aceso + pulso * 0.5)} style={{transform: `scale(${1 + 0.04 * pulso})`}} />
					</div>
				);
			})}
		</div>
	);
};
