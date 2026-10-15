import React from 'react';
import {AbsoluteFill, getStaticFiles, OffthreadVideo, staticFile} from 'remotion';
import {alfa, cor, H, VARIANTE, W} from '../theme';

/*
 * Recorte do apresentador (texto atrás da pessoa). Só para entrada com rosto filmado.
 * Empilhamento: fundo (vídeo original) -> texto/janela -> <OffthreadVideo transparent> do recorte.
 *
 * O recorte é feito ANTES, fora do Remotion (scripts/recortar_orador.py, opcional): gera um
 * vídeo com alfa (WebM VP9 yuva420p ou ProRes 4444) com os MESMOS cortes e o mesmo tempo da voz
 * editada, alinhado 1:1 com o original. Sem os arquivos, desenha uma silhueta de marcação
 * (para montar e conferir o layout antes do recorte existir).
 */

const existe = (arq?: string) => Boolean(arq) && getStaticFiles().some((f) => f.name === arq);

/** Silhueta de marcação (cabeça + ombros), só para layout. */
const Silhueta: React.FC = () => {
	const c = VARIANTE === 'escura' ? '#26252C' : '#C9C6BE';
	return (
		<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
			<defs>
				<linearGradient id="sil" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0" stopColor={c} />
					<stop offset="1" stopColor={VARIANTE === 'escura' ? '#141418' : '#B5B2AA'} />
				</linearGradient>
			</defs>
			<ellipse cx={W / 2} cy={H * 0.44} rx={W * 0.17} ry={W * 0.21} fill="url(#sil)" />
			<rect x={W / 2 - W * 0.07} y={H * 0.53} width={W * 0.14} height={H * 0.08} fill="url(#sil)" />
			<path d={`M ${W * 0.06} ${H} C ${W * 0.08} ${H * 0.7}, ${W * 0.24} ${H * 0.6}, ${W / 2} ${H * 0.59} C ${W * 0.76} ${H * 0.6}, ${W * 0.92} ${H * 0.7}, ${W * 0.94} ${H} Z`} fill="url(#sil)" />
			<ellipse cx={W / 2} cy={H * 0.44} rx={W * 0.17} ry={W * 0.21} fill="none" stroke={alfa(cor.acento, 0.25)} strokeWidth={2} strokeDasharray="10 10" />
		</svg>
	);
};

/**
 * `video` e `recorte` são caminhos em public/ (ex.: "orador.mp4", "orador-alfa.webm").
 * `de` = frame do arquivo em que a cena começa (o frame N do arquivo = frame N da timeline
 * quando o vídeo foi cortado igual à voz; passe o `ini` da cena). `deRecorte` = o mesmo para o
 * vídeo com alfa, quando ele cobre só um trecho (recortar_orador.py --de). `zoom` simula câmera B (1,35).
 * `atras` = o que fica entre o fundo e a pessoa (texto gigante, letreiro, janela).
 * `frente` = o que fica por cima da pessoa (legenda de apoio, chip).
 */
export const Recorte: React.FC<{
	video?: string;
	recorte?: string;
	de?: number;
	deRecorte?: number;
	zoom?: number;
	atras?: React.ReactNode;
	frente?: React.ReactNode;
	escurecerFundo?: number;
}> = ({video, recorte, de = 0, deRecorte, zoom = 1, atras, frente, escurecerFundo = 0.25}) => {
	const temVideo = existe(video);
	const temRecorte = existe(recorte);
	const camera: React.CSSProperties = {transform: `scale(${zoom})`, transformOrigin: '50% 38%'};
	return (
		<AbsoluteFill>
			<AbsoluteFill style={camera}>
				{temVideo ? <OffthreadVideo src={staticFile(video!)} trimBefore={de} muted style={{width: W, height: H, objectFit: 'cover'}} /> : null}
				<AbsoluteFill style={{background: `rgba(0,0,0,${temVideo ? escurecerFundo : 0})`}} />
			</AbsoluteFill>
			<AbsoluteFill>{atras}</AbsoluteFill>
			<AbsoluteFill style={camera}>
				{temRecorte ? (
					<OffthreadVideo src={staticFile(recorte!)} trimBefore={Math.max(0, deRecorte ?? de)} transparent muted style={{width: W, height: H, objectFit: 'cover'}} />
				) : temVideo ? null : (
					<Silhueta />
				)}
			</AbsoluteFill>
			<AbsoluteFill>{frente}</AbsoluteFill>
		</AbsoluteFill>
	);
};
