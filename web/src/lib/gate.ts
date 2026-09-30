import { DEPTH_RANGE, type Brand, type Carousel, type Slide } from './carousel';
import { LUGARES } from './mapa-babitonga';

/**
 * Quality gate of docs/COPY-ENGINE.md Parte C, as far as a machine can tell.
 *
 * Only the deterministic items are judged here. The ones that need reading
 * comprehension (hook, loop, one-idea, persona, promise=payoff) are surfaced
 * as `manual` so the operator sees the full checklist and the viewer never
 * claims a verdict it cannot support.
 */

export type CheckStatus = 'pass' | 'fail' | 'manual';

export type Check = {
  id: string;
  label: string;
  status: CheckStatus;
  /** A failed blocking check forbids approval (RF15). */
  blocking: boolean;
  findings: string[];
};

export type GateReport = {
  checks: Check[];
  blockers: Check[];
  warnings: Check[];
  manual: Check[];
};

const EM_DASH = '—';

/** Exported so the generator's prompt (src/lib/prompt.ts) quotes the exact same list, not a copy that can drift. */
export const SUPERLATIVES = [
  'melhor',
  'pior',
  'revolucionário',
  'revolucionaria',
  'líder',
  'lider',
  'inédito',
  'inedito',
  'único',
  'unico',
  'maior do mundo',
  'definitivo',
  'imperdível',
  'imperdivel',
];

/**
 * Acronyms the manual requires expanding on first use (COPY-ENGINE B.4) —
 * per brand, because the two audiences don't share a jargon floor: Karaguá
 * writes for a mixed audience that includes laypeople (pessoa_padrao), so
 * its acronyms expand; ADX writes for professional media buyers who already
 * live in CPL/CPQL/ROAS, so its list is empty (docs/adx/COMMUNICATION-MANUAL
 * §4) — expanding those would read as condescending, not helpful.
 * Exported so the generator's prompt (src/lib/prompt.ts) quotes the same list.
 */
export const ACRONYMS: Record<Brand, readonly string[]> = {
  karagua: ['PSA', 'MRV', 'REDD+', 'VM0033', 'VM0007', 'PEPSA', 'SBCE', 'BNDES'],
  adx: [],
};

const BUDGET = { eyebrow: 3, headline: 10, body: 26 } as const;

function slideTexts(slide: Slide): string[] {
  return [slide.eyebrow, slide.headline, slide.body, slide.cliffhanger, slide.datum?.label].filter(
    (value): value is string => typeof value === 'string' && value.length > 0,
  );
}

/** Prose the figure draws (labels, statements) — not the raw numeric values, that's figureSourceCheck's job. */
function figureTexts(figure: Slide['figure']): string[] {
  if (!figure) return [];
  switch (figure.type) {
    case 'comparacao':
      return [
        ...figure.itens.flatMap((item) => [item.label, item.valorLabel]),
        ...(figure.unidade ? [figure.unidade] : []),
      ];
    case 'analogia':
      return [figure.afirmacao, figure.dado.label];
    case 'fluxo':
      return figure.etapas.flatMap((etapa) =>
        [etapa.label, etapa.detalhe].filter((value): value is string => typeof value === 'string'),
      );
    case 'ciclo':
      return figure.etapas.map((etapa) => etapa.label);
    case 'camadas':
      return figure.camadas.flatMap((camada) =>
        [camada.label, camada.detalhe].filter((value): value is string => typeof value === 'string'),
      );
    case 'linha-do-tempo':
      return figure.marcos.flatMap((marco) => [marco.data, marco.label]);
    case 'balanca':
      return [
        figure.esquerda.label,
        figure.direita.label,
        ...figure.esquerda.itens,
        ...figure.direita.itens,
      ];
    case 'mapa':
      return [
        ...figure.pontos.flatMap((ponto) => [LUGARES[ponto.lugar].nome, ...(ponto.nota ? [ponto.nota] : [])]),
        ...(figure.legenda ? [figure.legenda] : []),
      ];
    case 'serie':
      return [
        ...figure.pontos.flatMap((ponto) => [ponto.rotulo, ponto.valorLabel]),
        ...(figure.unidade ? [figure.unidade] : []),
      ];
    case 'anel':
      return [figure.valorLabel, figure.rotulo, ...(figure.contexto ? [figure.contexto] : [])];
  }
}

