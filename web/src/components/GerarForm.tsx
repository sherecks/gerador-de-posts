'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button, Input, Select, Spinner, Textarea } from '@/design-system';
import { BRAND_LABEL, DEPTH_RANGE, PERSONAS_BY_BRAND, PERSONA_LABEL, type Brand } from '@/lib/carousel';
import styles from './GerarForm.module.css';

const BRAND_OPTIONS = (Object.keys(BRAND_LABEL) as Brand[]).map((value) => ({
  value,
  label: BRAND_LABEL[value],
}));

const FRAMEWORK_OPTIONS = [
  { value: 'PAS', label: 'Lei/decreto novo, ou reframe de métrica — PAS (Problema → Agitação → Solução)' },
  { value: 'AIDA', label: 'Notícia de mercado, preço, tendência, caso antes/depois — AIDA' },
  { value: 'explicador', label: '"Como funciona", metodologia, conceito — Explicador' },
  { value: 'hook-prova-payoff', label: 'Marco, conquista, dado de impacto — Hook → prova → payoff' },
] as const;

const DEPTH_OPTIONS = (Object.keys(DEPTH_RANGE) as Array<keyof typeof DEPTH_RANGE>).map((value) => {
  const [min, max] = DEPTH_RANGE[value];
  const name = { rapida: 'Rápida', explicador: 'Explicador', guia: 'Guia' }[value];
  return { value, label: `${name} (${min}–${max} slides)` };
});

type Result = { id: string; blockers: string[]; warnings: string[] } | null;

export type GerarFormDefaults = {
  brand?: Brand;
  fonteUrl?: string;
  fonteTitulo?: string;
  fontePublisher?: string;
  fonteData?: string;
  resumo?: string;
};

export function GerarForm({ defaults }: { defaults?: GerarFormDefaults }) {
  const router = useRouter();
  const [brand, setBrand] = useState<Brand>(defaults?.brand ?? 'karagua');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result>(null);

  const personaOptions = PERSONAS_BY_BRAND[brand].map((value) => ({ value, label: PERSONA_LABEL[value] }));

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const body = {
      brand: String(form.get('brand')),
      persona: String(form.get('persona')),
      depth: String(form.get('depth')),
      framework: String(form.get('framework')),
      resumo: String(form.get('resumo') ?? '').trim(),
      texto: String(form.get('texto') ?? '').trim() || undefined,
      source: {
        title: String(form.get('fonteTitulo') ?? '').trim(),
        url: String(form.get('fonteUrl') ?? '').trim(),
        publisher: String(form.get('fontePublisher') ?? '').trim() || undefined,
        date: String(form.get('fonteData') ?? '').trim() || undefined,
      },
    };

    try {
      const response = await fetch('/api/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = (await response.json()) as { id?: string; blockers?: string[]; warnings?: string[]; error?: string };
      if (!response.ok || !json.id) {
        setError(json.error ?? 'falha desconhecida ao gerar o carrossel');
        return;
      }
      setResult({ id: json.id, blockers: json.blockers ?? [], warnings: json.warnings ?? [] });
      router.push(`/carrossel/${json.id}`);
    } catch (cause) {
      setError(`não consegui falar com o servidor: ${(cause as Error).message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {error ? <p className={styles.error}>{error}</p> : null}
      {result ? (
        <p className={styles.notice}>
          Gerado. {result.blockers.length > 0 ? `${result.blockers.length} bloqueante(s) no gate.` : 'Sem bloqueante.'}{' '}
          Abrindo o carrossel…
        </p>
      ) : null}

      {defaults?.fonteUrl ? (
        <p className={styles.info}>Pré-preenchido a partir de uma pauta pesquisada. Confira antes de gerar.</p>
      ) : null}

      <fieldset className={styles.fieldset} disabled={loading}>
        <legend className={styles.legend}>Marca</legend>
        <Select
          label="Gerar para"
          name="brand"
          required
          options={BRAND_OPTIONS}
          value={brand}
          onChange={(event) => setBrand(event.target.value as Brand)}
        />
      </fieldset>

      <fieldset className={styles.fieldset} disabled={loading}>
        <legend className={styles.legend}>Fonte</legend>
        <p className={styles.hint}>
          A URL vira a citação persistida (fonte rastreável, regra do site). Se a página não carregar bem
          (paywall, JavaScript), cole o texto abaixo como reforço; a URL continua sendo a citação.
          {brand === 'adx' ? ' Na ADX o ângulo costuma nascer de dado próprio, não de notícia: a URL pode ser a landing (adx.dev.br) ou um post do blog, e o campo de texto abaixo é onde o argumento entra.' : ''}
        </p>
        <Input
          label="URL da notícia"
          name="fonteUrl"
          type="url"
          required
          placeholder="https://…"
          defaultValue={defaults?.fonteUrl}
        />
        <Input
          label="Título da fonte"
          name="fonteTitulo"
          required
          placeholder='Ex.: "Lei nº 15.042/2024"'
          defaultValue={defaults?.fonteTitulo}
        />
        <div className={styles.row}>
          <Input
            label="Veículo/publisher (opcional)"
            name="fontePublisher"
            placeholder="Ex.: Carbon Pulse"
            defaultValue={defaults?.fontePublisher}
          />
          <Input label="Data (opcional)" name="fonteData" type="date" defaultValue={defaults?.fonteData} />
        </div>
        <Textarea
          label="Colar texto da notícia (opcional, reforça ou substitui a busca da URL)"
          name="texto"
          rows={6}
          placeholder="Cole aqui o corpo da notícia, se a busca automática não for suficiente…"
        />
      </fieldset>

      <fieldset className={styles.fieldset} disabled={loading}>
        <legend className={styles.legend}>Pauta e enquadramento</legend>
        <Textarea
          label="Ângulo da pauta"
          name="resumo"
          required
          rows={3}
          placeholder="O que essa notícia muda, e por que isso importa agora?"
          defaultValue={defaults?.resumo}
        />
        <Select label="Tipo de pauta (framework)" name="framework" required options={[...FRAMEWORK_OPTIONS]} />
        <div className={styles.row}>
          <Select label="Persona primário" name="persona" required options={personaOptions} />
          <Select label="Profundidade" name="depth" required options={DEPTH_OPTIONS} defaultValue="explicador" />
        </div>
      </fieldset>

      <Button type="submit" disabled={loading} fullWidth>
        {loading ? (
          <span className={styles.loading}>
            <Spinner /> Gerando…
          </span>
        ) : (
          'Gerar carrossel'
        )}
      </Button>
    </form>
  );
}
