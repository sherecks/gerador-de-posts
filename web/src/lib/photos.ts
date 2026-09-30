/**
 * Curated photo library for slides. Every entry was looked at and described
 * by hand (never auto-captioned): `alt` is what a person would tell another
 * person is in the photo, which is also what accessibility text is for.
 *
 * `path` is repo-root relative and served through `/api/asset` like every
 * other slide image (src/lib/store.ts `resolveAsset`), even though these
 * particular files happen to sit under `web/public/`: one addressing scheme
 * for every image, factory-rendered or hand-curated.
 *
 * The generator (`src/lib/prompt.ts`) offers this list to the model and
 * requires it to copy `path`/`alt` verbatim; `src/app/api/gerar/route.ts`
 * re-checks that against `PHOTO_PATHS` before saving, so a hallucinated
 * path can never reach a generation.
 */

export type PhotoTag =
  | 'paisagem'
  | 'raizes'
  | 'baia'
  | 'mutirao'
  | 'plantio'
  | 'fauna'
  | 'poluicao'
  | 'simbolica';

export type Photo = {
  path: string;
  alt: string;
  tags: PhotoTag[];
};

export const PHOTO_LIBRARY: readonly Photo[] = [
  {
    path: 'web/public/images/DSC_0378.jpg',
    alt: 'Muda de mangue em vaso branco, pronta para plantio, com saco de coleta vermelho ao fundo',
    tags: ['plantio'],
  },
  {
    path: 'web/public/images/DSC_0379.jpg',
    alt: 'Muda de mangue em vaso branco vista de outro ângulo, pronta para plantio',
    tags: ['plantio'],
  },
  {
    path: 'web/public/images/DSC_0381.jpg',
    alt: 'Propágulos de mangue recolhidos dentro de um saco de ráfia vermelho, prontos para o plantio',
    tags: ['plantio'],
  },
  {
    path: 'web/public/images/DSC_0382.jpg',
    alt: 'Propágulos de mangue dentro do saco de ráfia vermelho, outro ângulo',
    tags: ['plantio'],
  },
  {
    path: 'web/public/images/DSC_0619.jpg',
    alt: 'Pneumatóforos de manguezal com um pote plástico preso entre os galhos, evidência do lixo que chega pela maré',
    tags: ['paisagem', 'raizes', 'poluicao'],
  },
  {
    path: 'web/public/images/DSC_0621.jpg',
    alt: 'Voluntários do mutirão SOS Manguezal trocam um saco de lixo ao lado de caiaques, com o manguezal ao fundo',
    tags: ['mutirao', 'baia'],
  },
  {
    path: 'web/public/images/DSC_0622.jpg',
    alt: 'Voluntários do mutirão SOS Manguezal ao lado dos caiaques, outro ângulo da troca do saco de lixo',
    tags: ['mutirao', 'baia'],
  },
  {
    path: 'web/public/images/DSC_0623.jpg',
    alt: 'Voluntário carrega um pedaço de madeira retirado do manguezal durante o mutirão SOS Manguezal',
    tags: ['mutirao'],
  },
  {
    path: 'web/public/images/DSC_0625.jpg',
    alt: 'Dois voluntários retiram uma placa de metal enferrujada de dentro do manguezal durante o mutirão',
    tags: ['mutirao', 'poluicao'],
  },
  {
    path: 'web/public/images/DSC_0629.jpg',
    alt: 'Interior denso do manguezal, pneumatóforos em primeiro plano e uma muda brotando entre eles',
    tags: ['paisagem', 'raizes'],
  },
  {
    path: 'web/public/images/DSC_0632.jpg',
    alt: 'Voluntário agachado no lodo do manguezal, com vaso e saco de coleta na mão, durante ação de plantio',
    tags: ['mutirao', 'plantio'],
  },
  {
    path: 'web/public/images/DSC_0633.jpg',
    alt: 'Voluntário enche um saco de lixo preto em meio às raízes do manguezal',
    tags: ['mutirao', 'poluicao'],
  },
  {
    path: 'web/public/images/DSC_0643.jpg',
    alt: 'Caranguejo vermelho entre os pneumatóforos do manguezal, fotografado por entre os galhos',
    tags: ['fauna', 'paisagem'],
  },
  {
    path: 'web/public/images/DSC_0650.jpg',
    alt: 'Raízes de manguezal cobertas de ostras na base, com a baía ao fundo',
    tags: ['paisagem', 'raizes', 'baia'],
  },
  {
    path: 'web/public/images/DSC_0651.jpg',
    alt: 'Raízes de manguezal cobertas de ostras, outro ângulo, com a baía ao fundo',
    tags: ['paisagem', 'raizes', 'baia'],
  },
  {
    path: 'web/public/images/DSC_0653.jpg',
    alt: 'Folhagem de mangue em primeiro plano com a baía ao fundo, céu nublado',
    tags: ['paisagem', 'baia'],
  },
  {
    path: 'web/public/images/DSC_0655.jpg',
    alt: 'Voluntários carregam sacos de lixo por entre os galhos do manguezal durante o mutirão',
    tags: ['mutirao'],
  },
  {
    path: 'web/public/images/DSC_0656.jpg',
    alt: 'Voluntários carregam sacos de lixo pelo manguezal, outro ângulo do mutirão',
    tags: ['mutirao'],
  },
  {
    path: 'web/public/images/DSC_0660.jpg',
    alt: 'Muda de mangue solitária refletida na água parada da baía',
    tags: ['plantio', 'simbolica'],
  },
  {
    path: 'web/public/images/DSC_0662.jpg',
    alt: 'Raízes de manguezal em arco dramático sobre a água, com pessoas ao fundo na baía',
    tags: ['paisagem', 'raizes', 'baia', 'mutirao'],
  },
  {
    path: 'web/public/images/DSC_0664.jpg',
    alt: 'Raízes maduras de manguezal cobertas de ostras, emaranhadas sobre a lama',
    tags: ['paisagem', 'raizes'],
  },
  {
    path: 'web/public/images/DSC_0665.jpg',
    alt: 'Raízes maduras de manguezal cobertas de ostras, com água entre as raízes',
    tags: ['paisagem', 'raizes'],
  },
  {
    path: 'web/public/images/DSC_0671.jpg',
    alt: 'Restos de sacolas plásticas presos nos galhos do manguezal, pendurados sobre a água',
    tags: ['poluicao', 'raizes'],
  },
] as const;

