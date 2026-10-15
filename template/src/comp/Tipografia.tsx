import React from 'react';
import {spring, useCurrentFrame} from 'remotion';
import {alfa, cor, corDe, FPS, papel, px, tonalidade, VARIANTE, type Papel} from '../theme';

/*
 * Tipografia em papéis (estilo padrão). Marcação dentro do texto:
 *   *palavra*   acento: texto em gradiente + brilho
 *   _palavra_   emocional: serifa itálica (use UMA por frase)
 *   [palavra]   contorno (só o traço, miolo vazado)
 *   {palavra}   papel "numero" (larga) dentro de uma frase
 *   ~palavra~   cor de problema (dor, erro)
 * Ex.: "Sua equipe _perde_ *clientes*"
 */

export type Entrada = 'palavra' | 'letra' | 'mascara' | 'nenhuma';
type Estilo = 'normal' | 'acento' | 'emocional' | 'contorno' | 'numero' | 'problema';
type Trecho = {texto: string; estilo: Estilo};

const MARCAS: Array<[RegExp, Estilo]> = [
	[/^\*([^*]+)\*$/, 'acento'],
	[/^_([^_]+)_$/, 'emocional'],
	[/^\[([^\]]+)\]$/, 'contorno'],
	[/^\{([^}]+)\}$/, 'numero'],
	[/^~([^~]+)~$/, 'problema'],
];

/** Quebra o texto marcado em trechos com estilo. */
export const parseMisto = (texto: string): Trecho[] =>
	texto
		.split(/(\*[^*]+\*|_[^_]+_|\[[^\]]+\]|\{[^}]+\}|~[^~]+~)/g)
		.filter((p) => p.length > 0)
		.map((p) => {
			for (const [re, estilo] of MARCAS) {
				const m = re.exec(p);
				if (m) return {texto: m[1], estilo};
			}
			return {texto: p, estilo: 'normal' as Estilo};
		});

/** Remove a marcação (para medir/ler o texto puro). */
export const textoPuro = (texto: string) => parseMisto(texto).map((t) => t.texto).join('');

/** Estilo visual de um trecho. `base` é a cor do texto comum. */
const estiloTrecho = (estilo: Estilo, tamBase: number, base: string, corAcento: string): React.CSSProperties => {
	const escura = VARIANTE === 'escura';
	switch (estilo) {
		case 'acento':
			return {
				backgroundImage: escura
					? `linear-gradient(180deg, #FFFFFF 0%, ${corAcento} 115%)`
					: `linear-gradient(180deg, ${tonalidade(cor.acento, -0.42)} 0%, ${tonalidade(cor.acento, -0.12)} 100%)`,
				WebkitBackgroundClip: 'text',
				backgroundClip: 'text',
				color: 'transparent',
				filter: escura
					? `drop-shadow(0 0 ${tamBase * 0.22}px ${alfa(corAcento, 0.55)})`
					: `drop-shadow(0 ${tamBase * 0.04}px ${tamBase * 0.12}px ${alfa(cor.acento, 0.22)})`,
			};
		case 'emocional':
			return {
				...papel.emocional,
				fontSize: '1.12em',
				color: corAcento,
				letterSpacing: '-.005em',
				filter: escura ? `drop-shadow(0 0 ${tamBase * 0.2}px ${alfa(corAcento, 0.6)})` : undefined,
				paddingRight: '0.06em',
			};
		case 'contorno':
			// paint-order: o miolo (na cor do fundo) cobre os contornos internos que fontes variáveis sobrepõem
			return {color: cor.fundo, WebkitTextStroke: `${Math.max(4, tamBase * 0.044)}px ${alfa(base, 0.85)}`, paintOrder: 'stroke fill'};
		case 'numero':
			return {...papel.numero, fontSize: '1em'};
		case 'problema':
			return {
				color: corDe('problema'),
				filter: `drop-shadow(0 0 ${tamBase * 0.2}px ${alfa(corDe('problema'), escura ? 0.55 : 0.3)})`,
			};
		default:
			return {color: base};
	}
};

