import type React from 'react';
import type {PropsCena} from './tipos';

/**
 * Registro de tipos de cena (tipo do cenas.json -> componente). Preenchido em Video.tsx.
 * Fica num arquivo próprio para a cena "rajada" poder renderizar qualquer tipo sem import circular.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const REGISTRO: Record<string, React.FC<PropsCena<any>>> = {};
