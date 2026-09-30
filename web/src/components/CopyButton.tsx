'use client';

import { useState } from 'react';
import styles from './CopyButton.module.css';

type Props = { text: string; label: string };

export function CopyButton({ text, label }: Props) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch (cause) {
      console.error('clipboard write failed', cause);
      setState('failed');
    }
    window.setTimeout(() => setState('idle'), 2000);
  }

  return (
    <button type="button" className={styles.button} onClick={copy}>
      {state === 'idle' ? label : state === 'copied' ? 'copiado' : 'falhou, copie à mão'}
    </button>
  );
}
