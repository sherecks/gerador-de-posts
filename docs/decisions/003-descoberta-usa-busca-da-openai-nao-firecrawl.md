# 003 — Descoberta de pautas usa a busca da própria OpenAI, não firecrawl

**Status**: aceito
**Data**: 2026-09-17

## Contexto

O PRD (§4 RF01, §7) previa firecrawl (MCP) como motor de descoberta: um cron
diário varre fontes-semente e propõe pautas numa fila. Firecrawl não está
configurado neste checkout, e RNF01 já restringe a rede a "100% local, exceto
a API de imagem da OpenAI".

O pedido era simples: pesquisar notícias com IA, a partir do que já está
rodando (`/gerar`, decisão 002).

## Decisão

`POST /api/pesquisar` usa a Responses API da OpenAI com a ferramenta
`web_search_preview` (`src/lib/discovery.ts` monta o prompt, a mesma chave de
`OPENAI_API_KEY` já configurada faz a busca). Testado ao vivo antes de
integrar: a chamada devolve notícias reais, com URL e data verificáveis via
`url_citation` nas anotações da resposta.

Por que não firecrawl agora: exigiria uma segunda chave/serviço externo só
para isso, quando a mesma chave que já existe resolve. RNF01 fica mais
estrito, não mais frouxo, um único serviço de rede em vez de dois. Fica
registrado como troca deliberada do PRD, não como desvio silencioso.

## O que isso é, e o que não é

- **Não persiste.** Não existe fila de pautas (Nova → Aprovada → Rejeitada,
  RF05) nem dedupe por URL (RF02): cada busca é uma chamada nova, os
  resultados vivem só no navegador. O operador escolhe uma candidata em
  `/pesquisar` e ela vai direto para `/gerar` via query string
  (`fonteUrl`, `fonteTitulo`, `fontePublisher`, `fonteData`, `resumo`
  pré-preenchidos) — nunca grava nada antes de o operador decidir gerar.
- **Continua propose-only.** O modelo busca e descreve; a fonte listada em
  cada candidata é o que o operador confere antes de aprovar, exatamente
  como o RNF04 pede. Nada aqui é tratado como fato até alguém olhar.
- **Sem cron.** A busca é sob demanda (o operador clica), não diária. O
  campo "tema" é opcional; vazio, a busca varre as fontes-semente de
  `EDITORIAL-REFERENCE.md` §4 (o próprio doc, lido do disco, nunca uma cópia
  paralela que possa divergir dele).

## Risco aceito

`web_search_preview` é uma ferramenta em preview da OpenAI; o formato de
resposta pode mudar. `src/app/api/pesquisar/route.ts` valida a saída contra
`discoveryResultSchema` (Zod) e devolve erro explícito se o modelo não
responder no contrato, em vez de servir um JSON quebrado — mesmo padrão de
`/api/gerar`.

## O que ainda falta (fora desta rodada)

- Fila de pautas persistida, dedupe por URL, cron diário (RF01–RF07) — segue
  em aberto, junto com o resto listado em docs/decisions/002.
- Reavaliar firecrawl se `web_search_preview` sair do preview em condição
  pior, ou se a Karaguá precisar de fontes que a busca da OpenAI não alcança
  bem (paywalls, sites que bloqueiam indexação).
