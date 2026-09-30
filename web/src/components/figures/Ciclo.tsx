import type { FigureCiclo } from '@/lib/carousel';
import { cx } from './cx';
import { Icon } from './icons';
import styles from './figures.module.css';

/*
 * Ring geometry, in the SVG's 0-100 viewBox. A cycle has to show its
 * direction or it is just a circle of words: each step gets an arc that ends
 * in an arrowhead pointing at the next node.
 */
const CENTER = 50;
const RING_RADIUS = 32;
const NODE_RADIUS = 6;
const LABEL_RADIUS = 42;
/** Angular room the node itself eats, so arcs start clear of it. */
const NODE_CLEAR = ((NODE_RADIUS + 1.8) / RING_RADIUS) * (180 / Math.PI);
const ARROW_SWEEP = 5;

function polar(angleDeg: number, radius: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(rad), y: CENTER + radius * Math.sin(rad) };
}

export function Ciclo({ data }: { data: FigureCiclo }) {
  const n = data.etapas.length;
  const stepAngle = 360 / n;
  const hasIcons = data.etapas.some((etapa) => etapa.icon);

  return (
    <div className={styles.figure}>
      <div className={cx(styles.ciclo, hasIcons && styles.cicloIcons)}>
        <svg className={styles.cicloSvg} viewBox="0 0 100 100" aria-hidden="true">
          {data.etapas.map((_, index) => {
            const start = -90 + index * stepAngle;
            const arcStart = start + NODE_CLEAR;
            const arrowTip = start + stepAngle - NODE_CLEAR;
            const arcEnd = arrowTip - ARROW_SWEEP;
            if (arcEnd <= arcStart) return null;

            const from = polar(arcStart, RING_RADIUS);
            const to = polar(arcEnd, RING_RADIUS);
            const largeArc = arcEnd - arcStart > 180 ? 1 : 0;

            const tip = polar(arrowTip, RING_RADIUS);
            const wing1 = polar(arcEnd, RING_RADIUS + 2.4);
            const wing2 = polar(arcEnd, RING_RADIUS - 2.4);

            return (
              <g key={`arc-${index}`}>
                <path
                  className={styles.cicloArc}
                  d={`M ${from.x} ${from.y} A ${RING_RADIUS} ${RING_RADIUS} 0 ${largeArc} 1 ${to.x} ${to.y}`}
                />
                <polygon
                  className={styles.cicloArrow}
                  points={`${tip.x},${tip.y} ${wing1.x},${wing1.y} ${wing2.x},${wing2.y}`}
                />
              </g>
            );
          })}

          {data.etapas.map((_, index) => {
            const node = polar(-90 + index * stepAngle, RING_RADIUS);
            return (
              <g key={`node-${index}`}>
                <circle className={styles.cicloNode} cx={node.x} cy={node.y} r={NODE_RADIUS} />
                <text className={styles.cicloNodeText} x={node.x} y={node.y}>
                  {index + 1}
                </text>
              </g>
            );
          })}
        </svg>

        {data.etapas.map((etapa, index) => {
          const angle = -90 + index * stepAngle;
          const at = polar(angle, LABEL_RADIUS);
          const cos = Math.cos((angle * Math.PI) / 180);
          const side = cos > 0.35 ? styles.cicloLabelEnd : cos < -0.35 ? styles.cicloLabelStart : undefined;
          // Due north or south the label sits on the ring's axis: with an icon it is taller, so it has to
          // grow AWAY from the ring instead of being centered on its anchor and landing on the node.
          const sin = Math.sin((angle * Math.PI) / 180);
          const axis = side ? undefined : sin < 0 ? styles.cicloLabelTop : styles.cicloLabelBottom;

          return (
            <div
              key={`label-${index}`}
              className={cx(styles.cicloLabel, side, axis)}
              style={{ left: `${at.x}%`, top: `${at.y}%` }}
            >
              {etapa.icon ? <Icon name={etapa.icon} className={styles.cicloIcon} /> : null}
              <span className={styles.cicloText}>{etapa.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
