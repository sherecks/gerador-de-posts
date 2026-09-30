import type { FigureBalanca } from '@/lib/carousel';
import { cx } from './cx';
import styles from './figures.module.css';

/**
 * Two sides of one question. The right side carries the accent because in
 * this editorial framework it is always the payoff (o que muda, o que a
 * Karaguá defende); the left is the situation it answers.
 */
export function Balanca({ data }: { data: FigureBalanca }) {
  return (
    <div className={styles.figure}>
      <div className={styles.balanca}>
        <div className={styles.balancaSide}>
          <span className={styles.balancaHead}>{data.esquerda.label}</span>
          <ul className={styles.balancaList}>
            {data.esquerda.itens.map((item, index) => (
              <li className={styles.balancaItem} key={index}>
                <span className={cx(styles.balancaBullet, styles.balancaBulletMuted)} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <span className={styles.balancaRule} aria-hidden="true" />

        <div className={styles.balancaSide}>
          <span className={cx(styles.balancaHead, styles.balancaHeadAccent)}>{data.direita.label}</span>
          <ul className={styles.balancaList}>
            {data.direita.itens.map((item, index) => (
              <li className={styles.balancaItem} key={index}>
                <span className={styles.balancaBullet} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
