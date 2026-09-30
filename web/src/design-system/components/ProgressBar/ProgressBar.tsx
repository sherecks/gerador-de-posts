import React, { type CSSProperties } from 'react';
import styles from './ProgressBar.module.css';

type Color = 'mangue';
type Size = 'sm' | 'md';

export interface ProgressBarProps {
  value: number;
  color?: Color;
  size?: Size;
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = 'mangue',
  size = 'md',
  label,
  className,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={[
        styles.root,
        styles[`color-${color}`],
        styles[`size-${size}`],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ '--progress': clampedValue / 100 } as CSSProperties}
        />
      </div>
    </div>
  );
};
