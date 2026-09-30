import type { CSSProperties } from 'react';
import type { FigureMapa } from '@/lib/carousel';
import {
  LUGARES,
  LUGARES_CONTEXTO,
  MAPA_5KM_PCT,
  MAPA_IMAGEM,
  MAPA_VIEW_H,
  MAPA_VIEW_W,
  type Lugar,
  type LugarId,
} from '@/lib/mapa-babitonga';
import { cx } from './cx';
import { MapaPlacer } from './MapaPlacer';
import styles from './figures.module.css';

/**
 * The Baía da Babitonga on the standard OpenStreetMap map, as a stitched
 * image (scripts/mapa-babitonga/build.py). The generation only names places;
 * where they sit is geography, projected onto the image at build time, not a
 * guess. The bay and the ocean are written on the water (moving to a fallback
 * spot when a point takes theirs), so the reader knows which way is the sea.
 *
 * The image keeps its aspect ratio and fits whichever of the frame's width or
 * height runs out first, so a point's percent position on the box is its
 * percent position on the map. MapaPlacer then picks each label's side.
 */
export function Mapa({ data }: { data: FigureMapa }) {
  const named = new Set<LugarId>(data.pontos.map((ponto) => ponto.lugar));
  const hasEmphasis = data.pontos.some((ponto) => ponto.destaque === true);
  const ratio = { '--mapa-ratio': MAPA_VIEW_W / MAPA_VIEW_H } as CSSProperties;

  return (
    <div className={styles.figure}>
      <div className={styles.mapa}>
        <MapaPlacer className={styles.mapaBox} style={ratio}>
          {/* The standard OpenStreetMap rendering, stitched from its tiles at build time (no network at post time). */}
          {/* eslint-disable-next-line @next/next/no-img-element -- exported by html-to-image, which needs a plain <img> */}
          <img className={styles.mapaImagem} src={MAPA_IMAGEM} alt="" width={MAPA_VIEW_W} height={MAPA_VIEW_H} />

          {/* The emphasized point claims its side first, then the other points, then the context names. */}
          {[...data.pontos]
            .sort((a, b) => Number(b.destaque === true) - Number(a.destaque === true))
            .map((ponto, order) => (
              <PlaceLabel
                key={ponto.lugar}
                lugar={LUGARES[ponto.lugar]}
                nota={ponto.nota}
                recedes={hasEmphasis && ponto.destaque !== true}
                priority={order}
              />
            ))}

          {LUGARES_CONTEXTO.filter((id) => !named.has(id)).map((id) => (
            <PlaceLabel key={id} lugar={LUGARES[id]} priority={8} context />
          ))}

          {/* Bottom-left, on its own panel: the scale and the credit ODbL asks for. */}
          <div className={styles.mapaChave} data-obstaculo="">
            {/* cqw here is the map box's width (it's an inline-size container): 5 km at this map's scale. */}
            <span className={styles.mapaEscala} style={{ width: `${MAPA_5KM_PCT}cqw` }}>
              5 km
            </span>
            <span className={styles.mapaCredito}>© OpenStreetMap</span>
          </div>
        </MapaPlacer>
      </div>

      {data.legenda ? <span className={styles.mapaLegenda}>{data.legenda}</span> : null}
    </div>
  );
}

const OPPOSITE: Record<'direita' | 'esquerda', 'direita' | 'esquerda'> = { direita: 'esquerda', esquerda: 'direita' };

/** Sides a label may try, the gazetteer's choice first. Water and area names have no dot to dodge: only their own side. */
function sideOptions(lugar: Lugar): string {
  if (lugar.tipo !== 'cidade') return lugar.lado;
  const first = lugar.lado === 'centro' ? 'direita' : lugar.lado;
  return [first, OPPOSITE[first], 'acima', 'abaixo'].join(',');
}

function PlaceLabel({
  lugar,
  nota,
  recedes = false,
  priority,
  context = false,
}: {
  lugar: Lugar;
  nota?: string;
  recedes?: boolean;
  priority: number;
  context?: boolean;
}) {
  const options = sideOptions(lugar);
  const isTown = lugar.tipo === 'cidade';
  return (
    <div
      className={cx(styles.mapaPonto, recedes && styles.mapaRecede)}
      style={{ left: `${lugar.x}%`, top: `${lugar.y}%` }}
      data-opcoes={options}
      data-ancoras={lugar.ancoras ? [lugar, ...lugar.ancoras].map((a) => `${a.x},${a.y}`).join(';') : undefined}
      data-lado={options.split(',')[0]}
      data-prioridade={priority}
      data-contexto={context ? '' : undefined}
    >
      {isTown ? <span className={styles.mapaDot} aria-hidden="true" data-obstaculo="" /> : null}
      <span
        className={cx(
          styles.mapaTexto,
          lugar.tipo === 'agua' && styles.mapaAgua,
          lugar.tipo === 'area' && styles.mapaArea,
        )}
        data-texto=""
      >
        <span className={styles.mapaLabel}>{lugar.nome}</span>
        {nota ? <span className={styles.mapaNota}>{nota}</span> : null}
      </span>
    </div>
  );
}
