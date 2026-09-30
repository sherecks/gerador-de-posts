/**
 * Figure candidates found in the source text, by rule (no model).
 *
 * The generator has the whole figure catalog in its prompt and, left to
 * itself, never draws one: of the carousels it has written, none has a
 * figure. Describing when to use a figure was not enough, so this hands it the
 * sentences that already carry a drawable number — a share of a whole, a run
 * of values over years — with the exact numbers, and asks it to confirm and
 * use the strongest one. It only proposes: the model still decides, and the
 * gate still demands the source and checks that the drawing says what the
 * caption says.
 */

const PERCENT = /(\d{1,3}(?:[.,]\d+)?)\s?%/g;
const YEAR = /\b(?:19|20)\d\d\b/g;
const NUMBER = /\d+(?:[.,]\d+)?/g;
/** A percentage that is a change ("29% acima", "queda de 8%") is not a share of a whole, so no ring. */
const CHANGE = /(acima|abaixo|aument|queda|cresc|reduç|reduz|alta de|baixa de|variaç|dobr|acréscimo|desconto)/i;

function sentences(text: string): string[] {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // markdown links keep their text
    .replace(/[*_`>#]/g, '')
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter((s) => s.length >= 30 && s.length <= 320);
}

export function figureHints(articleText: string): string {
  const all = sentences(articleText);
  const seen = new Set<string>();
  const rings: string[] = [];
  const series: string[] = [];

  for (const sentence of all) {
    for (const match of CHANGE.test(sentence) ? [] : sentence.matchAll(PERCENT)) {
      const raw = match[0].replace(/\s/g, '');
      const value = Number.parseFloat((match[1] ?? '').replace(',', '.'));
      if (value > 0 && value < 100 && !seen.has(raw) && rings.length < 3) {
        seen.add(raw);
        rings.push(`- "${sentence}"\n  → anel: valor ${value}, valorLabel "${raw}"`);
      }
    }
    const years = new Set(sentence.match(YEAR) ?? []);
    const numbers = (sentence.replace(YEAR, ' ').match(NUMBER) ?? []).length;
    if (years.size >= 2 && numbers >= 2 && series.length < 2) {
      series.push(`- "${sentence}"\n  → possível série (${[...years].join(', ')}); só serve com 3 ou mais pontos no texto`);
    }
  }

  if (rings.length === 0 && series.length === 0) return '';
  return `## Candidatos a figura (detectados no texto-fonte)

O texto traz números que uma figura desenha melhor do que uma frase. Confirme cada um no texto e use em UM slide de
desenvolvimento (layout "figura") o que mais sustenta o ÂNGULO decidido pelo operador, não o primeiro da lista. Ignore o que não sustentar uma figura honesta (sem inventar ponto que o
texto não traz).

${[...rings, ...series].join('\n')}
`;
}
