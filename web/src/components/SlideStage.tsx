import type { CSSProperties, ReactNode } from 'react';
import type { Brand, Slide, Surface, WaveVariant } from '@/lib/carousel';
import { inferLayout } from '@/lib/layout';
import { Figure } from './figures';
import { FigureFit } from './figures/FigureFit';
import { TextFit } from './TextFit';
import styles from './SlideStage.module.css';

const SURFACE_CLASS: Record<Surface, string | undefined> = {
  shell: styles.shell,
  carbon: styles.carbon,
  lime: styles.lime,
  imagem: styles.imagem,
};

/** Second class alongside SURFACE_CLASS (docs/decisions/004) — undefined for karagua so the Karaguá rules above win by being the only match. */
const BRAND_CLASS: Record<Brand, string | undefined> = {
  karagua: undefined,
  adx: styles.brandAdx,
};

const EYEBROW_CLASS: Record<Surface, string | undefined> = {
  shell: styles.shellEyebrow,
  carbon: styles.carbonEyebrow,
  lime: styles.limeEyebrow,
  imagem: styles.imagemEyebrow,
};

/** Solid paint behind a surface, for the wave band and the logo mark backdrop — per brand, same values as the SURFACE_CLASS rules in CSS. */
const SURFACE_PAINT: Record<Brand, Record<Surface, string>> = {
  karagua: {
    shell: 'var(--k-color-surface-shell)',
    carbon: 'var(--k-color-surface-carbon)',
    lime: 'var(--k-color-green-karagua)',
    imagem: 'var(--k-color-surface-carbon)',
  },
  adx: {
    shell: '#ffffff',
    carbon: '#0a0a0a',
    lime: '#0057e7',
    imagem: '#0a0a0a',
  },
};

/**
 * Hand-authored wave silhouettes (RENDER-RULES organic-divider concession):
 * a fixed catalog, never freehand, so the brand stays consistent across
 * generations while the divider still reads as alive, matching the leaf
 * silhouettes already in the Karaguá mark.
 */
const WAVE_PATH: Record<WaveVariant, string> = {
  suave: 'M0,90 C 260,30 540,150 1080,70 L1080,220 L0,220 Z',
  diagonal: 'M0,150 C 360,50 720,130 1080,20 L1080,220 L0,220 Z',
  dupla: 'M0,70 C 180,130 360,10 540,80 C 720,150 900,30 1080,100 L1080,220 L0,220 Z',
};

const DEFAULT_SCRIM = { top: 0.45, bottom: 0.55 } as const;

