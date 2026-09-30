# web — Gerador de Posts

Painel local, multi-marca, que lê as gerações em disco, gera carrossel novo
via OpenAI e pesquisa pauta na web — tudo pelo gate de qualidade de cada
marca. Hoje tem duas: **Karaguá Ecotech** (carbono azul em manguezal) e
**ADX** (SaaS que cruza Meta Ads com CRM). O nome do projeto era "Karaguá
Social"; virou "Gerador de Posts" quando a ADX entrou — ver
[decisão 004](../docs/decisions/004-um-segundo-brand-a-adx.md).

Ainda sem: editor campo a campo, fila de aprovação persistida e export em
PDF (PRD §4). Export em PNG/ZIP existe — ver seção própria abaixo.

## Rodar

```bash
pnpm install
pnpm dev          # http://localhost:3210
pnpm typecheck    # gate: tsc --noEmit
pnpm build        # gate: next build
```

Abra por `localhost` **ou** `127.0.0.1`: `allowedDevOrigins` no `next.config.ts`
cobre as duas grafias. Sem isso o dev server bloqueia `/_next/hmr` para a grafia
que ele não considera sua, a página renderiza e nada fica clicável.

## Páginas

| Rota | O que faz |
|---|---|
| `/` | Lista as gerações em disco, com etiqueta de marca por card |
| `/gerar` | Gera um carrossel novo via OpenAI (formulário abaixo) |
| `/pesquisar` | Busca pauta/ângulo real na web via OpenAI |
| `/carrossel/[id]` | Visualizador de um carrossel: slides, legenda, gate, baixar PNG/ZIP |
| `/figuras` | Catálogo dos 10 tipos de figura, com exemplo em cada marca |

## Marcas (`brand`)

Todo carrossel declara `brand: "karagua" | "adx"` (`src/lib/carousel.ts`,
default `"karagua"` para arquivo escrito antes desse campo existir). Isso
decide três coisas, sempre nesses três lugares:

- **Tokens visuais** — `SlideStage.module.css`, classe `.brandAdx` aplicada
  junto da classe de superfície (nunca no lugar dela). Cada cor foi validada
  pela skill de dataviz (`validate_palette.js`), não escolhida no olho — ver
  decisão 004 pros números. A Karaguá usa Aileron/JetBrains Mono e destaque
  em caixa preenchida; a ADX usa Bebas Neue/IBM Plex (Google Fonts, `<link>`
  em `layout.tsx`) e destaque colorindo a palavra, sem caixa — reproduz o
  que os posts publicados da ADX já fazem, não um hábito importado da Karaguá.
- **Voz editorial** — `docs/COPY-ENGINE.md` + `COMMUNICATION-MANUAL.md` +
  `EDITORIAL-REFERENCE.md` pra Karaguá (raiz de `docs/`, anteriores à
  decisão 004); os mesmos três nomes dentro de `docs/adx/` pra ADX.
  `RENDER-RULES.md` é o único compartilhado (mecânica de render, não voz).
  `src/lib/docs.ts` lê o conjunto certo por marca a cada chamada, nunca uma
  cópia congelada.
- **Personas e siglas** — `PERSONAS_BY_BRAND` filtra o dropdown de `/gerar`
  (a Karaguá tem 4, a ADX tem 3, nunca misturadas). `ACRONYMS` em
  `src/lib/gate.ts` também é por marca: a Karaguá exige expandir sigla
  (público leigo incluso), a ADX não (audiência já fluente em CPL/CPQL/ROAS).

O catálogo de figuras (`src/components/figures/`) **não muda por marca**: os
8 componentes já liam cor via `--fig-*`, herdar os valores da ADX foi
automático. A exceção é `Camadas.tsx`, que decide tinta de rótulo por
marca+superfície (não dá pra derivar isso só do CSS).

## Gerar um carrossel (`/gerar`)

Precisa de uma chave da OpenAI:

```bash
cp .env.local.example .env.local
# edite .env.local e cole OPENAI_API_KEY=sk-...
```

`OPENAI_TEXT_MODEL` é opcional (padrão `gpt-4o` só como ponto de partida;
confirme o modelo vigente na sua conta antes de trocar). A chave só é lida em
`src/lib/openai.ts`, no servidor; nunca chega ao client (RNF05).

