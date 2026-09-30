import React from 'react';
import styles from './DataBar.module.css';

type Accent = 'mangue';

export interface DataBarItem {
  label: string;
  value: string;
}

export interface DataBarProps {
  items: DataBarItem[];
  accent?: Accent;
  'aria-label'?: string;
  className?: string;
}

export const DataBar: React.FC<DataBarProps> = ({
  items,
  accent = 'mangue',
  'aria-label': ariaLabel,
  className,
}) => {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={[styles.root, styles[`accent-${accent}`], className]
        .filter(Boolean)
        .join(' ')}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className={styles.divider} aria-hidden="true" />}
          <div className={styles.item}>
            <span className={styles.label}>{item.label}</span>
            <span className={styles.value}>{item.value}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
