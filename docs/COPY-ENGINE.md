# Copy Engine — motor de geração de carrossel (retenção-first)

> Discovery consolidado do que faz um carrossel ter **qualidade de copy** e **retenção**,
> convertido em regras acionáveis que o motor de copy do Gerador de Posts executa para a Karaguá Ecotech.
> Casa com o PRD (RF08–RF15) e com o `COMMUNICATION-MANUAL.md` (voz/marca).
> Este documento é o **motor**: o gerador recebe pauta + persona e produz slides seguindo o contrato abaixo.

---

## PARTE A — DISCOVERY: o que move retenção (evidência)

### A.1 Por que carrossel (e por que retenção é a métrica)
- Carrossel é hoje o formato de maior engajamento: **~10%** vs ~7% imagem única vs ~6% Reels; **1.4× mais reach** que estático (Mosseri, fev/2026); dwell time **15–30s** vs 3–5s de Reels.
- A métrica-motor é **swipe-through / completion rate**: % que chega ao último slide = (viram último ÷ viram primeiro) × 100. Alvo saudável: **≥40–50%** chegam ao fim.
- Cada swipe conta como micro-engajamento e tempo ativo → sinaliza reach ao algoritmo. Salvamentos e compartilhamentos por reach importam mais que likes.

### A.2 As 3 alavancas de retenção (ordem de impacto)
1. **O primeiro slide carrega ~80% do swipe-through.** Se não abre curiosidade, o resto não é visto.
2. **Slide 2 é um segundo hook.** O Instagram dá "segunda chance" reexibindo a partir do slide 2 → ele deve funcionar sozinho, não ser mera continuação.
3. **Open loop sustentado + 1 ideia por slide.** Curiosity gap aberto na capa só fecha no payoff; cada slide entrega uma unidade de valor e insinua a próxima (cliffhanger no rodapé).

### A.3 Gatilhos psicológicos que abrem o loop (Buffer)
Curiosity gap · FOMO · ROMO (alívio de não precisar acompanhar tudo) · Novelty (contraintuitivo) · Identity trigger (fala com "quem é você") · Social proof (número real, específico).

### A.4 Tipos de hook de texto que param o scroll
Tensão/contradição · Especificidade emocional · Cliffhanger (setup sem payoff imediato) · Disrupção de padrão (frases curtas, ritmo quebrado) · Estatística surpreendente · "Você pode estar fazendo isso errado".

### A.5 Regra de ouro anti-clickbait
**Promessa = payoff.** O hook é o convite, não a entrega. Overpromise que não cumpre destrói confiança — fatal para uma marca técnica como a Karaguá (cada número tem fonte). O hook cria a pergunta; o corpo entrega a resposta com lastro.

### A.6 Design a serviço da retenção
- **Consistência visual** (paleta, tipografia, ritmo de layout) reduz carga cognitiva e sustenta o swipe — aqui = tokens Karaguá v3.0, sempre.
- **Swipe cue** ("arraste") aparece em só ~5% dos carrosséis e sobe engajamento de 1.83%→2%. Barato, usar.
- **Número de slides por profundidade**: 2–4 dica rápida · 5–7 explicador/lista · 8–10 guia profundo. Nunca esticar ideia simples (mata completion). Cada slide justifica sua existência.

---

## PARTE B — MOTOR: contrato de geração

O gerador recebe `{ pauta, fonte(s), persona_primario, persona_secundario?, profundidade }` e produz um objeto de carrossel. Regras:

### B.1 Seleção de framework narrativo (por tipo de pauta)
| Tipo de pauta | Framework | Quando |
|---|---|---|
| Lei/decreto novo, mudança regulatória | **PAS** (Problema → Agitação → Solução) | Há uma dor/risco que a norma cria ou resolve |
| Notícia de mercado, preço, tendência | **AIDA** (Atenção → Interesse → Desejo → Ação) | Curiosidade fria, atualização de cenário |
| "Como funciona", metodologia, conceito | **Explicador / listicle** (hook → N pontos → síntese) | Pauta didática (VM0033, MRV, carbono azul) |
| Marco/conquista, dado de impacto | **Hook → prova → payoff** | Storytelling factual com número-âncora |

### B.2 Estrutura de slides (6–8, variável por profundidade)
1. **Capa/Hook** — headline ≤10 palavras, um gatilho de A.3/A.4, com número-âncora quando houver. Swipe cue discreto.
2. **Slide 2 (2º hook)** — reancora a tensão de forma autônoma; contextualiza "por que agora". NÃO repete a capa.
3. a N-2. **Desenvolvimento** — 1 ideia por slide; cada slide = 1 afirmação + (quando numérica) 1 dado com fonte rastreável (JetBrains Mono no número). Rodapé com micro-cliffhanger até o penúltimo.
   N-1. **Payoff** — fecha o loop aberto na capa; conecta ao modelo Karaguá (carbono azul / PSA / Babitonga) sem propaganda.
   N. **CTA** — 1 ação clara (salvar / comentar / seguir a pauta). Sem superlativo sem prova.

