import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Camadas3D} from '../comp/Camadas3D';
import {Letreiro, LinhaSVG} from '../comp/Efeitos';
import {GradeBento} from '../comp/GradeBento';
import {Palco} from '../comp/Palco';
import {Recorte} from '../comp/Recorte';
import {TelaViva} from '../comp/TelaViva';
import {RotuloMono, TextoMisto} from '../comp/Tipografia';
import {AREA, cor, fmt, H, papel, px, W} from '../theme';
import {f, fr, ms} from '../tempo';
import {REGISTRO} from './registro';
import type {
	BaseKit,
	CenaBento,
	CenaCamadas,
	CenaFrase,
	CenaLetreiro,
	CenaLinha,
	CenaRajada,
	CenaRecorte,
	CenaTelaViva,
	LinhaFrase,
	PropsCena,
} from './tipos';

/*
 * Cenas do estilo padrão. Todas passam pelo Palco (câmera, carimbos, flash, tremor, motion blur)
 * e ocupam a área útil (AREA: abaixo do HUD, acima da legenda em caixa).
 */

const PalcoDe: React.FC<{def: BaseKit; ini: number; children: React.ReactNode; origem?: [number, number]}> = ({def, ini, children, origem}) => (
	<Palco ini={ini} camera={def.camera} cameraInicial={def.cameraInicial} carimbos={def.carimbos} motionBlur={def.motionBlur} origem={origem}>
		{children}
	</Palco>
);

/** Frame local de uma Ref (ou `padrao` se ausente). */
const local = (ref: number | string | undefined, ini: number, padrao: number) => (ref !== undefined ? Math.max(0, fr(ref) - ini - 4) : padrao);

/** Linha de frase: texto misto ou número que conta (count-up ease-out 30-45 frames). */
const Linha: React.FC<{l: LinhaFrase; at: number; ini: number; alinhar: 'center' | 'left'}> = ({l, at, ini, alinhar}) => {
	const frame = useCurrentFrame();
	const tam = px(l.papel === 'estreita' ? 190 : l.papel === 'numero' || l.numero ? 150 : 112) * (l.tam ?? 1);
	if (l.numero) {
		const n = l.numero;
		const t1 = n.ateEm !== undefined ? fr(n.ateEm) - ini : at + 36;
		const v = interpolate(frame, [at, Math.max(at + 1, t1)], [n.de ?? 0, n.valor], {
			easing: Easing.out(Easing.cubic),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});
		const texto = `${n.prefixo ?? ''}${fmt(v, n.casas ?? 0)}${n.sufixo ?? ''}`;
		return <TextoMisto texto={`*${texto}*`} at={at} papel="numero" tam={tam} entrada="mascara" alinhar={alinhar} brilho />;
	}
	return (
		<TextoMisto
			texto={l.texto ?? ''}
			at={at}
			papel={l.papel ?? 'frase'}
			tam={tam}
			entrada={l.entrada ?? (l.papel === 'estreita' || l.papel === 'numero' ? 'mascara' : 'palavra')}
			alinhar={alinhar}
			gradiente={l.gradiente ?? (l.papel === 'estreita' || l.papel === 'numero')}
			brilho={l.brilho}
		/>
	);
};

/** Bloco de rótulo mono + linhas (hierarquia: rótulo pequeno espaçado em cima, palavra grande embaixo). */
export const BlocoFrase: React.FC<{
	rotulo?: string;
	rotuloEm?: number | string;
	linhas: LinhaFrase[];
	ini: number;
	alinhar?: 'centro' | 'esquerda';
	style?: React.CSSProperties;
}> = ({rotulo, rotuloEm, linhas, ini, alinhar = 'centro', style}) => {
	const al = alinhar === 'centro' ? 'center' : 'left';
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: al === 'center' ? 'center' : 'flex-start', gap: px(10), ...style}}>
			{rotulo ? (
				<RotuloMono at={local(rotuloEm, ini, 1)} style={{marginBottom: px(10)}}>
					{rotulo}
				</RotuloMono>
			) : null}
			{linhas.map((l, i) => (
				<Linha key={i} l={l} at={local(l.em, ini, 2 + i * 5)} ini={ini} alinhar={al} />
			))}
		</div>
	);
};

/** frase: tipografia em papéis (rótulo mono + frase/número/estreita + palavra emocional). */
export const FraseCena: React.FC<PropsCena<CenaFrase>> = ({def, ini}) => (
	<PalcoDe def={def} ini={ini}>
		<div
			style={{
				position: 'absolute',
				left: AREA.lado,
				right: AREA.lado,
				top: AREA.topo,
				height: AREA.altura,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: def.vertical === 'topo' ? 'flex-start' : 'center',
			}}
		>
			<BlocoFrase rotulo={def.rotulo} rotuloEm={def.rotuloEm} linhas={def.linhas} ini={ini} alinhar={def.alinhar} />
		</div>
	</PalcoDe>
);

/** telaViva: janela de app inventada com estados ligados à fala (+ título opcional acima). */
export const TelaVivaCena: React.FC<PropsCena<CenaTelaViva>> = ({def, ini}) => (
	<PalcoDe def={def} ini={ini}>
		<div style={{position: 'absolute', left: AREA.lado, right: AREA.lado, top: AREA.topo, height: AREA.altura, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: px(34)}}>
			{def.titulo ? <BlocoFrase rotulo={def.rotulo} linhas={[{texto: def.titulo, tam: 0.7}]} ini={ini} /> : null}
			<TelaViva def={def.tela} ini={ini} largura={AREA.largura} />
		</div>
	</PalcoDe>
);

