/**
 * Karaguá Design System — Spacing, Radius & Shadow Tokens
 * Typed constants mirroring CSS custom properties from tokens.css.
 */

// ── Spacing ───────────────────────────────────────────

export type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;

export const spaces = {
  0:  'var(--k-space-0)',
  1:  'var(--k-space-1)',
  2:  'var(--k-space-2)',
  3:  'var(--k-space-3)',
  4:  'var(--k-space-4)',
  5:  'var(--k-space-5)',
  6:  'var(--k-space-6)',
  8:  'var(--k-space-8)',
  10: 'var(--k-space-10)',
  12: 'var(--k-space-12)',
  16: 'var(--k-space-16)',
  20: 'var(--k-space-20)',
  24: 'var(--k-space-24)',
  32: 'var(--k-space-32)',
} as const satisfies Record<Space, string>;

// ── Border Radius ─────────────────────────────────────

export type Radius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'pill' | 'full';

export const radii = {
  none: 'var(--k-radius-none)',
  sm:   'var(--k-radius-sm)',
  md:   'var(--k-radius-md)',
  lg:   'var(--k-radius-lg)',
  xl:   'var(--k-radius-xl)',
  pill: 'var(--k-radius-pill)',
  full: 'var(--k-radius-full)',
} as const satisfies Record<Radius, string>;

// ── Shadows ───────────────────────────────────────────

export type Shadow = 'sm' | 'md' | 'lg' | 'xl';

export const shadows = {
  sm: 'var(--k-shadow-sm)',
  md: 'var(--k-shadow-md)',
  lg: 'var(--k-shadow-lg)',
  xl: 'var(--k-shadow-xl)',
} as const satisfies Record<Shadow, string>;
