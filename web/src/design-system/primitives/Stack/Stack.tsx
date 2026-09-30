import { type ReactNode } from 'react';
import styles from './Stack.module.css';

type StackGap = 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16;
type StackAlign = 'start' | 'center' | 'end' | 'stretch';
type StackJustify = 'start' | 'center' | 'end' | 'between';
type StackAs = 'div' | 'section' | 'ul' | 'ol';

export interface StackProps {
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  as?: StackAs;
  children: ReactNode;
  className?: string;
}

export function Stack({
  gap = 4,
  align = 'stretch',
  justify,
  as: Tag = 'div',
  children,
  className,
}: StackProps) {
  const classNames = [
    styles.stack,
    styles[`gap-${gap}`],
    styles[`align-${align}`],
    justify && styles[`justify-${justify}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Tag className={classNames}>{children}</Tag>;
}
