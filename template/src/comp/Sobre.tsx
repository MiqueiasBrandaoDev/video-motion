import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {alfa, AREA, brilho, cor, corDe, easingRola, fmt, FPS, H, MOLAS, papel, prog, px, SEGURO_LADO, SEGURO_TOPO, tonalidade, W} from '../theme';
import {fr, type Ref} from '../tempo';
import {Icone} from './Icone';
import {RotuloMono, TextoMisto} from './Tipografia';

/*
 * Sobreposições do talking head: elementos que entram SOBRE ou EM VOLTA do rosto, cada um no
 * marco da fala. Ficam na lista `sobre` da cena `orador`:
 *   {"tipo": "titulo", "em": "marco", "ate": "marco2", "camada": "atras", ...campos do tipo}
 * `camada: "atras"` desenha entre o fundo e a pessoa (exige o recorte com alfa; sem ele, fica
 * por cima, então posicione acima da cabeça). Valores de spring/frames medidos nos anúncios
 * analisados em out/2026 (references/remotion-padroes.md, seção 12).
 *
 * Todos recebem `at` (frame local de entrada, ~3 frames antes da palavra) e `ini` (frame
 * absoluto da cena) para converter outros marcos.
 */

export type PropsSobre<T> = {d: T; at: number; ini: number};
const mola = (frame: number, t: number, tipo: keyof typeof MOLAS) => (frame < t ? 0 : spring({frame: frame - t, fps: FPS, ...MOLAS[tipo]}));
const local = (ref: Ref | undefined, ini: number, padrao: number) => (ref !== undefined ? fr(ref) - ini : padrao);
const sombraTexto = 'drop-shadow(0 6px 28px rgba(0,0,0,.55))';

// ---------------------------------------------------------------- título de duas larguras (+ riscado)
export type DefTitulo = {rotulo?: string; linha1?: string; linha2?: string; y?: number; tam?: number; pb?: boolean; riscaEm?: Ref; risca?: boolean};

/**
 * Lockup de largura contrastada: linha 1 grotesca larga 800 + linha 2 condensada alta com
 * gradiente. Linha 1 desce de -20 px com blur em 4 frames; linha 2 entra 3 frames depois com
 * scaleY 1,3 -> 1 e blur. `riscaEm` (ou `risca: true`) passa uma barra na linha 2: scaleX 0 -> 1
 * em 8 frames, -3°, na cor de problema. `pb: true` = branco puro (trecho em preto e branco).
 */
