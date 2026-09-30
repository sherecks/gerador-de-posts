import {
  DEPTH_RANGE,
  PERSONA_LABEL,
  ICON_MEANING,
  iconNameSchema,
  layoutSchema,
  silhouetteSchema,
  slideRoleSchema,
  surfaceSchema,
  waveVariantSchema,
  type Brand,
  type Depth,
  type Framework,
  type Persona,
  type Source,
} from './carousel';
import { loadRuleDocs } from './docs';
import { ACRONYMS, SUPERLATIVES } from './gate';
import { figureHints } from './figure-hints';
import { LUGARES, LUGAR_IDS } from './mapa-babitonga';
import { PHOTO_LIBRARY } from './photos';

export type GenerateInput = {
  brand: Brand;
  persona: Persona;
  depth: Depth;
  framework: Framework;
  resumo: string;
  source: Source;
  articleText: string;
};

function list(options: readonly string[]): string {
  return options.map((option) => `"${option}"`).join(' | ');
}

const BRAND_IDENTITY: Record<Brand, string> = {
  karagua: `Você escreve carrosséis de Instagram para a Karaguá Ecotech (carbono azul em manguezal, Baía da
Babitonga). A pauta comenta uma notícia real, sempre com fonte rastreável.`,
  adx: `Você escreve carrosséis de Instagram para a ADX (SaaS que cruza investimento em Meta Ads com venda real
no CRM do cliente, criativo por criativo). Não é comentário de notícia: é reframe de métrica — pega uma crença
comum ("CPL baixo é bom", "mais lead é melhor") e mostra o número que ela esconde. Todo post tem um contraste
(antes/depois, isto/aquilo, dois números lado a lado); um fato solto sem esse par não é um post ADX.`,
};

function identity(brand: Brand): string {
  const acronyms = ACRONYMS[brand];
  const siglaClause =
    acronyms.length > 0
      ? ` Estas siglas expandem por extenso na 1ª ocorrência, mesmo que o texto-fonte já as use sem expandir: ${acronyms.join(', ')}.`
      : ' Este brand não exige expansão de sigla: a audiência já é fluente no jargão do nicho (ver COMMUNICATION-MANUAL §4).';

  return `${BRAND_IDENTITY[brand]}
Objetivo: máxima retenção (swipe-through) sem trair a marca. Os documentos abaixo (COPY-ENGINE, COMMUNICATION-MANUAL,
EDITORIAL-REFERENCE, RENDER-RULES) são o contrato: siga à risca, sobretudo as regras invioláveis.

A única base factual permitida é o TEXTO-FONTE fornecido no fim deste prompt. Nunca invente número, data, nome ou
citação que não esteja nele. Nunca invente uma URL de fonte: todo "source" do JSON de saída (em "datum" e nas
figuras) deve reproduzir exatamente a fonte única fornecida na encomenda.

## Quatro erros que gerações anteriores cometeram — não repita

Estes quatro já quebraram carrosséis reais (gate bloqueou ou o resultado ficou feio). Confira cada um antes de
responder:

1. **Todo slide planeje o "role" ANTES de escrever, e o último elemento do array "slides" é SEMPRE
   "cta" — sem exceção, mesmo em profundidade "rapida" com só 4 slides.** A ordem mínima é capa → hook-2 → …
   → payoff → cta. Se o orçamento de slides estiver apertado, corte um "desenvolvimento", nunca o "cta": um
   carrossel que termina em "payoff" fica sem chamada para ação e o gate rejeita.
2. **Se o "headline" (ou o "body") de um slide cita um número, aquele MESMO slide precisa ter "datum"**
   com esse valor e a fonte. Um número "solto" no texto, sem "datum" no mesmo slide, é bloqueante — inclusive
   na capa.
3. **"highlight" é um acento, não um segundo título.** No máximo 2 trechos, cada um com no máximo 3 palavras
   (o schema recusa mais que isso). Nunca marque a maior parte do headline: se sobra só uma preposição fora da
   caixa, a caixa virou um bloco sólido cobrindo a frase inteira, e isso é feio, não é destaque.
4. **Nunca use estas palavras sem prova numérica adjacente**: ${SUPERLATIVES.join(', ')}.${siglaClause} E
   confira que a contagem final de "slides" cai dentro da janela pedida (abaixo) — não acima dela "porque o
   assunto rendia mais".`;
}