function allTexts(carousel: Carousel): string[] {
  return [
    ...carousel.slides.flatMap((slide) => [...slideTexts(slide), ...figureTexts(slide.figure)]),
    carousel.caption.text,
    ...carousel.caption.hashtags,
  ];
}

function words(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Whether `text` contains a standalone numeric claim ("R$ 12 bi", "4,5
 * milhões", "40%") as opposed to a letter+digit identifier ("B4", "COP28",
 * "VM0033", "5G") that only looks numeric to a naive `/\d/` scan. A token
 * counts only when what's left after stripping a leading currency sign and
 * trailing punctuation is nothing but digits/.,/% — a letter anywhere in
 * that core means it is a name, not a number, and needs no `datum`.
 */
function hasStandaloneNumber(text: string): boolean {
  return text.split(/\s+/).some((word) => {
    const core = word.replace(/^[R$€£]+/, '').replace(/[.,;:!?)]+$/, '');
    return /^\d[\d.,]*%?$/.test(core);
  });
}

function slideLabel(index: number): string {
  return `slide ${index + 1}`;
}

function emDashCheck(carousel: Carousel): Check {
  const findings: string[] = [];
  carousel.slides.forEach((slide, index) => {
    for (const text of slideTexts(slide)) {
      if (text.includes(EM_DASH)) findings.push(`${slideLabel(index)}: "${text.trim()}"`);
    }
  });
  if (carousel.caption.text.includes(EM_DASH)) findings.push('legenda');

  return {
    id: 'travessao',
    label: 'Travessão: zero "—" na copy e na legenda',
    status: findings.length === 0 ? 'pass' : 'fail',
    blocking: true,
    findings,
  };
}

/**
 * A figure that carries its own source(s) declares the slide's source too: a
 * ring of "99%" with the article behind it needs no second `datum` for the
 * same number in the headline. `fonte-figura` still blocks a figure without one.
 */
function figureDeclaresSource(figure: Slide['figure']): boolean {
  if (!figure) return false;
  switch (figure.type) {
    case 'serie':
    case 'anel':
      return Boolean(figure.source?.url);
    case 'comparacao':
      return figure.itens.every((item) => Boolean(item.source?.url));
    case 'analogia':
      return Boolean(figure.dado.source?.url);
    default:
      return false;
  }
}

function sourceCheck(carousel: Carousel): Check {
  const findings: string[] = [];
  carousel.slides.forEach((slide, index) => {
    const numeric = slideTexts(slide).filter(hasStandaloneNumber);
    if (numeric.length > 0 && !slide.datum && !figureDeclaresSource(slide.figure)) {
      findings.push(`${slideLabel(index)}: número sem fonte declarada (${numeric.join(' · ')})`);
    }
    if (slide.datum && !slide.datum.source.url) {
      findings.push(`${slideLabel(index)}: fonte sem URL rastreável`);
    }
  });

  return {
    id: 'fonte',
    label: 'Fonte: todo número carrega fonte rastreável',
    status: findings.length === 0 ? 'pass' : 'fail',
    blocking: true,
    findings,
  };
}

function budgetCheck(carousel: Carousel): Check {
  const findings: string[] = [];
  carousel.slides.forEach((slide, index) => {
    if (slide.eyebrow && words(slide.eyebrow) > BUDGET.eyebrow) {
      findings.push(`${slideLabel(index)}: eyebrow com ${words(slide.eyebrow)} palavras (máx ${BUDGET.eyebrow})`);
    }
    if (words(slide.headline) > BUDGET.headline) {
      findings.push(`${slideLabel(index)}: headline com ${words(slide.headline)} palavras (máx ${BUDGET.headline})`);
    }
    if (slide.body && words(slide.body) > BUDGET.body) {
      findings.push(`${slideLabel(index)}: corpo com ${words(slide.body)} palavras (máx ${BUDGET.body})`);
    }
  });

  return {
    id: 'budget',
    label: `Budget: eyebrow ≤${BUDGET.eyebrow} · headline ≤${BUDGET.headline} · corpo ≤${BUDGET.body}`,
    status: findings.length === 0 ? 'pass' : 'fail',
    blocking: false,
    findings,
  };
}

