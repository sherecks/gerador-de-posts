import type { FigureComparacao } from '@/lib/carousel';
import { cx } from './cx';
import styles from './figures.module.css';

/**
 * Bars from one baseline, every value direct-labelled (a slide has no tooltip
 * or axis to fall back on). With `destaque` on one item, that bar keeps the
 * accent and the rest recede — emphasis, the right answer when the brand has
 * a single color chord and the slide has a single point.
 */
export function Comparacao({ data }: { data: FigureComparacao }) {
  const max = Math.max(...data.itens.map((item) => Math.abs(item.valor)), 1);
  const hasEmphasis = data.itens.some((item) => item.destaque === true);

  return (
    <div className={styles.figure}>
      <div>
        {data.itens.map((item, index) => {
          const recedes = hasEmphasis && item.destaque !== true;
          return (
            <div key={index} className={styles.compRow}>
              <div className={styles.compHead}>
                <span className={styles.compLabel}>{item.label}</span>
                <span className={styles.compValue}>{item.valorLabel}</span>
              </div>
              <div className={styles.compTrack}>
                <div
                  className={cx(styles.compFill, recedes && styles.compFillMuted)}
                  style={{ width: `${(Math.abs(item.valor) / max) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {data.unidade ? <span className={styles.compUnit}>{data.unidade}</span> : null}
    </div>
  );
}
