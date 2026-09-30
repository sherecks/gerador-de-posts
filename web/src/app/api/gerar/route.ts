import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ArticleFetchError, fetchArticleText } from '@/lib/article';
import {
  brandSchema,
  carouselDraftSchema,
  carouselSchema,
  depthSchema,
  frameworkSchema,
  personaSchema,
  sourceSchema,
} from '@/lib/carousel';
import { runGate } from '@/lib/gate';
import { extractJson } from '@/lib/json';
import { getOpenAI, openaiKeyConfigured, textModel } from '@/lib/openai';
import { ensurePhotos, sanitizeImages } from '@/lib/carousel-photos';
import { buildPrompt } from '@/lib/prompt';
import { dataDir } from '@/lib/store';

export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  brand: brandSchema,
  /** Every generation cites a checkable URL (brand rule); pasted text is only a fallback for the fetch step. */
  texto: z.string().min(1).optional(),
  persona: personaSchema,
  depth: depthSchema,
  framework: frameworkSchema,
  resumo: z.string().min(1, 'descreva o ângulo da pauta'),
  source: sourceSchema,
});

function slugify(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return slug || 'geracao';
}

async function uniqueId(base: string): Promise<string> {
  const dir = dataDir();
  let existing: Set<string>;
  try {
    existing = new Set((await readdir(dir)).map((file) => file.replace(/\.json$/, '')));
  } catch {
    existing = new Set();
  }
  if (!existing.has(base)) return base;
  let attempt = 2;
  while (existing.has(`${base}-${attempt}`)) attempt += 1;
  return `${base}-${attempt}`;
}

type DraftResult =
  | { success: true; data: z.infer<typeof carouselDraftSchema> }
  | { success: false; error: string };

function parseDraft(raw: string): DraftResult {
  let json: unknown;
  try {
    json = extractJson(raw);
  } catch (cause) {
    return { success: false, error: `resposta não é JSON válido (${(cause as Error).message})` };
  }
  const result = carouselDraftSchema.safeParse(json);
  if (!result.success) {
    const first = result.error.issues[0];
    const where = first ? first.path.join('.') || '(raiz)' : '(raiz)';
    return { success: false, error: `fora do contrato em "${where}": ${first?.message ?? 'formato desconhecido'}` };
  }
  return { success: true, data: result.data };
}

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
  const input = parsedRequest.data;

  let articleText: string;
  try {
    articleText = input.texto ?? (await fetchArticleText(input.source.url));
  } catch (cause) {
    const message = cause instanceof ArticleFetchError ? cause.message : (cause as Error).message;
    return NextResponse.json({ error: `não consegui ler a fonte: ${message}` }, { status: 400 });
  }

  const prompt = await buildPrompt({
    brand: input.brand,
    persona: input.persona,
    depth: input.depth,
    framework: input.framework,
    resumo: input.resumo,
    source: input.source,
    articleText,
  });

  const client = getOpenAI();

  async function callModel(correction?: string): Promise<string> {
    const completion = await client.chat.completions.create({
      model: textModel(),
      temperature: 0.6,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user },
        ...(correction ? [{ role: 'user' as const, content: correction }] : []),
      ],
    });
    return completion.choices[0]?.message.content ?? '';
  }

  let raw: string;
  try {
    raw = await callModel();
  } catch (cause) {
    return NextResponse.json({ error: `falha ao chamar a OpenAI: ${(cause as Error).message}` }, { status: 502 });
  }

  let draft = parseDraft(raw);
  if (!draft.success) {
    // One corrective retry, quoting the exact validation error back at the model.
    try {
      raw = await callModel(
        `A resposta anterior falhou a validação: ${draft.error}. Responda de novo só com o JSON corrigido, no mesmo contrato.`,
      );
      draft = parseDraft(raw);
    } catch (cause) {
      return NextResponse.json(
        { error: `falha ao chamar a OpenAI na nova tentativa: ${(cause as Error).message}` },
        { status: 502 },
      );
    }
  }

  if (!draft.success) {
    return NextResponse.json({ error: `o modelo não respondeu no contrato: ${draft.error}` }, { status: 502 });
  }

  const sanitized = ensurePhotos(sanitizeImages(draft.data), input.brand);
  const id = await uniqueId(slugify(sanitized.title));

  const carousel = carouselSchema.parse({
    id,
    brand: input.brand,
    title: sanitized.title,
    status: 'rascunho',
    createdAt: new Date().toISOString(),
    pauta: { resumo: input.resumo, source: input.source },
    framework: input.framework,
    persona: input.persona,
    depth: input.depth,
    slides: sanitized.slides,
    caption: sanitized.caption,
    notes: `Gerado via /gerar em ${new Date().toLocaleString('pt-BR')} · modelo ${textModel()}.`,
  });

  const report = runGate(carousel);

  const dir = dataDir();
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${id}.json`), `${JSON.stringify(carousel, null, 2)}\n`, 'utf8');

  return NextResponse.json({
    id,
    blockers: report.blockers.map((check) => check.label),
    warnings: report.warnings.map((check) => check.label),
  });
}