No formulário: marca, URL de referência (vira a citação persistida, sempre
obrigatória — pra Karaguá é a notícia comentada; pra ADX costuma ser a
própria landing/blog, já que o ângulo nasce de dado de produto, não de
notícia de terceiro), texto colado como reforço ou como argumento em si,
ângulo da pauta, tipo de pauta (framework), persona (filtrada pela marca) e
profundidade. `src/app/api/gerar/route.ts` busca o texto da URL, monta o
prompt brand-aware (`src/lib/prompt.ts`) com os docs certos + a biblioteca de
fotos (só Karaguá tem) + o catálogo de figuras, chama a OpenAI, valida a
resposta contra `carouselDraftSchema` (retry único se falhar), grava o
arquivo e abre o carrossel gerado.

O modelo nunca decide `id`, `brand`, `status`, `createdAt`, `pauta`,
`framework`, `persona`, `depth` nem `notes`: isso vem do formulário/servidor.
O modelo também nunca inventa uma fonte: o prompt manda reproduzir
exatamente a URL que o operador informou em todo `source`.

## Pesquisar pautas (`/pesquisar`)

Busca real na web com a própria OpenAI (Responses API, ferramenta
`web_search_preview`), sem precisar de firecrawl nem de uma segunda chave —
ver [decisão 003](../docs/decisions/003-descoberta-usa-busca-da-openai-nao-firecrawl.md).
Campo "tema" opcional: vazio, varre as fontes-semente da marca escolhida
(`EDITORIAL-REFERENCE.md` §4 de cada uma — Verra/ClimaInfo/SBCE pra Karaguá,
Meta for Business/HubSpot Blog pra ADX). Pra ADX a busca é inspiração de
ângulo, não notícia pra citar como fonte principal — o post final raramente
cita o que a busca achou (`docs/adx/EDITORIAL-REFERENCE.md`). Cada candidata
traz título, URL, veículo, data, resumo e por que interessa — **nada é salvo
em disco**: é uma proposta para o operador conferir, igual ao propose-only
do PRD (RF01–RF03), só sem fila persistida ainda. Um clique em "usar esta
pauta" leva para `/gerar` com a marca, a fonte e o ângulo pré-preenchidos.

## Baixar um post (`/carrossel/[id]`)

Dois botões na barra abaixo do slide: **baixar este slide** (um PNG) e
**baixar carrossel (.zip)** (todos os PNGs + `legenda.txt` com a legenda e
as hashtags). `src/lib/export.ts` faz a captura com `html-to-image` em cima
do `.slide` já renderizado na tela — não existe um clone escondido em
1080px: como todo o CSS do slide é `cqw` (relativo à própria largura), só
escalar o `pixelRatio` para `1080 / larguraAtual` já reproduz o design em
resolução de feed. Pro carrossel inteiro, o botão percorre os slides pelo
próprio estado de navegação do viewer (troca, espera 2 frames + as `<img>`
carregarem, captura, próximo), depois monta o `.zip` com `jszip` — não
precisa da rota de servidor nenhuma, tudo roda no navegador com o que já
está na tela.

Sem PDF ainda (PRD §4 previa PNG e/ou PDF); só PNG/ZIP.

## De onde vêm os dados

Um JSON por carrossel em `../data/carousels/*.json`, no contrato de
`src/lib/carousel.ts` (Zod). Arquivo fora do contrato aparece na home como erro
nomeado, nunca é ignorado em silêncio. `KARAGUA_DATA_DIR` aponta para outra pasta.

A imagem de um slide pode vir de dois lugares, os dois servidos pela mesma
rota `/api/asset?path=...` (qualquer arquivo **dentro do repo**, recusa
caminho que escape dele): `../output/` é onde a fábrica renderiza por
geração (hoje vazio neste checkout); `web/public/images/` é a biblioteca de
fotos curada da Karaguá — ver seção seguinte. A ADX não usa foto (seus posts
publicados são 100% tipografia + dado).

## Modelos de slide e figuras

`slide.layout` escolhe o modelo visual: `capa-onda` (foto + faixa de cor com
borda em onda — só Karaguá, sem foto ele vira `faixa` sozinho), `faixa`
(texto full-bleed, o padrão), `numero` (dado em destaque), `figura` (um
desenho do catálogo abaixo) ou `fechamento` (logo/wordmark + CTA). Sem
`layout` explícito, `src/lib/layout.ts` infere pelo `role`/conteúdo, então
JSON escrito antes desse campo existir continua renderizando.
`slide.highlight` marca até 2 trechos do `headline` (≤3 palavras cada, o
schema recusa mais — evita a caixa cobrindo o título inteiro).