export const Titulo2L: React.FC<PropsSobre<DefTitulo>> = ({d, at, ini}) => {
	const frame = useCurrentFrame();
	const tam = d.tam ?? 1;
	const s1 = frame < at ? 0 : spring({frame: frame - at, fps: FPS, config: {damping: 200}, durationInFrames: 4});
	const s2 = frame < at + 3 ? 0 : spring({frame: frame - at - 3, fps: FPS, config: {damping: 200}, durationInFrames: 5});
	const tRisca = d.riscaEm !== undefined ? fr(d.riscaEm) - ini : d.risca ? at + 10 : Infinity;
	const risca = Number.isFinite(tRisca) ? interpolate(frame, [tRisca, tRisca + 8], [0, 1], {easing: Easing.out(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
	const t2 = px(196) * tam;
	return (
		<div style={{position: 'absolute', left: SEGURO_LADO, right: SEGURO_LADO, top: (d.y ?? 0.1) * H, display: 'flex', flexDirection: 'column', alignItems: 'center', filter: sombraTexto}}>
			{d.rotulo ? (
				<RotuloMono at={at} tam={px(26)} cor="#E4E1EE" style={{marginBottom: px(12)}}>
					{d.rotulo}
				</RotuloMono>
			) : null}
			{d.linha1 ? (
				<div style={{opacity: s1, transform: `translateY(${(1 - s1) * -20}px)`, filter: s1 < 0.99 ? `blur(${(1 - s1) * 6}px)` : undefined}}>
					<TextoMisto texto={d.linha1} entrada="nenhuma" tam={px(104) * tam} cor="#FFFFFF" style={{lineHeight: 1, letterSpacing: '-.04em', textTransform: 'uppercase'}} />
				</div>
			) : null}
			{d.linha2 ? (
				<div style={{position: 'relative', opacity: s2, transform: `scaleY(${1.3 - 0.3 * s2})`, transformOrigin: '50% 100%', filter: s2 < 0.99 ? `blur(${(1 - s2) * 8}px)` : undefined, marginTop: px(-4)}}>
					<TextoMisto texto={d.linha2} entrada="nenhuma" papel="estreita" tam={t2} gradiente={!d.pb} cor="#FFFFFF" brilho={!d.pb} style={{lineHeight: 0.86}} />
					{risca > 0 ? (
						<div
							style={{
								position: 'absolute',
								left: '-5%',
								width: '110%',
								top: '47%',
								height: Math.max(6, t2 * 0.055),
								borderRadius: 99,
								background: corDe('problema'),
								boxShadow: `0 0 ${t2 * 0.08}px ${corDe('problema')}`,
								transform: `rotate(-3deg) scaleX(${risca})`,
								transformOrigin: '0% 50%',
							}}
						/>
					) : null}
				</div>
			) : null}
		</div>
	);
};

// ---------------------------------------------------------------- número que rola
export type DefNumero = {valores: Array<{v: number | string; em: Ref}>; prefixo?: string; sufixo?: string; rotulo?: string; y?: number; tam?: number; casas?: number};

/**
 * Número gigante (atrás da cabeça) que rola a cada marco: o antigo sobe e some
 * (translateY 0 -> -60%, opacidade 1 -> 0, blur 0 -> 6 px), o novo sobe de baixo
 * (60% -> 0, blur 6 -> 0), os dois em 6 frames com bezier(.2, 0, 0, 1), sobrepostos.
 */
export const NumeroRola: React.FC<PropsSobre<DefNumero>> = ({d, ini}) => {
	const frame = useCurrentFrame();
	const ts = d.valores.map((x) => fr(x.em) - ini - 3);
	let k = -1;
	ts.forEach((t, i) => {
		if (frame >= t) k = i;
	});
	if (k < 0) return null;
	const p = interpolate(frame, [ts[k], ts[k] + 6], [0, 1], {easing: easingRola, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const tam = px(330) * (d.tam ?? 1);
	const txt = (v: number | string) => `${d.prefixo ?? ''}${typeof v === 'number' ? fmt(v, d.casas ?? 0) : v}${d.sufixo ?? ''}`;
	const estilo = (y: number, o: number, b: number): React.CSSProperties => ({
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		textAlign: 'center',
		transform: `translateY(${y}%)`,
		opacity: o,
		filter: b > 0.2 ? `blur(${b}px)` : undefined,
	});
	const num = (v: number | string) => (
		<div style={{...papel.numero, fontSize: tam, lineHeight: 1, whiteSpace: 'nowrap', backgroundImage: `linear-gradient(180deg, #FFFFFF 15%, ${tonalidade(cor.acento, 0.35)} 100%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>{txt(v)}</div>
	);
	return (
		<div style={{position: 'absolute', left: 0, width: W, top: (d.y ?? 0.1) * H, height: tam * 1.05, filter: `drop-shadow(0 0 ${tam * 0.12}px ${alfa(cor.acento, 0.45)})`}}>
			{d.rotulo ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: -px(46), display: 'flex', justifyContent: 'center'}}>
					<RotuloMono at={ts[0]} tam={px(26)} cor="#E4E1EE">
						{d.rotulo}
					</RotuloMono>
				</div>
			) : null}
			{k > 0 && p < 1 ? <div style={estilo(-60 * p, 1 - p, 6 * p)}>{num(d.valores[k - 1].v)}</div> : null}
			<div style={estilo(60 * (1 - p), p, 6 * (1 - p))}>{num(d.valores[k].v)}</div>
		</div>
	);
};

// ---------------------------------------------------------------- chips sequenciais
export type DefChips = {itens: Array<{texto: string; em: Ref}>; y?: number; numerar?: boolean};

/** Chips numerados que acendem em sequência (01 — 02 — 03); o último aceso fica sólido no acento. Pop spring 12/260. */
export const Chips: React.FC<PropsSobre<DefChips>> = ({d, ini}) => {
	const frame = useCurrentFrame();
	const ts = d.itens.map((x) => fr(x.em) - ini - 2);
	const chars = d.itens.reduce((n, x) => n + x.texto.length + 3, 0);
	const tam = Math.min(px(50), (W - 2 * SEGURO_LADO - d.itens.length * px(70)) / (chars * 0.62));
	let atual = -1;
	ts.forEach((t, i) => {
		if (frame >= t) atual = i;
	});
	return (
		<div style={{position: 'absolute', left: 0, width: W, top: (d.y ?? 0.6) * H, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: tam * 0.35}}>
			{d.itens.map((it, i) => {
				const s = mola(frame, ts[i], 'check');
				const ativo = i === atual;
				return (
					<React.Fragment key={i}>
						{i > 0 ? <div style={{width: tam * 0.5, height: 3, borderRadius: 2, background: alfa('#FFFFFF', 0.35), opacity: frame >= ts[i] ? 1 : 0.25}} /> : null}
						<div
							style={{
								display: 'flex',
								alignItems: 'baseline',
								gap: tam * 0.3,
								padding: `${tam * 0.24}px ${tam * 0.36}px`,
								borderRadius: tam * 0.24,
								background: ativo ? cor.gradAcento : 'rgba(14,12,20,.82)',
								border: `1.5px solid ${ativo ? alfa(cor.acentoClaro, 0.9) : 'rgba(255,255,255,.16)'}`,
								boxShadow: ativo ? brilho(cor.acento, 1) : '0 8px 24px rgba(0,0,0,.35)',
								opacity: frame < ts[i] ? 0 : Math.min(1, s * 1.4),
								transform: `scale(${0.6 + 0.4 * s})`,
							}}
						>
							{d.numerar !== false ? <span style={{...papel.rotulo, fontSize: tam * 0.42, letterSpacing: '.06em', color: alfa('#FFFFFF', ativo ? 0.85 : 0.55)}}>{String(i + 1).padStart(2, '0')}</span> : null}
							<span style={{...papel.frase, fontSize: tam, letterSpacing: '-.02em', color: '#FFFFFF', textTransform: 'uppercase', lineHeight: 1}}>{it.texto}</span>
						</div>
					</React.Fragment>
				);
			})}
		</div>
	);
};

// ---------------------------------------------------------------- checklist de objeções (HUD)
export type DefObjecoes = {rotulo?: string; total?: number; checks: Ref[]; y?: number; cor?: string};

/** HUD no topo: rótulo + círculos que ganham check (fundo na cor, traço 20 -> 0 em 6 frames, scale .6 -> 1 spring 12/260). */
export const Objecoes: React.FC<PropsSobre<DefObjecoes>> = ({d, at, ini}) => {
	const frame = useCurrentFrame();
	const n = Math.max(d.total ?? d.checks.length, d.checks.length);
	const c = corDe(d.cor ?? 'solucao');
	const tam = px(46);
	const ent = mola(frame, at, 'ui');
	return (
		<div style={{position: 'absolute', left: 0, width: W, top: d.y !== undefined ? d.y * H : SEGURO_TOPO + px(10), display: 'flex', justifyContent: 'center', alignItems: 'center', gap: px(14), opacity: ent, filter: 'drop-shadow(0 4px 14px rgba(0,0,0,.5))'}}>
			<div style={{...papel.rotulo, fontSize: px(24), color: '#D9D5E6', marginRight: px(10)}}>{d.rotulo ?? 'objeções'}</div>
			{Array.from({length: n}).map((_, i) => {
				const t = i < d.checks.length ? fr(d.checks[i]) - ini : Infinity;
				const s = mola(frame, t, 'check');
				const traco = interpolate(frame, [t, t + 6], [20, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
				const feito = frame >= t;
				return (
					<div
						key={i}
						style={{
							width: tam,
							height: tam,
							borderRadius: 99,
							border: `2.5px solid ${feito ? c : 'rgba(255,255,255,.4)'}`,
							background: feito ? c : 'rgba(10,10,14,.35)',
							boxShadow: feito ? `0 0 16px ${alfa(c, 0.6)}` : undefined,
							transform: `scale(${feito ? 0.6 + 0.4 * s : 1})`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						{feito ? (
							<svg width={tam * 0.6} height={tam * 0.6} viewBox="0 0 24 24" fill="none" stroke="#0B0B0E" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">
								<path d="M4 12.5 9.5 18 20 6.5" strokeDasharray={20} strokeDashoffset={traco} pathLength={20} />
							</svg>
						) : null}
					</div>
				);
			})}
		</div>
	);
};

// ---------------------------------------------------------------- terminal de comando
export type DefComando = {texto: string; rotulo?: string; feitoEm?: Ref; rotuloFeito?: string; y?: number};

/** Caixa "COMANDO › texto█" digitando a ~45 caracteres/s (1,5 por frame), cursor piscando a cada 15 frames. */
export const Comando: React.FC<PropsSobre<DefComando>> = ({d, at, ini}) => {
	const frame = useCurrentFrame();
	const n = Math.max(0, Math.floor((frame - at - 2) * 1.5));
	const tFeito = d.feitoEm !== undefined ? fr(d.feitoEm) - ini : Infinity;
	const feito = frame >= tFeito;
	const p = mola(frame, at, 'ui');
	const tam = px(40);
	const cOk = corDe('solucao');
	return (
		<div style={{position: 'absolute', left: 0, width: W, top: (d.y ?? 0.66) * H, display: 'flex', justifyContent: 'center'}}>
			<div
				style={{
					maxWidth: W - 2 * SEGURO_LADO,
					padding: `${px(18)}px ${px(28)}px ${px(22)}px`,
					borderRadius: px(18),
					background: 'rgba(18,16,24,.86)',
					border: `1.5px solid ${feito ? alfa(cOk, 0.6) : 'rgba(255,255,255,.12)'}`,
					boxShadow: '0 18px 50px rgba(0,0,0,.45)',
					opacity: frame < at ? 0 : p,
					transform: `translateY(${(1 - p) * 18}px) scale(${0.95 + 0.05 * p})`,
					filter: p < 0.99 ? `blur(${(1 - p) * 6}px)` : undefined,
				}}
			>
				<div style={{display: 'flex', alignItems: 'center', gap: px(10), ...papel.rotulo, fontSize: px(19), letterSpacing: '.22em', color: feito ? cOk : '#A9A6B4', marginBottom: px(8)}}>
					{feito ? <Icone nome="check" tam={px(22)} cor={cOk} espessura={3} /> : null}
					{feito ? `${d.rotulo ?? 'comando'} · ${d.rotuloFeito ?? 'feito'}` : d.rotulo ?? 'comando'}
				</div>
				<div style={{...papel.rotulo, textTransform: 'none', letterSpacing: 0, fontWeight: 500, fontSize: tam, color: '#F5F4F2', whiteSpace: 'pre-wrap'}}>
					<span style={{color: cor.acentoClaro}}>› </span>
					{d.texto.slice(0, n)}
					<span style={{display: 'inline-block', width: '0.55em', height: '1em', marginLeft: 4, verticalAlign: '-0.15em', background: '#F5F4F2', opacity: Math.floor(frame / 15) % 2 === 0 ? 0.9 : 0}} />
				</div>
			</div>
		</div>
	);
};

// ---------------------------------------------------------------- HUD de gravação
export type DefRec = {estado?: string; rotulo?: string; capitulos?: Array<{em: Ref; texto: string}>; inicioTimecode?: number; y?: number};

/** "● REC [BRUTO] 00:00:02:00" à esquerda + capítulo à direita (troca com crossfade de 4 frames). */
export const Rec: React.FC<PropsSobre<DefRec>> = ({d, at, ini}) => {
	const frame = useCurrentFrame();
	const f = frame + (d.inicioTimecode ?? 0) * FPS;
	const s = Math.floor(f / FPS);
	const tc = `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}:${String(Math.floor(f % FPS)).padStart(2, '0')}`;
	const ent = mola(frame, at, 'ui');
	const caps = (d.capitulos ?? []).map((c) => ({...c, t: fr(c.em) - ini}));
	let k = -1;
	caps.forEach((c, i) => {
		if (frame >= c.t) k = i;
	});
	const top = d.y !== undefined ? d.y * H : SEGURO_TOPO - px(30);
	const fonte: React.CSSProperties = {...papel.rotulo, fontSize: px(24), letterSpacing: '.12em'};
	return (
		<div style={{position: 'absolute', left: SEGURO_LADO, right: SEGURO_LADO, top, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: ent, filter: 'drop-shadow(0 2px 10px rgba(0,0,0,.6))'}}>
			<div style={{display: 'flex', alignItems: 'center', gap: px(14), ...fonte, color: '#F5F4F2'}}>
				<div style={{width: px(16), height: px(16), borderRadius: 99, background: corDe('problema'), opacity: 0.4 + 0.6 * (Math.sin(frame / 6) > 0 ? 1 : 0), boxShadow: `0 0 10px ${corDe('problema')}`}} />
				<span style={{fontWeight: 700}}>{d.estado ?? 'rec'}</span>
				{d.rotulo ? <span style={{padding: `${px(4)}px ${px(12)}px`, border: '1.5px solid rgba(255,255,255,.7)', borderRadius: px(6), fontWeight: 700}}>{d.rotulo}</span> : null}
				<span style={{color: '#B9B5C6', fontWeight: 500}}>{tc}</span>
			</div>
			{k >= 0 ? (
				<div style={{position: 'relative', ...fonte, color: '#F5F4F2', padding: `${px(8)}px ${px(16)}px`, borderRadius: 99, border: '1.5px solid rgba(255,255,255,.22)', background: 'rgba(12,10,18,.6)'}}>
					{caps.map((c, i) => {
						const o = i === k ? prog(frame, c.t, 4) : i === k - 1 ? 1 - prog(frame, caps[k].t, 4) : 0;
						return o > 0.01 ? (
							<span key={i} style={{opacity: o, position: i === k ? 'relative' : 'absolute', left: i === k ? undefined : px(16)}}>
								<span style={{color: cor.acentoClaro}}>{String(i + 1).padStart(2, '0')}</span> {c.texto}
							</span>
						) : null;
					})}
				</div>
			) : null}
		</div>
	);
};

// ---------------------------------------------------------------- lista de passos (com o orador em card)
export type DefPassos = {rotulo?: string; titulo: string; itens: Array<{titulo: string; sub?: string; icone?: string; em: Ref}>; y?: number; iconeGrande?: boolean};

/**
 * Layout dividido: rótulo mono + título de 2 linhas + 3 itens à esquerda; o item ativo (pelo
 * marco da fala) ganha caixa de vidro no acento, os outros ficam a 40%. Tile grande com o
 * ícone do item ativo e 2 anéis pulsando à direita, acima do card do orador.
 * Use com `card` na cena orador (o card padrão ocupa o canto inferior direito).
 */
export const Passos: React.FC<PropsSobre<DefPassos>> = ({d, at, ini}) => {
	const frame = useCurrentFrame();
	const ts = d.itens.map((x) => fr(x.em) - ini - 3);
	let k = -1;
	ts.forEach((t, i) => {
		if (frame >= t) k = i;
	});
	const larg = W * 0.54;
	const linhas = d.titulo.split('|');
	const it = k >= 0 ? d.itens[k] : d.itens[0];
	const pTile = mola(frame, k >= 0 ? ts[k] : at + 6, 'pop');
	const top = (d.y ?? 0.13) * H;
	return (
		<>
			<div style={{position: 'absolute', left: SEGURO_LADO, width: larg, top}}>
				{d.rotulo ? (
					<RotuloMono at={at} tam={px(24)} cor="#CFC9E2" style={{marginBottom: px(14)}}>
						● {d.rotulo}
					</RotuloMono>
				) : null}
				{linhas.map((l, i) => (
					<TextoMisto key={i} texto={l} at={at + 2 + i * 3} tam={px(92)} alinhar="left" cor="#FFFFFF" style={{lineHeight: 1.04, letterSpacing: '-.04em', whiteSpace: 'nowrap'}} />
				))}
				<div style={{display: 'flex', flexDirection: 'column', gap: px(16), marginTop: px(40)}}>
					{d.itens.map((x, i) => {
						const ativo = i === k;
						const e = mola(frame, at + 6 + i * 2, 'ui');
						const acende = ativo ? prog(frame, ts[i], 6) : 0;
						return (
							<div
								key={i}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: px(22),
									padding: `${px(16)}px ${px(20)}px`,
									borderRadius: px(22),
									background: alfa(cor.acento, 0.18 * acende),
									border: `1.5px solid ${alfa(cor.acentoClaro, 0.5 * acende + 0.06)}`,
									boxShadow: acende > 0 ? `0 0 ${30 * acende}px ${alfa(cor.acento, 0.25 * acende)}` : undefined,
									opacity: (frame < at + 6 + i * 2 ? 0 : e) * (ativo ? 1 : 0.42),
									transform: `translateY(${(1 - e) * 16}px)`,
								}}
							>
								<div style={{width: px(84), height: px(84), borderRadius: px(22), flexShrink: 0, background: `linear-gradient(150deg, ${cor.acento}, ${tonalidade(cor.acento, -0.35)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: ativo ? `0 0 24px ${alfa(cor.acento, 0.6)}` : undefined}}>
									<Icone nome={x.icone ?? 'check'} tam={px(42)} cor="#FFFFFF" espessura={2} />
								</div>
								<div style={{minWidth: 0}}>
									<div style={{...papel.frase, fontSize: px(44), color: '#FFFFFF', letterSpacing: '-.025em', whiteSpace: 'nowrap'}}>{x.titulo}</div>
									{x.sub ? <div style={{...papel.frase, fontWeight: 500, fontSize: px(28), color: '#B9B4CC', marginTop: px(2), whiteSpace: 'nowrap'}}>{x.sub}</div> : null}
								</div>
							</div>
						);
					})}
				</div>
			</div>
			{d.iconeGrande !== false ? (
				<div style={{position: 'absolute', left: W * 0.755 - px(150), top: H * 0.27 - px(150), width: px(300), height: px(300), opacity: mola(frame, at + 4, 'ui')}}>
					{[1, 0.72].map((r, i) => (
						<div key={i} style={{position: 'absolute', inset: `${((1 - r) / 2) * 100}%`, borderRadius: 999, border: `1.5px solid ${alfa(cor.acentoClaro, 0.22 + i * 0.1)}`, transform: `scale(${1 + 0.03 * Math.sin(frame / 10 + i)})`}} />
					))}
					<div
						style={{
							position: 'absolute',
							inset: '25%',
							borderRadius: px(36),
							background: `linear-gradient(150deg, ${tonalidade(cor.acento, 0.15)}, ${tonalidade(cor.acento, -0.3)})`,
							boxShadow: `0 0 50px ${alfa(cor.acento, 0.55)}, inset 0 2px 0 rgba(255,255,255,.25)`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							transform: `scale(${0.85 + 0.15 * pTile})`,
						}}
					>
						<Icone nome={it.icone ?? 'check'} tam={px(76)} cor="#FFFFFF" espessura={2} />
					</div>
				</div>
			) : null}
		</>
	);
};

// ---------------------------------------------------------------- cards flutuantes
export type DefCards = {itens: Array<{numero?: string; titulo: string; sub?: string}>; y?: number};

/** 2-3 cards inclinados ±8° ao lado da cabeça: sobem 80 px girando 6° a mais, spring 16/180, stagger 4; flutuam (seno). */
export const Cards: React.FC<PropsSobre<DefCards>> = ({d, at}) => {
	const frame = useCurrentFrame();
	const cw = px(290);
	const ch = px(450);
	const pos = d.itens.length === 3 ? [0.04, 0.37, 0.7] : [0.035, 0.7];
	const rot = d.itens.length === 3 ? [-8, 0, 8] : [-8, 8];
	return (
		<>
			{d.itens.map((it, i) => {
				const s = mola(frame, at + i * 4, 'card');
				const r = rot[i] ?? 0;
				const flut = Math.sin((frame + i * 17) / 20) * 6;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: (pos[i] ?? 0.5) * W,
							top: (d.y ?? 0.3) * H + flut,
							width: cw,
							height: ch,
							borderRadius: px(28),
							border: `${px(4)}px solid rgba(255,255,255,.92)`,
							background: `linear-gradient(165deg, ${tonalidade(cor.acento, -0.25)}, ${tonalidade(cor.acento, -0.72)} 70%)`,
							boxShadow: `0 30px 60px rgba(0,0,0,.5), 0 0 40px ${alfa(cor.acento, 0.35)}`,
							opacity: frame < at + i * 4 ? 0 : Math.min(1, s * 1.5),
							transform: `translateY(${(1 - s) * 80}px) rotate(${r + (1 - s) * 6 * Math.sign(r || 1)}deg)`,
							padding: px(26),
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'flex-end',
							overflow: 'hidden',
						}}
					>
						{it.numero ? <div style={{...papel.numero, fontSize: px(120), color: '#FFFFFF', lineHeight: 0.9, marginBottom: px(14)}}>{it.numero}</div> : null}
						<div style={{...papel.frase, fontSize: px(40), color: '#FFFFFF', lineHeight: 1.05}}>{it.titulo}</div>
						{it.sub ? <div style={{...papel.frase, fontWeight: 500, fontSize: px(26), color: 'rgba(255,255,255,.7)', marginTop: px(6)}}>{it.sub}</div> : null}
					</div>
				);
			})}
		</>
	);
};

