import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {FundoGrade} from './comp/FundoGrade';
import {Legendas, VeuLegenda} from './comp/Legendas';
import {Cena, Wipe} from './comp/Transicoes';
import {Numeros} from './cenas/Numeros';
import {CtaCena, Pills, TerminalCena} from './cenas/Outras';
import {PrintCena} from './cenas/PrintCena';
import {Titulo} from './cenas/Titulo';
import type {CenaDef, PropsCena} from './cenas/tipos';
import cenasJson from './data/cenas.json';
import config from './data/config.json';
import {fr, naBatida} from './tempo';

/*
 * Registro de tipos de cena. Para uma cena sob medida: crie src/cenas/MinhaCena.tsx
 * recebendo PropsCena, adicione o tipo em cenas/tipos.ts e registre aqui.
 */
const REGISTRO: Record<string, React.FC<PropsCena<any>>> = {
	titulo: Titulo,
	numeros: Numeros,
	print: PrintCena,
	terminal: TerminalCena,
	pills: Pills,
	cta: CtaCena,
};

const CENAS = (cenasJson as unknown as {cenas: CenaDef[]}).cenas;
const SOBREPOE = 6; // frames de sobreposição entre cenas (cross-fade com blur)

export const Video: React.FC = () => {
	const {durationInFrames} = useVideoConfig();
	const inicios = CENAS.map((c, i) => (i === 0 ? 0 : naBatida(fr(c.inicio))));
	return (
		<AbsoluteFill>
			<FundoGrade />
			{CENAS.map((c, i) => {
				const Comp = REGISTRO[c.tipo];
				if (!Comp) throw new Error(`tipo de cena desconhecido: ${c.tipo} (cena ${c.id})`);
				const from = i === 0 ? 0 : inicios[i] - SOBREPOE;
				const fim = i < CENAS.length - 1 ? inicios[i + 1] : durationInFrames;
				const dur = Math.max(1, fim - from);
				return (
					<Sequence key={c.id} from={from} durationInFrames={dur} name={c.id}>
						<Cena dur={dur} entra={i === 0 ? 1 : 12} sai={i === CENAS.length - 1 ? 1 : 9}>
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
			{config.legendas ? (
				<>
					<VeuLegenda />
					<Legendas />
				</>
			) : null}
			{config.audio ? <Audio src={staticFile(config.audio)} /> : null}
		</AbsoluteFill>
	);
};
