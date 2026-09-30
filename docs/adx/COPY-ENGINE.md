# Copy Engine ADX — motor de geração de carrossel

> Equivalente ADX de `docs/COPY-ENGINE.md`. Mesma mecânica de retenção (carrossel,
> hook, open loop), voz e matéria-prima diferentes: aqui não se comenta notícia
> externa, se defende uma tese de produto com dado real ou ilustrativo, sempre
> no contraste "o que parece" vs "o que é de verdade".
> Base: os 4 posts já publicados (`ADX/public/post1-4.png`) e o pitch do
> `README.md`/landing ("ADX cruza o investimento em Meta Ads com o que
> realmente virou venda no seu CRM, criativo por criativo").

---

## PARTE A — O que já funciona (evidência dos 4 posts publicados)

- **post1** — hook em bloco de cor sólida: "Lead barato não paga a conta. Venda
  paga." Duas frases curtas, a segunda vira a primeira de cabeça para baixo.
- **post2** — comparação preto-vs-branco: o mesmo custo por lead visto de dois
  jeitos ("o que você vê hoje" vs "o que o ADX mostra"), síntese em uma frase:
  "O mesmo criativo. Três vezes mais caro do que parecia."
- **post3** — funil de métricas (leads → qualificados → em contato →
  validação), síntese: "Seu painel para no primeiro número." (crítica ao
  hábito de olhar só o topo do funil).
- **post4** — dois termos lado a lado (CPL vs CPQL), síntese: "Otimizar pelo
  primeiro é comprar volume. Pelo segundo, é comprar venda."

**O padrão**: nenhum post é notícia. Todos são **reframe de métrica**: pegam
um número que o mercado trata como bom o bastante (CPL, lead, volume) e
mostram o número que importa de verdade (CPQL, venda, criativo por
criativo). A tensão não vem de fato externo, vem de **comparação**: dois
números, dois estados, dois jeitos de olhar o mesmo dado.

## PARTE B — MOTOR: contrato de geração

O gerador recebe `{ ângulo, persona, profundidade }` e produz um carrossel. Regras:

### B.1 Seleção de framework (por tipo de ângulo)
| Tipo de ângulo | Framework | Quando |
|---|---|---|
| Reframe de métrica (CPL vs CPQL, lead vs venda) | **PAS** (Problema → Agitação → Solução) | O ângulo é "você está otimizando pela métrica errada" |
| Caso/exemplo com número antes-depois | **AIDA** | Há um "antes" e um "depois" do ADX cruzar os dados |
| "O que é X", conceito de performance marketing | **Explicador** | Ângulo didático (o que é CPQL, o que é atribuição por CRM) |
| Marco do produto, integração nova, resultado de cliente | **Hook → prova → payoff** | Storytelling factual com número-âncora |

### B.2 Estrutura de slides (2–4, o padrão dos posts reais é curto)
1. **Capa/Hook** — a virada em 2 frases curtas (setup, depois a frase que inverte). Sem
   pergunta retórica, sem "descubra". Bloco de cor sólida, sem foto (ADX não usa foto).
2. **Prova** — o contraste em número: dois valores lado a lado (figura `comparacao` ou
   `balanca`), ou um funil (`comparacao` com itens decrescentes), ou dois termos
   definidos lado a lado (`balanca`).
3. **Payoff** — a frase-síntese que fecha o raciocínio ("Otimizar pelo primeiro é
   comprar volume. Pelo segundo, é comprar venda."). Conecta ao que o ADX faz,
   sem citar feature por nome a menos que seja o ponto do post.
4. **CTA** — 1 ação: "Veja seu CPQL de verdade" / "Conecte seu CRM" / "Fale com o time".
   Sem superlativo, sem "revolucione suas campanhas".

### B.3 Legenda + hashtags
- Linha 1 = a frase de virada da capa, repetida ou levemente reformulada.
- Corpo expande o raciocínio em 2-3 frases, sem repetir o carrossel palavra por palavra.
- Fecha com CTA direto, sem pergunta de engajamento forçada (a voz ADX não pede
  comentário fácil, ela afirma).
- Hashtags: mix de nicho (#metaads #performancemarketing #trafegopago #crm
  #growthmarketing) + termo do ângulo (#cpql #roas #atribuicao).

### B.4 Regras de microcopy (invioláveis)
- Sem travessão (—). Vírgula, dois-pontos, ponto-e-vírgula, ponto, parênteses.
- Todo número comparável tem par: um "antes" e um "depois", ou dois lados
  (nunca um número solto sem o que ele substitui/derruba).
- **Siglas do métier (CPL, CPQL, CTR, CAC, LTV, ROAS, CRM, CTA) não precisam
  expandir** — a audiência é profissional de tráfego/growth, já fluente nelas.
  Expande só o que for termo interno do produto ou pouco comum no nicho.
- Sem superlativo sem prova ("revolucionário", "o melhor CRM do mercado").
- Budget por slide: eyebrow ≤3 palavras · headline ≤10 · corpo ≤22 (a voz ADX
  é mais enxuta que a da Karaguá; os 4 posts reais nunca passam disso).
- 1 ideia por slide. O contraste é a ideia; não empilhar um segundo argumento
  no mesmo slide.

### B.5 Enquadramento por persona (define o ângulo do "por que isso importa")
- **gestor_trafego** → ângulo operacional: qual métrica olhar, qual decisão
  ela muda no dia a dia da conta.
- **dono_negocio** → ângulo de dinheiro: quanto está saindo por venda de
  verdade, não por lead; ROI, não vaidade.
- **agencia_parceira** → ângulo de credibilidade: como provar resultado pro
  cliente da agência com dado do CRM dele, não achismo.

---

## PARTE C — GATE DE QUALIDADE (mesmo mecanismo de `src/lib/gate.ts`)

Os checks automáticos (`travessão`, `fonte`, `estrutura`, `budget`, `contagem`,
`superlativo`) são os mesmos de qualquer carrossel — só a lista de siglas que
exige expansão é vazia para a ADX (B.4). Os itens manuais (hook, loop, 1
ideia, persona, promessa=payoff) valem igual.

## PARTE D — INSUMO PARA O PROMPT DO GERADOR (resumo operacional)

> "Você escreve carrosséis de Instagram para a ADX (SaaS que cruza Meta Ads
> com CRM, criativo por criativo, para mostrar custo por venda real, não só
> por lead). Regras: a capa é uma virada de 2 frases curtas, nunca uma
> pergunta; o corpo do post é sempre uma comparação (dois números, dois
> estados, dois termos), nunca um fato solto; o payoff fecha com a síntese
> que a comparação prova; siglas do métier (CPL, CPQL, CTR, CAC, ROAS, CRM)
> não precisam de expansão; sem travessão; sem superlativo; enxuto (headline
> ≤10 palavras, corpo ≤22); enquadre pelo persona primário. Voz: direta,
> confiante, um pouco provocadora com a métrica errada, nunca com o leitor.
> Nunca usa emoji, exclamação ou 'descubra/veja agora'."
