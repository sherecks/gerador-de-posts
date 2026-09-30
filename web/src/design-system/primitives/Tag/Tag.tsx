import { type ReactNode } from 'react';
import styles from './Tag.module.css';

type TagVariant = 'filled' | 'outline' | 'subtle';
type TagColor = 'mangue' | 'coral' | 'neutral';
type TagSize = 'sm' | 'md';

export interface TagProps {
  variant?: TagVariant;
  color?: TagColor;
  size?: TagSize;
  children: ReactNode;
  className?: string;
}

export function Tag({
  variant = 'filled',
  color = 'mangue',
  size = 'sm',
  children,
  className,
}: TagProps) {
  const classNames = [
    styles.tag,
    styles[`variant-${variant}`],
    styles[`color-${color}`],
    styles[`size-${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classNames}>{children}</span>;
}
