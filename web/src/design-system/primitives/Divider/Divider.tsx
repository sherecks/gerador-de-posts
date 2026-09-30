import styles from './Divider.module.css';

type DividerColor = 'default' | 'mangue' | 'subtle';
type DividerThickness = 1 | 2 | 3;
type DividerSpacing = 'sm' | 'md' | 'lg';

export interface DividerProps {
  color?: DividerColor;
  thickness?: DividerThickness;
  spacing?: DividerSpacing;
  className?: string;
}

export function Divider({
  color = 'default',
  thickness = 1,
  spacing = 'md',
  className,
}: DividerProps) {
  const classNames = [
    styles.divider,
    styles[`color-${color}`],
    styles[`thickness-${thickness}`],
    styles[`spacing-${spacing}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <hr className={classNames} />;
}
