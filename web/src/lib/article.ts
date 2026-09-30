/**
 * Fetches a news URL and reduces it to plain text. Deliberately simple (no
 * Readability/JSDOM): strips script/style/tags and collapses whitespace.
 * Good enough to give the model a factual base; loses nothing the model
 * should be citing (headings, body text) and keeps the dependency footprint
 * at zero, matching RNF01 (100% local, one network dependency: OpenAI).
 */

const MAX_CHARS = 9000;

const ENTITIES: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
};

function decodeEntities(text: string): string {
  return text.replace(/&(nbsp|amp|lt|gt|quot|#39|apos);/g, (match) => ENTITIES[match] ?? match);
}

function stripHtml(html: string): string {
  const withoutNoise = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  const withBreaks = withoutNoise.replace(/<(br|\/p|\/div|\/li|\/h[1-6])\s*\/?>/gi, '\n');
  const textOnly = withBreaks.replace(/<[^>]+>/g, ' ');

  return decodeEntities(textOnly)
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export class ArticleFetchError extends Error {}

export async function fetchArticleText(url: string): Promise<string> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GeradorDePosts/0.1; local)' },
      redirect: 'follow',
    });
  } catch (cause) {
    throw new ArticleFetchError(`não consegui alcançar a URL (${(cause as Error).message})`);
  }

  if (!response.ok) {
    throw new ArticleFetchError(`a URL respondeu HTTP ${response.status}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
    throw new ArticleFetchError(`a URL não é uma página de texto (content-type: ${contentType || 'desconhecido'})`);
  }

  const html = await response.text();
  const text = stripHtml(html);

  if (text.length < 200) {
    throw new ArticleFetchError(
      'o texto extraído da URL ficou curto demais (a página pode carregar o conteúdo via JavaScript). Cole o texto da notícia diretamente.',
    );
  }

  return text.length > MAX_CHARS ? `${text.slice(0, MAX_CHARS)}\n\n[texto truncado]` : text;
}
