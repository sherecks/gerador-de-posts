import { z } from 'zod';
import { LUGAR_IDS } from './mapa-babitonga';

/**
 * Contract of one carousel generation, as the factory writes it to disk.
 * Mirrors docs/COPY-ENGINE.md (B.2 slide structure, B.3 caption) and
 * docs/RENDER-RULES.md (surface, silhouette, adaptive overlay).
 *
 * The contract is brand-agnostic on purpose: `role`, `layout`, `surface`,
 * `figure` etc. are visual/structural roles, not Karaguá-specific words.
 * `brand` picks which design tokens and editorial voice apply (see
 * docs/decisions/004-um-segundo-brand-a-adx.md); everything else in this
 * file is shared by every brand.
 */

export const brandSchema = z.enum(['karagua', 'adx']);

/** Absent on every file written before this field existed → defaults to the only brand there was. */
const brandWithDefault = brandSchema.default('karagua');

export const sourceSchema = z.object({
  title: z.string().min(1),
  url: z.url(),
  publisher: z.string().min(1).optional(),
  date: z.iso.date().optional(),
});

export const slideDatumSchema = z.object({
  /** The anchor number, rendered in JetBrains Mono. */
  value: z.string().min(1),
  label: z.string().min(1),
  source: sourceSchema,
});

export const slideRoleSchema = z.enum([
  'capa',
  'hook-2',
  'desenvolvimento',
  'payoff',
  'cta',
]);

export const surfaceSchema = z.enum(['shell', 'carbon', 'lime', 'imagem']);

export const silhouetteSchema = z.enum(['quadrado', 'crescente', 'decrescente']);

export const slideImageSchema = z.object({
  /** Path relative to the repo root, e.g. "output/posts/lei-15042/slide-1.png". */
  path: z.string().min(1),
  alt: z.string().min(1),
  /**
   * Adaptive scrim opacity per band (RENDER-RULES §3). The factory computes it
   * from the sampled luminance; the viewer only replays what was decided.
   */
  overlay: z
    .object({ top: z.number().min(0).max(1), bottom: z.number().min(0).max(1) })
    .optional(),
});

/**
 * Layout of the slide (visual arrangement, distinct from `surface`/color).
 * Left unset, `inferLayout` (src/lib/layout.ts) derives it from role/content
 * so every generation written before this field existed still renders.
 */
export const layoutSchema = z.enum(['capa-onda', 'faixa', 'numero', 'figura', 'fechamento']);

/** Which pre-drawn wave silhouette divides photo from color band (capa-onda). */
export const waveVariantSchema = z.enum(['suave', 'diagonal', 'dupla']);

/** Small on-brand icon set the `analogia`/`ciclo` figures draw from. */
export const iconNameSchema = z.enum([
  'arvore',
  'carro',
  'moeda',
  'casa',
  'peixe',
  'onda',
  'fabrica',
  'pessoa',
  // natureza e mercado de carbono
  'folha',
  'gota',
  'nuvem',
  'sol',
  'barco',
  'predio',
  'documento',
  // negócio, funil e comunicação
  'grafico',
  'alvo',
  'funil',
  'telefone',
  'mensagem',
  'carrinho',
  'relogio',
  'usuarios',
  'alerta',
]);

/**
 * What each icon stands for, in the words the generator should match against
 * ("1 disto = N daquilo" only lands when the icon IS the thing). Shown in
 * the prompt and on /figuras, so a name and its meaning cannot drift apart.
 */
export const ICON_MEANING: Record<z.infer<typeof iconNameSchema>, string> = {
  arvore: 'árvore, floresta, vegetação',
  carro: 'carro, veículo, transporte, emissão de escapamento',
  moeda: 'dinheiro, preço, valor, crédito (unidade monetária)',
  casa: 'casa, moradia, família, comunidade',
  peixe: 'peixe, pesca, vida marinha',
  onda: 'água, maré, mar, costa',
  fabrica: 'fábrica, indústria, emissor de carbono',
  pessoa: 'uma pessoa, um habitante, um cliente',
  folha: 'folha, planta, natureza, sustentabilidade',
  gota: 'gota, água, chuva, umidade',
  nuvem: 'nuvem, gás, CO₂ na atmosfera',
  sol: 'sol, energia solar, clima, calor',
  barco: 'barco, pesca artesanal, navegação, baía',
  predio: 'prédio público, prefeitura, município, empresa',
  documento: 'documento, lei, contrato, relatório, norma',
  grafico: 'gráfico de barras, resultado, métrica, desempenho',
  alvo: 'alvo, meta, foco, público certo',
  funil: 'funil de vendas, filtro, qualificação',
  telefone: 'celular, contato, ligação, app',
  mensagem: 'mensagem, conversa, WhatsApp, atendimento',
  carrinho: 'carrinho, compra, venda, e-commerce',
  relogio: 'tempo, prazo, hora, velocidade',
  usuarios: 'grupo de pessoas, público, equipe, audiência',
  alerta: 'alerta, risco, problema, atenção',
};