// ---------------------------------------------------------------- pill de CTA
export type DefPill = {texto: string; icone?: string; y?: number};

/** Pill pequena com gradiente do acento logo abaixo da legenda; entra no "toque/clique" e fica até o fim. */
export const PillCta: React.FC<PropsSobre<DefPill>> = ({d, at}) => {
	const frame = useCurrentFrame();
	const s = mola(frame, at, 'pop');
	const pulso = 0.8 + 0.2 * Math.sin(frame / 7);
	const tam = px(38);
	return (
		<div style={{position: 'absolute', left: 0, width: W, top: (d.y ?? 0.68) * H, display: 'flex', justifyContent: 'center'}}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: tam * 0.45,
					padding: `${tam * 0.42}px ${tam * 0.9}px`,
					borderRadius: 999,
					background: cor.gradAcento,
					color: '#FFFFFF',
					...papel.frase,
					fontWeight: 700,
					fontSize: tam,
					letterSpacing: '-.01em',
					boxShadow: `0 0 ${36 * pulso}px ${alfa(cor.acento, 0.6)}, inset 0 1px 0 rgba(255,255,255,.35)`,
					opacity: frame < at ? 0 : Math.min(1, s * 1.5),
					transform: `scale(${0.8 + 0.2 * s})`,
				}}
			>
				{d.texto}
				<Icone nome={d.icone ?? 'arrowDown'} tam={tam} cor="#FFFFFF" espessura={2.4} style={{transform: `translateY(${Math.sin(frame / 5) * 3}px)`}} />
			</div>
		</div>
	);
};

