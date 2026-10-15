import React from 'react';
import {interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame} from 'remotion';
import {alfa, brilho, cor, FPS, H, MOLAS, papel, px, W} from '../theme';
import {fr, type Ref} from '../tempo';
import {existe, Silhueta} from './Recorte';

/*
 * Orador (talking head): o vídeo do rosto em tela cheia com reenquadramento, punch-in nas
 * palavras-chave, preto e branco no "jeito antigo" e encolhimento para card. Usado pela cena
 * `orador` (cenas/Orador.tsx), pelo duelo e pelo letterbox.
 *
 * Sincronia: o vídeo de entrada é cortado com os MESMOS trechos e o mesmo `tempo` da voz
 * (scripts/cortar_video.py), então o frame N do arquivo é o frame N da timeline. Cada cena
 * passa `trimBefore = ini` (frame absoluto em que ela começa).
 *
 * Enquadramento (vídeo fonte 16:9 ou 9:16, sem precisar saber o tamanho):
 *   x, y  posição do recorte (object-position, 0-1): 0 = encosta na esquerda/topo, 1 = direita/base
 *   zoom  escala extra sobre o "cobrir a tela" (1 = só cobre; 1,2 = fecha no rosto)
 *   foco  altura do rosto no quadro (0-1), origem do zoom e do punch-in (padrão 0,38)
 *   desce desloca o vídeo para baixo (fração da altura) para abrir espaço acima da cabeça
 *         quando a fonte não tem respiro (comum em 16:9). A borda de cima do vídeo de fundo
 *         funde com o fundo de grade em 12% da altura; a pessoa recortada (alfa) desce junto, nítida.
 */

export type Enquadramento = {x?: number; y?: number; zoom?: number; foco?: number; desce?: number};
/** Punch-in: aproxima até `escala` (padrão 1,12) na palavra `em`; volta em `ate` (ou fica). */
export type PunchIn = {em: Ref; escala?: number; ate?: Ref};
/** Trecho em preto e branco ("jeito antigo"): entra em 6 frames, sai em 8. */
export type TrechoPB = {de: Ref; ate?: Ref};
export type Ret = {x: number; y: number; w: number; h: number; raio?: number};
export type PosLegenda = 'rosto' | 'base' | 'esquerda' | 'oculta' | number;
/** Orador encolhe para card em `em` (10 frames) e volta em `ate`. `ret` em px do quadro final. */
export type CardOrador = {em: Ref; ate?: Ref; ret?: Partial<Ret>; legenda?: PosLegenda};

export const TELA: Ret = {x: 0, y: 0, w: W, h: H, raio: 0};
/** Card padrão: canto inferior direito, ~40% da largura (layout "lista à esquerda, orador à direita"). */
export const CARD_PADRAO: Ret = {x: Math.round(W * 0.553), y: Math.round(H * 0.44), w: Math.round(W * 0.403), h: Math.round(H * 0.4), raio: px(28)};

export const misturaRet = (a: Ret, b: Ret, p: number): Ret => ({
	x: a.x + (b.x - a.x) * p,
	y: a.y + (b.y - a.y) * p,
	w: a.w + (b.w - a.w) * p,
	h: a.h + (b.h - a.h) * p,
	raio: (a.raio ?? 0) + ((b.raio ?? 0) - (a.raio ?? 0)) * p,
});

const mola = (frame: number, t: number, tipo: keyof typeof MOLAS) => (frame < t ? 0 : spring({frame: frame - t, fps: FPS, ...MOLAS[tipo]}));

/** Escala do punch-in no frame local (chaves encadeadas, cada uma com spring de 12 frames). */
export const escalaPunch = (frame: number, ini: number, punch: PunchIn[] = []) => {
	let v = 1;
	for (const p of punch) {
		const t = fr(p.em) - ini;
		if (frame < t) break;
		v += ((p.escala ?? 1.12) - v) * mola(frame, t, 'punch');
		if (p.ate !== undefined) {
			const t2 = fr(p.ate) - ini;
			if (frame >= t2) v += (1 - v) * mola(frame, t2, 'punch');
		}
	}
	return v;
};

