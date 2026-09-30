'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Carousel } from '@/lib/carousel';
import { ROLE_LABEL } from '@/lib/carousel';
import { captureSlide, downloadBlob, downloadCarouselZip, waitForImages, waitFrames } from '@/lib/export';
import { SlideStage } from './SlideStage';
import styles from './CarouselViewer.module.css';

type Props = { carousel: Carousel };

type ExportState =
  | { kind: 'idle' }
  | { kind: 'single' }
  | { kind: 'progress'; done: number; total: number }
  | { kind: 'zipping' }
  | { kind: 'error'; message: string };

export function CarouselViewer({ carousel }: Props) {
  const [current, setCurrent] = useState(0);
  const [exportState, setExportState] = useState<ExportState>({ kind: 'idle' });
  const total = carousel.slides.length;
  const filmstripRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const exporting = exportState.kind !== 'idle' && exportState.kind !== 'error';

  const go = useCallback(
    (delta: number) => {
      setCurrent((value) => Math.min(total - 1, Math.max(0, value + delta)));
    },
    [total],
  );

  // Keyboard and arrow navigation can land on a thumb that is scrolled out of view.
  useEffect(() => {
    const strip = filmstripRef.current;
    const thumb = strip?.children[current];
    if (thumb instanceof HTMLElement) {
      thumb.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }
  }, [current]);

  useEffect(() => {
    if (exporting) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, exporting]);

  async function downloadCurrentSlide() {
    const node = stageRef.current;
    if (!node || exporting) return;
    setExportState({ kind: 'single' });
    try {
      await waitForImages(node);
      const blob = await captureSlide(node);
      const role = carousel.slides[current]?.role ?? 'slide';
      downloadBlob(blob, `${carousel.id}-${String(current + 1).padStart(2, '0')}-${role}.png`);
      setExportState({ kind: 'idle' });
    } catch (cause) {
      setExportState({ kind: 'error', message: (cause as Error).message });
    }
  }

  async function downloadWholeCarousel() {
    const node = stageRef.current;
    if (!node || exporting) return;
    const startIndex = current;
    setExportState({ kind: 'progress', done: 0, total });

    try {
      await document.fonts.ready;
      const slideBlobs: Array<{ role: string; blob: Blob }> = [];

      for (let index = 0; index < total; index += 1) {
        setCurrent(index);
        await waitFrames(2);
        const node = stageRef.current;
        if (!node) throw new Error('slide sumiu do DOM durante a exportação');
        await waitForImages(node);
        const blob = await captureSlide(node);
        slideBlobs.push({ role: carousel.slides[index]?.role ?? `slide-${index + 1}`, blob });
        setExportState({ kind: 'progress', done: index + 1, total });
      }

      setExportState({ kind: 'zipping' });
      await downloadCarouselZip(carousel, slideBlobs);
      setExportState({ kind: 'idle' });
    } catch (cause) {
      setExportState({ kind: 'error', message: (cause as Error).message });
    } finally {
      setCurrent(startIndex);
    }
  }

  const slide = carousel.slides[current];
  if (!slide) return null;

  return (
    <section className={styles.viewer} aria-label="Visualizador do carrossel">
      <div className={styles.stageRow}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => go(-1)}
          disabled={current === 0 || exporting}
          aria-label="Slide anterior"
        >
          ←
        </button>

        <div className={styles.stage} ref={stageRef}>
          <SlideStage slide={slide} index={current + 1} total={total} brand={carousel.brand} />
        </div>

        <button
          type="button"
          className={styles.arrow}
          onClick={() => go(1)}
          disabled={current === total - 1 || exporting}
          aria-label="Próximo slide"
        >
          →
        </button>
      </div>

      <div className={styles.meta}>
        <span>
          {current + 1}/{total} · {ROLE_LABEL[slide.role]} · superfície {slide.surface}
        </span>
        <span>← → navega</span>
      </div>

      {slide.datum ? (
        <p className={styles.sourceLine}>
          Fonte do dado: {slide.datum.source.publisher ? `${slide.datum.source.publisher}, ` : ''}
          <a href={slide.datum.source.url} target="_blank" rel="noreferrer noopener">
            {slide.datum.source.title}
          </a>
          {slide.datum.source.date ? ` (${slide.datum.source.date})` : ''}
        </p>
      ) : null}

      <div className={styles.exportRow}>
        <button
          type="button"
          className={styles.exportButton}
          onClick={downloadCurrentSlide}
          disabled={exporting}
        >
          {exportState.kind === 'single' ? 'Gerando PNG…' : 'Baixar este slide (PNG)'}
        </button>
        <button
          type="button"
          className={styles.exportButton}
          onClick={downloadWholeCarousel}
          disabled={exporting}
        >
          {exportState.kind === 'progress'
            ? `Gerando ${exportState.done}/${exportState.total}…`
            : exportState.kind === 'zipping'
              ? 'Compactando…'
              : 'Baixar carrossel (.zip)'}
        </button>
      </div>
      {exportState.kind === 'error' ? (
        <p className={styles.exportError}>Falha ao exportar: {exportState.message}</p>
      ) : null}

      <div className={styles.filmstrip} ref={filmstripRef}>
        {carousel.slides.map((item, index) => (
          <button
            key={`${item.role}-${index}`}
            type="button"
            className={`${styles.thumbButton} ${index === current ? styles.thumbActive : ''}`}
            onClick={() => !exporting && setCurrent(index)}
            disabled={exporting}
            aria-label={`Ir para o slide ${index + 1}: ${item.headline}`}
            aria-current={index === current}
          >
            <SlideStage slide={item} index={index + 1} total={total} brand={carousel.brand} />
          </button>
        ))}
      </div>
    </section>
  );
}
