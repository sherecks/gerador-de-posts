import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './Radio.module.css';

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  function Radio({ label, disabled, className, id, ...rest }, ref) {
    const inputId = id || (label ? `radio-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    const wrapperClasses = [
      styles.wrapper,
      disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <label htmlFor={inputId} className={wrapperClasses}>
        <input
          ref={ref}
          id={inputId}
          type="radio"
          className={styles.input}
          disabled={disabled}
          {...rest}
        />
        <span className={styles.circle} aria-hidden="true" />
        {label && <span className={styles.label}>{label}</span>}
      </label>
    );
  },
);
