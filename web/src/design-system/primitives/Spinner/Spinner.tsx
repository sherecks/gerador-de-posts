import styles from './Spinner.module.css';

type SpinnerSize = 'sm' | 'md' | 'lg';
type SpinnerAccent = 'mangue';

export interface SpinnerProps {
  size?: SpinnerSize;
  accent?: SpinnerAccent;
  className?: string;
}

export function Spinner({
  size = 'md',
  accent = 'mangue',
  className,
}: SpinnerProps) {
  const classNames = [
    styles.spinner,
    styles[`size-${size}`],
    styles[`accent-${accent}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classNames} role="status" aria-label="Loading">
      <span className={styles.ring} />
    </span>
  );
}
