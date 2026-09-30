import React from 'react';
import styles from './StatementBlock.module.css';

type Color = 'mangue' | 'on-dark';
type Align = 'left' | 'center';

export interface StatementBlockProps {
  statement: string;
  label?: string;
  color?: Color;
  maxWidth?: string;
  align?: Align;
  className?: string;
}

export const StatementBlock: React.FC<StatementBlockProps> = ({
  statement,
  label,
  color = 'mangue',
  maxWidth,
  align = 'center',
  className,
}) => {
  return (
    <div
      className={[
        styles.root,
        styles[`color-${color}`],
        styles[`align-${align}`],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={maxWidth ? { maxWidth } : undefined}
    >
      <p className={styles.statement}>{statement}</p>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
};
