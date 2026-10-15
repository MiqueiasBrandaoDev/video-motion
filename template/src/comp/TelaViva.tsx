import React from 'react';
import {interpolate, spring, useCurrentFrame, Easing} from 'remotion';
import {alfa, brilho, cor, corDe, corTextoDe, entraUI, fmt, FPS, MOLAS, molaKit, papel, prog, px, VARIANTE} from '../theme';
import {fr, type Ref} from '../tempo';
import {Icone} from './Icone';
import {CamadaVideo, type Enquadramento} from './Orador';

/*
 * TelaViva: janela de app inventada, desenhada em código, cujos estados mudam no tempo da fala.
 * Não é print: é a versão simplificada e legível do que o produto faz (lista, painel, CRM,
 * checklist, timeline, fluxo, kanban, prompt digitando). Cada bloco entra com stagger e
 * cada estado muda num `em` (marco da fala).
 * Entrada da janela: spring {damping 200} em 6 frames (opacidade, escala .94 -> 1, sobe 20 px, blur 6 -> 0).
 */

export type Status = 'ok' | 'erro' | 'aviso' | 'neutro' | 'carregando';
export type EstadoItem = {em: Ref; status?: Status; texto?: string};
export type ItemLista = {titulo: string; sub?: string; avatar?: string; icone?: string; badge?: string; status?: Status; estados?: EstadoItem[]};

export type BlocoTela =
	| {tipo: 'lista'; rotulo?: string; itens: ItemLista[]}
	| {tipo: 'checklist'; rotulo?: string; itens: Array<{texto: string; em: Ref}>}
	| {tipo: 'contador'; rotulo: string; de?: number; ate: number; em: Ref; ateEm?: Ref; prefixo?: string; sufixo?: string; casas?: number; cor?: string}
	| {tipo: 'toggles'; rotulo?: string; itens: Array<{texto: string; ligado?: boolean; em?: Ref}>}
	| {tipo: 'timeline'; rotulo?: string; trilhas: Array<{rotulo: string; blocos: number[][]; cor?: string}>; em: Ref; ateEm?: Ref}
	| {tipo: 'fluxo'; rotulo?: string; nos: Array<{texto: string; icone?: string; em: Ref; decisao?: boolean}>}
	| {tipo: 'kanban'; colunas: string[]; card: {texto: string; avatar?: string}; passos: Array<{em: Ref; coluna: number}>}
	| {tipo: 'prompt'; rotulo?: string; texto: string; em: Ref; cps?: number}
	| {tipo: 'chat'; rotulo?: string; mensagens: Array<{texto: string; em: Ref; ok?: string; icone?: string}>; cps?: number}
	| {tipo: 'video'; rotulo?: string; arquivo?: string; proporcao?: number; altura?: number; enquadramento?: Enquadramento; status?: string}
	| {tipo: 'colunas'; blocos: BlocoTela[]; pesos?: number[]};

export type DefTelaViva = {
	titulo: string;
	status?: {texto: string; final?: {texto: string; em: Ref; status?: Status}};
	blocos: BlocoTela[];
	alerta?: {em: Ref; cor?: string};
	inclinar?: boolean;
	/** Entra girada em 3D e endireita: rotateY 28° -> 0 (e rotateX 6° -> 0) em 18 frames, spring {damping 200, mass 1.2}. */
	perspectiva?: {em?: Ref; rotY?: number; rotX?: number};
};

const corStatus = (s?: Status) =>
	s === 'ok' ? corDe('solucao') : s === 'erro' ? corDe('problema') : s === 'aviso' ? corDe('acento2') : corDe('neutro');

const T = {
	titulo: px(40),
	sub: px(26),
	rotulo: px(21),
};

