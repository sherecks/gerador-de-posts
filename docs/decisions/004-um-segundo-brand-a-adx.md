# 004 — Um segundo brand: a ADX

**Status**: aceito
**Data**: 2026-09-29

## Contexto

O pedido: usar o design system da ADX (outra empresa do operador, SaaS que
cruza Meta Ads com CRM, `Desktop/ADX/design-system.html`) para gerar posts
dela também, na mesma ferramenta.

Antes de mexer em código, li o repo `Desktop/ADX/` (README, landing, os 4
posts já publicados em `public/post1-4.png`) em vez de adivinhar a voz pelas
classes CSS. Isso mudou o que seria construído: a ADX não comenta notícia
externa como a Karaguá — os 4 posts reais são reframe de métrica (CPL barato
esconde CPQL caro), sem citar fonte de terceiro nenhuma vez.

## Decisão

`brand` entra no contrato (`carouselSchema`), `z.enum(['karagua','adx'])`
com `.default('karagua')` — todo arquivo escrito antes deste campo existir
continua válido, vira Karaguá automaticamente. Confirmado com o operador
antes de codar:

1. **Mesma ferramenta, não uma cópia.** A ADX ganha tokens, voz e personas
   próprias; reaproveita o motor inteiro (schema, gate, gerador, figuras,
   pesquisa, export). Nada no repo de produção da ADX (o SaaS real, com
   tenants de verdade) é tocado.
2. **4:5, não o 1:1 que a ADX já usa.** Decisão deliberada do operador: os
   posts da ADX saem no mesmo formato dos da Karaguá, não no quadrado dos 4
   posts de referência. `SlideStage` continua com uma única proporção.

## O que muda por brand, e como

- **Tokens visuais** (`SlideStage.module.css`): `.brandAdx` aplicado como
  segunda classe junto da classe de superfície (`.brandAdx.shell`, nunca no
  lugar de `.shell`) — especificidade decide sozinha, sem `!important`. Um
  chord também na ADX (azul `#0057E7`), mesma regra flat-at-rest, tipografia
  diferente: Bebas Neue (display) + IBM Plex Mono (dado/sigla) + IBM Plex
  Sans (corpo), carregados via Google Fonts (`layout.tsx`), do mesmo jeito
  que o próprio `design-system.html` da ADX já fazia — não self-hosted como
  a Aileron da Karaguá.
- **Toda cor validada pela skill de dataviz**, não escolhida no olho: as 3
  rampas ordinais (shell/carbon/lime × azul) passaram no validador
  (`validate_palette.js --ordinal`) depois de re-escalonadas — a primeira
  tentativa de cada uma falhou o piso de contraste 2:1 contra a superfície
  específica (branco puro, preto puro, ou o próprio azul de marca) e foi
  reajustada até passar. A tinta de rótulo por faixa (`Camadas.tsx`) usa o
  `contrast()` exportado do validador contra `#ffffff`/`#0a0a0a`, não
  estimativa visual.
- **Destaque de headline muda de mecanismo, não só de cor.** A Karaguá marca
  com caixa preenchida (herda de `karagua-design-system`). Os posts reais da
  ADX (`post4.png`, "CPQL" em azul) marcam colorindo a palavra, sem caixa —
  a regra ADX reproduz o que a marca já faz, não importa o hábito da
  Karaguá. `.brandAdx .highlightBox` zera o preenchimento e usa
  `color: var(--fig-accent)`.
- **Marca de fechamento**: a Karaguá tem um glifo (folha). Os 4 posts da ADX
  nunca usam ícone, só o wordmark "ADX" em Bebas Neue com uma régua de
  acento embaixo — é isso que `BrandMark` desenha para `brand === 'adx'`,
  sem inventar um logo que não existe.
- **Voz editorial**: `docs/adx/COPY-ENGINE.md`, `COMMUNICATION-MANUAL.md`,
  `EDITORIAL-REFERENCE.md` — mesma estrutura dos documentos Karaguá,
  conteúdo derivado dos 4 posts reais + README + landing, nunca inventado.
  `RENDER-RULES.md` é o único doc compartilhado entre brands (mecânica de
  render, não voz). `docs/lib/docs.ts` lê `docs/<brand>/*.md`, e karagua
  continua na raiz por ser anterior a esta decisão.
- **Siglas**: a Karaguá exige expansão (`ACRONYMS.karagua`, público leigo
  incluso). A ADX não (`ACRONYMS.adx = []`): a audiência já vive em
  CPL/CPQL/CTR/ROAS, expandir soaria didático demais — ver
  `docs/adx/COMMUNICATION-MANUAL.md` §4.
- **Personas**: `gestor_trafego`, `dono_negocio`, `agencia_parceira`,
  somadas ao enum existente (nunca substituindo as da Karaguá).
  `PERSONAS_BY_BRAND` filtra o dropdown de `/gerar` por marca escolhida.
