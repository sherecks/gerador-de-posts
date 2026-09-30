import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, disabled, className, id, ...rest }, ref) {
    const inputId = id || (label ? `cb-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

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
          type="checkbox"
          className={styles.input}
          disabled={disabled}
          {...rest}
        />
        <span className={styles.box} aria-hidden="true" />
        {label && <span className={styles.label}>{label}</span>}
      </label>
    );
  },
);
