import React from 'react';
import styles from './MetricCard.module.css';

type Accent = 'mangue';
type Size = 'sm' | 'md' | 'lg';
type Align = 'left' | 'center';

export interface MetricCardProps {
  value: string;
  label?: string;
  description?: string;
  accent?: Accent;
  size?: Size;
  align?: Align;
  'aria-label'?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  description,
  accent = 'mangue',
  size = 'md',
  align = 'center',
  'aria-label': ariaLabel,
  className,
}) => {
  return (
    <div
      role="group"
      aria-label={ariaLabel ?? label}
      className={[
        styles.root,
        styles[`accent-${accent}`],
        styles[`size-${size}`],
        styles[`align-${align}`],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label && <span className={styles.label}>{label}</span>}
      <span className={styles.value}>{value}</span>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
};