export const PHOTO_PATHS: ReadonlySet<string> = new Set(PHOTO_LIBRARY.map((photo) => photo.path));

export function findPhoto(path: string): Photo | undefined {
  return PHOTO_LIBRARY.find((photo) => photo.path === path);
}

/**
 * Words in a slide that point at a tag. Scored, not required: a slide about
 * "crédito de carbono" matches nothing specific and gets a landscape, which
 * is still the mangrove the post is about. Word boundaries matter here:
 * "muda" is also the verb ("o que muda com a lei"), "ação" ends half the
 * nouns in a policy post, "ave" hides in "chave".
 */
const TAG_HINTS: Record<PhotoTag, RegExp> = {
  poluicao: /lixo|plástic|resíduo|poluiç|esgoto|descarte|contamina|sacola/i,
  plantio: /\bmudas\b|\bmuda de\b|\bplant|propágulo|restaur|recuper|reflorest|viveiro/i,
  mutirao: /mutirão|voluntári|comunidade|limpeza|mobiliz|\bação de\b/i,
  fauna: /caranguejo|peixe|\bpesca|marisc|ostra|biodivers|espécie|\baves?\b|berçário/i,
  baia: /\bbaía|babitonga|\bmaré|estuário|\bcosta\b|litoral/i,
  raizes: /\bra[ií]z|carbono|sedimento|\bsolo\b|\blama\b|estoc|sequestr|\bazul\b/i,
  paisagem: /manguezal|mangue|natureza|ecossistema|paisagem/i,
  simbolica: /futuro|começ|semente|esperança|próximo passo|junte-se|faça parte/i,
};

/**
 * How much a matched tag counts. The topic of a photo (trash, planting, the
 * mutirão, animals) outweighs where it was taken (the bay, the roots): a
 * slide about trash at high tide wants the trash, not the tide.
 */
const TAG_WEIGHT: Record<PhotoTag, number> = {
  poluicao: 3,
  plantio: 3,
  mutirao: 3,
  fauna: 3,
  baia: 1,
  raizes: 1,
  paisagem: 1,
  simbolica: 1,
};

/** Pairs shot seconds apart ("outro ângulo"): showing both in one post looks like a repeat. */
function frame(path: string): string {
  const pairs: Record<string, string> = {
    'DSC_0379': 'DSC_0378',
    'DSC_0382': 'DSC_0381',
    'DSC_0622': 'DSC_0621',
    'DSC_0651': 'DSC_0650',
    'DSC_0656': 'DSC_0655',
    'DSC_0665': 'DSC_0664',
  };
  const name = path.replace(/^.*\/|\.jpg$/g, '');
  return pairs[name] ?? name;
}

/** Small stable hash, so the same post always gets the same photo and different posts spread over the library. */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Picks the library photo that best fits `text`: tags whose hints the text
 * matches weigh most, a mangrove landscape is the default when nothing
 * matches, and a pollution shot only comes up when the slide talks about
 * pollution (trash in the roots is the wrong picture for a post about
 * replanting). Never a photo, or its twin shot, already in `used`; ties
 * broken by a hash of `seed`, so posts don't all land on the same picture.
 */
export function pickPhoto(text: string, used: ReadonlySet<string>, seed: string): Photo | undefined {
  const usedFrames = new Set([...used].map(frame));
  const aboutPollution = TAG_HINTS.poluicao.test(text);
  const candidates = PHOTO_LIBRARY.filter(
    (photo) => !usedFrames.has(frame(photo.path)) && (aboutPollution || !photo.tags.includes('poluicao')),
  );
  if (candidates.length === 0) return undefined;

  const scored = candidates.map((photo) => ({
    photo,
    score: photo.tags.reduce(
      (sum, tag) => sum + (TAG_HINTS[tag].test(text) ? TAG_WEIGHT[tag] : 0) + (tag === 'paisagem' ? 0.5 : 0),
      0,
    ),
    tie: hash(`${seed}:${photo.path}`),
  }));
  scored.sort((a, b) => b.score - a.score || a.tie - b.tie);
  return scored[0]?.photo;
}

/**
 * Whether a library photo belongs on a slide with this text. Only pollution
 * shots are restricted: every photo is of the mangrove, but trash in the roots
 * says "pollution" whatever the headline next to it says.
 */
export function photoFitsText(photo: Photo, text: string): boolean {
  return !photo.tags.includes('poluicao') || TAG_HINTS.poluicao.test(text);
}
