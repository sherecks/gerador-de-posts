import type { Layout, Slide } from './carousel';

/**
 * Resolves the visual layout of a slide. A generation may declare `layout`
 * explicitly; one written before the field existed (the two seed JSONs, any
 * future factory output that skips it) falls back to a rule derived from
 * role/content, so nothing in `data/carousels/` breaks when this field
 * shipped after the contract.
 */
export function inferLayout(slide: Slide): Layout {
  if (slide.layout) return slide.layout;
  if (slide.figure) return 'figura';
  if (slide.role === 'cta') return 'fechamento';
  if (slide.role === 'capa' && slide.image) return 'capa-onda';
  if (slide.datum && !slide.body) return 'numero';
  return 'faixa';
}
