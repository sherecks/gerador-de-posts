import { type ReactNode } from 'react';
import styles from './Footer.module.css';

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterProps {
  logo?: ReactNode;
  columns?: FooterColumn[];
  copyright?: string;
  className?: string;
}

export function Footer({
  logo,
  columns,
  copyright,
  className,
}: FooterProps) {
  const classNames = [styles.footer, className].filter(Boolean).join(' ');

  return (
    <footer className={classNames}>
      <div className={styles.inner}>
        {columns && columns.length > 0 && (
          <div className={styles.columns}>
            {columns.map((col) => (
              <div key={col.title} className={styles.column}>
                <span className={styles.columnTitle}>{col.title}</span>
                <ul className={styles.linkList}>
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className={styles.link}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        <div className={styles.bottom}>
          {logo && <div className={styles.logo}>{logo}</div>}
          {copyright && <span className={styles.copyright}>{copyright}</span>}
        </div>
      </div>
    </footer>
  );
}
