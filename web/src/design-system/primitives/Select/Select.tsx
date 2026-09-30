import { forwardRef, type SelectHTMLAttributes } from 'react';
import styles from './Select.module.css';

type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  selectSize?: SelectSize;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { label, error, options, placeholder, selectSize = 'md', disabled, className, id, ...rest },
    ref,
  ) {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const wrapperClasses = [
      styles.wrapper,
      error && styles.hasError,
      disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const selectClasses = [
      styles.select,
      styles[`size-${selectSize}`],
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses}>
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.selectWrap}>
          <select
            ref={ref}
            id={selectId}
            className={selectClasses}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : undefined}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className={styles.chevron} aria-hidden="true">
            &#8963;
          </span>
        </div>
        {error && (
          <span id={`${selectId}-error`} className={styles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  },
);
