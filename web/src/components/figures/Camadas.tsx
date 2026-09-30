import type { Brand, FigureCamadas, Surface } from '@/lib/carousel';
import { cx } from './cx';
import styles from './figures.module.css';

/**
 * Which ramp steps need light text, per brand and surface. Computed with
 * the dataviz skill's `contrast()` against #ffffff/#0a0a0a for every hex in
 * each validated ramp (docs/decisions/004) — not eyeballed, and not shared
 * between brands: Karaguá's ramps and ADX's sit at different luminances
 * even on the "same" surface role, so the flip point moves.
 */
const RAMP_INK: Record<Brand, Record<Surface, readonly ('dark' | 'light')[]>> = {
  karagua: {
    shell: ['dark', 'dark', 'light', 'light', 'light'],
    carbon: ['light', 'light', 'dark', 'dark', 'dark'],
    imagem: ['light', 'light', 'dark', 'dark', 'dark'],
    lime: ['light', 'light', 'light', 'light', 'light'],
  },
  adx: {
    shell: ['dark', 'dark', 'light', 'light', 'light'],
    carbon: ['light', 'light', 'dark', 'dark', 'dark'],
    imagem: ['light', 'light', 'dark', 'dark', 'dark'],
    lime: ['dark', 'dark', 'dark', 'dark', 'dark'],
  },
};

/** Spreads n layers across the 5 ramp steps, so 3 layers use 1/3/5, not 1/2/3. */
function rampStep(index: number, total: number): number {
  if (total <= 1) return 3;
  return Math.round(1 + (index * 4) / (total - 1));
}

/**
 * A section through the ground, deepening downward. The categories here are
 * genuinely ordered (depth), so a single-hue ordinal ramp is the honest
 * encoding rather than the value-ramp-on-nominal-categories mistake.
 */
export function Camadas({ data, surface, brand }: { data: FigureCamadas; surface: Surface; brand: Brand }) {
  const total = data.camadas.length;
  const inkByStep = RAMP_INK[brand][surface];

  return (
    <div className={styles.figure}>
      <div className={styles.camadas}>
        <div className={styles.camadasRail} aria-hidden="true">
          <span className={styles.camadasRailCaption}>profundidade</span>
          <span className={styles.camadasRailLine} />
          <span className={styles.camadasRailArrow} />
        </div>

        <div className={styles.camadasBands}>
          {data.camadas.map((camada, index) => {
            const step = rampStep(index, total);
            const ink = inkByStep[step - 1] === 'light' ? styles.inkLight : styles.inkDark;
            return (
              <div
                key={index}
                className={cx(styles.camadaBand, ink)}
                style={{ background: `var(--fig-ramp-${step})` }}
              >
                <span className={styles.camadaLabel}>{camada.label}</span>
                {camada.detalhe ? <span className={styles.camadaDetalhe}>{camada.detalhe}</span> : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