// ---------------------------------------------------------------- card final
export type DefFinal = {marca: string; rotulo?: string; slogan?: string; url?: string};

/** Card final (1-2 s): fundo escuro com halo, marca, slogan, endereço e seta para baixo. */
export const CardFinal: React.FC<PropsSobre<DefFinal>> = ({d, at}) => {
	const frame = useCurrentFrame();
	const f = prog(frame, at, 8);
	const blocos = [
		d.rotulo ? <RotuloMono key="r" at={at + 2} tam={px(30)} cor="#D6D1E6" style={{marginBottom: px(10)}}>{d.rotulo}</RotuloMono> : null,
		<TextoMisto key="m" texto={d.marca} at={at + 3} tam={px(150)} entrada="mascara" gradiente style={{letterSpacing: '-.05em'}} />,
		d.slogan ? <TextoMisto key="s" texto={d.slogan} at={at + 8} tam={px(64)} cor="#F5F4F2" style={{marginTop: px(22)}} /> : null,
		d.url ? <div key="u" style={{...papel.rotulo, textTransform: 'none', letterSpacing: '.04em', fontSize: px(36), color: '#B9B4CC', marginTop: px(34), opacity: prog(frame, at + 12, 8)}}>{d.url}</div> : null,
	];
	return (
		<AbsoluteFill style={{opacity: f, background: `radial-gradient(60% 40% at 50% 46%, ${alfa(cor.acento, 0.32)}, transparent 70%), ${cor.fundo}`}}>
			<div style={{position: 'absolute', left: SEGURO_LADO, right: SEGURO_LADO, top: AREA.topo, bottom: H - AREA.base, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
				{blocos}
				<div style={{marginTop: px(60), width: px(96), height: px(96), borderRadius: 999, border: `2px solid ${alfa(cor.acentoClaro, 0.7)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: brilho(cor.acento, 0.8), opacity: prog(frame, at + 14, 8), transform: `translateY(${Math.sin(frame / 6) * 8}px)`}}>
					<Icone nome="arrowDown" tam={px(48)} cor={cor.acentoClaro} espessura={2.4} />
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- registro
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SOBRE: Record<string, {comp: React.FC<PropsSobre<any>>; camada: 'atras' | 'frente'}> = {
	titulo: {comp: Titulo2L, camada: 'atras'},
	riscado: {comp: (p) => <Titulo2L {...p} d={{risca: true, ...p.d}} />, camada: 'atras'},
	numero: {comp: NumeroRola, camada: 'atras'},
	chips: {comp: Chips, camada: 'frente'},
	objecoes: {comp: Objecoes, camada: 'frente'},
	comando: {comp: Comando, camada: 'frente'},
	rec: {comp: Rec, camada: 'frente'},
	passos: {comp: Passos, camada: 'frente'},
	cards: {comp: Cards, camada: 'frente'},
	pill: {comp: PillCta, camada: 'frente'},
	final: {comp: CardFinal, camada: 'frente'},
};

export type ItemSobre = {tipo: string; em: Ref; ate?: Ref; camada?: 'atras' | 'frente'; [campo: string]: unknown};

/**
 * Desenha os itens `sobre` de uma camada. Entrada: o próprio componente (a partir de `em`,
 * antecipado 3 frames). Saída em `ate`: opacidade, blur 8 px e sobe 10 px em 6 frames.
 */
export const CamadaSobre: React.FC<{itens?: ItemSobre[]; camada: 'atras' | 'frente'; ini: number}> = ({itens = [], camada, ini}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{itens.map((it, i) => {
				const reg = SOBRE[it.tipo];
				if (!reg) throw new Error(`sobreposição desconhecida: ${it.tipo}`);
				if ((it.camada ?? reg.camada) !== camada) return null;
				const at = local(it.em, ini, 0) - 3;
				if (frame < at - 1) return null;
				const t1 = it.ate !== undefined ? fr(it.ate) - ini : Infinity;
				const sai = frame >= t1 ? prog(frame, t1, 6) : 0;
				if (sai >= 1) return null;
				const Comp = reg.comp;
				return (
					<AbsoluteFill key={i} style={sai > 0 ? {opacity: 1 - sai, filter: `blur(${sai * 8}px)`, transform: `translateY(${-sai * 10}px)`} : undefined}>
						<Comp d={it} at={at} ini={ini} />
					</AbsoluteFill>
				);
			})}
		</AbsoluteFill>
	);
};
