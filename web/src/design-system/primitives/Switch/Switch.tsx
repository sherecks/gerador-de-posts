'use client';

import { type KeyboardEvent } from 'react';
import styles from './Switch.module.css';

type SwitchAccent = 'mangue';
type SwitchSize = 'sm' | 'md';

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  accent?: SwitchAccent;
  size?: SwitchSize;
  disabled?: boolean;
  className?: string;
}

export function Switch({
  checked = false,
  onChange,
  label,
  accent = 'mangue',
  size = 'md',
  disabled,
  className,
}: SwitchProps) {
  const handleClick = () => {
    if (!disabled) onChange?.(!checked);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  const wrapperClasses = [
    styles.wrapper,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const trackClasses = [
    styles.track,
    styles[`size-${size}`],
    styles[`accent-${accent}`],
    checked && styles.checked,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={wrapperClasses}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={trackClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      >
        <span className={styles.thumb} />
      </button>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
