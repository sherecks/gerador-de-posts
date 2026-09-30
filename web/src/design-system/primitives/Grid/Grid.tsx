import { type ReactNode } from 'react';
import styles from './Grid.module.css';

type GridColumns = 1 | 2 | 3 | 4;
type GridGap = 2 | 4 | 6 | 8;
type GridAlign = 'start' | 'center' | 'end' | 'stretch';
type GridAs = 'div' | 'section' | 'ul' | 'ol';

export interface GridProps {
  columns?: GridColumns;
  gap?: GridGap;
  align?: GridAlign;
  as?: GridAs;
  children: ReactNode;
  className?: string;
}

export function Grid({
  columns = 3,
  gap = 6,
  align,
  as: Tag = 'div',
  children,
  className,
}: GridProps) {
  const classNames = [
    styles.grid,
    styles[`columns-${columns}`],
    styles[`gap-${gap}`],
    align && styles[`align-${align}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Tag className={classNames}>{children}</Tag>;
}
