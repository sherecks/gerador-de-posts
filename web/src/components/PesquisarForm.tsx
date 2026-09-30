'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button, Input, Select, Spinner } from '@/design-system';
import { BRAND_LABEL, type Brand } from '@/lib/carousel';
import type { Candidate } from '@/lib/discovery';
import styles from './PesquisarForm.module.css';

const BRAND_OPTIONS = (Object.keys(BRAND_LABEL) as Brand[]).map((value) => ({
  value,
  label: BRAND_LABEL[value],
}));

const RELEVANCIA_CLASS: Record<Candidate['relevancia'], string | undefined> = {
  alta: styles.relevancia_alta,
  media: styles.relevancia_media,
  baixa: styles.relevancia_baixa,
};

const RELEVANCIA_LABEL: Record<Candidate['relevancia'], string> = {
  alta: 'relevância alta',
  media: 'relevância média',
  baixa: 'relevância baixa',
};

export function PesquisarForm() {
  const router = useRouter();
  const [brand, setBrand] = useState<Brand>('karagua');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candidatas, setCandidatas] = useState<Candidate[] | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const tema = String(form.get('tema') ?? '').trim() || undefined;

    try {
      const response = await fetch('/api/pesquisar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, tema }),
      });
      const json = (await response.json()) as { candidatas?: Candidate[]; error?: string };
      if (!response.ok || !json.candidatas) {
        setError(json.error ?? 'falha desconhecida ao buscar pautas');
        setCandidatas(null);
        return;
      }
      setCandidatas(json.candidatas);
    } catch (cause) {
      setError(`não consegui falar com o servidor: ${(cause as Error).message}`);
    } finally {
      setLoading(false);
    }
  }

  function usarPauta(candidata: Candidate) {
    const params = new URLSearchParams({
      brand,
      fonteUrl: candidata.url,
      fonteTitulo: candidata.titulo,
      resumo: `${candidata.resumo} ${candidata.porque}`,
    });
    if (candidata.publisher) params.set('fontePublisher', candidata.publisher);
    if (candidata.data) params.set('fonteData', candidata.data);
    router.push(`/gerar?${params.toString()}`);
  }

  return (
    <>
      <form className={styles.form} onSubmit={onSubmit}>
        <Select
          className={styles.brandSelect}
          name="brand"
          label="Marca"
          options={BRAND_OPTIONS}
          value={brand}
          onChange={(event) => setBrand(event.target.value as Brand)}
          disabled={loading}
        />
        <Input
          className={styles.input}
          name="tema"
          label="Tema (opcional)"
          placeholder="Deixe vazio para varrer as fontes-semente da marca"
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <span className={styles.loading}>
              <Spinner size="sm" /> Buscando…
            </span>
          ) : (
            'Buscar pautas'
          )}
        </Button>
      </form>

      {error ? <p className={styles.error}>{error}</p> : null}

      {!error && candidatas === null && !loading ? (
        <p className={styles.empty}>Nenhuma busca ainda. Resultados não ficam salvos: escolha uma pauta e ela vai direto para o gerador.</p>
      ) : null}

      {candidatas ? (
        <div className={styles.list}>
          {candidatas.map((candidata) => (
            <article className={styles.card} key={candidata.url}>
              <div className={styles.cardHead}>
                <h2 className={styles.cardTitle}>{candidata.titulo}</h2>
                <span className={`${styles.relevancia} ${RELEVANCIA_CLASS[candidata.relevancia]}`}>
                  {RELEVANCIA_LABEL[candidata.relevancia]}
                </span>
              </div>
              <p className={styles.meta}>
                {candidata.publisher ?? 'fonte não identificada'}
                {candidata.data ? ` · ${candidata.data}` : ''}
              </p>
              <p className={styles.resumo}>{candidata.resumo}</p>
              <p className={styles.porque}>{candidata.porque}</p>
              <div className={styles.cardActions}>
                <a className={styles.link} href={candidata.url} target="_blank" rel="noreferrer noopener">
                  abrir fonte ↗
                </a>
                <Button
                  className={styles.useButton}
                  size="sm"
                  variant="secondary"
                  type="button"
                  onClick={() => usarPauta(candidata)}
                >
                  Usar esta pauta →
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </>
  );
}
