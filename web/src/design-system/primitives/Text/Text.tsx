import { type ReactNode } from 'react';
import styles from './Text.module.css';

type TextSize = 'xs' | 'sm' | 'base' | 'md' | 'lg';
type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
type TextColor =
  | 'primary'
  | 'secondary'
  | 'on-dark'
  | 'muted'
  | 'mangue'
  | 'coral'
  | 'inherit';
type TextAs = 'span' | 'p' | 'div';
type TextAlign = 'left' | 'center' | 'right';
type TextTracking = 'normal' | 'wide' | 'wider' | 'widest';

export interface TextProps {
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  as?: TextAs;
  align?: TextAlign;
  tracking?: TextTracking;
  uppercase?: boolean;
  children: ReactNode;
  className?: string;
}

export function Text({
  size = 'base',
  weight = 'regular',
  color = 'primary',
  as: Tag = 'p',
  align,
  tracking,
  uppercase,
  children,
  className,
}: TextProps) {
  const classNames = [
    styles.text,
    styles[`size-${size}`],
    styles[`weight-${weight}`],
    styles[`color-${color}`],
    align && styles[`align-${align}`],
    tracking && styles[`tracking-${tracking}`],
    uppercase && styles.uppercase,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Tag className={classNames}>{children}</Tag>;
}