/**
 * Frase com tipografia mista. Entra no frame local `at`:
 *  - palavra: cada palavra sobe 30 px com blur 8 -> 0 e escala .9 -> 1, 2 frames de atraso entre palavras
 *  - letra:   cada letra com escala .6 -> 1 + blur, 1 frame de atraso por letra (~10 frames no total)
 *  - mascara: a linha sobe de dentro de uma máscara (overflow hidden) em ~5 frames
 * `gradiente` aplica o gradiente de texto padrão na frase inteira (fora as marcações).
 */
export const TextoMisto: React.FC<{
	texto: string;
	at?: number;
	papel?: Papel;
	tam?: number;
	entrada?: Entrada;
	cor?: string;
	corAcento?: string;
	gradiente?: boolean;
	brilho?: boolean;
	alinhar?: 'center' | 'left';
	style?: React.CSSProperties;
}> = ({texto, at = 0, papel: p = 'frase', tam = px(110), entrada = 'palavra', cor: corBase = cor.texto, corAcento = cor.acento, gradiente = false, brilho = false, alinhar = 'center', style}) => {
	const frame = useCurrentFrame();
	const trechos = parseMisto(texto);
	const escura = VARIANTE === 'escura';
	const acentoTxt = escura ? corAcento : cor.acentoTexto;
	const gradFrase: React.CSSProperties = gradiente
		? {
				backgroundImage: cor.gradTexto,
				WebkitBackgroundClip: 'text',
				backgroundClip: 'text',
				color: 'transparent',
				// o fundo só pinta dentro da caixa do span: com lineHeight < 1 o acento de Á/É/Ã e a cedilha
				// ficavam de fora (sumiam). Folga em cima e embaixo, compensada na margem, sem mexer no layout.
				paddingTop: '.24em',
				marginTop: '-.24em',
				paddingBottom: '.14em',
				marginBottom: '-.14em',
			}
		: {};
	const sombra = brilho ? (escura ? `drop-shadow(0 0 ${tam * 0.18}px ${alfa(corAcento, 0.45)})` : `drop-shadow(0 ${tam * 0.04}px ${tam * 0.12}px ${alfa(corAcento, 0.18)})`) : '';

	// unidades animadas (palavra ou letra), preservando os espaços
	let k = 0;
	const unidades: React.ReactNode[] = [];
	trechos.forEach((t, ti) => {
		const est = estiloTrecho(t.estilo, tam, corBase, acentoTxt);
		const estiloFinal = t.estilo === 'normal' ? {...est, ...gradFrase} : est;
		const pedacos = entrada === 'letra' ? Array.from(t.texto) : t.texto.split(/(\s+)/);
		pedacos.forEach((pd, pi) => {
			if (pd === '') return;
			if (/^\s+$/.test(pd)) {
				unidades.push(<span key={`${ti}-${pi}`}>{pd}</span>);
				return;
			}
			const idx = k++;
			let anim: React.CSSProperties = {};
			if (entrada === 'palavra' || entrada === 'letra') {
				const atraso = entrada === 'letra' ? idx : idx * 2;
				const s = spring({frame: frame - at - atraso, fps: FPS, config: {damping: 200}, durationInFrames: 8});
				const vis = frame >= at + atraso ? s : 0;
				const blur = (1 - vis) * 8;
				anim = {
					opacity: vis,
					transform: entrada === 'letra' ? `scale(${0.6 + 0.4 * vis})` : `translateY(${(1 - vis) * 30}px) scale(${0.9 + 0.1 * vis})`,
					filter: [blur > 0.2 ? `blur(${blur}px)` : '', estiloFinal.filter ?? ''].filter(Boolean).join(' ') || undefined,
				};
			}
			unidades.push(
				<span
					key={`${ti}-${pi}`}
					style={{display: 'inline-block', whiteSpace: 'pre', ...estiloFinal, ...anim, transformOrigin: '50% 80%'}}
				>
					{pd}
				</span>,
			);
		});
	});

	const mascara = entrada === 'mascara';
	const corpo = (
		<div
			style={{
				...papel[p],
				fontSize: tam,
				color: corBase,
				textAlign: alinhar,
				// na máscara o brilho vai no envelope de fora: aqui dentro o overflow cortaria o halo em retângulo
				filter: (!mascara && sombra) || undefined,
				...style,
			}}
		>
			{unidades}
		</div>
	);
	if (!mascara) return corpo;
	/*
	 * Entrada por máscara: a linha sobe de baixo para dentro de uma janela com overflow hidden.
	 * Três regras (bug real: antes da entrada aparecia uma faixa de brilho com borda reta e a
	 * pontinha das letras, e o halo ficava recortado em retângulo depois de entrar):
	 *  1. antes de `at` a linha não é desenhada (opacity 0), em vez de ficar escondida "quase fora";
	 *  2. o brilho (drop-shadow) fica no envelope de FORA da janela, então nunca é recortado;
	 *  3. a janela tem folga nos QUATRO lados: acento/til em cima, descendente/cedilha embaixo e o
	 *     brilho dos trechos marcados (*acento*, ~problema~ têm drop-shadow próprio, raio ~0,22 do
	 *     tamanho). Dentro de um flex centralizado a janela encolhe para a largura do texto; sem folga
	 *     lateral o halo do "80%" virava um retângulo de borda reta.
	 */
	const s = spring({frame: frame - at, fps: FPS, config: {damping: 200}, durationInFrames: 6});
	const folga = tam * 0.45;
	return (
		<div style={{filter: sombra || undefined, opacity: frame < at ? 0 : 1}}>
			<div style={{overflow: 'hidden', padding: folga, margin: -folga}}>
				<div style={{transform: `translateY(${(1 - s) * 160}%)`}}>{corpo}</div>
			</div>
		</div>
	);
};

