import React from 'react';

// Ícones lucide (ISC) desenhados inline: stroke currentColor, fill none.
const P: Record<string, React.ReactNode> = {
	video: (
		<>
			<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
			<rect x="2" y="6" width="14" height="12" rx="2" />
		</>
	),
	mic: (
		<>
			<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
			<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
			<line x1="12" x2="12" y1="19" y2="22" />
		</>
	),
	scissors: (
		<>
			<circle cx="6" cy="6" r="3" />
			<path d="M8.12 8.12 12 12" />
			<path d="M20 4 8.12 15.88" />
			<circle cx="6" cy="18" r="3" />
			<path d="M14.8 14.8 20 20" />
		</>
	),
	pen: (
		<>
			<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
			<path d="m15 5 4 4" />
		</>
	),
	arrowDown: (
		<>
			<path d="M12 5v14" />
			<path d="m19 12-7 7-7-7" />
		</>
	),
	sparkles: (
		<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
	),
	fileText: (
		<>
			<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
			<path d="M14 2v4a2 2 0 0 0 2 2h4" />
			<path d="M10 9H8" />
			<path d="M16 13H8" />
			<path d="M16 17H8" />
		</>
	),
	trophy: (
		<>
			<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
			<path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
			<path d="M4 22h16" />
			<path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
			<path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
			<path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
		</>
	),
	lock: (
		<>
			<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
			<path d="M7 11V7a5 5 0 0 1 10 0v4" />
		</>
	),
	hardDrive: (
		<>
			<line x1="22" x2="2" y1="12" y2="12" />
			<path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
			<line x1="6" x2="6.01" y1="16" y2="16" />
			<line x1="10" x2="10.01" y1="16" y2="16" />
		</>
	),
	github: (
		<>
			<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
			<path d="M9 18c-4.51 2-5-2-7-2" />
		</>
	),
	terminal: (
		<>
			<polyline points="4 17 10 11 4 5" />
			<line x1="12" x2="20" y1="19" y2="19" />
		</>
	),
	cursor: (
		<path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z" />
	),
	clock: (
		<>
			<circle cx="12" cy="12" r="10" />
			<polyline points="12 6 12 12 16 14" />
		</>
	),
	file: (
		<>
			<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
			<path d="M14 2v4a2 2 0 0 0 2 2h4" />
			<path d="M10 9H8" />
			<path d="M16 13H8" />
			<path d="M16 17H8" />
		</>
	),
	bot: (
		<>
			<path d="M12 8V4H8" />
			<rect width="16" height="12" x="4" y="8" rx="2" />
			<path d="M2 14h2" />
			<path d="M20 14h2" />
			<path d="M15 13v2" />
			<path d="M9 13v2" />
		</>
	),
	wrench: (
		<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
	),
	inbox: (
		<>
			<polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
			<path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
		</>
	),
	package: (
		<>
			<path d="m7.5 4.27 9 5.15" />
			<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
			<path d="m3.3 7 8.7 5 8.7-5" />
			<path d="M12 22V12" />
		</>
	),
	check: <path d="M20 6 9 17l-5-5" />,
	play: <polygon points="6 3 20 12 6 21 6 3" />,
	monitor: (
		<>
			<rect width="20" height="14" x="2" y="3" rx="2" />
			<line x1="8" x2="16" y1="21" y2="21" />
			<line x1="12" x2="12" y1="17" y2="21" />
		</>
	),
	code: (
		<>
			<polyline points="16 18 22 12 16 6" />
			<polyline points="8 6 2 12 8 18" />
		</>
	),
	message: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
	folder: (
		<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
	),
	cpu: (
		<>
			<rect width="16" height="16" x="4" y="4" rx="2" />
			<rect width="6" height="6" x="9" y="9" rx="1" />
			<path d="M15 2v2" />
			<path d="M15 20v2" />
			<path d="M2 15h2" />
			<path d="M2 9h2" />
			<path d="M20 15h2" />
			<path d="M20 9h2" />
			<path d="M9 2v2" />
			<path d="M9 20v2" />
		</>
	),
	dollar: (
		<>
			<line x1="12" x2="12" y1="2" y2="22" />
			<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
		</>
	),
	history: (
		<>
			<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
			<path d="M3 3v5h5" />
			<path d="M12 7v5l4 2" />
		</>
	),
	search: (
		<>
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.3-4.3" />
		</>
	),
	layout: (
		<>
			<rect width="18" height="18" x="3" y="3" rx="2" />
			<path d="M3 9h18" />
			<path d="M9 21V9" />
		</>
	),
	arrowRight: (
		<>
			<path d="M5 12h14" />
			<path d="m12 5 7 7-7 7" />
		</>
	),
	gitBranch: (
		<>
			<line x1="6" x2="6" y1="3" y2="15" />
			<circle cx="18" cy="6" r="3" />
			<circle cx="6" cy="18" r="3" />
			<path d="M18 9a9 9 0 0 1-9 9" />
		</>
	),
	coins: (
		<>
			<circle cx="8" cy="8" r="6" />
			<path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
			<path d="M7 6h1v4" />
			<path d="m16.71 13.88.7.71-2.82 2.82" />
		</>
	),
	gauge: (
		<>
			<path d="m12 14 4-4" />
			<path d="M3.34 19a10 10 0 1 1 17.32 0" />
		</>
	),
	trendingUp: (
		<>
			<polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
			<polyline points="16 7 22 7 22 13" />
		</>
	),
	users: (
		<>
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</>
	),
	calendar: (
		<>
			<rect width="18" height="18" x="3" y="4" rx="2" />
			<path d="M16 2v4" />
			<path d="M8 2v4" />
			<path d="M3 10h18" />
		</>
	),
	link: (
		<>
			<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
			<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
		</>
	),
	mail: (
		<>
			<rect width="20" height="16" x="2" y="4" rx="2" />
			<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
		</>
	),
	shield: (
		<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
	),
	zap: (
		<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
	),
	heart: (
		<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
	),
	x: (
		<>
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</>
	),
};

export type NomeIcone = keyof typeof P;

/**
 * Ícone SVG em traço (estilo lucide). Nunca use emoji como ícone.
 * Para um ícone novo, copie os paths de https://lucide.dev/icons (licença ISC) para o mapa P.
 */
export const Icone: React.FC<{nome: string; tam?: number; cor?: string; espessura?: number; style?: React.CSSProperties}> = ({
	nome,
	tam = 40,
	cor = 'currentColor',
	espessura = 1.75,
	style,
}) => (
	<svg
		width={tam}
		height={tam}
		viewBox="0 0 24 24"
		fill="none"
		stroke={cor}
		strokeWidth={espessura}
		strokeLinecap="round"
		strokeLinejoin="round"
		style={{flexShrink: 0, ...style}}
	>
		{P[nome] ?? P.layout}
	</svg>
);
