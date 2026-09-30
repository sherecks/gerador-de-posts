━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRD — Gerador de Posts (fábrica local de carrosséis de Instagram)
Versão: 1.1 · Status: DRAFT · Data: 2026-07-24
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> Nota (2026-09-29): este PRD nasceu com "Karaguá Social" como nome do
> projeto, quando a ferramenta só existia para a Karaguá Ecotech. O nome
> mudou para "Gerador de Posts" com a entrada de um segundo brand, a ADX
> (docs/decisions/004). O escopo abaixo descreve o produto no momento em
> que foi escrito; ainda é específico da Karaguá (personas, discovery,
> imagem), não reescrito para refletir o multi-brand.

## 0. FONTES DE VERDADE (não confundir)

- **Conteúdo / voz / fatos** ← `karagua-context/` (brandbook textual, business plan, base legal, FAQ). Verificado: brandbook vigente, alinhado ao site, não desatualizado.
- **Identidade visual dos posts** ← `karagua-website/` (`src/style.css` DS v3.0 + `Spec/01-design-system-blocado.md` + `Spec/03-copy.md`). O brandbook textual NÃO cobre o eixo visual; a verdade visual vive no site.
- **UI da ferramenta** (fila, editor, dashboard) ← design-system de `plataforma-product-ops` (`src/design-system/` + `src/components/ui/`), copiado para dentro do repo.
- **Restrição de projeto**: 100% local. Nada de Neon/Vercel/STLFLIX ou qualquer serviço externo, exceto a API de imagem da OpenAI (único serviço de rede permitido, chave própria).

## 1. PROBLEMA

A Karaguá Ecotech precisa manter presença consistente no Instagram publicando conteúdo de autoridade sobre atualidades do nicho de carbono azul — notícias, leis e movimentos de mercado que impactam créditos de carbono em manguezais. Hoje isso é manual, esporádico e sem padronização de marca. Produzir carrossel de qualidade (pauta relevante + copy com retenção + arte fiel ao brandbook + fonte rastreável de cada dado) a cada notícia é lento e não escala, e o risco de sair da linha visual/verbal da marca é alto.

## 2. OBJETIVO

Uma plataforma web local que descobre pautas de atualidades do nicho, roda discovery antes de qualquer produção, enfileira para aprovação e gera carrosséis padronizados na identidade Karaguá — editáveis e exportáveis para postagem manual.

Métrica-alvo: tempo de "notícia relevante → carrossel pronto para postar".
Meta: de horas de trabalho manual para < 15 min de curadoria/edição por post.
Prazo: MVP em ~3–4 semanas de desenvolvimento.
Anti-critério: nenhum post pode violar o brandbook visual (Aileron/JetBrains Mono, verde `#c7d926`, superfícies bege, sem cards arredondados/sombras em repouso) nem publicar dado sem fonte rastreável.

## 3. PÚBLICO-ALVO

Primário — **Operador de conteúdo da Karaguá (o Lucas)**: curadoria de pautas, revisão de copy, ajuste fino de slides, aprovação e export. Trabalha localmente na própria máquina (M1). Um único operador na v1.

Secundário — **Audiência do Instagram da Karaguá** (destinatário final do output): compradores B2B ESG, municípios (B2G), investidores, comunidade. Consome carrosséis de autoridade sobre carbono azul, leis e mercado.

## 4. ESCOPO

### MVP (versão 1)

- **Discovery automatizado de pautas**: job local (cron **diário**, cadência de **1 post/dia**) que usa **firecrawl** para buscar/varrer atualidades do nicho (mercado de carbono, Lei 15.042/2024, ProManguezal, Verra, BNDES Fundo Clima, preço do crédito voluntário, ESG) e propõe pautas candidatas na fila.
- **Fila de pautas (aprovação nº 1)**: cada pauta candidata entra como card com fonte rastreável (URL), ângulo proposto, e sinal de relevância. Operador aprova/rejeita antes de qualquer produção. Propose-only: nada avança sem aprovação.
- **Discovery de ângulo** (metodologia `escopo`/`discovery`): pauta aprovada gera hipótese de narrativa do carrossel (gancho, promessa, sequência de slides) antes de escrever a copy.
- **Geração de carrossel**: copy PT-BR com hooks de retenção slide-a-slide (open loop na capa, cliffhanger no rodapé de cada slide, CTA final), legenda + hashtags. Aplica regras de copy do site (sem travessão, siglas expandem na 1ª ocorrência, cada número tem fonte, sem superlativo sem prova).
- **Fila de posts (aprovação nº 2)**: carrossel gerado entra na fila de aprovação de post.
- **Imagem image-first com fallback generativo**: o sistema **primeiro busca imagens reais de qualidade** aderentes ao contexto da pauta (via firecrawl/busca). Quando a melhor imagem tem barreira de direitos autorais, gera via **OpenAI `gpt-image-2`** uma imagem original *inspirada* nela (mesma composição/tema, sem copiar), respeitando as restrições visuais da marca (sem estética AI genérica). Foto real também pode entrar por upload manual.
- **Editor híbrido**: campos estruturados por slide (eyebrow, headline, corpo, dado+fonte) + ajustes pontuais (reordenar slides, trocar imagem, escolher entre **vários templates** de carrossel). Preview ao vivo renderizado com a identidade Karaguá.
- **Render + export**: renderiza os slides (satori/resvg, in-process) em PNG 1080×1350 (4:5) e/ou PDF do carrossel para download. Legenda copiável.
- **Persistência local**: SQLite (arquivo no repo) guarda pautas, drafts, posts, estados de fila.
- **UI da ferramenta**: dashboard + duas filas (pautas, posts) + editor, construídos com o DS product-ops.

