import { z } from 'zod';
import type { Brand } from './carousel';
import { loadRuleDocs } from './docs';

/**
 * A discovery candidate (PRD RF01-RF03): a pauta the search turned up, never
 * a pauta the app decided on its own to run with. Nothing here is persisted
 * — there is no fila de pautas yet (docs/decisions/002 "o que ainda
 * falta") — the operator picks one in the browser and it flows straight
 * into /gerar. Propose-only survives even without a queue: the API route
 * never writes to disk.
 */
/** The model writes natural PT-BR ("média"); normalize accents before matching the enum instead of rejecting it. */
const relevanciaSchema = z
  .string()
  .transform((value) => value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase())
  .pipe(z.enum(['alta', 'media', 'baixa']));

export const candidateSchema = z.object({
  titulo: z.string().min(1),
  url: z.url(),
  publisher: z.string().min(1).optional(),
  data: z.string().optional(),
  resumo: z.string().min(1),
  relevancia: relevanciaSchema,
  porque: z.string().min(1),
});

export const discoveryResultSchema = z.object({
  candidatas: z.array(candidateSchema).min(1).max(8),
});

export type Candidate = z.infer<typeof candidateSchema>;
export type DiscoveryResult = z.infer<typeof discoveryResultSchema>;

const BRAND_IDENTITY: Record<Brand, string> = {
  karagua: `Você faz o discovery de pautas para o Instagram da Karaguá Ecotech (carbono azul em manguezal,
Baía da Babitonga). Cada candidata é uma notícia real que pode virar um post que a comenta.`,
  adx: `Você faz o discovery de ângulo para o Instagram da ADX (SaaS que cruza Meta Ads com CRM). A ADX não
comenta notícia: cada candidata é matéria-prima de INSPIRAÇÃO — um dado, benchmark ou mudança de mercado que
sugere um reframe de métrica (ver docs/adx/EDITORIAL-REFERENCE.md §1-2), não uma notícia que o post vai citar
como fonte principal.`,
};

const BRAND_DEFAULT_SWEEP: Record<Brand, string> = {
  karagua: `Sem tema específico do operador: busque pelas fontes-semente do discovery listadas em
EDITORIAL-REFERENCE.md §4 (Verra, Carbon Pulse, ClimaInfo, Ministério da Fazenda/SBCE, MMA/ProManguezal,
Diário Oficial, MapBiomas) e pelo tema geral do nicho (mercado de carbono, carbono azul, manguezal, Lei
15.042/2024, PSA, preço do crédito voluntário).`,
  adx: `Sem tema específico do operador: busque pelos temas-semente de docs/adx/EDITORIAL-REFERENCE.md §2
(diferença CPL/CPQL/CAC/LTV, mudanças de tracking e atribuição no Meta Ads, benchmark de custo por lead/venda
por nicho, integração Meta Ads + CRM) e pelas fontes de §1 (Meta for Business, HubSpot Blog, newsletters de
growth, cobertura BR de performance marketing).`,
};

function identity(brand: Brand): string {
  return `${BRAND_IDENTITY[brand]} Use a busca na web para encontrar páginas REAIS e recentes: nunca invente
título, URL, veículo ou data. Se não tiver certeza de que uma página existe de verdade, não a inclua.`;
}

function schemaNote(): string {
  return `## Formato de saída (contrato JSON)

Responda **apenas** com um objeto JSON válido: sem bloco de código markdown, sem texto antes ou depois. Formato:

{
  "candidatas": [
    {
      "titulo": string,
      "url": string,          // URL exata obtida na busca, nunca inventada
      "publisher"?: string,
      "data"?: "AAAA-MM-DD",  // se a busca não trouxer a data, omita
      "resumo": string,       // 1-2 frases, o que a página diz
      "relevancia": "alta" | "media" | "baixa",
      "porque": string        // por que interessa ao nicho / que ângulo de post ela sugere
    }
  ]
}

Entre 3 e 8 candidatas. Cada uma precisa ter vindo de um resultado de busca real, não de conhecimento geral
sem fonte. Prefira algo dos últimos 30 dias; algo mais antigo só entra se for claramente relevante e não
amplamente batido (marco legal, dado novo, benchmark que ainda vale).`;
}

export async function buildDiscoveryPrompt(brand: Brand, tema?: string): Promise<{ system: string; user: string }> {
  const docs = await loadRuleDocs(brand);
  const system = `${identity(brand)}\n\n${docs}\n\n${schemaNote()}`;

  const user = tema
    ? `Busque pautas sobre: ${tema}\n\nGere o JSON agora, seguindo à risca o contrato. Responda só com o JSON.`
    : `${BRAND_DEFAULT_SWEEP[brand]}\n\nGere o JSON agora, seguindo à risca o contrato. Responda só com o JSON.`;

  return { system, user };
}
