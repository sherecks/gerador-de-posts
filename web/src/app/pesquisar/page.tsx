import type { Metadata } from 'next';
import { PesquisarForm } from '@/components/PesquisarForm';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Pesquisar pautas — Gerador de Posts',
};

export default function PesquisarPage() {
  return (
    <>
      <h1 className={styles.title}>Pesquisar pautas</h1>
      <p className={styles.lede}>
        Busca real na web via OpenAI (não firecrawl, ver <code>docs/decisions/003</code>): sem tema, varre as
        fontes-semente da marca escolhida (<code>docs/EDITORIAL-REFERENCE.md</code> ou{' '}
        <code>docs/adx/EDITORIAL-REFERENCE.md</code> §4). Cada candidata é uma proposta, nunca uma pauta
        aprovada, nada fica salvo em disco — confira a fonte antes de gerar (RNF04: rastreabilidade é humana,
        não automática).
      </p>
      <PesquisarForm />
    </>
  );
}