### B.3 Legenda + hashtags
- **Linhas 1–2 = preview** (o "hook da legenda"): tensão/valor que ganha o tap; espelha a promessa da capa.
- Corpo expande com a fonte citada (URL/instituição). Fecha com CTA e 1 pergunta de engajamento.
- Hashtags PT-BR do nicho (mix amplo + específico): #carbonoazul #mercadodecarbono #manguezal #ESG #créditodecarbono + tema da pauta.

### B.4 Regras de microcopy (invioláveis — herdadas do site)
- Sem travessão (—). Usar vírgula, dois-pontos, ponto-e-vírgula, parênteses.
- Todo número tem fonte; toda fonte referencia um número. Um sem o outro = pendência.
- Siglas expandem na 1ª ocorrência (PSA, MRV, REDD+, VM0033/VM0007, PEPSA, SBCE, BNDES Fundo Clima).
- Sem superlativo sem prova ("melhor", "revolucionário", "líder").
- Budget por slide: eyebrow ≤3 palavras · headline ≤10 · corpo ≤26. Preferir cortar a explicar.
- 1 ideia por slide. Se um slide tem duas ideias, vira dois slides ou some.

### B.5 Enquadramento por persona (define hook + profundidade técnica)
Puxa da matriz do `EDITORIAL-REFERENCE.md` §3. O `persona_primario` decide o hook e o nível de jargão:
- pessoa_padrao → hook de identidade/curiosidade, zero jargão, "o que muda pra você".
- servidor_publico → hook de instrumento/receita, cita a norma.
- eng_ambiental_quimico → hook técnico, aceita VM0033/MRV/tCO₂e no corpo.
- investidor → hook de número/tendência, preço e tese.

---

## PARTE C — GATE DE QUALIDADE (validação automática pré-aprovação, RF15)

O post só pode ir para "Aprovado" se passar em todos:

- [ ] **Hook-check**: capa tem ≥1 gatilho de A.3/A.4 e abre um loop (não entrega tudo).
- [ ] **Slide-2-check**: slide 2 funciona sozinho como 2º hook (não é "continuação").
- [ ] **Loop-check**: o payoff (N-1) fecha o loop aberto na capa.
- [ ] **1-ideia-por-slide**: nenhum slide com 2+ afirmações centrais.
- [ ] **Fonte-check**: todo número tem fonte rastreável persistida (bloqueante).
- [ ] **Travessão-check**: zero "—" na copy e na legenda.
- [ ] **Sigla-check**: siglas expandidas na 1ª ocorrência.
- [ ] **Superlativo-check**: nenhum superlativo sem prova adjacente.
- [ ] **Budget-check**: eyebrow/headline/corpo dentro do limite.
- [ ] **Persona-check**: hook e profundidade coerentes com o persona primário declarado.
- [ ] **Promessa=payoff**: o que a capa promete é entregue no corpo (anti-clickbait).
- [ ] **Slide-count-check**: contagem coerente com a profundidade (2–4 / 5–7 / 8–10) e nenhum slide-filler.

Falha em item bloqueante (fonte, travessão) impede aprovação. Falha em item de qualidade gera alerta editável.

---

## PARTE D — INSUMO PARA O PROMPT DO GERADOR (resumo operacional)

> "Você escreve carrosséis de Instagram para a Karaguá Ecotech (carbono azul em manguezal). Objetivo: máxima retenção (swipe-through) sem trair a marca. Regras: 1º slide abre curiosity gap com número-âncora; slide 2 é um 2º hook autônomo; 1 ideia por slide; open loop até o payoff; cada número tem fonte; sem travessão; siglas expandem; sem superlativo sem prova; budget enxuto (headline ≤10 palavras); framework por tipo de pauta (PAS lei / AIDA mercado / explicador metodologia); enquadre pelo persona primário. Promessa da capa = payoff do corpo. Voz: objetiva, institucional, base técnica, próxima da comunidade (ver COMMUNICATION-MANUAL)."

### Fontes do discovery
PostNitro — Carousel Swipe-Through Rate (10 fatores) · CreatorFlow — Instagram Carousel Guide 2026 (stats Mosseri/Buffer) · Buffer — Anatomy of a Great Hook 2026 (gatilhos psicológicos, tipos de hook) · Reddit r/copywriting, instacarousel, gogochimp — frameworks AIDA/PAS.
