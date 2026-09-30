/** Strips a stray ```json fence if the model adds one despite being told not to. */
export function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return JSON.parse(fenced ? (fenced[1] ?? trimmed) : trimmed);
}
