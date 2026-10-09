import React from 'react';
import {cor, fonte, px} from '../theme';

/**
 * Card de vidro: raio 20px, borda fina, blur de fundo, brilho interno no topo.
 * `destaque` (0-1 ou boolean) acende a borda e o glow na cor de acento.
 * `opaco` usa fundo quase sólido (para ficar legível sobre print ou grade).
 */
export const CardVidro: React.FC<{
	children: React.ReactNode;
	style?: React.CSSProperties;
	destaque?: boolean | number;
	opaco?: boolean;
}> = ({children, style, destaque = false, opaco = false}) => {
	const d = typeof destaque === 'number' ? destaque : destaque ? 1 : 0;
	return (
		<div
			style={{
				background: opaco ? cor.vidroOpaco : cor.vidro,
				border: `1.5px solid ${d > 0.5 ? cor.linhaAcento : cor.linha}`,
				borderRadius: 20,
				padding: '28px 30px',
				backdropFilter: 'blur(12px)',
				boxShadow: `${cor.sombra}, inset 0 1px 0 ${cor.brilhoInterno}${d > 0 ? `, ${cor.glow(1.3 * d)}` : ''}`,
				...style,
			}}
		>
			{children}
		</div>
	);
};

/** Rótulo mono em caixa alta, na cor de acento (cabeçalho de cena). */
export const Rotulo: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
	<div
		style={{
			fontFamily: fonte.mono,
			fontWeight: 600,
			fontSize: px(26),
			letterSpacing: '.18em',
			textTransform: 'uppercase',
			color: cor.acentoTexto,
			...style,
		}}
	>
		{children}
	</div>
);

/** Texto com *trechos* marcados em acento. Ex.: "Você perde *horas*". */
export const TextoMarcado: React.FC<{texto: string; corAcento?: string}> = ({texto, corAcento = cor.acentoTexto}) => (
	<>
		{texto.split(/(\*[^*]+\*)/g).map((parte, i) =>
			parte.startsWith('*') && parte.endsWith('*') ? (
				<span key={i} style={{color: corAcento}}>
					{parte.slice(1, -1)}
				</span>
			) : (
				<React.Fragment key={i}>{parte}</React.Fragment>
			),
		)}
	</>
);
