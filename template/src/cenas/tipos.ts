import type {DefCamadas3D} from '../comp/Camadas3D';
import type {ItemNumero} from '../comp/Contador';
import type {FormaLinha} from '../comp/Efeitos';
import type {DefGradeBento} from '../comp/GradeBento';
import type {ChaveCamera, DefCarimbo} from '../comp/Palco';
import type {ItemPill} from '../comp/Pill';
import type {DefTelaViva} from '../comp/TelaViva';
import type {CardOrador, Enquadramento, PosLegenda, PunchIn, TrechoPB} from '../comp/Orador';
import type {ItemSobre} from '../comp/Sobre';
import type {LinhaTerminal} from '../comp/Terminal';
import type {Entrada} from '../comp/Tipografia';
import type {Papel} from '../theme';
import type {Ref} from '../tempo';

/**
 * Campos comuns a toda cena de src/data/cenas.json.
 * transicao: "corte" (seco, padrão do estilo novo) ou "suave" (cross-fade com blur, padrão das cenas clássicas).
 */
type Base = {
	id: string;
	inicio: Ref;
	rotulo?: string;
	wipe?: boolean;
	transicao?: 'corte' | 'suave';
	orador?: boolean;
	/** Posição da legenda nesta cena (fixa ou trocando por marco). Padrão por tipo: orador = rosto, duelo/letterbox = sobre o vídeo, resto = base. */
	legenda?: PosLegenda | Array<{em: Ref; pos: PosLegenda}>;
};

/** Campos das cenas do estilo padrão: câmera virtual, carimbos, motion blur. */
export type BaseKit = Base & {
	camera?: ChaveCamera[];
	cameraInicial?: {escala?: number; x?: number; y?: number};
	carimbos?: DefCarimbo[];
	motionBlur?: boolean;
};

// ---------- clássicas (variante anterior; continuam funcionando) ----------
export type CenaTitulo = Base & {
	tipo: 'titulo';
	linhas: Array<{texto: string; em?: Ref; tam?: number}>;
	alinhar?: 'esquerda' | 'centro';
};
export type CenaNumeros = Base & {tipo: 'numeros'; itens: ItemNumero[]; legenda?: string};
export type CenaPrint = Base & {tipo: 'print'; janela?: string; apoio?: ItemPill[]};
export type CenaTerminal = Base & {tipo: 'terminal'; titulo?: string; linhas: LinhaTerminal[]};
export type CenaPills = Base & {tipo: 'pills'; titulo?: string; itens: ItemPill[]};
export type CenaCta = Base & {
	tipo: 'cta';
	principal: string;
	em?: Ref;
	pill?: {texto: string; icone?: string; em?: Ref};
};

// ---------- estilo padrão ----------
/** Linha de frase: texto com marcação (*acento* _emocional_ [contorno] {numero} ~problema~) ou número que conta. */
export type LinhaFrase = {
	texto?: string;
	em?: Ref;
	papel?: Papel;
	tam?: number;
	entrada?: Entrada;
	gradiente?: boolean;
	brilho?: boolean;
	numero?: {valor: number; de?: number; casas?: number; prefixo?: string; sufixo?: string; ateEm?: Ref};
};
export type CenaFrase = BaseKit & {
	tipo: 'frase';
	rotuloEm?: Ref;
	linhas: LinhaFrase[];
	alinhar?: 'centro' | 'esquerda';
	vertical?: 'centro' | 'topo';
};
export type CenaTelaViva = BaseKit & {tipo: 'telaViva'; titulo?: string; tela: DefTelaViva};
export type CenaCamadas = BaseKit & DefCamadas3D & {tipo: 'camadas'; titulo?: string};
export type CenaBento = BaseKit & DefGradeBento & {tipo: 'bento'};
export type CenaLetreiro = BaseKit & {tipo: 'letreiro'; texto: string; texto2?: string; em?: Ref; tam?: number; velocidade?: number; linhas?: LinhaFrase[]};
export type CenaLinha = BaseKit & {
	tipo: 'linha';
	forma: FormaLinha;
	em?: Ref;
	planaEm?: Ref;
	cor?: string;
	rotuloLinha?: {antes: string; depois?: string};
	linhas?: LinhaFrase[];
};
export type CenaRecorte = BaseKit & {
	tipo: 'recorte';
	video?: string;
	recorte?: string;
	de?: number;
	deRecorte?: number;
	zoom?: number;
	linhas?: LinhaFrase[];
	letreiro?: {texto: string; texto2?: string; em?: Ref};
};
// ---------- talking head ----------
/** Itens `sobre` (sobreposições no marco da fala): titulo, riscado, numero, chips, objecoes, comando, rec, passos, cards, pill, final. */
export type CenaOrador = BaseKit & {
	tipo: 'orador';
	video?: string;
	recorte?: string;
	de?: number;
	deRecorte?: number;
	zoom?: number;
	enquadramento?: Enquadramento;
	punch?: PunchIn[];
	pb?: TrechoPB[];
	card?: CardOrador;
	raw?: {em: Ref; editadoEm?: Ref; rotulo?: string; rotuloFinal?: string; moldura?: {x: number; y: number; w: number; h: number}};
	escurecer?: number;
	sobre?: ItemSobre[];
	linhas?: LinhaFrase[];
	letreiro?: {texto: string; texto2?: string; em?: Ref};
};
export type LadoDuelo = {rotulo: string; icone?: string; cor?: string; video?: string; de?: number; enquadramento?: Enquadramento; pb?: boolean; legenda?: string};
export type CenaDuelo = BaseKit & {tipo: 'duelo'; titulo: string; lados: LadoDuelo[]; placar?: Array<{em: Ref; lado: number}>; claro?: boolean};
export type CenaLetterbox = BaseKit & {
	tipo: 'letterbox';
	titulo: string;
	selo?: {texto: string; icone?: string};
	video?: string;
	de?: number;
	enquadramento?: Enquadramento;
	punch?: PunchIn[];
	rodape?: string;
	claro?: boolean;
	sobre?: ItemSobre[];
};

