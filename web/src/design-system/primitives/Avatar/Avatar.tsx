import styles from './Avatar.module.css';

type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  className?: string;
}

export function Avatar({
  src,
  alt = '',
  initials,
  size = 'md',
  className,
}: AvatarProps) {
  const classNames = [
    styles.avatar,
    styles[`size-${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={classNames}
      />
    );
  }

  return (
    <span className={classNames} aria-label={alt || initials}>
      {initials && (
        <span className={styles.initials}>
          {initials.slice(0, 2).toUpperCase()}
        </span>
      )}
    </span>
  );
}
