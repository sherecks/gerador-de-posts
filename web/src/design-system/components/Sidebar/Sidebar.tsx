'use client';

import { type ReactNode, useEffect } from 'react';
import styles from './Sidebar.module.css';

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  position?: 'left' | 'right';
  width?: number;
  className?: string;
}

export function Sidebar({
  open,
  onClose,
  children,
  position = 'left',
  width = 320,
  className,
}: SidebarProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const wrapperClasses = [
    styles.wrapper,
    open && styles.open,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const panelClasses = [
    styles.panel,
    styles[`pos-${position}`],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses}>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <aside
        className={panelClasses}
        style={{ width }}
        role="complementary"
      >
        {children}
      </aside>
    </div>
  );
}