/**
 * teaser (cold open): o trecho do payoff no começo, em P&B, com grão, vinheta e tremor opcionais.
 * O trecho vem do campo "teaser" do cortes.json (cortar_video.py põe a frase no começo do orador.mp4).
 * rotulo (campo comum): chip pequeno no topo, ex. "daqui a pouco".
 */
export type CenaTeaser = BaseKit & {
	tipo: 'teaser';
	video?: string;
	de?: number;
	enquadramento?: Enquadramento;
	/** nível de P&B 0-1 (padrão 1) */
	pb?: number;
	/** grão de filme 0-1 (padrão 0,35; 0 tira) */
	grao?: number;
	/** tremor de câmera na mão (0 = parado, padrão; 1 = leve, ~3 px) */
	tremor?: number;
	/** vinheta 0-1 (padrão 0,6) */
	vinheta?: number;
	/** aproximação lenta ao longo da cena (padrão 0,05 = +5%) */
	aproxima?: number;
	punch?: PunchIn[];
};
/**
 * volta: transição "volta ao começo" (fita VHS rebobinando) entre o teaser e o corpo.
 * de: de onde rebobina (padrão "bloco:payoff"); ate: até onde (padrão: o fim da cena = início do corpo).
 * rotulo: texto do OSD (padrão "REW"). forca: intensidade dos defeitos 0-1,5 (padrão 1).
 */
export type CenaVolta = BaseKit & {
	tipo: 'volta';
	video?: string;
	de?: Ref;
	ate?: Ref;
	enquadramento?: Enquadramento;
	forca?: number;
	pbInicial?: number;
};

/** Plano da rajada: qualquer cena (sem id/inicio) com `em` opcional. */
export type PlanoRajada = {tipo: string; em?: Ref; [campo: string]: unknown};
export type CenaRajada = BaseKit & {tipo: 'rajada'; passo_ms?: number; planos: PlanoRajada[]};

export type CenaDef =
	| CenaTitulo
	| CenaNumeros
	| CenaPrint
	| CenaTerminal
	| CenaPills
	| CenaCta
	| CenaFrase
	| CenaTelaViva
	| CenaCamadas
	| CenaBento
	| CenaLetreiro
	| CenaLinha
	| CenaRecorte
	| CenaOrador
	| CenaDuelo
	| CenaLetterbox
	| CenaTeaser
	| CenaVolta
	| CenaRajada;

/** Tipos do estilo padrão: transição em corte seco (as próprias cenas animam a entrada). */
export const TIPOS_KIT = new Set(['frase', 'telaViva', 'camadas', 'bento', 'letreiro', 'linha', 'recorte', 'orador', 'duelo', 'letterbox', 'rajada', 'teaser', 'volta']);

/** Props que toda cena recebe: a definição e o frame absoluto em que o Sequence começa. */
export type PropsCena<T extends CenaDef = CenaDef> = {def: T; ini: number; dur: number};
