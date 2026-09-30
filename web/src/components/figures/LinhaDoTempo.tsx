import type { FigureLinhaDoTempo } from '@/lib/carousel';
import { cx } from './cx';
import styles from './figures.module.css';

/**
 * Marks on a rail, oldest first. Only the most recent marker is filled: on a
 * pauta about regulation, "where we are now" is the whole point, and filling
 * every marker would spend the emphasis on nothing.
 */
export function LinhaDoTempo({ data }: { data: FigureLinhaDoTempo }) {
  const last = data.marcos.length - 1;

  return (
    <div className={styles.figure}>
      <div className={styles.timeline}>
        <span className={styles.timelineRail} aria-hidden="true" />
        {data.marcos.map((marco, index) => (
          <div key={index} className={styles.timelineItem}>
            <span
              className={cx(styles.timelineMarker, index === last && styles.timelineMarkerLast)}
              aria-hidden="true"
            />
            <span className={styles.timelineDate}>{marco.data}</span>
            <span className={styles.timelineLabel}>{marco.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
