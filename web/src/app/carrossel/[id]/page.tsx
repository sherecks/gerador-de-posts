import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CarouselViewer } from '@/components/CarouselViewer';
import { CopyButton } from '@/components/CopyButton';
import { GatePanel } from '@/components/GatePanel';
import { PERSONA_LABEL, STATUS_LABEL } from '@/lib/carousel';
import { runGate } from '@/lib/gate';
import { loadCarousel, loadCarousels } from '@/lib/store';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const { carousels } = await loadCarousels();
  return carousels.map((carousel) => ({ id: carousel.id }));
}

export default async function CarouselPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const carousel = await loadCarousel(id);
  if (!carousel) notFound();

  const report = runGate(carousel);
  const captionFull = `${carousel.caption.text}\n\n${carousel.caption.hashtags.join(' ')}`;

  return (
    <>
      <Link href="/" className={styles.back}>
        ← todas as gerações
      </Link>

      <header className={styles.head}>
        <span className={styles.status}>{STATUS_LABEL[carousel.status]}</span>
        <h1 className={styles.title}>{carousel.title}</h1>
        <p className={styles.pauta}>{carousel.pauta.resumo}</p>
        <p className={styles.provenance}>
          Pauta:{' '}
          <a href={carousel.pauta.source.url} target="_blank" rel="noreferrer noopener">
            {carousel.pauta.source.title}
          </a>
          {carousel.pauta.source.publisher ? ` · ${carousel.pauta.source.publisher}` : ''}
          {carousel.pauta.source.date ? ` · ${carousel.pauta.source.date}` : ''}
        </p>
      </header>

      <div className={styles.columns}>
        <CarouselViewer carousel={carousel} />

        <aside className={styles.aside}>
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Enquadramento</h2>
            <dl className={styles.dl}>
              <dt>Framework</dt>
              <dd>{carousel.framework}</dd>
              <dt>Persona</dt>
              <dd>{PERSONA_LABEL[carousel.persona]}</dd>
              <dt>Profundidade</dt>
              <dd>{carousel.depth}</dd>
              <dt>Slides</dt>
              <dd>{carousel.slides.length}</dd>
            </dl>
          </section>

          <section className={styles.block}>
            <div className={styles.blockHead}>
              <h2 className={styles.blockTitle}>Legenda</h2>
              <CopyButton text={captionFull} label="copiar" />
            </div>
            <p className={styles.caption}>{carousel.caption.text}</p>
            <p className={styles.hashtags}>{carousel.caption.hashtags.join(' ')}</p>
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Gate de qualidade</h2>
            <GatePanel report={report} />
          </section>

          {carousel.notes ? (
            <section className={styles.block}>
              <h2 className={styles.blockTitle}>Notas da fábrica</h2>
              <p className={styles.caption}>{carousel.notes}</p>
            </section>
          ) : null}
        </aside>
      </div>
    </>
  );
}
