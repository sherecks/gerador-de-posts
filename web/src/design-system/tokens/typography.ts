/**
 * Karaguá Design System — Typography Tokens
 * Typed constants mirroring CSS custom properties from tokens.css.
 */

// ── Font Size ─────────────────────────────────────────

export type FontSize =
  | 'xs' | 'sm' | 'base' | 'md' | 'lg'
  | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
  | 'hero';

export const fontSizes = {
  xs:   'var(--k-font-size-xs)',
  sm:   'var(--k-font-size-sm)',
  base: 'var(--k-font-size-base)',
  md:   'var(--k-font-size-md)',
  lg:   'var(--k-font-size-lg)',
  xl:   'var(--k-font-size-xl)',
  '2xl': 'var(--k-font-size-2xl)',
  '3xl': 'var(--k-font-size-3xl)',
  '4xl': 'var(--k-font-size-4xl)',
  '5xl': 'var(--k-font-size-5xl)',
  '6xl': 'var(--k-font-size-6xl)',
  hero: 'var(--k-font-size-hero)',
} as const satisfies Record<FontSize, string>;

// ── Font Weight ───────────────────────────────────────

export type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export const fontWeights = {
  regular:  'var(--k-font-weight-regular)',
  medium:   'var(--k-font-weight-medium)',
  semibold: 'var(--k-font-weight-semibold)',
  bold:     'var(--k-font-weight-bold)',
} as const satisfies Record<FontWeight, string>;

// ── Line Height ───────────────────────────────────────

export type LineHeight = 'tight' | 'snug' | 'normal' | 'relaxed';

export const lineHeights = {
  tight:   'var(--k-line-height-tight)',
  snug:    'var(--k-line-height-snug)',
  normal:  'var(--k-line-height-normal)',
  relaxed: 'var(--k-line-height-relaxed)',
} as const satisfies Record<LineHeight, string>;

// ── Letter Spacing (Tracking) ─────────────────────────

export type Tracking = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';

export const trackings = {
  tighter: 'var(--k-tracking-tighter)',
  tight:   'var(--k-tracking-tight)',
  normal:  'var(--k-tracking-normal)',
  wide:    'var(--k-tracking-wide)',
  wider:   'var(--k-tracking-wider)',
  widest:  'var(--k-tracking-widest)',
} as const satisfies Record<Tracking, string>;
