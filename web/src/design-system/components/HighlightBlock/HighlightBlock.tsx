import React from 'react';
import styles from './HighlightBlock.module.css';

type Variant = 'mangue' | 'coral';

export interface HighlightBlockProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

export const HighlightBlock: React.FC<HighlightBlockProps> = ({
  children,
  variant = 'mangue',
  className,
}) => {
  return (
    <aside
      className={[styles.root, styles[`variant-${variant}`], className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </aside>
  );
};
