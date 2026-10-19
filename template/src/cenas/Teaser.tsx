import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {FiltroRGB, Grao, OSD, Scanlines, Tracking, Triangulos, tremor, Vinheta} from '../comp/Fita';
import {CamadaVideo, escalaPunch, type Enquadramento} from '../comp/Orador';
import {alfa, CFG, cor, FPS, H, papel, px, SEGURO_LADO, SEGURO_TOPO, W} from '../theme';
import {fr} from '../tempo';
import type {CenaTeaser, CenaVolta, PropsCena} from './tipos';

/*
 * Teaser (cold open / flash-forward) e volta ao começo. Ver references/roteiros-e-ganchos.md,
 * estrutura "teaser", e scripts/cortar_video.py (campo "teaser" do cortes.json).
 *
 * Timeline gerada pelo cortar_video.py com teaser:
 *   [teaser: frase de impacto, voz de megafone] [volta: silêncio, vídeo congelado] [corpo]
 *   blocos: "teaser" (0), "volta" (fim do teaser), primeiro bloco do corpo, ... e "payoff"
 *   (onde a frase do teaser reaparece no corpo).
 *
 * cenas.json:
 *   {"id": "teaser", "tipo": "teaser", "inicio": 0, "rotulo": "daqui a pouco", "grao": 0.4, "tremor": 1}
 *   {"id": "volta",  "tipo": "volta",  "inicio": "bloco:volta"}
 *   {"id": "gancho", "tipo": "orador", "inicio": "bloco:gancho", ...}   <- corpo, colorido
 */

const ORADOR = (CFG as {orador?: {video?: string; enquadramento?: Enquadramento}}).orador ?? {};

/** Frame de uma referência, ou null se ela não existir (ex.: projeto sem "payoff"). */
const frOuNulo = (ref: string | number) => {
	try {
		return fr(ref);
	} catch {
		return null;
	}
};

