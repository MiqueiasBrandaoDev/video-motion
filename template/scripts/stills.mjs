// Renderiza frames avulsos (PNG) para conferência visual rápida, com um único bundle.
// Uso: node scripts/stills.mjs <pasta-saida> <frame> [frame...]
// Ex.: node scripts/stills.mjs qa/stills 0 45 90 140
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const raiz = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const [saida, ...frames] = process.argv.slice(2);
if (!saida || !frames.length) {
	console.error('uso: node scripts/stills.mjs <pasta-saida> <frame> [frame...]');
	process.exit(1);
}
const serveUrl = await bundle({entryPoint: path.join(raiz, 'src', 'index.ts'), publicDir: path.join(raiz, 'public')});
const composition = await selectComposition({serveUrl, id: 'Video'});
for (const fr of frames) {
	const out = path.resolve(raiz, saida, `f${String(fr).padStart(4, '0')}.png`);
	await renderStill({composition, serveUrl, output: out, frame: Number(fr), imageFormat: 'png'});
	console.log('ok', out);
}
process.exit(0);