### Fora do escopo por ora (fase 2+)

- Publicação automática no Instagram (Graph API / Meta app review) — v1 exporta para postagem manual.
- Multi-usuário / papéis / permissões (v1 é single-operador local).
- Formatos além de carrossel feed (Reels, Stories, post único).
- Agendamento de publicação / calendário editorial.
- Editor visual livre tipo canvas (arrastar/redimensionar qualquer elemento).
- Métricas de performance dos posts (engajamento, alcance).
- Banco de imagens reais curado / DAM.

## 5. REQUISITOS FUNCIONAIS

### Discovery de pautas
- RF01: O sistema executa, sob cron local diário (meta 1 post/dia), buscas via firecrawl sobre um conjunto de temas do nicho e registra pautas candidatas com título, resumo, URL-fonte e data.
- RF02: O sistema deduplica pautas já vistas (por URL/similaridade) para não repropor a mesma notícia.
- RF03: O sistema classifica cada pauta por sinal de relevância (impacto no mercado de carbono azul) e ordena a fila por esse sinal.
- RF04: O operador pode disparar discovery manual sob demanda, além do cron.

### Fila de pautas
- RF05: O sistema exibe pautas candidatas em uma fila com estados: Nova → Aprovada → Rejeitada.
- RF06: Ao aprovar uma pauta, o sistema dispara o discovery de ângulo e cria um draft de post vinculado à pauta e à fonte.
- RF07: O operador pode inserir manualmente uma pauta (colar link/tema) que entra na mesma fila.

### Produção de post
- RF08: O sistema gera a estrutura do carrossel (6–8 slides, variável) com eyebrow, headline, corpo e dado+fonte por slide, executando o motor de copy `docs/COPY-ENGINE.md` (framework por tipo de pauta, hook + slide-2 autônomo, open loop até o payoff, 1 ideia por slide) e as regras verbais do `docs/COMMUNICATION-MANUAL.md`.
- RF09: O sistema gera legenda e hashtags PT-BR para o post.
- RF10: O sistema associa a cada dado numérico uma fonte rastreável; um slide/legenda sem fonte para um número é sinalizado como pendência antes da aprovação.
- RF11: Para slides que pedem arte, o sistema primeiro busca (firecrawl) imagens reais de qualidade aderentes ao contexto e as sugere ao operador. Quando a imagem escolhida tem barreira de direitos autorais, o sistema gera via `gpt-image-2` uma imagem original inspirada na referência (composição/tema equivalentes, sem cópia), dentro das restrições visuais da marca.
- RF11a: Cada imagem sugerida exibe sua origem (fonte/licença quando conhecida) e o operador decide entre usar a real, gerar a versão inspirada, ou fazer upload de foto própria.

### Fila de posts + edição
- RF12: O carrossel gerado entra em uma fila de posts com estados: Rascunho → Em revisão → Aprovado → Exportado.
- RF13: O operador edita campos estruturados de cada slide com preview ao vivo na identidade Karaguá.
- RF14: O operador pode reordenar slides, adicionar/remover slide, trocar a imagem (buscar/regenerar/upload) e escolher entre os vários templates de carrossel disponíveis.
- RF15: O sistema valida, na aprovação, o Gate de Qualidade de `docs/COPY-ENGINE.md` Parte C (hook-check, slide-2, loop, 1-ideia, fonte, travessão, sigla, superlativo, budget, persona, promessa=payoff, slide-count) e bloqueia aprovação em falha de item bloqueante (fonte, travessão).

### Export
- RF16: Ao aprovar, o sistema renderiza cada slide em PNG 1080×1350 e disponibiliza download individual e como PDF único do carrossel.
- RF17: O sistema disponibiliza a legenda + hashtags para cópia.

## 6. REQUISITOS NÃO-FUNCIONAIS

