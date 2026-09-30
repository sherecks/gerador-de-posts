import type { FigureSerie } from '@/lib/carousel';
import { cx } from './cx';
import styles from './figures.module.css';

/**
 * A line over an axis that starts at zero. A line chart may crop its axis,
 * but a slide has no axis labels to warn the reader that it did, so a series
 * that looks like it doubled must really have doubled: the baseline stays at
 * zero (the bottom edge, or a rule through the chart when a value is negative). Every point is direct-labeled, and
 * with a `destaque` the rest recede, as in `comparacao`.
 *
 * The line is SVG with a non-scaling stroke; dots and labels are HTML placed
 * by percentage, so nothing is stretched by the aspect ratio of the box.
 */
/**
 * The first and last labels grow inward from their point instead of being
 * centered on it: centered, a wide value like "R$ 17,60" hangs past the
 * slide's edge, and FigureFit would shrink the whole figure to pull it back.
 */
function edgeClass(index: number, count: number, start: string | undefined, end: string | undefined) {
  if (index === 0) return start;
  if (index === count - 1) return end;
  return undefined;
}

export function Serie({ data }: { data: FigureSerie }) {
  const values = data.pontos.map((p) => p.valor);
  const lo = Math.min(0, ...values);
  const hi = Math.max(...values, lo + 1);
  const span = hi - lo;
  const hasEmphasis = data.pontos.some((p) => p.destaque === true);

  // each point carries its own position, so nothing indexes a second array
  const items = data.pontos.map((p, i) => ({
    ...p,
    left: 6 + (i / (data.pontos.length - 1)) * 88, // inset keeps the end labels inside the slide
    top: 100 - ((p.valor - lo) / span) * 88, // the zero line is the bottom edge; 12% of headroom above the top point
  }));
  const zeroTop = 100 - ((0 - lo) / span) * 88; // only drawn when a value is negative: otherwise the axis rule is the zero line

  return (
    <div className={styles.figure}>
      <div className={styles.serie}>
        <svg className={styles.serieSvg} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {lo < 0 ? (
            <line className={styles.serieBase} x1="0" x2="100" y1={zeroTop} y2={zeroTop} vectorEffect="non-scaling-stroke" />
          ) : null}
          <polyline
            className={styles.serieLine}
            points={items.map((p) => `${p.left},${p.top}`).join(' ')}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {items.map((item, i) => {
          const recedes = hasEmphasis && item.destaque !== true;
          return (
            <div
              key={i}
              className={cx(styles.seriePoint, edgeClass(i, items.length, styles.seriePointStart, styles.seriePointEnd))}
              style={{ left: `${item.left}%`, top: `${item.top}%` }}
            >
              <span className={cx(styles.serieValue, recedes && styles.serieMuted)}>{item.valorLabel}</span>
              <span className={cx(styles.serieDot, recedes && styles.serieDotMuted)} aria-hidden="true" />
            </div>
          );
        })}
      </div>

      <div className={styles.serieAxis}>
        {items.map((item, i) => (
          <span
            key={i}
            className={cx(styles.serieTick, edgeClass(i, items.length, styles.serieTickStart, styles.serieTickEnd))}
            style={{ left: `${item.left}%` }}
          >
            {item.rotulo}
          </span>
        ))}
      </div>
      {data.unidade ? <span className={styles.compUnit}>{data.unidade}</span> : null}
    </div>
  );
}
