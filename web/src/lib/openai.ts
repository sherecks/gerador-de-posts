import OpenAI from 'openai';

/**
 * OPENAI_API_KEY lives in web/.env.local (RNF05: never committed, never sent
 * to the client — this module only ever runs on the server, imported from
 * route handlers). OPENAI_TEXT_MODEL lets the operator pick/upgrade the
 * model without a code change; the default below is a placeholder the
 * operator is expected to confirm, not a hard recommendation.
 */

let cachedClient: OpenAI | null = null;

export function openaiKeyConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY não configurada. Crie web/.env.local (veja .env.local.example) e reinicie o servidor.',
    );
  }
  if (!cachedClient) cachedClient = new OpenAI({ apiKey });
  return cachedClient;
}

export function textModel(): string {
  return process.env.OPENAI_TEXT_MODEL || 'gpt-4o';
}
