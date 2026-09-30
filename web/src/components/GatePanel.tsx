import type { Check, GateReport } from '@/lib/gate';
import styles from './GatePanel.module.css';

const MARK: Record<Check['status'], string> = {
  pass: '[ok]',
  fail: '[x]',
  manual: '[ ]',
};

const STATUS_CLASS: Record<Check['status'], string | undefined> = {
  pass: styles.pass,
  fail: styles.fail,
  manual: styles.manual,
};

export function GatePanel({ report }: { report: GateReport }) {
  const blocked = report.blockers.length > 0;

  return (
    <div className={styles.panel}>
      <p className={`${styles.verdict} ${blocked ? styles.blocked : styles.clear}`}>
        {blocked
          ? `Aprovação bloqueada: ${report.blockers.length} item(ns) bloqueante(s)`
          : 'Nenhum bloqueante automático'}
        {report.warnings.length > 0 ? ` · ${report.warnings.length} alerta(s)` : ''}
      </p>

      <ul className={styles.list}>
        {report.checks.map((check) => (
          <li key={check.id} className={[styles.item, STATUS_CLASS[check.status]].filter(Boolean).join(' ')}>
            <span className={styles.mark} aria-hidden="true">
              {MARK[check.status]}
            </span>
            <span className={styles.label}>
              {check.label}
              {check.blocking && check.status === 'fail' ? (
                <span className={styles.blockingTag}>bloqueante</span>
              ) : null}
              {check.findings.length > 0 ? (
                <ul className={styles.findings}>
                  {check.findings.map((finding) => (
                    <li key={finding}>{finding}</li>
                  ))}
                </ul>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