`slide.figure` é um catálogo fechado de 10 tipos, em
`src/components/figures/`: `comparacao` (com `destaque` pra marcar qual
barra é o ponto), `analogia` (com `iconBase`/`labelBase` pra desenhar a
equivalência "1 disto = N daquilo", não só um pictograma solto), `fluxo`,
`ciclo`, `camadas`, `linha-do-tempo`, `balanca`, `mapa`, `serie` (linha com o
eixo começando em zero, todo ponto rotulado, `destaque` em no máximo um) e `anel`
(uma fatia de um todo, 0 a 100). O gerador só
preenche dados; o SVG de cada tipo já existe, desenhado uma vez nos tokens
da marca — nenhuma geração escreve SVG livre. Ver todos rodando em
`/figuras`. `comparacao`, `analogia`, `serie` e `anel` carregam número com
fonte opcional; o gate cobra isso (`fonte-figura`, bloqueante), do mesmo jeito que
já cobrava de `datum`. Dois checks novos cobrem o uso: `figura-consistente`
(bloqueante: o número escrito no anel tem que ser o mesmo que o desenho mostra) e
`figura-uso` (aviso: no máximo 2 slides com figura, um destaque por série). O
prompt do gerador diz qual figura serve a qual dado (mudança no tempo → `serie`,
fração de um todo → `anel`, número solto → layout `numero`).

## Biblioteca de fotos (Karaguá)

`src/lib/photos.ts` cataloga as fotos reais em `public/images/` (mutirão SOS
Manguezal + manguezal da Babitonga), cada uma com `alt` escrito à mão (nunca
gerado) e tags. O prompt do gerador oferece essa lista ao modelo e exige que
`path`/`alt` sejam copiados ao pé da letra; `POST /api/gerar` reconfere isso
antes de salvar (`sanitizeImages`), e descarta silenciosamente qualquer
imagem cujo `path` não bata exatamente com a biblioteca, em vez de salvar uma
referência quebrada. Novas fotos: adicionar o arquivo em `public/images/` e
uma entrada em `photos.ts` — olhando a foto antes de escrever o `alt`, não
adivinhando pelo nome do arquivo. Não existe biblioteca equivalente para a
ADX (seus posts não usam foto); se isso mudar, replica o padrão.

**As fotos não estão no git** (são originais de câmera, 14–18 MB cada). Num
clone novo, copie os arquivos `DSC_*.jpg` listados em `src/lib/photos.ts` para
`web/public/images/`. Sem eles o app roda, mas as capas, os fechamentos e os
slides com foto aparecem sem imagem.

Além do que o modelo escolhe, `src/lib/carousel-photos.ts` completa as fotos
antes de salvar: capa e fechamento sempre com foto, slides só de texto com a
foto na parte de baixo, até 6 por post, escolhidas pelas palavras do slide e
sem repetir; foto de lixo só entra em slide que fala de poluição.

## O que o gate julga sozinho

Determinístico: travessão, número sem fonte (em texto e em figura, os dois
bloqueantes), estrutura de slides, budget de palavras, contagem por
profundidade, superlativo, sigla sem expansão (lista por marca, ver acima).

Os itens que exigem leitura (hook, loop, uma ideia por slide, persona,
promessa = payoff) aparecem como `[ ]` para revisão humana. O visualizador não
finge veredito que não consegue sustentar.

## Design system

`src/design-system/` é uma cópia de `~/Projetos/karagua-design-system`
(tokens v3.0, Aileron em `public/fonts`) — a UI da própria ferramenta
(nav, formulários, botões) usa esses tokens pras duas marcas; é chrome do
painel, não identidade de post (PRD §0). Mudança de marca nasce lá e é
recopiada aqui, nunca editada só deste lado.

Os slides não leem esses tokens direto: `SlideStage.module.css` define uma
camada de tokens semânticos (`--slide-font-display/mono/body`, `--fig-*`)
que cada marca preenche com os próprios valores — é essa camada que faz o
mesmo componente de slide/figura render igual em duas marcas sem duplicar
JSX. Ver "Marcas" acima e a decisão 004 pros valores exatos e as validações
de contraste.
