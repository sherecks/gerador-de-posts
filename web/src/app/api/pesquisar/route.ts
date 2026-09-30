import { NextResponse } from 'next/server';
import { z } from 'zod';
import { brandSchema } from '@/lib/carousel';
import { buildDiscoveryPrompt, discoveryResultSchema } from '@/lib/discovery';
import { extractJson } from '@/lib/json';
import { getOpenAI, openaiKeyConfigured, textModel } from '@/lib/openai';

export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  brand: brandSchema,
  tema: z.string().trim().min(1).optional(),
});

type ParseResult =
  | { success: true; data: z.infer<typeof discoveryResultSchema> }
  | { success: false; error: string };

function parseResult(raw: string): ParseResult {
  let json: unknown;
  try {
    json = extractJson(raw);
  } catch (cause) {
    return { success: false, error: `resposta não é JSON válido (${(cause as Error).message})` };
  }
  const result = discoveryResultSchema.safeParse(json);
  if (!result.success) {
    const first = result.error.issues[0];
    const where = first ? first.path.join('.') || '(raiz)' : '(raiz)';
    return { success: false, error: `fora do contrato em "${where}": ${first?.message ?? 'formato desconhecido'}` };
  }
  return { success: true, data: result.data };
}

/**
 * Discovery via the OpenAI Responses API's built-in web_search tool, not
 * firecrawl (PRD §7 named firecrawl; see docs/decisions/003). Same key
 * already in .env.local, no second external service.
 */
export async function POST(request: Request): Promise<Response> {
  if (!openaiKeyConfigured()) {
    return NextResponse.json(
      {
        error:
          'OPENAI_API_KEY não configurada. Crie web/.env.local com a chave (veja web/.env.local.example) e reinicie o servidor.',
      },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'corpo da requisição não é JSON válido' }, { status: 400 });
  }

  const parsedRequest = requestSchema.safeParse(body);
  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: parsedRequest.error.issues[0]?.message ?? 'requisição inválida' },
      { status: 400 },
    );
  }

  const prompt = await buildDiscoveryPrompt(parsedRequest.data.brand, parsedRequest.data.tema);
  const client = getOpenAI();

  async function callModel(correction?: string): Promise<string> {
    const response = await client.responses.create({
      model: textModel(),
      tools: [{ type: 'web_search_preview' }],
      input: correction
        ? `${prompt.system}\n\n${prompt.user}\n\n${correction}`
        : `${prompt.system}\n\n${prompt.user}`,
    });
    return response.output_text;
  }

  let raw: string;
  try {
    raw = await callModel();
  } catch (cause) {
    const message = (cause as Error).message;
    return NextResponse.json(
      {
        error: `falha ao buscar na OpenAI: ${message}. Se o erro mencionar a ferramenta de busca, o modelo em OPENAI_TEXT_MODEL pode não suportar web_search_preview — gpt-4o suporta.`,
      },
      { status: 502 },
    );
  }

  let result = parseResult(raw);
  if (!result.success) {
    try {
      raw = await callModel(
        `A resposta anterior falhou a validação: ${result.error}. Responda de novo só com o JSON corrigido, no mesmo contrato.`,
      );
      result = parseResult(raw);
    } catch (cause) {
      return NextResponse.json(
        { error: `falha ao buscar na OpenAI na nova tentativa: ${(cause as Error).message}` },
        { status: 502 },
      );
    }
  }

  if (!result.success) {
    return NextResponse.json({ error: `o modelo não respondeu no contrato: ${result.error}` }, { status: 502 });
  }

  return NextResponse.json(result.data);
}
