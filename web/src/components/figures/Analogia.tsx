import type { FigureAnalogia } from '@/lib/carousel';
import { cx } from './cx';
import { Icon } from './icons';
import styles from './figures.module.css';

/** Past this the grid stops being countable and becomes texture. */
const MAX_SHOWN = 24;
const MAX_COLUMNS = 8;

/**
 * An analogy only lands as an equivalence: one of THIS equals N of THOSE.
 * With `iconBase` the figure draws both sides of that sentence; without it,
 * it degrades to a plain pictogram of `quantidade` units.
 */
export function Analogia({ data }: { data: FigureAnalogia }) {
  const shown = Math.min(data.quantidade, MAX_SHOWN);
  const overflow = data.quantidade - shown;
  const columns = Math.min(shown, MAX_COLUMNS);
  const paired = data.iconBase !== undefined;

  return (
    <div className={styles.figure}>
      <div className={styles.analogia}>
        <div className={styles.equiv}>
          {data.iconBase ? (
            <>
              <div className={styles.equivSide}>
                <span className={styles.equivMark}>
                  <Icon name={data.iconBase} className={styles.equivMarkIcon} />
                </span>
                {data.labelBase ? <span className={styles.equivCaption}>{data.labelBase}</span> : null}
              </div>
              <span className={styles.equivSign} aria-hidden="true">
                =
              </span>
            </>
          ) : null}

          {/* Always the wide side: at auto width a lone grid has no width to divide, and its
              `width: 100%` icons fall back to the SVG default size, huge discs over the slide. */}
          <div className={cx(styles.equivSide, styles.equivSideWide)}>
            <div className={styles.equivGrid} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: shown }, (_, index) => (
                <Icon key={index} name={data.icon} className={styles.equivIcon} />
              ))}
              {overflow > 0 ? (
                <span className={styles.equivOverflow} aria-hidden="true">
                  +{overflow}
                </span>
              ) : null}
            </div>
            {data.labelUnidade ? (
              <span className={cx(styles.equivCaption, paired && styles.equivCaptionWide)}>
                {data.labelUnidade}
              </span>
            ) : null}
          </div>
        </div>

        <p className={styles.analogiaAfirmacao}>{data.afirmacao}</p>

        <div className={styles.analogiaDado}>
          <span className={styles.analogiaValue}>{data.dado.value}</span>
          <span className={styles.analogiaLabel}>{data.dado.label}</span>
        </div>
      </div>
    </div>
  );
}