function slideCountCheck(carousel: Carousel): Check {
  const [min, max] = DEPTH_RANGE[carousel.depth];
  const count = carousel.slides.length;
  const inRange = count >= min && count <= max;

  return {
    id: 'slide-count',
    label: `Contagem: ${count} slides para profundidade "${carousel.depth}" (${min}–${max})`,
    status: inRange ? 'pass' : 'fail',
    blocking: false,
    findings: inRange ? [] : [`${count} slides fora da janela ${min}–${max}`],
  };
}

function superlativeCheck(carousel: Carousel): Check {
  const findings: string[] = [];
  for (const text of allTexts(carousel)) {
    const lower = text.toLowerCase();
    for (const word of SUPERLATIVES) {
      if (lower.includes(word)) findings.push(`"${word}" em "${text.trim()}"`);
    }
  }

  return {
    id: 'superlativo',
    label: 'Superlativo: nenhum sem prova adjacente',
    status: findings.length === 0 ? 'pass' : 'fail',
    blocking: false,
    findings,
  };
}

function acronymCheck(carousel: Carousel): Check {
  const findings: string[] = [];
  const stream = allTexts(carousel);

  for (const acronym of ACRONYMS[carousel.brand]) {
    const firstIndex = stream.findIndex((text) => text.includes(acronym));
    if (firstIndex === -1) continue;
    const first = stream[firstIndex];
    if (first === undefined) continue;
    // Expansion counts when the first occurrence sits next to a parenthetical.
    if (!/[()]/.test(first)) {
      findings.push(`${acronym} aparece sem expansão na 1ª ocorrência: "${first.trim()}"`);
    }
  }

  return {
    id: 'sigla',
    label: 'Siglas: expandidas na 1ª ocorrência',
    status: findings.length === 0 ? 'pass' : 'fail',
    blocking: false,
    findings,
  };
}

function structureCheck(carousel: Carousel): Check {
  const findings: string[] = [];
  const first = carousel.slides[0];
  const last = carousel.slides[carousel.slides.length - 1];
  const second = carousel.slides[1];

  if (first && first.role !== 'capa') findings.push('slide 1 não está marcado como capa');
  if (second && second.role !== 'hook-2') findings.push('slide 2 não está marcado como segundo hook');
  if (last && last.role !== 'cta') findings.push('último slide não está marcado como CTA');
  if (!carousel.slides.some((slide) => slide.role === 'payoff')) findings.push('nenhum slide de payoff');

  return {
    id: 'estrutura',
    label: 'Estrutura: capa · 2º hook · … · payoff · CTA',
    status: findings.length === 0 ? 'pass' : 'fail',
    blocking: false,
    findings,
  };
}

/**
 * `comparacao`, `analogia`, `serie` and `anel` carry standalone numeric claims
 * (a `source` field of their own); the others are structural/qualitative and
 * have nothing here to check.
 */
function figureSourceCheck(carousel: Carousel): Check {
  const findings: string[] = [];

  carousel.slides.forEach((slide, index) => {
    const figure = slide.figure;
    if (!figure) return;

    if (figure.type === 'comparacao') {
      figure.itens.forEach((item) => {
        if (!item.source) {
          findings.push(`${slideLabel(index)}: figura comparação, "${item.label}" (${item.valorLabel}) sem fonte`);
        }
      });
    } else if (figure.type === 'analogia') {
      if (!figure.dado.source) {
        findings.push(`${slideLabel(index)}: figura analogia, "${figure.dado.label}" sem fonte`);
      }
    } else if (figure.type === 'serie') {
      if (!figure.source) {
        findings.push(`${slideLabel(index)}: figura série (${figure.pontos.length} pontos) sem fonte`);
      }
    } else if (figure.type === 'anel') {
      if (!figure.source) {
        findings.push(`${slideLabel(index)}: figura anel, "${figure.rotulo}" (${figure.valorLabel}) sem fonte`);
      }
    }
  });

  return {
    id: 'fonte-figura',
    label: 'Fonte da figura: todo número desenhado carrega fonte rastreável',
    status: findings.length === 0 ? 'pass' : 'fail',
    blocking: true,
    findings,
  };
}

