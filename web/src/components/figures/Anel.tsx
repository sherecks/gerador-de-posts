import type { FigureAnel } from '@/lib/carousel';
import styles from './figures.module.css';

/**
 * One share of a whole. The arc starts at twelve o'clock and runs clockwise;
 * ends are butt-capped (the brand has no rounded corners). The figure printed
 * in the middle is `valorLabel`, and the gate refuses a carousel where it
 * disagrees with the arc.
 */
export function Anel({ data }: { data: FigureAnel }) {
  return (
    <div className={styles.figure}>
      <div className={styles.anel}>
        <svg className={styles.anelSvg} viewBox="0 0 100 100" aria-hidden="true">
          <circle className={styles.anelTrack} cx="50" cy="50" r="42" pathLength="100" />
          <circle
            className={styles.anelArc}
            cx="50"
            cy="50"
            r="42"
            pathLength="100"
            strokeDasharray={`${data.valor} ${100 - data.valor}`}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <span className={styles.anelValue}>{data.valorLabel}</span>
      </div>
      <div className={styles.anelText}>
        <span className={styles.anelRotulo}>{data.rotulo}</span>
        {data.contexto ? <span className={styles.anelContexto}>{data.contexto}</span> : null}
      </div>
    </div>
  );
}