/**
 * A figure is chosen from a fixed catalog, never freehand SVG from the
 * generator: the component draws it, the generator only supplies data. This
 * is what keeps every generation on-brand instead of drifting per call.
 */
const figureValueSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  source: sourceSchema.optional(),
});

export const figureComparacaoSchema = z.object({
  type: z.literal('comparacao'),
  itens: z
    .array(
      z.object({
        label: z.string().min(1),
        valor: z.number(),
        valorLabel: z.string().min(1),
        source: sourceSchema.optional(),
        /**
         * Emphasis: the one item the slide is actually about takes the accent,
         * the rest recede. With none set, every bar is the accent (one series,
         * one color). Setting it on more than one defeats the point.
         */
        destaque: z.boolean().optional(),
      }),
    )
    .min(2)
    .max(4),
  unidade: z.string().optional(),
});

export const figureAnalogiaSchema = z.object({
  type: z.literal('analogia'),
  icon: iconNameSchema,
  /** How many icon repeats draw the equivalence (capped so the slide stays legible). */
  quantidade: z.number().int().min(1).max(60),
  afirmacao: z.string().min(1),
  dado: figureValueSchema,
  /**
   * With `iconBase` the figure draws a real equivalence ("1 of these = N of
   * those"), which is what makes an analogy land. Without it, it falls back
   * to a plain pictogram of `quantidade` units.
   */
  iconBase: iconNameSchema.optional(),
  labelBase: z.string().min(1).optional(),
  labelUnidade: z.string().min(1).optional(),
});

export const figureFluxoSchema = z.object({
  type: z.literal('fluxo'),
  etapas: z
    .array(z.object({ label: z.string().min(1), detalhe: z.string().optional() }))
    .min(3)
    .max(6),
});

export const figureCicloSchema = z.object({
  type: z.literal('ciclo'),
  etapas: z
    .array(z.object({ label: z.string().min(1), icon: iconNameSchema.optional() }))
    .min(3)
    .max(6),
});

export const figureCamadasSchema = z.object({
  type: z.literal('camadas'),
  camadas: z
    .array(z.object({ label: z.string().min(1), detalhe: z.string().optional() }))
    .min(2)
    .max(5),
});

export const figureLinhaDoTempoSchema = z.object({
  type: z.literal('linha-do-tempo'),
  marcos: z.array(z.object({ data: z.string().min(1), label: z.string().min(1) })).min(2).max(6),
});

export const figureBalancaSchema = z.object({
  type: z.literal('balanca'),
  esquerda: z.object({ label: z.string().min(1), itens: z.array(z.string().min(1)).min(1).max(4) }),
  direita: z.object({ label: z.string().min(1), itens: z.array(z.string().min(1)).min(1).max(4) }),
});

/**
 * A locator on the real map of the Baía da Babitonga (mapa-babitonga.ts,
 * built from OpenStreetMap). A point names a place from the fixed list; its
 * position comes from that place's coordinates, never from the generation,
 * which used to guess x/y and put towns in the wrong spot.
 */
export const figureMapaSchema = z.object({
  type: z.literal('mapa'),
  pontos: z
    .array(
      z.object({
        lugar: z.enum(LUGAR_IDS),
        /** A short second line under the place name, e.g. "piloto, 380 ha". The name itself is fixed. */
        nota: z.string().min(1).max(32).optional(),
        /** With one point marked, the others recede. */
        destaque: z.boolean().optional(),
      }),
    )
    .min(1)
    .max(4),
  legenda: z.string().optional(),
});

/**
 * One numeric series over time or in sequence (price by year, leads by month).
 * A single `source` covers the whole series: its points come from one table.
 */