/**
 * The map is the real Baía da Babitonga (mapa-babitonga.ts): places are named from a fixed list and positioned
 * by their coordinates, so the model never guesses x/y. ADX has no territory to show.
 */
const MAPA_NOTE: Record<Brand, string> = {
  karagua: `{ "type":"mapa", "pontos": [{ "lugar": ${list(LUGAR_IDS)}, "nota"?:string (até 32 caracteres), "destaque"?:boolean }] (1 a 4), "legenda"?:string }
  É o mapa REAL da Baía da Babitonga (o mapa padrão do OpenStreetMap). Você não posiciona nada: escolhe o "lugar" da lista e o
  ponto cai na coordenada verdadeira, com o nome oficial. "nota" é uma linha curta sob o nome ("piloto, 380 ha"), com
  fonte se tiver número. A baía e o oceano já aparecem escritos sempre; não os repita como ponto. Lugares:
${LUGAR_IDS.map((id) => `  - ${id}: ${LUGARES[id].nome}`).join('\n')}
  Um lugar que não está na lista (o laboratório, uma comunidade) não vai no mapa: diga no texto do slide.`,
  adx: 'não use (o único mapa é o da Baía da Babitonga, território da Karaguá).',
};

const PHOTO_SECTION: Record<Brand, string> = {
  karagua: `## Biblioteca de fotos

Fotos reais do manguezal da Karaguá e de um mutirão de limpeza. TODAS mostram o mangue, então qualquer uma serve
para qualquer post: use foto sem medo. Onde usar:
- Capa (slide 1): SEMPRE com foto, layout "capa-onda".
- Fechamento (último slide, role "cta"): SEMPRE com foto, layout "fechamento" + "image". O mangue fica em cima e a
  marca e o CTA ficam na faixa de cor abaixo.
- Slides de texto do meio (sem figura, sem número): layout "faixa" + "image" com surface "shell", "carbon" ou "lime"
  põe a foto na parte de baixo do slide, sob uma onda, e o texto fica em cima, na cor da superfície. Use nos
  slides de texto curtos: eles ficam vazios sem ela.
- Para um slide de virada ou de emoção: layout "faixa" com surface "imagem" + "image" (a foto ocupa o slide
  inteiro e o texto pequeno ganha uma faixa sólida por trás). No máximo 1 por carrossel.
No máximo 6 fotos por carrossel, sem repetir. As fotos com tag "poluicao" (lixo nas raízes) só entram em slide
que fala de lixo ou poluição: num post sobre financiamento ou lei, elas contam outra história. Se você não escolher foto para a capa ou o fechamento, o sistema escolhe
uma pelo texto do slide, mas a sua escolha pelo conteúdo é melhor. Para usar uma, copie "path" e "alt"
**exatamente** como abaixo, sem alterar nem um caractere: um path que não está nesta lista é descartado antes
de o carrossel ser salvo. Escolha pelas tags que combinam com o slide (lixo → poluicao, muda → plantio etc.).

${PHOTO_LIBRARY.map((photo) => `- ${photo.path} — tags: ${photo.tags.join(', ')} — alt: "${photo.alt}"`).join('\n')}`,
  adx: `## Fotos

Este brand não usa foto (COMMUNICATION-MANUAL §8: os posts publicados são 100% tipografia + dado). Não preencha
"image" em nenhum slide e não use o layout "capa-onda" (ele depende de foto; sem ela, o visualizador o troca por
"faixa" de qualquer forma). A capa é sempre um bloco de cor sólida com a frase de virada.`,
};

