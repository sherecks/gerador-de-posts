import { type ReactNode } from 'react';
import styles from './DataTable.module.css';

export interface DataTableColumn<T> {
  key: keyof T & string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: T[keyof T], row: T) => ReactNode;
}

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: DataTableColumn<T>[];
  data: T[];
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  striped,
  hoverable,
  className,
}: DataTableProps<T>) {
  const tableClasses = [
    styles.table,
    striped && styles.striped,
    hoverable && styles.hoverable,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.wrapper}>
      <table className={tableClasses}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={styles.th}
                style={{
                  width: col.width,
                  textAlign: col.align || 'left',
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx} className={styles.tr}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={styles.td}
                  style={{ textAlign: col.align || 'left' }}
                >
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
