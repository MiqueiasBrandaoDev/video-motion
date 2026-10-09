import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {FPS, H, W} from './theme';
import {DURACAO_FRAMES} from './tempo';

// Duração = voz editada (blocos.json, gerado por scripts/cortar.py) ou config.duracao_s.
export const Root: React.FC = () => (
	<Composition id="Video" component={Video} durationInFrames={DURACAO_FRAMES} fps={FPS} width={W} height={H} />
);
