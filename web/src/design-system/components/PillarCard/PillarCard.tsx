import React from 'react';
import styles from './PillarCard.module.css';

type Accent = 'mangue';

export interface PillarCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent?: Accent;
  className?: string;
}

export const PillarCard: React.FC<PillarCardProps> = ({
  icon,
  title,
  description,
  accent = 'mangue',
  className,
}) => {
  return (
    <article
      className={[styles.root, styles[`accent-${accent}`], className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.iconWrap} aria-hidden="true">
        {icon}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </article>
  );
};
