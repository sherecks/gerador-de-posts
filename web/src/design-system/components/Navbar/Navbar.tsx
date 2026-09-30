import { type ReactNode } from 'react';
import styles from './Navbar.module.css';

type NavbarVariant = 'transparent' | 'glass' | 'solid';
type NavbarPosition = 'fixed' | 'static';

export interface NavbarProps {
  logo?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  variant?: NavbarVariant;
  position?: NavbarPosition;
  className?: string;
}

export function Navbar({
  logo,
  children,
  actions,
  variant = 'solid',
  position = 'fixed',
  className,
}: NavbarProps) {
  const classNames = [
    styles.navbar,
    styles[`variant-${variant}`],
    styles[`position-${position}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={classNames}>
      <div className={styles.inner}>
        {logo && <div className={styles.logo}>{logo}</div>}
        {children && <div className={styles.links}>{children}</div>}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </nav>
  );
}
