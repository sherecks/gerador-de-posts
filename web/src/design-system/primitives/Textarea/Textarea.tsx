import { forwardRef, type TextareaHTMLAttributes } from 'react';
import styles from './Textarea.module.css';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, error, disabled, className, id, rows = 4, ...rest },
    ref,
  ) {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const wrapperClasses = [
      styles.wrapper,
      error && styles.hasError,
      disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses}>
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={styles.textarea}
          disabled={disabled}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...rest}
        />
        {error && (
          <span id={`${textareaId}-error`} className={styles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  },
);
