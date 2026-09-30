import Link from 'next/link';
import { SlideStage } from '@/components/SlideStage';
import { BRAND_LABEL, STATUS_LABEL, type Carousel } from '@/lib/carousel';
import { runGate } from '@/lib/gate';
import { dataDir, loadCarousels } from '@/lib/store';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function GenerationCard({ carousel }: { carousel: Carousel }) {
  const cover = carousel.slides[0];
  const report = runGate(carousel);

  return (
    <Link href={`/carrossel/${carousel.id}`} className={styles.card}>
      <div className={styles.cover}>
        {cover ? (
          <SlideStage slide={cover} index={1} total={carousel.slides.length} brand={carousel.brand} />
        ) : null}
      </div>

      <div className={styles.cardBody}>
        <span className={`${styles.status} ${styles[`status_${carousel.status}`] ?? ''}`}>
          {STATUS_LABEL[carousel.status]}
        </span>
        <span className={styles.brandTag}>{BRAND_LABEL[carousel.brand]}</span>
        <h2 className={styles.cardTitle}>{carousel.title}</h2>
        <p className={styles.cardMeta}>
          {carousel.slides.length} slides · {carousel.framework} · {formatDate(carousel.createdAt)}
        </p>
        <p className={styles.cardGate}>
          {report.blockers.length > 0
            ? `${report.blockers.length} bloqueante(s)`
            : 'sem bloqueante'}
          {report.warnings.length > 0 ? ` · ${report.warnings.length} alerta(s)` : ''}
        </p>
      </div>
    </Link>
  );
}

export default async function Home() {
  const { carousels, errors } = await loadCarousels();

  return (
    <>
      <h1 className={styles.title}>Gerações</h1>
      <p className={styles.lede}>
        Cada carrossel produzido pela fábrica aparece aqui, na identidade de cada marca e com o gate
        de qualidade do copy engine correspondente. O visualizador só lê: aprovar, editar e exportar
        seguem com a fábrica.
      </p>

      {errors.length > 0 ? (
        <div className={styles.errors}>
          <strong>Arquivos fora do contrato:</strong>
          <ul>
            {errors.map((error) => (
              <li key={error.file}>{error.message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {carousels.length === 0 ? (
        <div className={styles.empty}>
          <p>Nenhuma geração em disco ainda.</p>
          <p className={styles.emptyPath}>{dataDir()}</p>
          <p>
            A fábrica grava um JSON por carrossel nessa pasta, no contrato de{' '}
            <code>src/lib/carousel.ts</code>.
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {carousels.map((carousel) => (
            <GenerationCard key={carousel.id} carousel={carousel} />
          ))}
        </div>
      )}
    </>
  );
}
