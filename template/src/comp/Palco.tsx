import React from 'react';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {AbsoluteFill, spring, useCurrentFrame} from 'remotion';
import {alfa, AREA, corDe, FPS, H, MOLAS, papel, px, VARIANTE, W} from '../theme';
import {fr, type Ref} from '../tempo';

/*
 * Palco: envelope das cenas do estilo padrão.
 *   câmera virtual (afastar para revelar, aproximar, pan) -> spring {damping 200, mass 1.2}, 16 frames
 *   carimbos (texto em caixa com borda batendo na tela) -> spring {stiffness 400, damping 18, mass .6}
 *   flash de tela colorido (3 frames) e tremor de câmera (4 frames) no frame do carimbo
 *   motion blur de câmera (opcional, só enquanto a câmera se move)
 * O som do carimbo/afastamento vem do plano de SFX (categoria "impacto", mesmo `em`).
 */

export type ChaveCamera = {em: Ref; escala?: number; x?: number; y?: number};
export type DefCarimbo = {texto: string; em: Ref; cor?: string; x?: number; y?: number; rot?: number; tam?: number};

type Pose = {escala: number; x: number; y: number};

/** Pose da câmera no frame (frame local), interpolando por spring de chave em chave. */
export const poseCamera = (frame: number, ini: number, inicial: Pose, chaves: ChaveCamera[] = []) => {
	let pose = inicial;
	let movendo = false;
	for (const c of chaves) {
		const t = fr(c.em) - ini;
		if (frame < t) break;
		const s = spring({frame: frame - t, fps: FPS, ...MOLAS.camera});
		if (s < 0.985) movendo = true;
		const alvo = {escala: c.escala ?? pose.escala, x: c.x ?? pose.x, y: c.y ?? pose.y};
		pose = {
			escala: pose.escala + (alvo.escala - pose.escala) * s,
			x: pose.x + (alvo.x - pose.x) * s,
			y: pose.y + (alvo.y - pose.y) * s,
		};
	}
	return {pose, movendo};
};

/** Deslocamento do tremor (4 frames, amplitude caindo) a partir dos frames `ts`. */
export const tremor = (frame: number, ts: number[], amp = 9) => {
	let dx = 0;
	let dy = 0;
	for (const t of ts) {
		const d = frame - t;
		if (d >= 0 && d < 4) {
			const k = 1 - d / 4;
			dx += Math.sin(d * 7.3 + t) * amp * k;
			dy += Math.cos(d * 5.1 + t) * amp * 0.7 * k;
		}
	}
	return {dx, dy};
};

/** Carimbo: caixa com borda grossa, rotação ~-7°, bate de 1,6x para 1x. `at` = frame local. */
export const Carimbo: React.FC<{def: DefCarimbo; at: number}> = ({def, at}) => {
	const frame = useCurrentFrame();
	if (frame < at) return null;
	const s = spring({frame: frame - at, fps: FPS, ...MOLAS.carimbo});
	const c = corDe(def.cor ?? 'problema');
	const escura = VARIANTE === 'escura';
	// cabe em ~84% da largura (caixa-alta pesada ~0,66 em por caractere)
	const tam = Math.min(def.tam ?? px(92), (W * 0.84) / (def.texto.length * 0.66 + 0.7));
	const escala = 1.6 - 0.6 * s;
	return (
		<div
			style={{
				position: 'absolute',
				left: (def.x ?? 0.5) * W,
				top: def.y !== undefined ? def.y * H : AREA.topo + AREA.altura * 0.45,
				transform: `translate(-50%, -50%) rotate(${def.rot ?? -7}deg) scale(${escala})`,
				opacity: Math.min(1, s * 4),
				zIndex: 30,
			}}
		>
			<div
				style={{
					...papel.frase,
					fontSize: tam,
					lineHeight: 1,
					letterSpacing: '-.02em',
					textTransform: 'uppercase',
					whiteSpace: 'nowrap',
					color: escura ? c : c,
					padding: `${tam * 0.16}px ${tam * 0.32}px ${tam * 0.2}px`,
					border: `${Math.max(5, tam * 0.07)}px solid ${c}`,
					borderRadius: tam * 0.14,
					background: escura ? alfa('#0A0607', 0.82) : alfa('#FFFFFF', 0.9),
					boxShadow: `0 0 ${tam * 0.3}px ${alfa(c, 0.55)}, inset 0 0 ${tam * 0.4}px ${alfa(c, 0.18)}`,
					textShadow: escura ? `0 0 ${tam * 0.22}px ${alfa(c, 0.7)}` : undefined,
				}}
			>
				{def.texto}
			</div>
		</div>
	);
};

/** Flash de tela inteira na cor, 3 frames, começando forte. */
export const Flash: React.FC<{at: number; cor: string; forca?: number}> = ({at, cor: c, forca = 0.28}) => {
	const frame = useCurrentFrame();
	const d = frame - at;
	if (d < 0 || d > 3) return null;
	return <AbsoluteFill style={{background: c, opacity: forca * (1 - d / 3), pointerEvents: 'none', zIndex: 40}} />;
};

/**
 * Envelope de cena do estilo padrão. `ini` = frame absoluto em que o Sequence começa.
 * `camera` = chaves [{em, escala, x, y}] (x/y em px, a partir do centro da área útil).
 * `cameraInicial` = pose antes da 1ª chave (ex.: {escala: 2.4} para começar perto e afastar).
 * `motionBlur` liga o CameraMotionBlur só enquanto a câmera anda (custo: ~samples x o render).
 */
export const Palco: React.FC<{
	ini: number;
	children: React.ReactNode;
	camera?: ChaveCamera[];
	cameraInicial?: Partial<Pose>;
	carimbos?: DefCarimbo[];
	motionBlur?: boolean;
	origem?: [number, number];
}> = ({ini, children, camera, cameraInicial, carimbos = [], motionBlur = false, origem}) => {
	const frame = useCurrentFrame();
	const inicial: Pose = {escala: 1, x: 0, y: 0, ...cameraInicial};
	const {pose, movendo} = poseCamera(frame, ini, inicial, camera);
	const tCarimbos = carimbos.map((c) => fr(c.em) - ini);
	const {dx, dy} = tremor(frame, tCarimbos);
	const ox = origem ? origem[0] : W / 2;
	const oy = origem ? origem[1] : AREA.topo + AREA.altura / 2;
	const cena = (
		<AbsoluteFill
			style={{
				transform: `translate(${pose.x}px, ${pose.y}px) scale(${pose.escala})`,
				transformOrigin: `${ox}px ${oy}px`,
			}}
		>
			{children}
		</AbsoluteFill>
	);
	return (
		<AbsoluteFill style={{transform: dx || dy ? `translate(${dx}px, ${dy}px)` : undefined}}>
			{motionBlur && movendo ? (
				<CameraMotionBlur shutterAngle={180} samples={6}>
					{cena}
				</CameraMotionBlur>
			) : (
				cena
			)}
			{carimbos.map((c, i) => (
				<React.Fragment key={i}>
					<Carimbo def={c} at={tCarimbos[i]} />
					<Flash at={tCarimbos[i]} cor={corDe(c.cor ?? 'problema')} />
				</React.Fragment>
			))}
		</AbsoluteFill>
	);
};