function schemaNote(brand: Brand, depth: Depth): string {
  const [min, max] = DEPTH_RANGE[depth];
  return `## Formato de saída (contrato JSON)

Responda **apenas** com um objeto JSON válido: sem bloco de código markdown, sem texto antes ou depois. Formato:

{
  "title": string,                 // título curto do post (não é o headline da capa)
  "slides": Slide[],                // ${min}-${max} slides para profundidade "${depth}"
  "caption": {
    "text": string,                 // linhas 1-2 = preview/hook da legenda; corpo cita a fonte; fecha com CTA + pergunta
    "hashtags": string[]            // cada item começa com "#", sem espaço, PT-BR do nicho
  }
}

Slide = {
  "role": ${list(slideRoleSchema.options)},
  "surface": ${list(surfaceSchema.options)},
  "layout"?: ${list(layoutSchema.options)},        // opcional; sem isso o visualizador infere pelo role/conteúdo
                                      // "capa-onda" só funciona com "image" preenchido (ver seção de fotos
                                      // abaixo); sem foto ele vira "faixa" sozinho, então só vale a pena
                                      // declarar "capa-onda" quando você também preencher "image".
  "wave"?: ${list(waveVariantSchema.options)},       // só importa em "capa-onda"
  "eyebrow"?: string,                // até 3 palavras
  "headline": string,                // até 10 palavras
  "highlight"?: string[],            // no máx. 2 trechos EXATOS (substring) do headline, cada um ≤3 palavras
                                      // (ver regra 3 acima — schema recusa trecho maior)
  "body"?: string,                   // até 26 palavras
  "cliffhanger"?: string,            // micro-gancho de rodapé; não usar no último slide
  "datum"?: { "value": string, "label": string, "source": Source },  // obrigatório se headline/body citam número (regra 2)
  "silhouette"?: ${list(silhouetteSchema.options)},
  "image"?: { "path": string, "alt": string },  // ver seção de fotos abaixo — path/alt copiados ao pé da letra
  "figure"?: Figure                  // ver catálogo abaixo
}

Source = { "title": string, "url": string, "publisher"?: string, "date"?: "AAAA-MM-DD" }

${PHOTO_SECTION[brand]}

## Catálogo de figuras

Escolha no máximo 1-2 slides com figura por carrossel, só quando um desenho explica melhor que texto (comparação,
série no tempo, percentual, analogia, processo, linha do tempo, corte em camadas, dois lados, mapa da Babitonga). O componente de cada tipo já
existe pronto na identidade da marca: você só preenche os dados, nunca escreve SVG.

- comparacao: { "type":"comparacao", "itens": [{ "label":string, "valor":number, "valorLabel":string, "source"?:Source, "destaque"?:boolean }] (2 a 4 itens), "unidade"?:string }
  "destaque" marca QUAL item é o ponto do slide (a barra fica na cor da marca; as outras recuam). Marque no
  máximo 1 item; sem nenhum "destaque", todas as barras saem na cor da marca (uma série, uma cor).
- analogia: { "type":"analogia", "icon": ${list(iconNameSchema.options)}, "quantidade": number (1-60), "afirmacao": string, "dado": { "value":string, "label":string, "source"?:Source }, "iconBase"?: ${list(iconNameSchema.options)}, "labelBase"?: string, "labelUnidade"?: string }
  Uma analogia só funciona como equivalência ("1 disto = N daquilo"). Prefira sempre preencher "iconBase" +
  "labelBase" (o lado único) junto com "labelUnidade" (o que os N ícones repetidos representam). Sem
  "iconBase" a figura vira um pictograma solto, menos claro — só omita quando não houver um "1 disto" natural.
- fluxo: { "type":"fluxo", "etapas": [{ "label":string, "detalhe"?:string }] (3 a 6 etapas) }
- ciclo: { "type":"ciclo", "etapas": [{ "label":string, "icon"?: ${list(iconNameSchema.options)} }] (3 a 6 etapas) }
- camadas: { "type":"camadas", "camadas": [{ "label":string, "detalhe"?:string }] (2 a 5 camadas) }
- linha-do-tempo: { "type":"linha-do-tempo", "marcos": [{ "data":string, "label":string }] (2 a 6 marcos) }
- balanca: { "type":"balanca", "esquerda": { "label":string, "itens":string[] (1-4) }, "direita": { "label":string, "itens":string[] (1-4) } }
  Para a ADX este é o formato mais usado: "esquerda" = o que parecia (a métrica de vaidade), "direita" = o que
  é de verdade (a métrica que decide budget) — o mesmo par que já aparece nos posts publicados.
- mapa: ${MAPA_NOTE[brand]}
- serie: { "type":"serie", "pontos": [{ "rotulo":string, "valor":number, "valorLabel":string, "destaque"?:boolean }] (3 a 8, em ordem), "unidade"?:string, "source"?:Source }
  Uma linha no tempo, com o eixo começando em zero (não exagera a variação). "rotulo" é o ponto no eixo ("2021",
  "jan/26"); "valorLabel" é o número escrito ("US$ 8"). "destaque" marca o ponto do slide (no máximo 1). A "source"
  é uma só, para a série inteira.
- anel: { "type":"anel", "valor":number (0-100), "valorLabel":string, "rotulo":string, "contexto"?:string, "source"?:Source }
  Uma fatia de um todo. "valorLabel" TEM que dizer o mesmo número de "valor" ("68%" para valor 68; use vírgula em
  decimal: "68,5%"): o desenho vem de "valor" e o gate bloqueia se os dois divergirem.

### Ícones (para "analogia" e "ciclo")

Escolha o ícone pelo SIGNIFICADO, não pelo clima do assunto. Uma analogia "1 disto = N daquilo" só funciona quando o
ícone É a coisa. Se nenhum ícone for a coisa, não force um: omita "iconBase" (vira pictograma) ou use outra figura.

${(iconNameSchema.options as readonly string[]).map((name) => `- ${name}: ${ICON_MEANING[name as keyof typeof ICON_MEANING]}`).join('\n')}

### Qual figura para qual dado

- Um número que MUDA ao longo do tempo (preço por ano, leads por mês) → serie. Nunca comparacao com anos como itens.
- Uma fração de um todo (68% dos leads, 1 em cada 3) → anel. Um número solto que não é fração → layout "numero" (datum), não figura.
- Comparar 2 a 4 grandezas diferentes no mesmo momento → comparacao.
- Datas de marcos sem número (a lei saiu em X, entra em vigor em Y) → linha-do-tempo. Se há número em cada data, é serie.
- Etapas de um processo → fluxo (linear) ou ciclo (se volta ao início). Dois lados de uma decisão → balanca.
- O texto-fonte traz uma fração clara ("mais de 99% dos créditos são empréstimo", "1 em cada 3") ou uma sequência de
  3 ou mais valores no tempo? Então o slide de desenvolvimento que carrega esse número DEVE ser uma figura (anel ou
  serie), com layout "figura", em vez de o número aparecer só no texto: o desenho é o que faz o leitor ver o dado. Faça
  isso em 1 slide (no máximo 2 figuras no carrossel).
  Exemplos (formato, não conteúdo): "anel" com valor 99, valorLabel "99%", rotulo "dos créditos previstos são
  empréstimo"; "serie" com pontos 2025 "R$ 14 bi", 2026 "R$ 27,5 bi" e o último em destaque.
- Só use figura quando o texto-fonte TRAZ os números que ela desenha. Sem número na fonte, não invente série nem anel:
  use fluxo, camadas ou balanca, ou nenhuma figura.

Regra de fonte também vale dentro da figura: todo "valor"/"dado" numérico de "comparacao" e "analogia", e a
"source" de "serie" e "anel", carrega a mesma fonte única da encomenda sempre que o número vier do texto-fonte, ou o gate bloqueia a aprovação.`;
}

export async function buildPrompt(input: GenerateInput): Promise<{ system: string; user: string }> {
  const docs = await loadRuleDocs(input.brand);

  const system = `${identity(input.brand)}\n\n${docs}\n\n${schemaNote(input.brand, input.depth)}`;

  const user = `## Encomenda

- Persona primário: ${PERSONA_LABEL[input.persona]} (${input.persona})
- Profundidade: ${input.depth}
- Framework narrativo (COPY-ENGINE B.1): ${input.framework}
- Ângulo já decidido pelo operador: ${input.resumo}
- Fonte única permitida: ${JSON.stringify(input.source)}

## Texto-fonte (única base factual; não use nada que não esteja aqui)

"""
${input.articleText}
"""

${figureHints(input.articleText)}
Gere o carrossel agora, seguindo à risca o contrato JSON. Responda só com o JSON.`;

  return { system, user };
}