/** Último estado já disparado de um item. */
const estadoAtual = (frame: number, ini: number, it: ItemLista) => {
	let st: {status?: Status; texto?: string; t: number} = {status: it.status, texto: it.badge, t: -999};
	for (const e of it.estados ?? []) {
		const t = fr(e.em) - ini;
		if (frame >= t) st = {status: e.status ?? st.status, texto: e.texto ?? st.texto, t};
	}
	return st;
};

const RotuloBloco: React.FC<{children: React.ReactNode}> = ({children}) => (
	<div style={{...papel.rotulo, fontSize: T.rotulo, color: cor.apagado, letterSpacing: '.24em', marginBottom: px(14)}}>{children}</div>
);

/** Badge de status com pop (spring damping 14, stiffness 220, mass .6) na troca. */
const Badge: React.FC<{texto: string; status?: Status; t: number}> = ({texto, status, t}) => {
	const frame = useCurrentFrame();
	const p = t > -999 ? molaKit(frame, t, 'pop') : 1;
	const c = corStatus(status);
	return (
		<div
			style={{
				...papel.rotulo,
				fontSize: px(19),
				letterSpacing: '.16em',
				padding: `${px(8)}px ${px(14)}px`,
				borderRadius: 999,
				border: `1.5px solid ${alfa(c, 0.75)}`,
				color: VARIANTE === 'escura' ? c : corTextoDe(c),
				background: alfa(c, 0.1),
				boxShadow: status && status !== 'neutro' ? `0 0 14px ${alfa(c, 0.35)}` : undefined,
				transform: `scale(${0.8 + 0.2 * p})`,
				whiteSpace: 'nowrap',
			}}
		>
			{texto}
		</div>
	);
};

const Avatar: React.FC<{letra: string; c: string; tam?: number}> = ({letra, c, tam = px(64)}) => (
	<div
		style={{
			width: tam,
			height: tam,
			borderRadius: 999,
			flexShrink: 0,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			...papel.frase,
			fontSize: tam * 0.42,
			color: '#FFFFFF',
			background: `linear-gradient(140deg, ${c}, ${alfa(c, 0.55)})`,
		}}
	>
		{letra}
	</div>
);

const AVATARES = ['#E5604A', '#4F8CF0', '#2FB59A', '#C58BF2', '#E9A23B'];

const BlocoLista: React.FC<{b: Extract<BlocoTela, {tipo: 'lista'}>; ini: number; at: number}> = ({b, ini, at}) => {
	const frame = useCurrentFrame();
	return (
		<div>
			{b.rotulo ? <RotuloBloco>{b.rotulo}</RotuloBloco> : null}
			<div style={{display: 'flex', flexDirection: 'column', gap: px(12)}}>
				{b.itens.map((it, i) => {
					const st = estadoAtual(frame, ini, it);
					const c = corStatus(st.status);
					const aceso = st.status && st.status !== 'neutro' ? prog(frame, st.t, 6) : 0;
					return (
						<div
							key={i}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: px(20),
								padding: `${px(18)}px ${px(20)}px`,
								borderRadius: px(18),
								background: cor.superficie2,
								border: `1.5px solid ${aceso ? alfa(c, 0.25 + 0.3 * aceso) : cor.linha}`,
								...entraUI(frame, at + i * 2),
							}}
						>
							{it.icone ? (
								<div style={{width: px(64), height: px(64), borderRadius: px(16), display: 'flex', alignItems: 'center', justifyContent: 'center', background: alfa(cor.acento, 0.12)}}>
									<Icone nome={it.icone} tam={px(34)} cor={cor.acento} />
								</div>
							) : (
								<Avatar letra={it.avatar ?? (it.sub?.startsWith('@') ? it.sub.slice(1, 2) : it.titulo.replace(/^@/, '').slice(0, 1)).toUpperCase()} c={AVATARES[i % AVATARES.length]} />
							)}
							<div style={{flex: 1, minWidth: 0}}>
								{it.sub ? <div style={{fontFamily: papel.frase.fontFamily, fontWeight: 500, fontSize: T.sub, color: cor.apagado}}>{it.sub}</div> : null}
								<div style={{...papel.frase, fontSize: T.titulo * 0.92, letterSpacing: '-.02em', color: cor.texto, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
									{it.titulo}
								</div>
							</div>
							{st.texto ? <Badge key={st.t} texto={st.texto} status={st.status} t={st.t} /> : null}
						</div>
					);
				})}
			</div>
		</div>
	);
};

