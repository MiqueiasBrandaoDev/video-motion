import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {FundoGrade} from './comp/FundoGrade';
import {Hud} from './comp/Hud';
import {LegendaCaixa, Legendas, VeuLegenda} from './comp/Legendas';
import {Cena, Wipe} from './comp/Transicoes';
import {BentoCena, CamadasCena, FraseCena, LetreiroCena, LinhaCena, RajadaCena, RecorteCena, TelaVivaCena} from './cenas/Kit';
import {Numeros} from './cenas/Numeros';
import {CtaCena, Pills, TerminalCena} from './cenas/Outras';
import {PrintCena} from './cenas/PrintCena';
import {REGISTRO} from './cenas/registro';
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
	orador: RecorteCena,
	rajada: RajadaCena,
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

export const Video: React.FC = () => {
	const {durationInFrames} = useVideoConfig();
	const inicios = CENAS.map((c, i) => (i === 0 ? 0 : naBatida(fr(c.inicio))));
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
				LEGENDA_ESTILO === 'caixa' ? (
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
