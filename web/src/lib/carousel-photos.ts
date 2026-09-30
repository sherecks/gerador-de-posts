import type { z } from 'zod';
import type { Brand, carouselDraftSchema } from './carousel';
import { findPhoto, photoFitsText, pickPhoto } from './photos';

/**
 * Photo rules applied to every generation before it is saved
 * (app/api/gerar/route.ts). Kept out of the route so they can be run on a
 * saved carousel too.
 */

type CarouselDraft = z.infer<typeof carouselDraftSchema>;

/**
 * The model is told to copy `path`/`alt` from PHOTO_LIBRARY verbatim, but
 * "told to" is not "guaranteed to": a hallucinated or slightly-altered path
 * would 404 silently in the viewer. Any slide whose image isn't an exact,
 * known library entry loses the image rather than shipping a broken one
 * (SlideStage's capa-onda-without-image fallback then renders it as faixa).
 */
export function sanitizeImages(data: CarouselDraft): CarouselDraft {
  return {
    ...data,
    slides: data.slides.map((slide) => {
      if (!slide.image) return slide;
      const known = findPhoto(slide.image.path);
      // A pollution shot on a slide that isn't about pollution is dropped too; ensurePhotos refills it.
      const text = [slide.eyebrow, slide.headline, slide.body].filter(Boolean).join(' ');
      if (!known || !photoFitsText(known, text)) {
        const { image: _drop, ...rest } = slide;
        return rest;
      }
      return { ...slide, image: { ...slide.image, path: known.path, alt: known.alt } };
    }),
  };
}

/** Past this a carousel stops being about its text and becomes a photo album. */
const MAX_PHOTOS = 6;

/**
 * Karaguá's photos are all of the mangrove, so any of them can open or close
 * any post, yet left to itself the model used one on the cover at most and
 * never on the CTA, and its text-only slides left half the slide empty. Here,
 * when the model didn't choose one:
 *   - the cover and the closing slide always get a photo;
 *   - a text-only slide in the middle (no figure, no number) gets one at its
 *     bottom (faixa + image on a plain surface draws it under a wave),
 * up to MAX_PHOTOS in the post. Each is picked by the words on its slide
 * (lixo → the pollution shots, muda → planting), never one already used.
 * A cover drawn as a number or a figure keeps that; ADX never uses photos.
 */
export function ensurePhotos(data: CarouselDraft, brand: Brand): CarouselDraft {
  if (brand !== 'karagua') return data;
  const used = new Set(data.slides.flatMap((slide) => (slide.image ? [slide.image.path] : [])));
  const last = data.slides.length - 1;
  const textLayout = (layout: string | undefined) => layout === undefined || layout === 'faixa';

  // Cover and closing first, so they get the best-fitting photos; then the middle, in order.
  const order = [0, last, ...data.slides.map((_, index) => index).filter((index) => index !== 0 && index !== last)];
  const slides = [...data.slides];

  for (const index of order) {
    const slide = slides[index];
    if (!slide || slide.image || used.size >= MAX_PHOTOS) continue;
    const isCover = index === 0 && (textLayout(slide.layout) || slide.layout === 'capa-onda');
    const isClosing = index === last && (slide.role === 'cta' || slide.layout === 'fechamento');
    const isTextSlide = !isCover && !isClosing && textLayout(slide.layout) && !slide.figure && !slide.datum;
    if (!isCover && !isClosing && !isTextSlide) continue;

    const text = [slide.eyebrow, slide.headline, slide.body, isClosing ? data.title : undefined].filter(Boolean).join(' ');
    const photo = pickPhoto(text, used, data.title);
    if (!photo) continue;
    used.add(photo.path);
    slides[index] = {
      ...slide,
      image: { path: photo.path, alt: photo.alt },
      ...(isCover ? { layout: 'capa-onda' as const } : isClosing ? { layout: 'fechamento' as const } : { layout: 'faixa' as const }),
      // A photo at the bottom needs a plain surface above it: "imagem" would put the photo behind the text instead.
      ...(isTextSlide && slide.surface === 'imagem' ? { surface: 'carbon' as const } : {}),
    };
  }
  return { ...data, slides };
}
