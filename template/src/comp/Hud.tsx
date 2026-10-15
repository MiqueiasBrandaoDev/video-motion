import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {alfa, cor, corDe, CFG, H, HUD, px, QUADRO45, VARIANTE, W} from '../theme';
import {fr} from '../tempo';
import {TextoMisto} from './Tipografia';

/*
 * Elementos fixos (HUD): ficam FORA das cenas e das transições, o vídeo inteiro.
 *   BarraCapitulos: segmentos finos no topo; o do capítulo atual enche durante o capítulo,
 *                   os concluídos ficam cheios na cor do capítulo (problema x solução).
 *   TituloFixo:     título do vídeo em 2 linhas com tipografia mista (config.hud.titulo).
 *   Quadro45:       escurece o que fica fora do 4:5 central (config.hud.quadro45).
 * Configuração em config.json -> "hud".
 */

export const BarraCapitulos: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const caps = CFG.hud?.capitulos ?? [];
	if (!caps.length) return null;
	const lado = px(84);
	const gap = px(10);
	const n = caps.length;
	const larg = (W - 2 * lado - gap * (n - 1)) / n;
	const inicios = caps.map((c) => fr(c.inicio));
	const entra = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<div style={{position: 'absolute', left: lado, top: HUD.barraY, display: 'flex', gap, opacity: entra}}>
			{caps.map((c, i) => {
				const ini = inicios[i];
				const fim = i < n - 1 ? inicios[i + 1] : durationInFrames;
				const p = interpolate(frame, [ini, Math.max(ini + 1, fim)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
				const cc = corDe(c.cor);
				return (
					<div key={i} style={{width: larg, height: px(7), borderRadius: 99, background: VARIANTE === 'escura' ? 'rgba(255,255,255,.12)' : 'rgba(20,20,20,.12)', overflow: 'hidden'}}>
						<div
							style={{
								width: `${p * 100}%`,
								height: '100%',
								borderRadius: 99,
								background: c.cor === 'problema' ? cc : `linear-gradient(90deg, ${cc}, ${corDe('acento2')})`,
								boxShadow: p > 0 ? `0 0 10px ${alfa(cc, 0.6)}` : undefined,
							}}
						/>
					</div>
				);
			})}
		</div>
	);
};

export const TituloFixo: React.FC = () => {
	const titulo = CFG.hud?.titulo;
	if (!titulo) return null;
	return (
		<div style={{position: 'absolute', left: px(84), right: px(84), top: HUD.tituloY}}>
			{titulo.split('|').map((l, i) => (
				<TextoMisto key={i} texto={l} at={2 + i * 4} tam={px(68)} alinhar="left" entrada="palavra" style={{lineHeight: 1.08, letterSpacing: '-.03em'}} />
			))}
		</div>
	);
};

export const Quadro45: React.FC = () => {
	if (!QUADRO45) return null;
	const faixa = Math.round((H - (W * 5) / 4) / 2);
	const c = VARIANTE === 'escura' ? cor.fundo : cor.fundo;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: faixa, background: `linear-gradient(180deg, ${c} 70%, ${alfa(c, 0)})`}} />
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: faixa, background: `linear-gradient(0deg, ${c} 70%, ${alfa(c, 0)})`}} />
		</AbsoluteFill>
	);
};

/** Tudo o que é fixo, na ordem certa. */
export const Hud: React.FC = () => (
	<>
		<Quadro45 />
		<BarraCapitulos />
		<TituloFixo />
	</>
);