const BlocoChecklist: React.FC<{b: Extract<BlocoTela, {tipo: 'checklist'}>; ini: number; at: number}> = ({b, ini, at}) => {
	const frame = useCurrentFrame();
	const c = corDe('solucao');
	return (
		<div>
			{b.rotulo ? <RotuloBloco>{b.rotulo}</RotuloBloco> : null}
			<div style={{display: 'flex', flexDirection: 'column', gap: px(18)}}>
				{b.itens.map((it, i) => {
					const t = fr(it.em) - ini;
					const feito = frame >= t;
					const girando = !feito && frame >= t - 10;
					const p = feito ? molaKit(frame, t, 'pop') : 0;
					return (
						<div key={i} style={{display: 'flex', alignItems: 'center', gap: px(18), ...entraUI(frame, at + i * 2)}}>
							<div
								style={{
									width: px(46),
									height: px(46),
									borderRadius: 999,
									flexShrink: 0,
									border: `3px solid ${feito ? c : girando ? 'transparent' : cor.linha}`,
									borderTopColor: girando ? c : undefined,
									borderRightColor: girando ? alfa(c, 0.4) : undefined,
									transform: girando ? `rotate(${(frame - t) * 36}deg)` : `scale(${0.8 + 0.2 * p})`,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									background: feito ? alfa(c, 0.15) : 'transparent',
									boxShadow: feito ? `0 0 16px ${alfa(c, 0.45)}` : undefined,
								}}
							>
								{feito ? <Icone nome="check" tam={px(28)} cor={c} espessura={3} /> : null}
							</div>
							<div style={{...papel.frase, fontWeight: 700, fontSize: T.titulo, letterSpacing: '-.02em', color: feito ? cor.texto : cor.apagado}}>{it.texto}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const BlocoContador: React.FC<{b: Extract<BlocoTela, {tipo: 'contador'}>; ini: number; at: number}> = ({b, ini, at}) => {
	const frame = useCurrentFrame();
	const t0 = fr(b.em) - ini;
	const t1 = b.ateEm !== undefined ? fr(b.ateEm) - ini : t0 + 36;
	const v = interpolate(frame, [t0, Math.max(t0 + 1, t1)], [b.de ?? 0, b.ate], {
		easing: Easing.out(Easing.cubic),
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const c = corDe(b.cor);
	const fim = frame >= t1 ? molaKit(frame, t1, 'pop') : 0;
	return (
		<div style={{...entraUI(frame, at)}}>
			<RotuloBloco>{b.rotulo}</RotuloBloco>
			<div
				style={{
					...papel.numero,
					fontSize: px(128),
					color: VARIANTE === 'escura' ? '#FFFFFF' : cor.texto,
					textShadow: VARIANTE === 'escura' ? `0 0 ${24 + 20 * fim}px ${alfa(c, 0.55)}` : undefined,
					whiteSpace: 'nowrap',
				}}
			>
				{b.prefixo ? <span style={{fontSize: '0.45em', color: corTextoDe(b.cor), marginRight: '0.2em'}}>{b.prefixo}</span> : null}
				{fmt(v, b.casas ?? 0)}
				{b.sufixo ? <span style={{fontSize: '0.38em', color: corTextoDe(b.cor), marginLeft: '0.25em', letterSpacing: '0'}}>{b.sufixo}</span> : null}
			</div>
		</div>
	);
};

const BlocoToggles: React.FC<{b: Extract<BlocoTela, {tipo: 'toggles'}>; ini: number; at: number}> = ({b, ini, at}) => {
	const frame = useCurrentFrame();
	return (
		<div>
			{b.rotulo ? <RotuloBloco>{b.rotulo}</RotuloBloco> : null}
			<div style={{display: 'flex', flexDirection: 'column', gap: px(14)}}>
				{b.itens.map((it, i) => {
					const inicial = it.ligado ?? true;
					const t = it.em !== undefined ? fr(it.em) - ini : Infinity;
					const p = frame >= t ? molaKit(frame, t, 'ui') : 0;
					const ligado = inicial ? 1 - p : p;
					const c = corDe('solucao');
					return (
						<div key={i} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${px(14)}px ${px(18)}px`, borderRadius: px(16), background: cor.superficie2, ...entraUI(frame, at + i * 2)}}>
							<div style={{...papel.frase, fontWeight: 700, fontSize: T.titulo * 0.82, color: ligado > 0.5 ? cor.texto : cor.apagado}}>{it.texto}</div>
							<div style={{width: px(86), height: px(48), borderRadius: 999, background: ligado > 0.5 ? alfa(c, 0.9) : cor.linha, position: 'relative', boxShadow: ligado > 0.5 ? `0 0 16px ${alfa(c, 0.45)}` : undefined}}>
								<div style={{position: 'absolute', top: px(5), left: px(5) + ligado * px(38), width: px(38), height: px(38), borderRadius: 999, background: '#FFFFFF'}} />
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const BlocoTimeline: React.FC<{b: Extract<BlocoTela, {tipo: 'timeline'}>; ini: number; at: number}> = ({b, ini, at}) => {
	const frame = useCurrentFrame();
	const t0 = fr(b.em) - ini;
	const t1 = b.ateEm !== undefined ? fr(b.ateEm) - ini : t0 + 60;
	const cabeca = interpolate(frame, [t0, t1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
	const larguraRot = px(150);
	return (
		<div style={{...entraUI(frame, at)}}>
			{b.rotulo ? <RotuloBloco>{b.rotulo}</RotuloBloco> : null}
			<div style={{position: 'relative', display: 'flex', flexDirection: 'column', gap: px(12), padding: px(16), borderRadius: px(18), background: cor.superficie2}}>
				{b.trilhas.map((tr, i) => {
					const c = corDe(tr.cor);
					return (
						<div key={i} style={{display: 'flex', alignItems: 'center', height: px(44)}}>
							<div style={{...papel.rotulo, width: larguraRot, fontSize: px(18), letterSpacing: '.16em', color: cor.apagado}}>{tr.rotulo}</div>
							<div style={{position: 'relative', flex: 1, height: '100%'}}>
								{tr.blocos.map(([x0, x1], j) => {
									const vis = cabeca >= x0 ? 1 : 0.18;
									return (
										<div key={j} style={{position: 'absolute', left: `${x0 * 100}%`, width: `${(x1 - x0) * 100}%`, top: 4, bottom: 4, borderRadius: px(8), background: `linear-gradient(180deg, ${alfa(c, 0.95)}, ${alfa(c, 0.65)})`, opacity: vis, boxShadow: vis === 1 ? `0 0 10px ${alfa(c, 0.35)}` : undefined}} />
									);
								})}
							</div>
						</div>
					);
				})}
				<div style={{position: 'absolute', top: px(8), bottom: px(8), left: `calc(${px(16) + larguraRot}px + (100% - ${px(32) + larguraRot}px) * ${cabeca})`, width: 3, borderRadius: 3, background: VARIANTE === 'escura' ? '#FFFFFF' : cor.texto, boxShadow: '0 0 10px rgba(255,255,255,.6)'}} />
			</div>
		</div>
	);
};

const BlocoFluxo: React.FC<{b: Extract<BlocoTela, {tipo: 'fluxo'}>; ini: number; at: number}> = ({b, ini}) => {
	const frame = useCurrentFrame();
	const c = corDe('solucao');
	return (
		<div>
			{b.rotulo ? <RotuloBloco>{b.rotulo}</RotuloBloco> : null}
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				{b.nos.map((n, i) => {
					const t = fr(n.em) - ini;
					const linha = i > 0 ? prog(frame, t - 8, 8) : 0;
					return (
						<React.Fragment key={i}>
							{i > 0 ? (
								<div style={{width: 3, height: px(34), background: `linear-gradient(${c}, ${alfa(c, 0.4)})`, transform: `scaleY(${linha})`, transformOrigin: 'top', boxShadow: `0 0 8px ${alfa(c, 0.5)}`}} />
							) : null}
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: px(16),
									padding: `${px(16)}px ${px(26)}px`,
									borderRadius: n.decisao ? px(10) : px(18),
									border: `2px solid ${alfa(c, 0.7)}`,
									background: cor.superficie2,
									boxShadow: brilho(c, 0.6),
									transform: n.decisao ? 'rotate(0deg)' : undefined,
									...entraUI(frame, t),
								}}
							>
								{n.icone ? <Icone nome={n.icone} tam={px(34)} cor={c} /> : null}
								<span style={{...papel.frase, fontWeight: 700, fontSize: T.titulo * 0.85, color: cor.texto}}>{n.texto}</span>
								{n.decisao ? <span style={{...papel.rotulo, fontSize: px(18), color: c}}>?</span> : null}
							</div>
						</React.Fragment>
					);
				})}
			</div>
		</div>
	);
};

const BlocoKanban: React.FC<{b: Extract<BlocoTela, {tipo: 'kanban'}>; ini: number; at: number}> = ({b, ini, at}) => {
	const frame = useCurrentFrame();
	let col = 0;
	let tTroca = -999;
	let de = 0;
	for (const p of b.passos) {
		const t = fr(p.em) - ini;
		if (frame >= t) {
			de = col;
			col = p.coluna;
			tTroca = t;
		}
	}
	const s = tTroca > -999 ? spring({frame: frame - tTroca, fps: FPS, config: {damping: 200}, durationInFrames: 10}) : 1;
	const pos = de + (col - de) * s;
	const n = b.colunas.length;
	const c = corDe('solucao');
	return (
		<div style={{position: 'relative', ...entraUI(frame, at)}}>
			<div style={{display: 'flex', gap: px(12)}}>
				{b.colunas.map((nome, i) => (
					<div key={i} style={{flex: 1, height: px(230), borderRadius: px(16), border: `1.5px solid ${Math.round(pos) === i ? alfa(c, 0.6) : cor.linha}`, background: cor.superficie2, padding: px(12)}}>
						<div style={{...papel.rotulo, fontSize: px(17), letterSpacing: '.12em', color: Math.round(pos) === i ? corTextoDe('solucao') : cor.apagado, textAlign: 'center'}}>{nome}</div>
					</div>
				))}
			</div>
			<div
				style={{
					position: 'absolute',
					top: px(58),
					left: `calc(${(pos / n) * 100}% + ${px(12)}px - ${(pos / n) * px(12)}px)`,
					width: `calc(${100 / n}% - ${px(24)}px + ${px(12) / n}px)`,
					height: px(150),
					borderRadius: px(14),
					background: `linear-gradient(150deg, ${alfa(c, 0.9)}, ${alfa(corDe('acento2'), 0.9)})`,
					boxShadow: brilho(c, 0.8),
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: px(10),
					transform: `rotate(${Math.sin(s * Math.PI) * -3}deg)`,
				}}
			>
				<Avatar letra={b.card.avatar ?? b.card.texto.replace(/^@/, '').slice(0, 1).toUpperCase()} c="#E5604A" tam={px(56)} />
				<div style={{...papel.frase, fontWeight: 700, fontSize: px(22), color: '#0B0B0E'}}>{b.card.texto}</div>
			</div>
		</div>
	);
};

const BlocoPrompt: React.FC<{b: Extract<BlocoTela, {tipo: 'prompt'}>; ini: number; at: number}> = ({b, ini, at}) => {
	const frame = useCurrentFrame();
	const t = fr(b.em) - ini;
	const n = Math.max(0, Math.floor((frame - t) * (b.cps ?? 1.6)));
	const txt = b.texto.slice(0, n);
	const fim = n >= b.texto.length;
	const cursor = !fim && Math.floor(frame / 8) % 2 === 0;
	return (
		<div style={{padding: px(22), borderRadius: px(20), background: cor.superficie2, border: `1.5px solid ${cor.linha}`, ...entraUI(frame, at)}}>
			{b.rotulo ? <RotuloBloco>{b.rotulo}</RotuloBloco> : null}
			<div style={{display: 'flex', alignItems: 'flex-end', gap: px(18)}}>
				<div style={{flex: 1, ...papel.frase, fontWeight: 700, fontSize: T.titulo * 0.9, lineHeight: 1.2, letterSpacing: '-.02em', color: cor.texto, minHeight: T.titulo * 2.2}}>
					{txt}
					<span style={{opacity: cursor ? 1 : 0, color: cor.acento}}>|</span>
				</div>
				<div style={{width: px(64), height: px(64), borderRadius: 999, background: cor.gradAcento, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: brilho(cor.acento, fim ? 1 : 0.4), transform: `scale(${fim ? 1 + 0.08 * Math.sin(frame / 5) : 1})`}}>
					<Icone nome="arrowRight" tam={px(32)} cor="#0B0B0E" espessura={2.6} style={{transform: 'rotate(-90deg)'}} />
				</div>
			</div>
		</div>
	);
};


/** Chat de comandos: bolha do usuário (gradiente do acento) digitando + confirmação com ícone e check. */
const BlocoChat: React.FC<{b: Extract<BlocoTela, {tipo: 'chat'}>; ini: number; at: number}> = ({b, ini, at}) => {
	const frame = useCurrentFrame();
	const cps = b.cps ?? 1.4;
	const c = corDe('solucao');
	return (
		<div style={{...entraUI(frame, at)}}>
			{b.rotulo ? <RotuloBloco>{b.rotulo}</RotuloBloco> : null}
			<div style={{display: 'flex', flexDirection: 'column', gap: px(14)}}>
				{b.mensagens.map((m, i) => {
					const t = fr(m.em) - ini - 3;
					if (frame < t) return null;
					const n = Math.floor((frame - t) * cps);
					const fim = n >= m.texto.length;
					const tOk = t + Math.ceil(m.texto.length / cps) + 6;
					return (
						<div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: px(10)}}>
							<div
								style={{
									maxWidth: '92%',
									padding: `${px(14)}px ${px(22)}px`,
									borderRadius: `${px(22)}px ${px(22)}px ${px(6)}px ${px(22)}px`,
									background: `linear-gradient(135deg, ${cor.acento}, ${tonalidadeLocal(cor.acento)})`,
									color: '#FFFFFF',
									...papel.frase,
									fontWeight: 700,
									fontSize: px(34),
									lineHeight: 1.15,
									letterSpacing: '-.02em',
									boxShadow: brilho(cor.acento, 0.5),
									...entraUI(frame, t, 12),
								}}
							>
								{m.texto.slice(0, n)}
								{!fim ? <span style={{opacity: Math.floor(frame / 8) % 2 ? 0 : 1}}>|</span> : null}
							</div>
							{m.ok && frame >= tOk ? (
								<div style={{display: 'flex', alignItems: 'center', gap: px(12), alignSelf: 'flex-start', ...entraUI(frame, tOk, 10)}}>
									<div style={{width: px(40), height: px(40), borderRadius: px(10), background: alfa(cor.acento, 0.2), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
										<Icone nome={m.icone ?? 'sparkles'} tam={px(22)} cor={cor.acentoClaro} />
									</div>
									<span style={{...papel.frase, fontWeight: 700, fontSize: px(27), color: cor.suave}}>{m.ok}</span>
									<Icone nome="check" tam={px(26)} cor={c} espessura={3} />
								</div>
							) : null}
						</div>
					);
				})}
			</div>
		</div>
	);
};
const tonalidadeLocal = (c: string) => alfa(c, 0.72);

/** Preview do vídeo do orador dentro da janela (o mesmo arquivo, no frame da timeline). */
const BlocoVideo: React.FC<{b: Extract<BlocoTela, {tipo: 'video'}>; ini: number; at: number}> = ({b, ini, at}) => {
	const frame = useCurrentFrame();
	const alt = b.altura ?? px(560);
	const larg = Math.round(alt * (b.proporcao ?? 9 / 16));
	return (
		<div style={{...entraUI(frame, at)}}>
			{b.rotulo ? <RotuloBloco>{b.rotulo}</RotuloBloco> : null}
			<div style={{position: 'relative', width: b.proporcao ? larg : '100%', height: alt, borderRadius: px(18), overflow: 'hidden', border: `1.5px solid ${alfa(cor.acentoClaro, 0.45)}`, boxShadow: `0 0 30px ${alfa(cor.acento, 0.25)}`}}>
				<CamadaVideo arquivo={b.arquivo ?? 'orador.mp4'} de={ini} ret={{x: 0, y: 0, w: b.proporcao ? larg : 2000, h: alt}} enq={b.enquadramento} marcacao style={b.proporcao ? undefined : {width: '100%'}} />
				{b.status ? (
					<div style={{position: 'absolute', left: px(14), top: px(14), display: 'flex', alignItems: 'center', gap: px(8), ...papel.rotulo, fontSize: px(17), letterSpacing: '.16em', color: '#FFFFFF', padding: `${px(6)}px ${px(12)}px`, borderRadius: 99, background: 'rgba(0,0,0,.55)'}}>
						<div style={{width: px(9), height: px(9), borderRadius: 99, background: corDe('problema'), opacity: 0.5 + 0.5 * Math.abs(Math.sin(frame / 6))}} />
						{b.status}
					</div>
				) : null}
			</div>
		</div>
	);
};

/** Blocos lado a lado (ex.: vídeo à esquerda, chat à direita). */
const BlocoColunas: React.FC<{b: Extract<BlocoTela, {tipo: 'colunas'}>; ini: number; at: number}> = ({b, ini, at}) => (
	<div style={{display: 'flex', gap: px(22), alignItems: 'flex-start'}}>
		{b.blocos.map((x, i) => {
			const Comp = BLOCOS[x.tipo];
			return (
				<div key={i} style={{flex: b.pesos?.[i] ?? 1, minWidth: 0}}>
					<Comp b={x} ini={ini} at={at + i * 2} />
				</div>
			);
		})}
	</div>
);

const BLOCOS: Record<BlocoTela['tipo'], React.FC<{b: any; ini: number; at: number}>> = {
	lista: BlocoLista,
	checklist: BlocoChecklist,
	contador: BlocoContador,
	toggles: BlocoToggles,
	timeline: BlocoTimeline,
	fluxo: BlocoFluxo,
	kanban: BlocoKanban,
	prompt: BlocoPrompt,
	chat: BlocoChat,
	video: BlocoVideo,
	colunas: BlocoColunas,
};

/** Janela da TelaViva. `ini` = frame absoluto do Sequence; `entra` = frame local de entrada. */
export const TelaViva: React.FC<{def: DefTelaViva; ini: number; entra?: number; largura: number; style?: React.CSSProperties}> = ({def, ini, entra = 2, largura, style}) => {
	const frame = useCurrentFrame();
	const tAlerta = def.alerta ? fr(def.alerta.em) - ini : Infinity;
	const alerta = frame >= tAlerta ? prog(frame, tAlerta, 5) : 0;
	const cBorda = alerta > 0 ? corDe(def.alerta?.cor ?? 'problema') : cor.acento;
	const final = def.status?.final;
	const tFinal = final ? fr(final.em) - ini : Infinity;
	const stTexto = frame >= tFinal ? final!.texto : def.status?.texto;
	const stCor = frame >= tFinal ? corStatus(final!.status ?? 'ok') : alerta > 0 ? cBorda : cor.acento;
	const pisca = frame < tFinal ? 0.55 + 0.45 * Math.abs(Math.sin(frame / 6)) : 1;
	const escura = VARIANTE === 'escura';
	const persp = def.perspectiva;
	const tPersp = persp ? (persp.em !== undefined ? fr(persp.em) - ini : entra) : 0;
	const sP = persp ? (frame < tPersp ? 0 : spring({frame: frame - tPersp, fps: FPS, ...MOLAS.perspectiva})) : 1;
	const giro = persp ? `rotateY(${(persp.rotY ?? 28) * (1 - sP)}deg) rotateX(${(persp.rotX ?? 6) * (1 - sP)}deg) ` : '';
	const ent = entraUI(frame, entra);
	return (
		<div style={{width: largura, perspective: 1800, ...style}}>
			<div
				style={{
					position: 'relative',
					borderRadius: px(30),
					background: escura ? `linear-gradient(180deg, ${alfa('#FFFFFF', 0.035)}, transparent 30%), ${cor.superficie}` : cor.superficie,
					border: `1.5px solid ${alfa(cBorda, 0.4 + 0.35 * alerta)}`,
					boxShadow: `${escura ? '0 30px 80px rgba(0,0,0,.6)' : '0 30px 70px rgba(20,20,20,.14)'}, 0 0 ${50 + 30 * alerta}px ${alfa(cBorda, (escura ? 0.22 : 0.14) + 0.25 * alerta)}, inset 0 1px 0 ${cor.brilhoInterno}`,
					...ent,
					transform: `${giro}${def.inclinar ? 'rotateX(5deg) rotateY(-7deg) ' : ''}${ent.transform ?? ''}`,
					transformOrigin: '50% 50%',
				}}
			>
				<div style={{display: 'flex', alignItems: 'center', gap: px(12), padding: `${px(22)}px ${px(28)}px`, borderBottom: `1px solid ${cor.linha}`}}>
					{['#FF5F57', '#FEBC2E', '#28C840'].map((c, i) => (
						<div key={i} style={{width: px(15), height: px(15), borderRadius: 99, background: escura ? alfa(c, 0.85) : c}} />
					))}
					<div style={{...papel.rotulo, fontSize: px(21), letterSpacing: '.06em', textTransform: 'none', color: cor.suave, marginLeft: px(10), flex: 1}}>{def.titulo}</div>
					{stTexto ? (
						<div style={{display: 'flex', alignItems: 'center', gap: px(10), ...papel.rotulo, fontSize: px(18), letterSpacing: '.18em', color: escura ? stCor : corTextoDe(stCor), padding: `${px(8)}px ${px(16)}px`, borderRadius: 999, border: `1.5px solid ${alfa(stCor, 0.5)}`, background: alfa(stCor, 0.08)}}>
							<div style={{width: px(10), height: px(10), borderRadius: 99, background: stCor, opacity: pisca, boxShadow: `0 0 8px ${stCor}`}} />
							{stTexto}
						</div>
					) : null}
				</div>
				<div style={{display: 'flex', flexDirection: 'column', gap: px(30), padding: px(28)}}>
					{def.blocos.map((b, i) => {
						const Comp = BLOCOS[b.tipo];
						return <Comp key={i} b={b} ini={ini} at={entra + 3 + i * 3} />;
					})}
				</div>
			</div>
		</div>
	);
};
