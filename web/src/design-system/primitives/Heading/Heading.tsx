import { type ReactNode } from 'react';
import styles from './Heading.module.css';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingSize = 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'hero';
type HeadingWeight = 'semibold' | 'bold';
type HeadingColor = 'primary' | 'on-dark' | 'mangue';
type HeadingTracking = 'tighter' | 'tight' | 'normal';
type HeadingAlign = 'left' | 'center' | 'right';

const defaultSizeByLevel: Record<HeadingLevel, HeadingSize> = {
  1: 'hero',
  2: '5xl',
  3: '4xl',
  4: '3xl',
  5: '2xl',
  6: 'xl',
};

export interface HeadingProps {
  level?: HeadingLevel;
  size?: HeadingSize;
  weight?: HeadingWeight;
  color?: HeadingColor;
  tracking?: HeadingTracking;
  align?: HeadingAlign;
  children: ReactNode;
  className?: string;
}

export function Heading({
  level = 2,
  size,
  weight = 'bold',
  color = 'primary',
  tracking,
  align,
  children,
  className,
}: HeadingProps) {
  const Tag = `h${level}` as const;
  const resolvedSize = size ?? defaultSizeByLevel[level];

  const classNames = [
    styles.heading,
    styles[`size-${resolvedSize}`],
    styles[`weight-${weight}`],
    styles[`color-${color}`],
    tracking && styles[`tracking-${tracking}`],
    align && styles[`align-${align}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Tag className={classNames}>{children}</Tag>;
}