export const figureSerieSchema = z.object({
  type: z.literal('serie'),
  pontos: z
    .array(
      z.object({
        /** What the point sits on the x axis: "2021", "jan/26". */
        rotulo: z.string().min(1),
        valor: z.number(),
        valorLabel: z.string().min(1),
        /** The point the slide is about; at most one, the rest recede. */
        destaque: z.boolean().optional(),
      }),
    )
    .min(3)
    .max(8),
  unidade: z.string().optional(),
  source: sourceSchema.optional(),
});

/**
 * One share of a whole, 0 to 100 (68% of the leads never become a sale).
 * `valorLabel` is what is printed in the ring and must say the same number
 * as `valor`, which is what draws it — the gate checks that they agree.
 */
export const figureAnelSchema = z.object({
  type: z.literal('anel'),
  valor: z.number().min(0).max(100),
  valorLabel: z.string().min(1),
  /** What the share measures, in a few words. */
  rotulo: z.string().min(1),
  /** One line that says what the rest is, or why it matters. */
  contexto: z.string().optional(),
  source: sourceSchema.optional(),
});

export const figureSchema = z.discriminatedUnion('type', [
  figureComparacaoSchema,
  figureAnalogiaSchema,
  figureFluxoSchema,
  figureCicloSchema,
  figureCamadasSchema,
  figureLinhaDoTempoSchema,
  figureBalancaSchema,
  figureMapaSchema,
  figureSerieSchema,
  figureAnelSchema,
]);

export const slideSchema = z.object({
  role: slideRoleSchema,
  surface: surfaceSchema,
  layout: layoutSchema.optional(),
  wave: waveVariantSchema.optional(),
  eyebrow: z.string().optional(),
  headline: z.string().min(1),
  /**
   * Words from `headline` that render with a color box behind them — an
   * accent on the one thing that matters, not a second color block. Capped
   * at 3 words per phrase and 2 phrases: a generator that tries to box half
   * the headline (seen in practice) fails this instead of shipping an ugly
   * slide, and the API route's retry loop asks it to try again.
   */
  highlight: z
    .array(
      z
        .string()
        .min(1)
        .refine((value) => value.trim().split(/\s+/).length <= 3, {
          message: 'highlight deve ter no máximo 3 palavras por trecho (é um acento, não um segundo título)',
        }),
    )
    .max(2)
    .optional(),
  body: z.string().optional(),
  /** Micro-cliffhanger in the footer, up to the penultimate slide (B.2). */
  cliffhanger: z.string().optional(),
  datum: slideDatumSchema.optional(),
  image: slideImageSchema.optional(),
  silhouette: silhouetteSchema.optional(),
  /** Diagram/schema in place of (or alongside) body copy. Own layout: 'figura'. */
  figure: figureSchema.optional(),
});

export const statusSchema = z.enum([
  'rascunho',
  'em-revisao',
  'aprovado',
  'exportado',
]);

export const depthSchema = z.enum(['rapida', 'explicador', 'guia']);

export const personaSchema = z.enum([
  // Karaguá
  'pessoa_padrao',
  'servidor_publico',
  'eng_ambiental_quimico',
  'investidor',
  // ADX
  'gestor_trafego',
  'dono_negocio',
  'agencia_parceira',
]);

export const frameworkSchema = z.enum([
  'PAS',
  'AIDA',
  'explicador',
  'hook-prova-payoff',
]);