function cx(...parts: ReadonlyArray<string | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

type ScrimStyle = CSSProperties & { '--scrim-top': string; '--scrim-bottom': string };

export function assetUrl(repoRelativePath: string): string {
  return `/api/asset?path=${encodeURIComponent(repoRelativePath)}`;
}

/**
 * Splits `text` on every occurrence of the given phrases and marks the
 * matches, so the headline can render a color box behind a chosen word
 * without the generator ever writing markup itself.
 */
function splitHighlight(text: string, phrases: readonly string[] | undefined) {
  if (!phrases || phrases.length === 0) return [{ text, marked: false }];

  const pattern = phrases
    .filter((phrase) => phrase.length > 0)
    .map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  if (!pattern) return [{ text, marked: false }];

  const parts = text.split(new RegExp(`(${pattern})`, 'g'));
  return parts
    .filter((part) => part.length > 0)
    .map((part) => ({ text: part, marked: phrases.includes(part) }));
}

function Headline({
  headline,
  highlight,
  className,
}: {
  headline: string;
  highlight: readonly string[] | undefined;
  className: string;
}) {
  const segments = splitHighlight(headline, highlight);
  const boxed = segments.some((segment) => segment.marked);
  return (
    <h2 className={cx(className, boxed ? styles.hasHighlight : undefined)}>
      {segments.map((segment, index) =>
        segment.marked ? (
          <mark key={index} className={styles.highlightBox}>
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </h2>
  );
}

/**
 * `onPhoto`: the footer sits over a photo, so it becomes a solid bar across
 * the slide's bottom edge. Small text straight on a photo is legible only on
 * the calm patches of that particular photo; on a bar it's legible on all of them.
 */
function Footer({
  slide,
  index,
  total,
  onPhoto = false,
}: {
  slide: Slide;
  index: number;
  total: number;
  onPhoto?: boolean;
}) {
  return (
    <div className={cx(styles.footer, onPhoto ? styles.footerOnPhoto : undefined)}>
      <span className={styles.cliffhanger}>{slide.cliffhanger ?? ''}</span>
      <span className={styles.swipe}>{index < total ? 'arraste →' : `${index}/${total}`}</span>
    </div>
  );
}

function Datum({ slide }: { slide: Slide }) {
  if (!slide.datum) return null;
  return (
    <div className={styles.datum}>
      <span className={styles.datumValue}>{slide.datum.value}</span>
      <span className={styles.datumLabel}>{slide.datum.label}</span>
      <span className={styles.datumSource}>
        {slide.datum.source.publisher ?? slide.datum.source.title}
      </span>
    </div>
  );
}

function Photo({ slide, scrimmed = true }: { slide: Slide; scrimmed?: boolean }) {
  if (!slide.image) return null;
  const scrim = slide.image.overlay ?? DEFAULT_SCRIM;
  const scrimStyle: ScrimStyle = {
    '--scrim-top': String(scrim.top),
    '--scrim-bottom': String(scrim.bottom),
  };
  return (
    <>
      {/* Local file served by /api/asset; next/image would add a loader we do not want offline. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.photo} src={assetUrl(slide.image.path)} alt={slide.image.alt} />
      {scrimmed ? <div className={styles.scrim} style={scrimStyle} aria-hidden="true" /> : null}
    </>
  );
}

function headlineClass(slide: Slide, onPhoto: boolean): string {
  return cx(
    styles.headline,
    slide.silhouette ? styles[slide.silhouette] : styles.quadrado,
    onPhoto ? styles.onPhoto : undefined,
  );
}

type LayoutProps = { slide: Slide; index: number; total: number; brand: Brand };

function slideClass(slide: Slide, brand: Brand, ...extra: ReadonlyArray<string | undefined>): string {
  return cx(styles.slide, BRAND_CLASS[brand], SURFACE_CLASS[slide.surface], ...extra);
}

/** capa-onda — photo up top, color band below with an organic wave edge. */
function CapaOnda({ slide, index, total, brand }: LayoutProps) {
  const band = SURFACE_PAINT[brand][slide.surface];
  const wave = WAVE_PATH[slide.wave ?? 'suave'];

  return (
    <div className={slideClass(slide, brand)}>
      {slide.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.waveTopPhoto} src={assetUrl(slide.image.path)} alt={slide.image.alt} />
      ) : null}

      <div className={styles.waveBand}>
        <svg
          className={styles.waveSvg}
          viewBox="0 0 1080 220"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={wave} fill={band} />
        </svg>
        <div className={styles.waveContent}>
          {slide.eyebrow ? (
            <p className={cx(styles.eyebrow, EYEBROW_CLASS[slide.surface])}>{slide.eyebrow}</p>
          ) : null}
          <Headline
            headline={slide.headline}
            highlight={slide.highlight}
            className={headlineClass(slide, false)}
          />
          {slide.body ? <p className={styles.body}>{slide.body}</p> : null}
          <div className={styles.spacer} />
          <Footer slide={slide} index={index} total={total} />
        </div>
      </div>
    </div>
  );
}

/**
 * faixa — the default text-forward slide. Three variants by its photo:
 * none (the surface alone), surface "imagem" (the photo behind everything,
 * small text on solid strips), or a photo on any other surface (the photo
 * fills the bottom under a wave, the text keeps the surface above it).
 */
function Faixa(props: LayoutProps) {
  const { slide } = props;
  if (slide.image && slide.surface !== 'imagem') return <FaixaFotoBaixo {...props} />;
  return <FaixaCheia {...props} />;
}

function FaixaCheia({ slide, index, total, brand }: LayoutProps) {
  const onPhoto = slide.surface === 'imagem' && slide.image !== undefined;

  return (
    <div className={slideClass(slide, brand)}>
      <Photo slide={slide} />
      {/* A text-only slide with room to spare grows its type instead of leaving the bottom half empty. */}
      <TextFit className={styles.content}>
        {slide.eyebrow ? (
          <p className={cx(styles.eyebrow, EYEBROW_CLASS[slide.surface])}>
            <PhotoStrip on={onPhoto}>{slide.eyebrow}</PhotoStrip>
          </p>
        ) : null}
        <Headline
          headline={slide.headline}
          highlight={slide.highlight}
          className={headlineClass(slide, onPhoto)}
        />
        {slide.body ? (
          <p className={cx(styles.body, onPhoto ? styles.bodyOnPhoto : undefined)}>
            <PhotoStrip on={onPhoto}>{slide.body}</PhotoStrip>
          </p>
        ) : null}
        <div className={styles.spacer} data-spacer="" />
        <Datum slide={slide} />
        <Footer slide={slide} index={index} total={total} onPhoto={onPhoto} />
      </TextFit>
    </div>
  );
}

/**
 * Small text over a photo sits on a solid strip, line by line (the strip
 * clones onto every wrapped line), the way the brand's own posts set a caption
 * on an image. The headline is big enough to hold on the scrim alone.
 */
function PhotoStrip({ on, children }: { on: boolean; children: ReactNode }) {
  return on ? <span className={styles.photoStrip}>{children}</span> : <>{children}</>;
}

/**
 * faixa with a photo at the bottom: the post's text on its surface, the
 * mangrove below a wave. The photo takes every bit of height the text leaves,
 * so a short slide gets more mangrove instead of an empty gap.
 */
function FaixaFotoBaixo({ slide, index, total, brand }: LayoutProps) {
  const band = SURFACE_PAINT[brand][slide.surface];
  const wave = WAVE_PATH[slide.wave ?? 'suave'];

  return (
    <div className={slideClass(slide, brand)}>
      <div className={styles.fotoBaixoStack}>
        <div className={styles.fotoBaixoText}>
          {slide.eyebrow ? (
            <p className={cx(styles.eyebrow, EYEBROW_CLASS[slide.surface])}>{slide.eyebrow}</p>
          ) : null}
          <Headline headline={slide.headline} highlight={slide.highlight} className={headlineClass(slide, false)} />
          {slide.body ? <p className={styles.body}>{slide.body}</p> : null}
          <Datum slide={slide} />
        </div>
        {slide.image ? (
          <div className={styles.bottomPhoto}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.bottomPhotoImg} src={assetUrl(slide.image.path)} alt={slide.image.alt} />
            <svg className={styles.bottomPhotoWave} viewBox="0 0 1080 220" preserveAspectRatio="none" aria-hidden="true">
              <path d={wave} fill={band} />
            </svg>
            <div className={styles.bottomPhotoFooter}>
              <Footer slide={slide} index={index} total={total} onPhoto />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** numero — the datum is the hero, headline/body only frame it. */
function Numero({ slide, index, total, brand }: LayoutProps) {
  return (
    <div className={slideClass(slide, brand)}>
      <div className={styles.content}>
        {slide.eyebrow ? (
          <p className={cx(styles.eyebrow, EYEBROW_CLASS[slide.surface])}>{slide.eyebrow}</p>
        ) : null}
        <div className={styles.spacer} />
        {slide.datum ? (
          <div className={styles.numeroHero}>
            <span className={styles.numeroValue}>{slide.datum.value}</span>
            <span className={styles.numeroLabel}>{slide.datum.label}</span>
          </div>
        ) : (
          <Headline
            headline={slide.headline}
            highlight={slide.highlight}
            className={headlineClass(slide, false)}
          />
        )}
        {slide.body ? <p className={styles.body}>{slide.body}</p> : null}
        <div className={styles.spacer} />
        {slide.datum ? (
          <span className={styles.datumSource}>
            {slide.datum.source.publisher ?? slide.datum.source.title}
          </span>
        ) : null}
        <Footer slide={slide} index={index} total={total} />
      </div>
    </div>
  );
}

/** figura — a diagram from the fixed catalog fills the slide's middle. */
function FiguraLayout({ slide, index, total, brand }: LayoutProps) {
  return (
    <div className={slideClass(slide, brand)}>
      <div className={styles.content}>
        {slide.eyebrow ? (
          <p className={cx(styles.eyebrow, EYEBROW_CLASS[slide.surface])}>{slide.eyebrow}</p>
        ) : null}
        <Headline
          headline={slide.headline}
          highlight={slide.highlight}
          className={cx(styles.headline, styles.figuraHeadline)}
        />
        {/* The frame takes all the height the slide leaves (no spacer here) and FigureFit grows the figure into it. */}
        <FigureFit className={styles.figuraFrame}>
          {slide.figure ? <Figure figure={slide.figure} surface={slide.surface} brand={brand} /> : null}
        </FigureFit>
        {slide.body ? <p className={styles.body}>{slide.body}</p> : null}
        <Footer slide={slide} index={index} total={total} />
      </div>
    </div>
  );
}

/** Karaguá: shell reads best with the lime mark; carbon/lime/imagem need the white one. ADX has no image mark (see BrandMark). */
const LOGO_MARK: Record<Surface, string> = {
  shell: '/logos/logo-sm-1.svg',
  carbon: '/logos/logo-sm-2.svg',
  lime: '/logos/logo-sm-2.svg',
  imagem: '/logos/logo-sm-2.svg',
};

/**
 * The mark on a fechamento slide. Karaguá has a leaf glyph; ADX's own posts
 * (post1-4.png) never use an icon mark, only the wordmark "ADX" in Bebas
 * Neue with a short accent rule under it — so that's what this draws
 * instead of reaching for an image asset that doesn't exist.
 */
function BrandMark({ brand, surface }: { brand: Brand; surface: Surface }) {
  if (brand === 'adx') {
    return (
      <span className={styles.adxWordmark} aria-hidden="true">
        ADX
        <span className={styles.adxWordmarkRule} />
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={styles.fechamentoLogo} src={LOGO_MARK[surface]} alt="" aria-hidden="true" />;
}

/**
 * fechamento — the mark, a clear CTA, nothing else competing for attention.
 * With a photo it closes the way capa-onda opens: the mangrove up top, the
 * wave, and the mark and CTA on the solid band, so the last slide shows what
 * the post was about and the CTA still sits on color, never on the photo.
 */
function Fechamento(props: LayoutProps) {
  return props.slide.image ? <FechamentoFoto {...props} /> : <FechamentoCor {...props} />;
}

function FechamentoFoto({ slide, index, total, brand }: LayoutProps) {
  const band = SURFACE_PAINT[brand][slide.surface];
  const wave = WAVE_PATH[slide.wave ?? 'suave'];

  return (
    <div className={slideClass(slide, brand)}>
      {slide.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={cx(styles.waveTopPhoto, styles.fechamentoFotoPhoto)}
          src={assetUrl(slide.image.path)}
          alt={slide.image.alt}
        />
      ) : null}

      <div className={cx(styles.waveBand, styles.fechamentoFotoBand)}>
        <svg className={styles.waveSvg} viewBox="0 0 1080 220" preserveAspectRatio="none" aria-hidden="true">
          <path d={wave} fill={band} />
        </svg>
        <div className={cx(styles.waveContent, styles.fechamentoFotoContent)}>
          <BrandMark brand={brand} surface={slide.surface} />
          <Headline
            headline={slide.headline}
            highlight={slide.highlight}
            className={cx(headlineClass(slide, false), styles.fechamentoHeadline)}
          />
          {slide.body ? <p className={styles.body}>{slide.body}</p> : null}
          <div className={styles.spacer} />
          <Footer slide={slide} index={index} total={total} />
        </div>
      </div>
    </div>
  );
}

function FechamentoCor({ slide, index, total, brand }: LayoutProps) {
  return (
    <div className={slideClass(slide, brand, styles.fechamentoSlide)}>
      <div className={cx(styles.content, styles.fechamentoContent)}>
        {slide.eyebrow ? (
          <p className={cx(styles.eyebrow, EYEBROW_CLASS[slide.surface])}>{slide.eyebrow}</p>
        ) : null}
        <BrandMark brand={brand} surface={slide.surface} />
        <Headline
          headline={slide.headline}
          highlight={slide.highlight}
          className={cx(headlineClass(slide, false), styles.fechamentoHeadline)}
        />
        {slide.body ? <p className={styles.body}>{slide.body}</p> : null}
        <div className={styles.spacer} />
        <Footer slide={slide} index={index} total={total} />
      </div>
    </div>
  );
}

const LAYOUT_COMPONENT: Record<ReturnType<typeof inferLayout>, (props: LayoutProps) => ReactNode> = {
  'capa-onda': CapaOnda,
  faixa: Faixa,
  numero: Numero,
  figura: FiguraLayout,
  fechamento: Fechamento,
};

type Props = {
  slide: Slide;
  /** Position in the deck, 1-based, for the swipe cue. */
  index: number;
  total: number;
  /** Which design tokens/voice this slide renders in (docs/decisions/004). Defaults to karagua for callers written before brand existed. */
  brand?: Brand;
};

/**
 * capa-onda's entire premise is a photo up top with a color band below. A
 * slide declared capa-onda without an `image` (by hand, or by a generator
 * that has no photo library yet) has nothing to curve the wave against: it
 * would just reserve a band of dead space. Fall back to faixa, which uses
 * the whole slide instead of leaving a hole.
 */
function resolveLayout(slide: Slide): ReturnType<typeof inferLayout> {
  const layout = inferLayout(slide);
  if (layout === 'capa-onda' && !slide.image) return 'faixa';
  return layout;
}

export function SlideStage({ slide, index, total, brand = 'karagua' }: Props) {
  const Layout = LAYOUT_COMPONENT[resolveLayout(slide)];
  return <Layout slide={slide} index={index} total={total} brand={brand} />;
}
