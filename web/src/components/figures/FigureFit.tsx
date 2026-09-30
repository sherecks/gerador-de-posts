'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';

/**
 * Grows a figure to fill the room its slide leaves for it.
 *
 * Every figure is drawn in `--u` units (figures.module.css), so a single
 * number, `--fig-scale`, grows its text, marks and gaps together. The room
 * left depends on the headline, the body and the figure's own item count,
 * none of which CSS can see at once, so this measures it instead: binary
 * search for the largest scale at which everything the figure draws still
 * sits inside this frame, including absolutely placed labels.
 *
 * The scale is capped so a sparse figure doesn't outshout the headline, and
 * it may go below 1 only as a last resort against overflowing the footer.
 * It lands on the live node, so export (html-to-image clones that node) gets
 * the same picture the viewer shows.
 */

const MIN_SCALE = 0.8;
const MAX_SCALE = 1.5;
const STEPS = 7;
/** Sub-pixel rounding slack, in CSS px. */
const TOLERANCE = 1;

function drawnInside(frame: HTMLElement): boolean {
  const box = frame.getBoundingClientRect();
  if (box.width < 1 || box.height < 1) return true;
  for (const el of frame.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    if (
      r.top < box.top - TOLERANCE ||
      r.bottom > box.bottom + TOLERANCE ||
      r.left < box.left - TOLERANCE ||
      r.right > box.right + TOLERANCE
    ) {
      return false;
    }
  }
  return true;
}

function fit(frame: HTMLElement): void {
  const fitsAt = (scale: number) => {
    frame.style.setProperty('--fig-scale', scale.toFixed(3));
    return drawnInside(frame);
  };

  // Search above 1 when it fits at 1, below 1 when it doesn't.
  let lo: number;
  let hi: number;
  if (fitsAt(1)) {
    if (fitsAt(MAX_SCALE)) return;
    lo = 1;
    hi = MAX_SCALE;
  } else {
    if (!fitsAt(MIN_SCALE)) return;
    lo = MIN_SCALE;
    hi = 1;
  }
  for (let step = 0; step < STEPS; step += 1) {
    const mid = (lo + hi) / 2;
    if (fitsAt(mid)) lo = mid;
    else hi = mid;
  }
  fitsAt(lo);
}

export function FigureFit({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const frame = ref.current;
    if (!frame) return;

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => fit(frame));
    };

    fit(frame);
    // The frame's size doesn't depend on the scale (it takes whatever the
    // slide leaves), so observing it can't loop: it only fires on real resizes.
    const observer = new ResizeObserver(schedule);
    observer.observe(frame);
    // Webfonts change text metrics after first paint.
    document.fonts?.ready.then(schedule).catch(() => {});

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [children]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
