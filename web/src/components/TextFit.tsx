'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';

/**
 * Grows a text-only slide's headline and body into the room the slide has.
 *
 * A two-line headline and a three-line body at base size fill the top third
 * of a 4:5 slide and leave the rest empty. The headline and body sizes are
 * `base × --text-scale` (SlideStage.module.css); this finds the largest scale
 * at which nothing overflows and the spacer above the footer still keeps some
 * air, the same measure-and-search FigureFit does for figures.
 *
 * Capped at 1.4: past that the headline stops reading as a headline and
 * starts reading as a poster. It lands on the live node, so the exported PNG
 * matches the viewer.
 */

const MAX_SCALE = 1.4;
const STEPS = 7;
/** Air the spacer must keep above the footer, as a fraction of the slide width. */
const RESERVE = 0.08;

function fits(root: HTMLElement, scale: number): boolean {
  root.style.setProperty('--text-scale', scale.toFixed(3));
  const spacer = root.querySelector<HTMLElement>('[data-spacer]');
  const room = spacer ? spacer.getBoundingClientRect().height : Infinity;
  return root.scrollHeight <= root.clientHeight + 1 && room >= root.clientWidth * RESERVE;
}

function fit(root: HTMLElement): void {
  if (!fits(root, 1)) {
    fits(root, 1);
    return;
  }
  if (fits(root, MAX_SCALE)) return;
  let lo = 1;
  let hi = MAX_SCALE;
  for (let step = 0; step < STEPS; step += 1) {
    const mid = (lo + hi) / 2;
    if (fits(root, mid)) lo = mid;
    else hi = mid;
  }
  fits(root, lo);
}

export function TextFit({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => fit(root));
    };

    fit(root);
    // The box's size comes from the slide, not from the scale, so this can't loop.
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
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
