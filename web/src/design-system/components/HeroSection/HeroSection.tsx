import { type ReactNode } from 'react';
import styles from './HeroSection.module.css';

type HeroAccent = 'mangue';
type HeroAlign = 'left' | 'center';

export interface HeroSectionProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  accent?: HeroAccent;
  align?: HeroAlign;
  children?: ReactNode;
  className?: string;
}

export function HeroSection({
  eyebrow,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  accent = 'mangue',
  align = 'left',
  children,
  className,
}: HeroSectionProps) {
  const sectionClasses = [
    styles.hero,
    styles[`align-${align}`],
    styles[`accent-${accent}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const hasActions = primaryAction || secondaryAction;

  return (
    <section className={sectionClasses}>
      <div className={styles.container}>
        {eyebrow && (
          <span className={styles.eyebrow}>{eyebrow}</span>
        )}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && (
          <p className={styles.subtitle}>{subtitle}</p>
        )}
        {hasActions && (
          <div className={styles.actions}>
            {primaryAction}
            {secondaryAction}
          </div>
        )}
        {children && <div className={styles.extra}>{children}</div>}
      </div>
    </section>
  );
}
