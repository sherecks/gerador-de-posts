import React from 'react';
import styles from './Timeline.module.css';

type Accent = 'mangue' | 'cyan';
type Status = 'completed' | 'active' | 'upcoming';

export interface TimelineItem {
  year: string;
  label: string;
  status: Status;
}

export interface TimelineProps {
  items: TimelineItem[];
  accent?: Accent;
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({
  items,
  accent = 'mangue',
  className,
}) => {
  return (
    <ol
      role="list"
      className={[styles.root, styles[`accent-${accent}`], className]
        .filter(Boolean)
        .join(' ')}
    >
      {items.map((item, index) => (
        <li
          key={index}
          className={[styles.item, styles[`status-${item.status}`]]
            .filter(Boolean)
            .join(' ')}
        >
          <div className={styles.dotTrack}>
            <span className={styles.dot} aria-hidden="true" />
            {index < items.length - 1 && (
              <span className={styles.line} aria-hidden="true" />
            )}
          </div>
          <span className={styles.year}>{item.year}</span>
          <span className={styles.label}>{item.label}</span>
        </li>
      ))}
    </ol>
  );
};
