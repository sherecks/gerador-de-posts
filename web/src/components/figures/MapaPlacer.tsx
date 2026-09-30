'use client';

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react';

/**
 * Places the map's labels without collisions, by measuring.
 *
 * Every label is rendered with `data-opcoes`, the sides it may grow toward
 * from its anchor, preferred first. In priority order (named points before
 * context names), each takes the first side where its text stays inside the
 * map and touches nothing already placed: dots, the scale bar, the credit and
 * earlier labels. A point that fits nowhere keeps its preferred side (hiding
 * a place the slide names would be worse than a tight fit); a context name
 * ("Baía da Babitonga") first tries its fallback spots on the water
 * (`data-ancoras`) and is hidden only if none fits, since it only orients.
 *
 * Measured, not estimated, because the label's real width depends on the font,
 * the slide size and the map's size, and it runs on the live node, so the
 * exported PNG gets the same placement.
 */

/** Breathing room between two labels, as a fraction of the map width. */
const PAD = 0.008;

function overlaps(a: DOMRect, b: DOMRect, pad: number): boolean {
  return a.left < b.right + pad && b.left < a.right + pad && a.top < b.bottom + pad && b.top < a.bottom + pad;
}

function inside(inner: DOMRect, outer: DOMRect): boolean {
  return inner.left >= outer.left && inner.right <= outer.right && inner.top >= outer.top && inner.bottom <= outer.bottom;
}

function place(root: HTMLElement): void {
  const box = root.getBoundingClientRect();
  if (box.width < 1) return;
  const pad = box.width * PAD;

  const taken: DOMRect[] = [];
  root.querySelectorAll<HTMLElement>('[data-obstaculo]').forEach((el) => taken.push(el.getBoundingClientRect()));

  const labels = [...root.querySelectorAll<HTMLElement>('[data-opcoes]')].sort(
    (a, b) => Number(a.dataset.prioridade ?? 9) - Number(b.dataset.prioridade ?? 9),
  );

  for (const label of labels) {
    const options = (label.dataset.opcoes ?? '').split(',').filter(Boolean);
    const text = label.querySelector<HTMLElement>('[data-texto]') ?? label;
    label.style.visibility = '';

    // Water names may also move: "x,y;x,y" in percent of the map, the first being their own spot.
    const anchors = (label.dataset.ancoras ?? '')
      .split(';')
      .filter(Boolean)
      .map((pair) => pair.split(','));
    const spots = anchors.length > 0 ? anchors : [[label.style.left, label.style.top]];

    let fitted = false;
    for (const [x, y] of spots) {
      if (anchors.length > 0) {
        label.style.left = `${x}%`;
        label.style.top = `${y}%`;
      }
      for (const side of options) {
        label.dataset.lado = side;
        const rect = text.getBoundingClientRect();
        if (inside(rect, box) && !taken.some((other) => overlaps(rect, other, pad))) {
          fitted = true;
          break;
        }
      }
      if (fitted) break;
    }

    if (!fitted) {
      if (label.dataset.contexto !== undefined) {
        label.style.visibility = 'hidden';
        continue;
      }
      label.dataset.lado = options[0] ?? 'direita';
    }
    taken.push(text.getBoundingClientRect());
  }
}

export function MapaPlacer({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => place(root));
    };

    place(root);
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    document.fonts?.ready.then(schedule).catch(() => {});

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [children]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
