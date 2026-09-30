'use client';

import { type ReactNode, useEffect } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import styles from './Drawer.module.css';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  position?: 'left' | 'right';
  width?: number;
  className?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  position = 'right',
  width = 400,
  className,
}: DrawerProps) {
  const panelRef = useFocusTrap<HTMLElement>(open);

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
        ref={panelRef}
        className={panelClasses}
        style={{ width }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          <button
            className={styles.close}
            onClick={onClose}
            aria-label="Fechar"
            type="button"
          >
            &#10005;
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </aside>
    </div>
  );
}
