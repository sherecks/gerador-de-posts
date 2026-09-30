import { type ReactNode } from 'react';
import styles from './Surface.module.css';

type SurfaceBg = 'white' | 'shell' | 'fog' | 'elevated' | 'deep' | 'glass' | 'carbon' | 'carbon-light';
type SurfaceRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl';
type SurfaceShadow = 'none' | 'sm' | 'md' | 'lg';
type SurfacePadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
type SurfaceAs = 'div' | 'section' | 'article';

export interface SurfaceProps {
  bg?: SurfaceBg;
  border?: boolean;
  radius?: SurfaceRadius;
  shadow?: SurfaceShadow;
  padding?: SurfacePadding;
  as?: SurfaceAs;
  children: ReactNode;
  className?: string;
}

export function Surface({
  bg = 'white',
  border,
  radius = 'md',
  shadow = 'none',
  padding = 'md',
  as: Tag = 'div',
  children,
  className,
}: SurfaceProps) {
  const classNames = [
    styles.surface,
    styles[`bg-${bg}`],
    styles[`radius-${radius}`],
    shadow !== 'none' && styles[`shadow-${shadow}`],
    styles[`padding-${padding}`],
    border && styles.border,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Tag className={classNames}>{children}</Tag>;
}