export const carouselSchema = z.object({
  id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/, 'id must be a kebab-case slug'),
  brand: brandWithDefault,
  title: z.string().min(1),
  status: statusSchema,
  createdAt: z.iso.datetime({ offset: true }),
  pauta: z.object({
    resumo: z.string().min(1),
    source: sourceSchema,
  }),
  framework: frameworkSchema,
  persona: personaSchema,
  depth: depthSchema,
  slides: z.array(slideSchema).min(2),
  caption: z.object({
    text: z.string().min(1),
    hashtags: z.array(z.string().regex(/^#\S+$/)).min(1),
  }),
  /** Set by the factory only; the viewer never writes. */
  notes: z.string().optional(),
});

/**
 * What the generator is allowed to decide. Provenance (`id`, `status`,
 * `createdAt`, `pauta`, `framework`, `persona`, `depth`, `notes`) comes from
 * the operator's form or the server, never from the model: the fact that a
 * number has a source is worth nothing if the source itself was invented.
 */
export const carouselDraftSchema = carouselSchema.pick({
  title: true,
  slides: true,
  caption: true,
});

export type CarouselDraft = z.infer<typeof carouselDraftSchema>;

export type Brand = z.infer<typeof brandSchema>;
export type Source = z.infer<typeof sourceSchema>;
export type Slide = z.infer<typeof slideSchema>;
export type Carousel = z.infer<typeof carouselSchema>;
export type Status = z.infer<typeof statusSchema>;
export type Surface = z.infer<typeof surfaceSchema>;
export type SlideRole = z.infer<typeof slideRoleSchema>;
export type Depth = z.infer<typeof depthSchema>;
export type Persona = z.infer<typeof personaSchema>;
export type Framework = z.infer<typeof frameworkSchema>;
export type Layout = z.infer<typeof layoutSchema>;
export type WaveVariant = z.infer<typeof waveVariantSchema>;
export type IconName = z.infer<typeof iconNameSchema>;
export type Figure = z.infer<typeof figureSchema>;
export type FigureType = Figure['type'];
export type FigureComparacao = z.infer<typeof figureComparacaoSchema>;
export type FigureAnalogia = z.infer<typeof figureAnalogiaSchema>;
export type FigureFluxo = z.infer<typeof figureFluxoSchema>;
export type FigureCiclo = z.infer<typeof figureCicloSchema>;
export type FigureCamadas = z.infer<typeof figureCamadasSchema>;
export type FigureLinhaDoTempo = z.infer<typeof figureLinhaDoTempoSchema>;
export type FigureSerie = z.infer<typeof figureSerieSchema>;
export type FigureAnel = z.infer<typeof figureAnelSchema>;
export type FigureBalanca = z.infer<typeof figureBalancaSchema>;
export type FigureMapa = z.infer<typeof figureMapaSchema>;

export const STATUS_LABEL: Record<Status, string> = {
  rascunho: 'Rascunho',
  'em-revisao': 'Em revisão',
  aprovado: 'Aprovado',
  exportado: 'Exportado',
};

export const ROLE_LABEL: Record<SlideRole, string> = {
  capa: 'Capa · hook',
  'hook-2': 'Slide 2 · segundo hook',
  desenvolvimento: 'Desenvolvimento',
  payoff: 'Payoff',
  cta: 'CTA',
};

export const BRAND_LABEL: Record<Brand, string> = {
  karagua: 'Karaguá Ecotech',
  adx: 'ADX',
};

export const PERSONA_LABEL: Record<z.infer<typeof personaSchema>, string> = {
  pessoa_padrao: 'Pessoa comum',
  servidor_publico: 'Servidor público',
  eng_ambiental_quimico: 'Engenharia ambiental',
  investidor: 'Investidor',
  gestor_trafego: 'Gestor de tráfego',
  dono_negocio: 'Dono do negócio',
  agencia_parceira: 'Agência parceira',
};

/** Which personas a brand's /gerar form offers — the two lists never mix in the dropdown. */
export const PERSONAS_BY_BRAND: Record<Brand, ReadonlyArray<z.infer<typeof personaSchema>>> = {
  karagua: ['pessoa_padrao', 'servidor_publico', 'eng_ambiental_quimico', 'investidor'],
  adx: ['gestor_trafego', 'dono_negocio', 'agencia_parceira'],
};

/** Slide-count window per depth (COPY-ENGINE A.6 / gate slide-count-check). */
export const DEPTH_RANGE: Record<z.infer<typeof depthSchema>, readonly [number, number]> = {
  rapida: [2, 4],
  explicador: [5, 7],
  guia: [8, 10],
};

export const FIGURE_LABEL: Record<FigureType, string> = {
  comparacao: 'Comparação (barras)',
  analogia: 'Analogia (ícone repetido)',
  fluxo: 'Fluxo (etapas com seta)',
  ciclo: 'Ciclo (processo circular)',
  camadas: 'Camadas (corte)',
  'linha-do-tempo': 'Linha do tempo',
  balanca: 'Balança (dois lados)',
  mapa: 'Mapa da Babitonga',
  serie: 'Série (linha no tempo)',
  anel: 'Anel (percentual)',
};

export const LAYOUT_LABEL: Record<Layout, string> = {
  'capa-onda': 'Capa com onda',
  faixa: 'Faixa de texto',
  numero: 'Número em destaque',
  figura: 'Figura',
  fechamento: 'Fechamento',
};
