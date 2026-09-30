import React from 'react';
import styles from './SectionLabel.module.css';

type Color = 'primary' | 'secondary' | 'on-dark' | 'mangue' | 'cyan' | 'gold';

export interface SectionLabelProps {
  children: React.ReactNode;
  color?: Color;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({
  children,
  color = 'secondary',
  className,
}) => {
  return (
    <span
      className={[styles.root, styles[`color-${color}`], className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
};