/** Rótulo mono pequeno e espaçado (papel "rotulo"), em cima da palavra grande. */
export const RotuloMono: React.FC<{children: React.ReactNode; at?: number; cor?: string; tam?: number; style?: React.CSSProperties}> = ({
	children,
	at = 0,
	cor: c,
	tam = px(26),
	style,
}) => {
	const frame = useCurrentFrame();
	const s = spring({frame: frame - at, fps: FPS, config: {damping: 200}, durationInFrames: 8});
	return (
		<div
			style={{
				...papel.rotulo,
				fontSize: tam,
				color: c ?? (VARIANTE === 'escura' ? '#C9C6D6' : cor.suave),
				opacity: frame < at ? 0 : s,
				letterSpacing: `${0.28 + (1 - s) * 0.2}em`,
				...style,
			}}
		>
			{children}
		</div>
	);
};

/** Chip mono (rótulo numerado de camada, tag de status). `solido` preenche com a cor. */
export const Chip: React.FC<{children: React.ReactNode; cor?: string; solido?: boolean; tam?: number; style?: React.CSSProperties}> = ({
	children,
	cor: c = cor.acento,
	solido = false,
	tam = px(22),
	style,
}) => (
	<div
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: tam * 0.5,
			...papel.rotulo,
			letterSpacing: '.14em',
			fontSize: tam,
			fontWeight: 700,
			padding: `${tam * 0.32}px ${tam * 0.6}px`,
			borderRadius: tam * 0.3,
			background: solido ? c : alfa(c, VARIANTE === 'escura' ? 0.12 : 0.1),
			border: `1.5px solid ${alfa(c, solido ? 1 : 0.6)}`,
			color: solido ? (VARIANTE === 'escura' ? '#0B0B0E' : '#FFFFFF') : VARIANTE === 'escura' ? c : cor.texto,
			boxShadow: `0 0 18px ${alfa(c, solido ? 0.45 : 0.2)}`,
			whiteSpace: 'nowrap',
			...style,
		}}
	>
		{children}
	</div>
);