- RNF01: **100% local.** Sem serviços gerenciados (sem Neon/Vercel/Supabase). Dados em SQLite local; app roda em `next start`/`next dev` na máquina. Único acesso de rede permitido: OpenAI Images (`gpt-image-2`) e o firecrawl do discovery/busca de imagens.
- RNF02: **Restrição de máquina (M1, 8 GB).** Um processo pesado por vez; render de slides in-process (satori/resvg, sem headless Chromium/Puppeteer para evitar swap-thrashing). Discovery e render não rodam concorrentes com outros builds pesados.
- RNF03: **Fidelidade de marca.** Tokens visuais dos slides derivam diretamente de `karagua-website/src/style.css` (v3.0); qualquer divergência é bug.
- RNF04: **Rastreabilidade.** Toda pauta e todo dado numérico carregam fonte persistida; auditável na UI.
- RNF05: **Segurança de credenciais.** `OPENAI_API_KEY` em `.env.local` fora do git; nunca commitada nem exposta ao client.
- RNF06: **Tipagem estrita.** TypeScript sem `any`; validação de payloads com Zod (contratos de pauta/post/slide).
- RNF07: **Determinismo de render.** Mesmo draft → mesmo PNG; imagens OpenAI cacheadas em disco por prompt para não regenerar a cada render.

## 7. DEPENDÊNCIAS

Técnicas:
- Cópia do design-system de `plataforma-product-ops` (`src/design-system/` + `src/components/ui/`) para o repo.
- Tokens visuais v3.0 + fontes Aileron/JetBrains Mono de `karagua-website` para o render dos slides.
- Motor de copy `docs/COPY-ENGINE.md` e `docs/COMMUNICATION-MANUAL.md` como contrato do gerador e do gate de qualidade.
- `OPENAI_API_KEY` válida para `gpt-image-2`.
- Biblioteca de render HTML→PNG in-process (satori + @resvg/resvg-js) e geração de PDF.
- firecrawl (MCP) para discovery de pautas e busca de imagens.
- Vários templates de carrossel modelados sobre os tokens v3.0.
- SQLite + camada de acesso (ex. Drizzle/better-sqlite3).

De negócio / pessoas:
- Definição da lista-semente de temas/queries do discovery (Lucas).
- Aprovação da linha editorial e dos templates de carrossel (Lucas).

## 8. RISCOS

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Imagem OpenAI cair na estética "AI genérica" e ferir a marca | Alta | Alto | Estratégia image-first: preferir imagem real; só gerar quando há barreira de direitos, e inspirada na referência; prompts com tokens de marca; revisão humana obrigatória; permitir substituir por foto real |
| Uso de imagem real com direitos autorais / gerar cópia próxima demais da referência | Média | Alto | Exibir fonte/licença na sugestão; gerar versão *inspirada* (composição/tema), não réplica; preferir bancos livres; decisão final humana registrada |
| Discovery trazer pautas irrelevantes ou repetidas | Média | Médio | Dedupe por URL/similaridade; score de relevância; fila propose-only com curadoria humana; entrada manual como fallback |
| Dado sem fonte rastreável vazar para um post | Média | Alto | RF10/RF15 bloqueiam aprovação com número sem fonte; validação automática na fila |
| Render pesado (Chromium) derrubar a máquina M1 | Média | Alto | Render in-process (satori/resvg), sem headless browser; serializar jobs pesados |
| Copy fugir das regras do site (travessão, superlativo, budget) | Média | Médio | Validador de copy na aprovação; prompts ancorados em `Spec/03-copy.md` |
| Divergência visual entre slide e DS v3.0 do site | Baixa | Médio | Derivar tokens diretamente do `style.css`; snapshot visual de referência |

## 9. FASES E LINHA DO TEMPO

Fase 1 — MVP (~3–4 semanas): repo Next.js local + DS product-ops na UI + SQLite + discovery automatizado com fila de pautas + geração de copy/estrutura + imagem OpenAI + editor híbrido + render/export PNG+PDF.
Fase 2 — Publicação & escala: Instagram Graph API (publicação automática — a conta oficial já existe), agendamento/calendário editorial, banco de imagens reais, métricas de performance, multi-formato (Stories/Reels).
Fase 3 — Colaboração: multi-usuário, papéis/aprovação em cadeia, variantes A/B de copy.

## 10. OPEN QUESTIONS

RESOLVIDAS:
- [x] Provedor de discovery → **firecrawl** (MCP).
- [x] Cadência → **cron diário, 1 post/dia**.
- [x] Templates → **vários templates** de carrossel na v1.
- [x] Imagem → **image-first**: buscar imagem real de qualidade; gerar via **`gpt-image-2`** apenas quando houver barreira de direitos, inspirada na referência.
- [x] Conta oficial do Instagram → **já existe** (habilita Fase 2).

RESOLVIDAS (cont.):
- [x] Lista-semente de fontes/queries → proposta em `docs/EDITORIAL-REFERENCE.md` §4 (Verra, Carbon Pulse, ClimaInfo, Min. Fazenda/SBCE, MMA/ProManguezal, Diário Oficial, MapBiomas). Falta só o Lucas validar/podar.
- [x] Linha editorial (não-engessada) + benchmark de contas + anatomia do carrossel + matriz de valor por persona → `docs/EDITORIAL-REFERENCE.md`.

PENDENTES:
- [ ] Validar/priorizar a lista-semente de fontes (§4 do EDITORIAL-REFERENCE) — Lucas.
- [ ] Aileron é fonte licenciada — confirmar direito de uso nos assets exportados para redes (mesmos `.woff2` do site) — Lucas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
