'use client';

import { type ReactNode, useEffect } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import styles from './Modal.module.css';

type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: ModalSize;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  className,
}: ModalProps) {
  const dialogRef = useFocusTrap<HTMLDivElement>(open);

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

  const dialogClasses = [
    styles.dialog,
    styles[`size-${size}`],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses}>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        className={dialogClasses}
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
      </div>
    </div>
  );
}
