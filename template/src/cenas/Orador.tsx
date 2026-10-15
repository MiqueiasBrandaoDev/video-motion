import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Letreiro} from '../comp/Efeitos';
import {Icone} from '../comp/Icone';
import {BordaCard, CamadaVideo, EtiquetaEstado, escalaPunch, misturaRet, MolduraSelecao, nivelPB, popEm, progCard, retCard, TELA, Xadrez, type Enquadramento, type Ret} from '../comp/Orador';
import {existe} from '../comp/Recorte';
import {CamadaSobre} from '../comp/Sobre';
import {TextoMisto} from '../comp/Tipografia';
import {alfa, AREA, brilho, CFG, cor, corDe, entraUI, papel, prog, px, SEGURO_LADO, SEGURO_TOPO, tonalidade, W, H} from '../theme';
import {fr} from '../tempo';
import {BlocoFrase} from './Kit';
import type {CenaDuelo, CenaLetterbox, CenaOrador, PropsCena} from './tipos';

/*
 * Cenas do talking head. Ordem das camadas na cena `orador`:
 *   xadrez (RAW) -> vídeo de fundo -> sobre "atras" + linhas/letreiro -> pessoa recortada (alfa)
 *   -> moldura RAW -> borda do card -> sobre "frente"
 * Sem o recorte com alfa (scripts/recortar_orador.py), o que é "atras" fica por cima do vídeo:
 * mantenha esses elementos acima da cabeça.
 */

const ORADOR = (CFG as {orador?: {video?: string; recorte?: string; enquadramento?: Enquadramento}}).orador ?? {};
const videoPadrao = (v?: string) => v ?? ORADOR.video ?? 'orador.mp4';
const recortePadrao = (r?: string) => r ?? ORADOR.recorte ?? 'orador-alfa.webm';

/** orador: rosto em tela cheia (reenquadrado), punch-in, P&B, card, RAW -> EDITADO e sobreposições. */
export const OradorCena: React.FC<PropsCena<CenaOrador>> = ({def, ini}) => {
	const frame = useCurrentFrame();
	const video = videoPadrao(def.video);
	const recorte = recortePadrao(def.recorte);
	const temRecorte = existe(recorte);
	const enq: Enquadramento = {...ORADOR.enquadramento, ...(def.zoom ? {zoom: def.zoom} : {}), ...def.enquadramento};
	const de = def.de ?? ini;
	const escala = escalaPunch(frame, ini, def.punch);
	const pb = nivelPB(frame, ini, def.pb);
	const pCard = progCard(frame, ini, def.card);
	if (enq.desce) enq.desce *= 1 - pCard; // no card, o orador ocupa o card inteiro
	let ret: Ret = misturaRet(TELA, retCard(def.card), pCard);

	// RAW -> EDITADO: xadrez de transparência + moldura tracejada; troca no marco `editadoEm`.
	const raw = def.raw;
	const tRaw = raw ? fr(raw.em) - ini : Infinity;
	const tEd = raw?.editadoEm !== undefined ? fr(raw.editadoEm) - ini : Infinity;
	const noRaw = frame >= tRaw - 1;
	const xadrez = noRaw ? (Number.isFinite(tEd) ? 1 - prog(frame, tEd, 6) : 1) : 0; // 1 no estado bruto, some em 6 frames
	const molduraRet: Ret = raw?.moldura
		? {x: raw.moldura.x * W, y: raw.moldura.y * H, w: raw.moldura.w * W, h: raw.moldura.h * H, raio: 0}
		: temRecorte
			? {x: W * 0.06, y: H * 0.18, w: W * 0.74, h: H * 0.37, raio: 0}
			: {x: W * 0.09, y: H * 0.16, w: W * 0.82, h: H * 0.62, raio: px(6)};
	if (raw && !temRecorte && xadrez > 0) {
		// sem recorte: o vídeo encolhe para dentro da moldura e volta a cobrir a tela na edição (encaixe 8 frames)
		ret = misturaRet(ret, molduraRet, xadrez);
	}
	const fundoVisivel = raw && temRecorte ? 1 - xadrez : 1;
	const tSomeEtiqueta = tEd + Math.round(1.2 * 30);
	const etiquetaOpac = noRaw ? (Number.isFinite(tSomeEtiqueta) ? 1 - prog(frame, tSomeEtiqueta, 8) : 1) : 0;
	const editado = frame >= tEd;

	const tamL = px(170);
	const atrasExtra = (
		<>
			{def.letreiro ? <Letreiro texto={def.letreiro.texto} texto2={def.letreiro.texto2} y={AREA.topo} tam={tamL} at={def.letreiro.em !== undefined ? Math.max(0, fr(def.letreiro.em) - ini - 4) : 0} /> : null}
			{def.linhas?.length ? (
				<div style={{position: 'absolute', left: AREA.lado, right: AREA.lado, top: def.letreiro ? AREA.topo + tamL * 2.45 : AREA.topo + px(20)}}>
					<BlocoFrase rotulo={def.rotulo} linhas={def.linhas} ini={ini} />
				</div>
			) : null}
		</>
	);

	return (
		<AbsoluteFill>
			{xadrez > 0 ? <Xadrez opacidade={xadrez} /> : null}
			<CamadaVideo arquivo={video} de={de} ret={ret} enq={enq} escala={escala} pb={pb} opacidade={fundoVisivel} marcacao={!temRecorte} />
			{def.escurecer ? <AbsoluteFill style={{background: `rgba(0,0,0,${def.escurecer})`}} /> : null}
			<CamadaSobre itens={def.sobre} camada="atras" ini={ini} />
			{atrasExtra}
			{temRecorte ? <CamadaVideo arquivo={recorte} de={def.deRecorte ?? de} ret={ret} enq={enq} escala={escala} pb={pb} transparente /> : null}
			{raw && xadrez > 0.01 ? <MolduraSelecao ret={molduraRet} opacidade={xadrez} /> : null}
			{raw && etiquetaOpac > 0.01 ? (
				<div style={{position: 'absolute', left: molduraRet.x, top: molduraRet.y - px(76), opacity: etiquetaOpac}}>
					<EtiquetaEstado key={editado ? 'ed' : 'raw'} texto={editado ? `✓ ${raw.rotuloFinal ?? 'editado'}` : raw.rotulo ?? 'bruto · sem edição'} destaque={editado} pop={editado ? popEm(frame, tEd) : popEm(frame, tRaw)} />
				</div>
			) : null}
			<BordaCard ret={ret} p={pCard} />
			<CamadaSobre itens={def.sobre} camada="frente" ini={ini} />
		</AbsoluteFill>
	);
};