/** camadas: anatomia em camadas 3D que explodem e se juntam. */
export const CamadasCena: React.FC<PropsCena<CenaCamadas>> = ({def, ini}) => (
	<PalcoDe def={def} ini={ini}>
		{def.titulo ? (
			<div style={{position: 'absolute', left: AREA.lado, right: AREA.lado, top: AREA.topo}}>
				<BlocoFrase rotulo={def.rotulo} linhas={[{texto: def.titulo, tam: 0.62}]} ini={ini} />
			</div>
		) : null}
		<Camadas3D def={def} ini={ini} titulo={Boolean(def.titulo)} />
	</PalcoDe>
);

/** bento: grade de cards com halo; com `encaixe` + câmera, o tile chega cheio e a câmera revela o grid. */
export const BentoCena: React.FC<PropsCena<CenaBento>> = ({def, ini}) => (
	<PalcoDe def={def} ini={ini}>
		<GradeBento def={def} ini={ini} />
	</PalcoDe>
);

/** letreiro: duas linhas gigantes em sentidos opostos (uma em contorno) + frase opcional na frente. */
export const LetreiroCena: React.FC<PropsCena<CenaLetreiro>> = ({def, ini}) => {
	const tam = px(170) * (def.tam ?? 1);
	return (
		<PalcoDe def={def} ini={ini}>
			<Letreiro texto={def.texto} texto2={def.texto2} y={AREA.topo + AREA.altura / 2 - tam * 1.15} tam={tam} at={local(def.em, ini, 0)} velocidade={def.velocidade} />
			{def.linhas?.length ? (
				<div style={{position: 'absolute', left: AREA.lado, right: AREA.lado, top: AREA.topo + AREA.altura / 2 + tam * 1.35}}>
					<BlocoFrase linhas={def.linhas} ini={ini} />
				</div>
			) : null}
		</PalcoDe>
	);
};

/** linha: batimento (ECG) que pode virar reta, linha reta, ou rachadura; com frase opcional. */
export const LinhaCena: React.FC<PropsCena<CenaLinha>> = ({def, ini}) => {
	const at = local(def.em, ini, 0);
	const plana = def.planaEm !== undefined ? fr(def.planaEm) - ini : undefined;
	const meio = AREA.topo + AREA.altura * (def.linhas?.length ? 0.36 : 0.5);
	const frame = useCurrentFrame();
	return (
		<PalcoDe def={def} ini={ini}>
			<div style={{position: 'absolute', left: 0, top: meio - px(130)}}>
				<LinhaSVG forma={def.forma} at={at} dur={def.forma === 'rachadura' ? 3 : 30} planaEm={plana} cor={def.cor} largura={W} altura={px(260)} />
			</div>
			{def.rotuloLinha ? (
				<div
					style={{
						position: 'absolute',
						right: AREA.lado,
						top: meio - px(190),
						...papel.rotulo,
						fontSize: px(30),
						color: plana !== undefined && frame >= plana ? cor.problemaTexto : cor.acentoTexto,
					}}
				>
					{plana !== undefined && frame >= plana ? def.rotuloLinha.depois ?? def.rotuloLinha.antes : def.rotuloLinha.antes}
				</div>
			) : null}
			{def.linhas?.length ? (
				<div style={{position: 'absolute', left: AREA.lado, right: AREA.lado, top: meio + px(170)}}>
					<BlocoFrase rotulo={def.rotulo} linhas={def.linhas} ini={ini} />
				</div>
			) : null}
		</PalcoDe>
	);
};

/** recorte / orador: apresentador filmado, com texto e letreiro ATRÁS da pessoa. */
export const RecorteCena: React.FC<PropsCena<CenaRecorte>> = ({def, ini}) => {
	const tam = px(170);
	const atras = (
		<>
			{def.letreiro ? <Letreiro texto={def.letreiro.texto} texto2={def.letreiro.texto2} y={AREA.topo} tam={tam} at={local(def.letreiro.em, ini, 0)} /> : null}
			{def.linhas?.length ? (
				<div style={{position: 'absolute', left: AREA.lado, right: AREA.lado, top: def.letreiro ? AREA.topo + tam * 2.45 : AREA.topo + px(20)}}>
					<BlocoFrase rotulo={def.rotulo} linhas={def.linhas} ini={ini} />
				</div>
			) : null}
		</>
	);
	return (
		<PalcoDe def={def} ini={ini} origem={[W / 2, H * 0.4]}>
			<Recorte video={def.video} recorte={def.recorte} de={def.de ?? ini} deRecorte={def.deRecorte} zoom={def.zoom} atras={atras} />
		</PalcoDe>
	);
};

/**
 * rajada: planos curtos em corte seco (~0,7 s cada) para os picos da fala. Cada plano é uma
 * cena de qualquer tipo registrado, sem `id`/`inicio`; começa no seu `em` ou a cada `passo_ms`.
 */
export const RajadaCena: React.FC<PropsCena<CenaRajada>> = ({def, ini, dur}) => {
	const passo = f(def.passo_ms ?? 700);
	const inicios = def.planos.map((p, i) => (p.em !== undefined ? Math.max(0, fr(p.em) - ini) : i * passo));
	return (
		<AbsoluteFill>
			{def.planos.map((p, i) => {
				const Comp = REGISTRO[p.tipo];
				if (!Comp) throw new Error(`rajada ${def.id}: tipo desconhecido ${p.tipo}`);
				const de = inicios[i];
				const ate = i < def.planos.length - 1 ? inicios[i + 1] : dur;
				const d = Math.max(1, ate - de);
				return (
					<Sequence key={i} from={de} durationInFrames={d} name={`${def.id}-${i + 1}`}>
						<Comp def={{...p, id: `${def.id}-${i + 1}`, inicio: ms(0)} as never} ini={ini + de} dur={d} />
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};
