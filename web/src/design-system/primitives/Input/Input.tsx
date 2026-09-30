import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  inputSize?: InputSize;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    { label, error, inputSize = 'md', disabled, className, id, ...rest },
    ref,
  ) {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const wrapperClasses = [
      styles.wrapper,
      error && styles.hasError,
      disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const inputClasses = [
      styles.input,
      styles[`size-${inputSize}`],
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        />
        {error && (
          <span id={`${inputId}-error`} className={styles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  },
);
