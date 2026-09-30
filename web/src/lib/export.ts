import { toBlob } from 'html-to-image';
import JSZip from 'jszip';
import type { Carousel } from './carousel';

/** Every export targets the feed's real size, regardless of how small the on-screen preview is. */
export const EXPORT_WIDTH = 1080;
export const EXPORT_HEIGHT = 1350;

/**
 * Rasterizes the already-rendered slide node at feed resolution. `node` is
 * the live on-screen `.slide` root (or its bordered wrapper): every slide is
 * built in `cqw` units relative to its own width (SlideStage.module.css), so
 * scaling the *pixel density* up to 1080-wide via `pixelRatio` reproduces
 * the design at full size without a second, hidden, full-width render — the
 * proportions are already identical, only the raster resolution differs.
 */
export async function captureSlide(node: HTMLElement): Promise<Blob> {
  const rect = node.getBoundingClientRect();
  if (rect.width <= 0) throw new Error('slide sem largura visível para capturar');

  const pixelRatio = EXPORT_WIDTH / rect.width;
  const restore = inlineSvgStyles(node);
  try {
    const blob = await toBlob(node, {
      pixelRatio,
      // The on-screen wrapper carries a 1px preview border (CarouselViewer.module.css)
      // that has no place in the exported file.
      style: { border: 'none', margin: '0' },
    });
    if (!blob) throw new Error('falha ao rasterizar o slide (canvas vazio)');
    return blob;
  } finally {
    restore();
  }
}

/** The SVG paint and text properties the figures set from CSS classes. */
const SVG_STYLE_PROPS = [
  'fill',
  'fill-opacity',
  'stroke',
  'stroke-width',
  'stroke-opacity',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-miterlimit',
  'opacity',
  'color',
  'font-family',
  'font-size',
  'font-weight',
  'letter-spacing',
  'text-anchor',
  'dominant-baseline',
  'vector-effect',
] as const;

/**
 * html-to-image clones an <svg> in one piece and copies computed styles onto
 * the <svg> root only. Its circles, paths and text keep their CSS-module class
 * names, but the stylesheet never reaches the rasterizer, so they fall back to
 * SVG defaults: a filled black disc where the anel's ring should be. Writing
 * the computed values inline on the live nodes makes the clone carry them.
 * The page looks the same meanwhile, since inline = computed, and the returned
 * function puts the original `style` attributes back.
 */
function inlineSvgStyles(node: HTMLElement): () => void {
  const saved: Array<[SVGElement, string | null]> = [];
  node.querySelectorAll('svg *').forEach((element) => {
    if (!(element instanceof SVGElement)) return;
    const computed = window.getComputedStyle(element);
    saved.push([element, element.getAttribute('style')]);
    for (const prop of SVG_STYLE_PROPS) {
      element.style.setProperty(prop, computed.getPropertyValue(prop));
    }
  });
  return () => {
    for (const [element, style] of saved) {
      if (style === null) element.removeAttribute('style');
      else element.setAttribute('style', style);
    }
  };
}

/** Resolves once every <img> inside `node` has finished loading (or already had), so a just-mounted photo slide isn't captured blank. */
export function waitForImages(node: HTMLElement): Promise<void> {
  const images = Array.from(node.querySelectorAll('img'));
  return Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.addEventListener('load', () => resolve(), { once: true });
        img.addEventListener('error', () => resolve(), { once: true });
      });
    }),
  ).then(() => undefined);
}

/** Two rAF ticks: one for React to commit + paint, one for the browser to settle layout/fonts on the new frame. */
export function waitFrames(count = 2): Promise<void> {
  return new Promise((resolve) => {
    function tick(remaining: number) {
      if (remaining <= 0) {
        resolve();
        return;
      }
      requestAnimationFrame(() => tick(remaining - 1));
    }
    tick(count);
  });
}

function slugSlideName(index: number, role: string): string {
  return `${String(index + 1).padStart(2, '0')}-${role}.png`;
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Give the browser a moment to pick up the click before the URL disappears.
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Bundles every already-captured slide PNG plus the caption into one ZIP and triggers the download. */
export async function downloadCarouselZip(
  carousel: Carousel,
  slideBlobs: ReadonlyArray<{ role: string; blob: Blob }>,
): Promise<void> {
  const zip = new JSZip();
  slideBlobs.forEach(({ role, blob }, index) => {
    zip.file(slugSlideName(index, role), blob);
  });

  const captionText = `${carousel.caption.text}\n\n${carousel.caption.hashtags.join(' ')}\n`;
  zip.file('legenda.txt', captionText);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipBlob, `${carousel.id}.zip`);
}
