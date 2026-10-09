import type {ItemNumero} from '../comp/Contador';
import type {ItemPill} from '../comp/Pill';
import type {LinhaTerminal} from '../comp/Terminal';
import type {Ref} from '../tempo';

/** Campos comuns a toda cena de src/data/cenas.json. */
type Base = {id: string; inicio: Ref; rotulo?: string; wipe?: boolean};

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

export type CenaDef = CenaTitulo | CenaNumeros | CenaPrint | CenaTerminal | CenaPills | CenaCta;

/** Props que toda cena recebe: a definição e o frame absoluto em que o Sequence começa. */
export type PropsCena<T extends CenaDef = CenaDef> = {def: T; ini: number; dur: number};