/** duelo: dois resultados empilhados (16:9) com rótulo, ícone e placar; título no topo. */
export const DueloCena: React.FC<PropsCena<CenaDuelo>> = ({def, ini}) => {
	const frame = useCurrentFrame();
	const claro = def.claro !== false;
	const tinta = claro ? '#121214' : '#F5F4F2';
	const larg = W - 2 * px(40);
	const alt = Math.round((larg * 9) / 16);
	const topo = SEGURO_TOPO - px(40);
	const blocoH = px(100) + alt;
	const vao = (H - 250 - topo - px(120) - 2 * blocoH) / 2;
	const placar = (lado: number) => (def.placar ?? []).filter((p) => p.lado === lado && frame >= fr(p.em) - ini);
	return (
		<AbsoluteFill style={{background: claro ? '#F6F5F2' : cor.fundo}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: topo, textAlign: 'center', ...entraUI(frame, 0)}}>
				<TextoMisto texto={def.titulo} entrada="nenhuma" tam={px(88)} cor={tinta} style={{textTransform: 'uppercase', letterSpacing: '-.03em'}} />
			</div>
			{def.lados.slice(0, 2).map((l, i) => {
				const y = topo + px(120) + vao * 0.5 + i * (blocoH + vao);
				const pts = placar(i);
				const ult = pts.length ? fr(pts[pts.length - 1].em) - ini : -99;
				const pop = popEm(frame, ult);
				const c = corDe(l.cor ?? (i === 0 ? 'acento' : 'acento2'));
				const lider = pts.length > 0 && pts.length >= placar(1 - i).length;
				return (
					<div key={i} style={{position: 'absolute', left: px(40), top: y, width: larg, ...entraUI(frame, 2 + i * 3)}}>
						<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: px(18), height: px(84)}}>
							<div style={{width: px(70), height: px(70), borderRadius: px(16), background: `linear-gradient(150deg, ${c}, ${tonalidade(c, -0.3)})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<Icone nome={l.icone ?? 'sparkles'} tam={px(38)} cor="#FFFFFF" espessura={2} />
							</div>
							<div style={{...papel.frase, fontSize: px(60), color: tinta, textTransform: 'uppercase', letterSpacing: '-.03em'}}>{l.rotulo}</div>
							{def.placar ? (
								<div style={{...papel.numero, fontSize: px(44), minWidth: px(70), textAlign: 'center', padding: `${px(4)}px ${px(14)}px`, borderRadius: px(14), color: lider ? '#FFFFFF' : tinta, background: lider ? c : alfa(tinta, 0.08), transform: `scale(${1 + 0.18 * (1 - pop) * (pop > 0 ? 1 : 0)})`, boxShadow: lider ? brilho(c, 0.7) : undefined}}>{pts.length}</div>
							) : null}
						</div>
						<div style={{position: 'relative', marginTop: px(16), width: larg, height: alt, borderRadius: px(26), overflow: 'hidden', background: '#101014', boxShadow: lider ? `0 0 0 ${px(4)}px ${c}, 0 20px 50px rgba(0,0,0,.25)` : '0 20px 50px rgba(0,0,0,.25)'}}>
							<CamadaVideo arquivo={videoPadrao(l.video)} de={l.de ?? ini} ret={{x: 0, y: 0, w: larg, h: alt}} enq={l.enquadramento} pb={l.pb ? 1 : 0} marcacao />
							{l.legenda ? (
								<div style={{position: 'absolute', left: px(18), top: px(16), display: 'flex', alignItems: 'center', gap: px(8), ...papel.rotulo, fontSize: px(19), letterSpacing: '.18em', color: '#FFFFFF', padding: `${px(6)}px ${px(12)}px`, borderRadius: 99, background: 'rgba(0,0,0,.5)'}}>
									<div style={{width: px(8), height: px(8), borderRadius: 99, background: c}} />
									{l.legenda}
								</div>
							) : null}
						</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

/** letterbox: faixa clara com título fixo condensado + selo, vídeo 16:9 no meio (reaproveita gravação horizontal). */
export const LetterboxCena: React.FC<PropsCena<CenaLetterbox>> = ({def, ini}) => {
	const frame = useCurrentFrame();
	const claro = def.claro !== false;
	const tinta = claro ? '#121214' : '#F5F4F2';
	const alt = Math.round((W * 9) / 16);
	const yVideo = Math.round(H * 0.37);
	const selo = def.selo;
	return (
		<AbsoluteFill style={{background: claro ? '#F7F6F3' : cor.fundo}}>
			<div style={{position: 'absolute', left: SEGURO_LADO, right: SEGURO_LADO, top: H * 0.15, textAlign: 'center'}}>
				<div style={{...papel.estreita, fontSize: Math.min(px(170), (W - 2 * SEGURO_LADO) / (def.titulo.length * 0.46)), color: tinta, lineHeight: 0.92, whiteSpace: 'nowrap'}}>{def.titulo}</div>
			</div>
			{selo ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: H * 0.255, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: px(22), ...entraUI(frame, 4)}}>
					<div style={{width: px(112), height: px(112), borderRadius: px(26), background: `linear-gradient(150deg, ${cor.acento}, ${tonalidade(cor.acento, -0.25)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 30px ${alfa(cor.acento, 0.35)}`}}>
						<Icone nome={selo.icone ?? 'sparkles'} tam={px(60)} cor="#FFFFFF" espessura={2} />
					</div>
					<div style={{...papel.frase, fontWeight: 700, fontSize: px(46), color: tinta, lineHeight: 1.08, letterSpacing: '-.02em'}}>
						{selo.texto.split('|').map((l, i) => (
							<div key={i}>{l}</div>
						))}
					</div>
				</div>
			) : null}
			<div style={{position: 'absolute', left: 0, top: yVideo, width: W, height: alt, borderRadius: px(18), overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,.28)'}}>
				<CamadaVideo arquivo={videoPadrao(def.video)} de={def.de ?? ini} ret={{x: 0, y: 0, w: W, h: alt}} enq={def.enquadramento} escala={escalaPunch(frame, ini, def.punch)} marcacao />
			</div>
			<CamadaSobre itens={def.sobre} camada="frente" ini={ini} />
			{def.rodape ? (
				<div style={{position: 'absolute', left: SEGURO_LADO, right: SEGURO_LADO, top: yVideo + alt + px(60), textAlign: 'center', ...entraUI(frame, 8)}}>
					<div style={{...papel.frase, fontSize: px(52), color: tinta, letterSpacing: '-.025em'}}>
						{def.rodape.split(/(\*[^*]+\*)/).map((t, i) =>
							t.startsWith('*') ? (
								<span key={i} style={{color: claro ? tonalidade(cor.acento, -0.2) : cor.acentoClaro}}>
									{t.slice(1, -1)}
								</span>
							) : (
								<span key={i}>{t}</span>
							),
						)}
					</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};