/**
 * A ring is drawn from `valor` and captioned with `valorLabel`. If the two
 * say different numbers the slide contradicts itself, and the reader trusts
 * the drawing over the caption. pt-BR decimals use a comma ("68,5%").
 */
function figureConsistencyCheck(carousel: Carousel): Check {
  const findings: string[] = [];

  carousel.slides.forEach((slide, index) => {
    const figure = slide.figure;
    if (figure?.type !== 'anel') return;
    const printed = Number.parseFloat((figure.valorLabel.match(/\d+(?:[.,]\d+)?/)?.[0] ?? '').replace(',', '.'));
    if (Number.isNaN(printed)) {
      findings.push(`${slideLabel(index)}: anel "${figure.valorLabel}" não traz número`);
    } else if (Math.abs(printed - figure.valor) > 0.5) {
      findings.push(`${slideLabel(index)}: anel desenha ${figure.valor}% mas o texto diz "${figure.valorLabel}"`);
    }
  });

  return {
    id: 'figura-consistente',
    label: 'Figura consistente: o número escrito é o mesmo que o desenho mostra',
    status: findings.length === 0 ? 'pass' : 'fail',
    blocking: true,
    findings,
  };
}

/** The prompt asks for at most two figure slides; a third dilutes each one. */
function figureUseCheck(carousel: Carousel): Check {
  const findings: string[] = [];
  const withFigure = carousel.slides.filter((slide) => slide.figure).length;
  if (withFigure > 2) findings.push(`${withFigure} slides com figura (o combinado é no máximo 2)`);

  carousel.slides.forEach((slide, index) => {
    if (slide.figure?.type === 'serie' && slide.figure.pontos.filter((p) => p.destaque).length > 1) {
      findings.push(`${slideLabel(index)}: série com mais de um ponto em destaque (destacar tudo é não destacar nada)`);
    }
  });

  return {
    id: 'figura-uso',
    label: 'Uso das figuras: no máximo 2 slides com figura, um destaque por série',
    status: findings.length === 0 ? 'pass' : 'fail',
    blocking: false,
    findings,
  };
}

const MANUAL_CHECKS: ReadonlyArray<Pick<Check, 'id' | 'label'>> = [
  { id: 'hook', label: 'Hook-check: a capa abre um loop, não entrega tudo' },
  { id: 'slide-2', label: 'Slide-2-check: funciona sozinho como segundo hook' },
  { id: 'loop', label: 'Loop-check: o payoff fecha o loop aberto na capa' },
  { id: 'uma-ideia', label: '1 ideia por slide: nenhum slide com duas afirmações centrais' },
  { id: 'persona', label: 'Persona-check: hook e jargão coerentes com o persona primário' },
  { id: 'promessa', label: 'Promessa = payoff: o que a capa promete é entregue' },
];

export function runGate(carousel: Carousel): GateReport {
  const automatic = [
    emDashCheck(carousel),
    sourceCheck(carousel),
    figureSourceCheck(carousel),
    figureConsistencyCheck(carousel),
    figureUseCheck(carousel),
    structureCheck(carousel),
    budgetCheck(carousel),
    slideCountCheck(carousel),
    superlativeCheck(carousel),
    acronymCheck(carousel),
  ];

  const manual: Check[] = MANUAL_CHECKS.map((item) => ({
    ...item,
    status: 'manual',
    blocking: false,
    findings: [],
  }));

  const checks = [...automatic, ...manual];
  return {
    checks,
    blockers: automatic.filter((check) => check.blocking && check.status === 'fail'),
    warnings: automatic.filter((check) => !check.blocking && check.status === 'fail'),
    manual,
  };
}