- **Fonte não é sempre notícia externa.** A Karaguá sempre comenta uma
  notícia com URL rastreável. A ADX às vezes defende uma tese de produto
  (nenhum dos 4 posts reais cita fonte de terceiro) — o campo continua
  obrigatório no schema (toda alegação ainda rastreia uma URL, nunca solta),
  mas para a ADX essa URL é tipicamente a própria landing/blog, e o campo de
  texto colado vira o argumento em si, não o resumo de um artigo de fora.

## O que não mudou

- O gate (`gate.ts`): travessão, budget, contagem, estrutura, superlativo —
  os mesmos checks, mesma taxonomia bloqueante/não-bloqueante. Só as siglas
  exigidas mudam por marca.
- O catálogo de figuras: os 8 componentes de `src/components/figures/` não
  ganharam nenhuma linha nova de lógica visual — eles já liam cor via
  `--fig-*`, então herdar os valores da ADX foi automático. A única exceção
  é `Camadas.tsx`, que precisa saber qual tinta de rótulo usar por marca+
  superfície (não dá pra derivar isso só de CSS).
- `/pesquisar`: mesmo mecanismo (`web_search_preview` da OpenAI, decisão
  003), só o texto de identidade e o sweep-padrão mudam por marca — para a
  ADX, a busca é "inspiração de ângulo", nunca "notícia para citar"
  (`docs/adx/EDITORIAL-REFERENCE.md`).

## Exemplo

`data/carousels/adx-cpl-nao-e-cpql.json` — escrito à mão (não gerado),
reaproveitando os números e as frases já publicadas em `post1.png`,
`post2.png` e `post4.png` da ADX, para provar o pipeline sem inventar dado.
Passa o gate sem bloqueante nem alerta.

## Dois bugs que só apareceram testando num navegador de verdade

`pnpm typecheck`/`build` não pegam nada disto — são erros de especificidade
CSS e de contraste, não de tipo. Achados rodando a exportação (seção
seguinte) com Playwright contra o Edge instalado e **olhando o PNG**, não só
o código:

1. **Eyebrow da ADX saía na cor da Karaguá.** `.shellEyebrow`/`.carbonEyebrow`
   etc. (`SlideStage.module.css`) tinham a cor de `--k-color-green-karagua-*`
   escrita direto, sem passar pela camada `--fig-*` — funcionava por acaso
   pra Karaguá (é a origem do token) e vazava oliva pra qualquer slide ADX
   com eyebrow. Fix: uma regra `.brandAdx .shellEyebrow, ...  { color:
   var(--fig-accent); }`, já que esse token é o único lugar que sabe a cor
   certa por marca+superfície.
2. **Destaque de texto sumia na superfície azul da ADX.** O tratamento
   "colore a palavra" (não caixa, ver acima) usa `--fig-accent`; na
   superfície `lime` (o azul de marca da ADX) `--fig-accent` é branco, a
   MESMA cor do resto do headline — "VENDA PAGA." renderizava idêntico ao
   resto da frase, destaque nenhum. Fix: só a superfície de acento cai de
   volta pro tratamento em caixa (branco/azul invertido), pelo mesmo motivo
   estrutural que a superfície lime da própria Karaguá já usa caixa em vez
   de cor.

Nenhum dos dois aparecia no exemplo hand-built original porque eu nunca
tinha *olhado* o PNG gerado, só confirmado que a página renderizava (200,
sem erro no HTML). Ficou registrado aqui porque é exatamente o tipo de erro
que só aparece testando a coisa de verdade, não lendo o código.

## Exportação (PNG/ZIP)

Pedido separado, mesma sessão: `src/lib/export.ts` + botões em
`CarouselViewer.tsx` ("Baixar este slide" / "Baixar carrossel (.zip)").
Usa `html-to-image` pra rasterizar o `.slide` já renderizado na tela — sem
clone escondido em largura fixa: como todo o CSS do slide já é `cqw`
(relativo à própria largura), só escalar o `pixelRatio` pra
`1080 / larguraAtual` reproduz o design em resolução de feed sem duplicar
render. Pro carrossel inteiro, percorre os slides via o próprio estado de
navegação do viewer (`setCurrent` + 2 frames de espera + aguardar
`<img>`s), captura cada um, e embrulha com `jszip` + `legenda.txt`.

Achado testando: sem `crossOrigin="anonymous"` no `<link>` da folha de
estilo do Google Fonts (só tinha no preconnect), `html-to-image` falhava ao
tentar ler `cssRules` pra embutir a fonte como base64 (`SecurityError`,
capturado internamente, não quebra a exportação, mas silenciosamente pula o
embed pretendido). Corrigido no `<link>` em `layout.tsx`.

## O que ainda falta (fora desta rodada)

- Biblioteca de fotos da ADX: não existe, e não deveria — os 4 posts reais
  são 100% tipografia (`docs/adx/COMMUNICATION-MANUAL.md` §8). Se isso mudar
  no futuro, replica o padrão de `src/lib/photos.ts`.
- Um filtro de marca na home (hoje só a etiqueta por card).
- Export em PDF (PRD §4 falava PNG e/ou PDF; só PNG/ZIP saiu desta rodada).
