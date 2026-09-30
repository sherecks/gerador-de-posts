/**
 * Karaguá Design System — Color Tokens
 * Typed constants mirroring CSS custom properties from tokens.css.
 */

// ── Brand Colors ──────────────────────────────────────

export type BrandColor = 'mangue' | 'coral' | 'positive';

export const brandColors = {
  mangue:        'var(--k-color-mangue)',
  mangueDark:    'var(--k-color-mangue-dark)',
  mangueSubtle:  'var(--k-color-mangue-subtle)',
  coral:         'var(--k-color-coral)',
  coralSubtle:   'var(--k-color-coral-subtle)',
  positive:      'var(--k-color-positive)',
} as const satisfies Record<string, string>;

// ── Surface Colors ────────────────────────────────────

export type SurfaceColor =
  | 'white'
  | 'shell'
  | 'fog'
  | 'carbon'
  | 'carbonLight'
  | 'carbonDeep';

export const surfaceColors = {
  white:       'var(--k-color-surface-white)',
  shell:       'var(--k-color-surface-shell)',
  fog:         'var(--k-color-surface-fog)',
  carbon:      'var(--k-color-surface-carbon)',
  carbonLight: 'var(--k-color-surface-carbon-light)',
  carbonDeep:  'var(--k-color-surface-carbon-deep)',
} as const satisfies Record<SurfaceColor, string>;

// ── Text Colors ───────────────────────────────────────

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'onDark'
  | 'onDarkMuted'
  | 'onDarkFaint'
  | 'onDarkGhost';

export const textColors = {
  primary:      'var(--k-color-text-primary)',
  secondary:    'var(--k-color-text-secondary)',
  onDark:       'var(--k-color-text-on-dark)',
  onDarkMuted:  'var(--k-color-text-on-dark-muted)',
  onDarkFaint:  'var(--k-color-text-on-dark-faint)',
  onDarkGhost:  'var(--k-color-text-on-dark-ghost)',
} as const satisfies Record<TextColor, string>;

// ── Border Colors ─────────────────────────────────────

export type BorderColor = 'default' | 'subtle' | 'onDark';

export const borderColors = {
  default: 'var(--k-color-border-default)',
  subtle:  'var(--k-color-border-subtle)',
  onDark:  'var(--k-color-border-on-dark)',
} as const satisfies Record<BorderColor, string>;

// ── Unified export ────────────────────────────────────

export const colors = {
  brand:   brandColors,
  surface: surfaceColors,
  text:    textColors,
  border:  borderColors,
} as const;
