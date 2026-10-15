import type {DefCamadas3D} from '../comp/Camadas3D';
import type {ItemNumero} from '../comp/Contador';
import type {FormaLinha} from '../comp/Efeitos';
import type {DefGradeBento} from '../comp/GradeBento';
import type {ChaveCamera, DefCarimbo} from '../comp/Palco';
import type {ItemPill} from '../comp/Pill';
import type {DefTelaViva} from '../comp/TelaViva';
import type {LinhaTerminal} from '../comp/Terminal';
import type {Entrada} from '../comp/Tipografia';
import type {Papel} from '../theme';
import type {Ref} from '../tempo';

/**
 * Campos comuns a toda cena de src/data/cenas.json.
 * transicao: "corte" (seco, padrão do estilo novo) ou "suave" (cross-fade com blur, padrão das cenas clássicas).
 */
type Base = {id: string; inicio: Ref; rotulo?: string; wipe?: boolean; transicao?: 'corte' | 'suave'; orador?: boolean};

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
	tipo: 'recorte' | 'orador';
	video?: string;
	recorte?: string;
	de?: number;
	deRecorte?: number;
	zoom?: number;
	linhas?: LinhaFrase[];
	letreiro?: {texto: string; texto2?: string; em?: Ref};
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
	| CenaRajada;

/** Tipos do estilo padrão: transição em corte seco (as próprias cenas animam a entrada). */
export const TIPOS_KIT = new Set(['frase', 'telaViva', 'camadas', 'bento', 'letreiro', 'linha', 'recorte', 'orador', 'rajada']);

/** Props que toda cena recebe: a definição e o frame absoluto em que o Sequence começa. */
export type PropsCena<T extends CenaDef = CenaDef> = {def: T; ini: number; dur: number};