/** teaser: o trecho do payoff em preto e branco, com grão, vinheta, tremor leve opcional e rótulo pequeno. */
export const TeaserCena: React.FC<PropsCena<CenaTeaser>> = ({def, ini, dur}) => {
	const frame = useCurrentFrame();
	const enq: Enquadramento = {...ORADOR.enquadramento, ...def.enquadramento};
	const tr = tremor(frame, def.tremor ?? 0, 'teaser');
	const aproxima = 1 + (def.aproxima ?? 0.05) * Math.min(1, frame / Math.max(1, dur));
	const escala = escalaPunch(frame, ini, def.punch) * aproxima * (def.tremor ? 1.03 : 1);
	const pb = def.pb ?? 1;
	const entraRotulo = interpolate(frame, [2, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const pisca = def.rotulo ? (Math.floor(frame / (FPS * 0.5)) % 2 === 0 ? 1 : 0.35) : 0;
	return (
		<AbsoluteFill style={{background: cor.fundo}}>
			<AbsoluteFill style={{transform: `translate(${tr.x}px, ${tr.y}px) rotate(${tr.r}deg)`, filter: `contrast(${1 + 0.18 * pb})`}}>
				<CamadaVideo arquivo={def.video ?? ORADOR.video ?? 'orador.mp4'} de={def.de ?? ini} enq={enq} escala={escala} pb={pb} marcacao />
			</AbsoluteFill>
			<Vinheta forca={def.vinheta ?? 0.6} />
			<Grao forca={def.grao ?? 0.35} id="vm-grao-teaser" />
			{def.rotulo ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: SEGURO_TOPO + px(26), display: 'flex', justifyContent: 'center', opacity: entraRotulo}}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: px(14),
							padding: `${px(12)}px ${px(22)}px`,
							borderRadius: 999,
							background: 'rgba(10,10,12,.55)',
							border: `${px(2)}px solid rgba(255,255,255,.22)`,
							...papel.rotulo,
							fontSize: px(26),
							color: '#FFFFFF',
						}}
					>
						<div style={{opacity: pisca}}>
							<Triangulos tam={px(24)} sentido={1} cor={cor.acento} />
						</div>
						{def.rotulo}
					</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/**
 * volta: a fita rebobina do payoff até o começo do corpo (frames do orador.mp4 de trás para
 * frente, acelerando e freando), com scanlines, faixas de tracking, aberração cromática, OSD
 * "◀◀ REW" e contador regressivo; o P&B do teaser vira cor no fim e um flash curto entrega
 * o primeiro quadro colorido do corpo. Som: scripts/som_volta.py (categoria transicao).
 */
export const VoltaCena: React.FC<PropsCena<CenaVolta>> = ({def, ini, dur}) => {
	const frame = useCurrentFrame();
	const enq: Enquadramento = {...ORADOR.enquadramento, ...def.enquadramento};
	const fAte = def.ate !== undefined ? fr(def.ate) : ini + dur; // primeiro quadro do corpo
	const fDe = (def.de !== undefined ? frOuNulo(def.de) : frOuNulo('bloco:payoff')) ?? Math.max(0, ini - 1);
	const u = dur > 1 ? Math.min(1, frame / (dur - 1)) : 1;
	const e = Easing.inOut(Easing.cubic)(u);
	const fonte = Math.round(fDe + (fAte - fDe) * e); // quadro do orador.mp4 mostrado agora
	const forca = def.forca ?? 1;
	const k = (0.35 + 0.65 * Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.08)), 0.7)) * forca; // intensidade (pico no meio)
	const pb = interpolate(u, [0, 0.55, 0.92], [def.pbInicial ?? 1, 0.8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const jit = Math.floor(frame / 1);
	const dx = (random(`volta-x-${jit}`) - 0.5) * px(18) * k;
	const skew = (random(`volta-s-${jit}`) - 0.5) * 2.2 * k;
	const rgb = Math.round(px(3) + px(9) * k);
	const flash = interpolate(frame, [dur - 5, dur - 3, dur - 1], [0, 0.5 * forca, 0.06], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	// contador regressivo do corpo: do payoff até 00:00
	const seg = Math.max(0, (fonte - fAte) / FPS);
	const tc = `${String(Math.floor(seg / 60)).padStart(2, '0')}:${String(Math.floor(seg % 60)).padStart(2, '0')}`;
	const idRgb = 'vm-rgb-volta';
	return (
		<AbsoluteFill style={{background: cor.fundo, overflow: 'hidden'}}>
			<FiltroRGB id={idRgb} d={rgb} />
			<AbsoluteFill style={{transform: `translateX(${dx}px) skewX(${skew}deg) scaleY(${1 + 0.015 * k})`, filter: `url(#${idRgb}) contrast(${1.08 + 0.1 * k}) saturate(${1 + 0.25 * k})`}}>
				<CamadaVideo arquivo={def.video ?? ORADOR.video ?? 'orador.mp4'} de={fonte - frame} enq={enq} pb={pb} marcacao />
			</AbsoluteFill>
			<Scanlines forca={0.12 + 0.16 * k} />
			<Tracking p={u} forca={k} />
			<Vinheta forca={0.45} />
			<Grao forca={0.25 * k} id="vm-grao-volta" />
			<div style={{position: 'absolute', left: SEGURO_LADO, top: SEGURO_TOPO + px(24)}}>
				<OSD>
					<Triangulos tam={px(40)} />
					{def.rotulo ?? 'REW'}
				</OSD>
			</div>
			<div style={{position: 'absolute', right: SEGURO_LADO, top: SEGURO_TOPO + px(24)}}>
				<OSD style={{fontVariantNumeric: 'tabular-nums'}}>{tc}</OSD>
			</div>
			{flash > 0.005 ? <AbsoluteFill style={{background: alfa('#FFFFFF', flash), pointerEvents: 'none'}} /> : null}
			<AbsoluteFill style={{pointerEvents: 'none', boxShadow: `inset 0 0 ${px(120)}px rgba(0,0,0,${0.35 * k})`, width: W, height: H}} />
		</AbsoluteFill>
	);
};