/** Nível de preto e branco 0..1 (grayscale interpolado em 6 frames na entrada, 8 na saída). */
export const nivelPB = (frame: number, ini: number, pb: TrechoPB[] = []) => {
	let g = 0;
	for (const t of pb) {
		const a = fr(t.de) - ini;
		const b = t.ate !== undefined ? fr(t.ate) - ini : 1e9;
		g = Math.max(g, interpolate(frame, [a, a + 6, b, b + 8], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
	}
	return g;
};

/** Progresso 0..1 do orador virando card (spring damping 200, 10 frames; volta igual). */
export const progCard = (frame: number, ini: number, card?: CardOrador) => {
	if (!card) return 0;
	const t = fr(card.em) - ini;
	let p = mola(frame, t, 'encolhe');
	if (card.ate !== undefined) p *= 1 - mola(frame, fr(card.ate) - ini, 'encolhe');
	return p;
};

export const retCard = (card?: CardOrador): Ret => ({...CARD_PADRAO, ...(card?.ret ?? {})});

/**
 * Uma camada de vídeo do orador dentro de um retângulo. Fonte e recorte (alfa) usam a MESMA
 * camada com os mesmos parâmetros, para ficarem alinhados pixel a pixel.
 */
export const CamadaVideo: React.FC<{
	arquivo?: string;
	de: number;
	ret?: Ret;
	enq?: Enquadramento;
	escala?: number;
	pb?: number;
	transparente?: boolean;
	opacidade?: number;
	marcacao?: boolean;
	style?: React.CSSProperties;
}> = ({arquivo, de, ret = TELA, enq = {}, escala = 1, pb = 0, transparente = false, opacidade = 1, marcacao = false, style}) => {
	const tem = existe(arquivo);
	if (!tem && !marcacao) return null;
	const zoom = (enq.zoom ?? 1) * escala;
	const foco = enq.foco ?? 0.38;
	const filtro = pb > 0.01 ? `grayscale(${pb}) contrast(${1 + 0.1 * pb}) brightness(${1 - 0.04 * pb})` : undefined;
	const desce = (enq.desce ?? 0) * ret.h;
	const mascara =
		desce > 0 && !transparente
			? `linear-gradient(180deg, transparent ${desce}px, #000 ${desce + ret.h * 0.12}px)`
			: undefined;
	return (
		<div
			style={{
				position: 'absolute',
				left: ret.x,
				top: ret.y,
				width: ret.w,
				height: ret.h,
				borderRadius: ret.raio ?? 0,
				overflow: 'hidden',
				opacity: opacidade,
				maskImage: mascara,
				WebkitMaskImage: mascara,
				...style,
			}}
		>
			<div style={{position: 'absolute', inset: 0, transform: `translateY(${desce}px) scale(${zoom})`, transformOrigin: `${(enq.x ?? 0.5) * 100}% ${foco * 100}%`, filter: filtro}}>
				{tem ? (
					<OffthreadVideo
						src={staticFile(arquivo!)}
						trimBefore={Math.max(0, de)}
						muted
						transparent={transparente}
						style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${(enq.x ?? 0.5) * 100}% ${(enq.y ?? 0.5) * 100}%`}}
					/>
				) : (
					<Silhueta />
				)}
			</div>
		</div>
	);
};

/** Moldura do card do orador: borda no acento com glow (aparece junto com o encolhimento). */
export const BordaCard: React.FC<{ret: Ret; p: number}> = ({ret, p}) =>
	p < 0.02 ? null : (
		<div
			style={{
				position: 'absolute',
				left: ret.x,
				top: ret.y,
				width: ret.w,
				height: ret.h,
				borderRadius: ret.raio ?? 0,
				border: `${px(3)}px solid ${alfa(cor.acentoClaro, 0.75 * p)}`,
				boxShadow: `${brilho(cor.acento, 0.9 * p)}, inset 0 0 ${px(30)}px ${alfa(cor.acento, 0.18 * p)}`,
				pointerEvents: 'none',
			}}
		/>
	);

/** Fundo xadrez de transparência (estado "bruto, sem edição"). */
export const Xadrez: React.FC<{opacidade?: number; celula?: number}> = ({opacidade = 1, celula = px(64)}) => (
	<div
		style={{
			position: 'absolute',
			inset: 0,
			opacity: opacidade,
			backgroundColor: '#1D1B24',
			backgroundImage: 'conic-gradient(#2A2733 25%, #1D1B24 0 50%, #2A2733 0 75%, #1D1B24 0)',
			backgroundSize: `${celula}px ${celula}px`,
		}}
	/>
);

/** Moldura de seleção tracejada com 8 alças (editor), etiqueta em cima à esquerda. */
export const MolduraSelecao: React.FC<{ret: Ret; opacidade?: number; etiqueta?: React.ReactNode}> = ({ret, opacidade = 1, etiqueta}) => {
	const a = px(16);
	const alcas = [
		[0, 0],
		[0.5, 0],
		[1, 0],
		[0, 0.5],
		[1, 0.5],
		[0, 1],
		[0.5, 1],
		[1, 1],
	];
	return (
		<div style={{position: 'absolute', left: ret.x, top: ret.y, width: ret.w, height: ret.h, opacity: opacidade, pointerEvents: 'none'}}>
			<div style={{position: 'absolute', inset: 0, border: `${px(3)}px dashed rgba(255,255,255,.85)`}} />
			{alcas.map(([x, y], i) => (
				<div key={i} style={{position: 'absolute', left: x * ret.w - a / 2, top: y * ret.h - a / 2, width: a, height: a, background: '#FFFFFF', borderRadius: px(3), boxShadow: '0 2px 8px rgba(0,0,0,.4)'}} />
			))}
			{etiqueta ? <div style={{position: 'absolute', left: 0, bottom: '100%', marginBottom: px(16)}}>{etiqueta}</div> : null}
		</div>
	);
};

/** Etiqueta de estado (BRUTO · sem edição -> ✓ EDITADO) com pop na troca. */
export const EtiquetaEstado: React.FC<{texto: string; destaque?: boolean; pop?: number}> = ({texto, destaque = false, pop = 1}) => (
	<div
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: px(12),
			padding: `${px(10)}px ${px(20)}px`,
			borderRadius: px(12),
			background: destaque ? cor.gradAcento : 'rgba(245,244,242,.94)',
			color: destaque ? '#FFFFFF' : '#141416',
			...papel.frase,
			fontWeight: 700,
			fontSize: px(32),
			letterSpacing: '-.01em',
			boxShadow: destaque ? brilho(cor.acento, 1) : '0 6px 20px rgba(0,0,0,.35)',
			transform: `scale(${0.8 + 0.2 * pop})`,
			transformOrigin: '0% 100%',
			whiteSpace: 'nowrap',
		}}
	>
		{texto}
	</div>
);

/** Spring do pop de etiqueta/chip (damping 14, stiffness 220, mass .6). */
export const popEm = (frame: number, t: number) => (frame < t ? 0 : spring({frame: frame - t, fps: FPS, ...MOLAS.pop}));
