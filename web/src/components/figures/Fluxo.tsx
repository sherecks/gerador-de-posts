import type { FigureFluxo } from '@/lib/carousel';
import { cx } from './cx';
import styles from './figures.module.css';

/**
 * A stepper on a rail. The rail is what makes it a sequence instead of a
 * list, and the filled last marker is what gives the sequence a direction:
 * the reader can see where it ends without an arrowhead per row.
 */
export function Fluxo({ data }: { data: FigureFluxo }) {
  const last = data.etapas.length - 1;

  return (
    <div className={styles.figure}>
      <div className={styles.fluxo}>
        {data.etapas.map((etapa, index) => (
          <div key={index} className={styles.fluxoStep}>
            <span className={cx(styles.fluxoMarker, index === last && styles.fluxoMarkerLast)}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className={styles.fluxoBody}>
              <span className={styles.fluxoLabel}>{etapa.label}</span>
              {etapa.detalhe ? <span className={styles.fluxoDetalhe}>{etapa.detalhe}</span> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
