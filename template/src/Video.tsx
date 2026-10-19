import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FundoGrade} from './comp/FundoGrade';
import {Hud} from './comp/Hud';
import {LegendaCaixa, LegendaFantasma, Legendas, VeuLegenda} from './comp/Legendas';
import type {PosLegenda} from './comp/Orador';
import {Cena, Wipe} from './comp/Transicoes';
import {BentoCena, CamadasCena, FraseCena, LetreiroCena, LinhaCena, RajadaCena, RecorteCena, TelaVivaCena} from './cenas/Kit';
import {Numeros} from './cenas/Numeros';
import {DueloCena, LetterboxCena, OradorCena} from './cenas/Orador';
import {CtaCena, Pills, TerminalCena} from './cenas/Outras';
import {PrintCena} from './cenas/PrintCena';
import {REGISTRO} from './cenas/registro';
import {TeaserCena, VoltaCena} from './cenas/Teaser';
import {Titulo} from './cenas/Titulo';
import {TIPOS_KIT, type CenaDef} from './cenas/tipos';
import cenasJson from './data/cenas.json';
import config from './data/config.json';
import {LEGENDA_ESTILO} from './theme';
import {fr, naBatida} from './tempo';

/*
 * Registro de tipos de cena. Para uma cena sob medida: crie src/cenas/MinhaCena.tsx
 * recebendo PropsCena, adicione o tipo em cenas/tipos.ts e registre aqui.
 */
Object.assign(REGISTRO, {
	// estilo padrão
	frase: FraseCena,
	telaViva: TelaVivaCena,
	camadas: CamadasCena,
	bento: BentoCena,
	letreiro: LetreiroCena,
	linha: LinhaCena,
	recorte: RecorteCena,
	rajada: RajadaCena,
	// talking head
	orador: OradorCena,
	duelo: DueloCena,
	letterbox: LetterboxCena,
	// teaser (cold open) e volta ao começo
	teaser: TeaserCena,
	volta: VoltaCena,
	// clássicas (variante anterior)
	titulo: Titulo,
	numeros: Numeros,
	print: PrintCena,
	terminal: TerminalCena,
	pills: Pills,
	cta: CtaCena,
});

const CENAS = (cenasJson as unknown as {cenas: CenaDef[]}).cenas;
const SOBREPOE = 6; // frames de sobreposição entre cenas na transição "suave" (cross-fade com blur)

const suave = (c: CenaDef) => (c.transicao ? c.transicao === 'suave' : !TIPOS_KIT.has(c.tipo));

/** Posição padrão da legenda fantasma por tipo de cena. */
const POS_PADRAO: Record<string, PosLegenda> = {orador: 'rosto', recorte: 'rosto', duelo: 0.84, letterbox: 0.64, teaser: 'rosto', volta: 'oculta'};

/** Posição da legenda no frame (cena ativa; card do orador ativo vira "esquerda"; `legenda` da cena sobrescreve). */
const posLegenda = (c: CenaDef | undefined, frame: number): PosLegenda => {
	if (!c) return 'base';
	const sobre = (c as {sobre?: Array<{tipo: string; em: string | number}>}).sobre ?? [];
	if (sobre.some((x) => x.tipo === 'final' && frame >= fr(x.em) - 3)) return 'oculta'; // card final cobre a tela
	const card = (c as {card?: {em: string | number; ate?: string | number; legenda?: PosLegenda}}).card;
	if (card && frame >= fr(card.em) && (card.ate === undefined || frame < fr(card.ate))) return card.legenda ?? 'esquerda';
	if (Array.isArray(c.legenda)) {
		let pos: PosLegenda = POS_PADRAO[c.tipo] ?? 'base';
		for (const ch of c.legenda) if (frame >= fr(ch.em)) pos = ch.pos;
		return pos;
	}
	return c.legenda ?? POS_PADRAO[c.tipo] ?? 'base';
};

export const Video: React.FC = () => {
	const {durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();
	const inicios = CENAS.map((c, i) => (i === 0 ? 0 : naBatida(fr(c.inicio))));
	const ativa = CENAS[inicios.reduce((k, v, i) => (frame >= v ? i : k), 0)];
	return (
		<AbsoluteFill>
			<FundoGrade />
			{CENAS.map((c, i) => {
				const Comp = REGISTRO[c.tipo];
				if (!Comp) throw new Error(`tipo de cena desconhecido: ${c.tipo} (cena ${c.id})`);
				const entraSuave = i > 0 && suave(c);
				const saiSuave = i < CENAS.length - 1 && suave(CENAS[i + 1]);
				const from = entraSuave ? inicios[i] - SOBREPOE : inicios[i];
				const fim = i < CENAS.length - 1 ? inicios[i + 1] : durationInFrames;
				const dur = Math.max(1, fim - from);
				return (
					<Sequence key={c.id} from={from} durationInFrames={dur} name={c.id}>
						<Cena dur={dur} entra={entraSuave ? 12 : 1} sai={saiSuave ? 9 : 1}>
							<Comp def={c} ini={from} dur={dur} />
						</Cena>
					</Sequence>
				);
			})}
			{CENAS.map((c, i) =>
				c.wipe && i > 0 ? (
					<Sequence key={`wipe-${c.id}`} from={Math.max(0, inicios[i] - 10)} durationInFrames={18} name={`wipe-${c.id}`}>
						<Wipe />
					</Sequence>
				) : null,
			)}
			<Hud />
			{config.legendas ? (
				LEGENDA_ESTILO === 'fantasma' ? (
					<LegendaFantasma pos={posLegenda(ativa, frame)} />
				) : LEGENDA_ESTILO === 'caixa' ? (
					<LegendaCaixa />
				) : (
					<>
						<VeuLegenda />
						<Legendas />
					</>
				)
			) : null}
			{config.audio ? <Audio src={staticFile(config.audio)} /> : null}
		</AbsoluteFill>
	);
};
