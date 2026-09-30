# Manual de Comunicação — ADX

> A voz da ADX aplicada ao Instagram. Fonte de verdade: os 4 posts já
> publicados (`ADX/public/post1-4.png`), o `README.md` e a descrição da
> landing. Equivalente ADX de `docs/COMMUNICATION-MANUAL.md`.

---

## 1. Propósito da comunicação

A ADX existe porque **CPL barato mente**. O produto cruza o investimento em
Meta Ads com o que virou venda de verdade no CRM do cliente, criativo por
criativo. Toda comunicação existe para ensinar esse deslocamento: olhar a
métrica que o Meta entrega de graça (lead, CPL, CTR) é olhar metade da
conta. A outra metade só o CRM sabe.

## 2. A tensão central (e como resolvê-la)

Não existe notícia para comentar (a ADX não é uma marca de conteúdo sobre um
nicho externo, é um produto). A tensão nasce de **dentro do dado**: todo post
pega uma crença comum ("CPL baixo é bom", "mais lead é melhor") e mostra o
número que ela esconde.

- ✅ Contraste de números reais ("R$ 5,20" vs "R$ 17,60", o mesmo criativo).
- ❌ Afirmação vaga sem o par que ela derruba ("otimize melhor suas campanhas").

## 3. Princípios de voz (4 pilares)

1. **Direto.** Frase curta, sem rodeio, sem pergunta retórica de abertura.
2. **Contrastante.** Toda peça de copy tem um "antes/depois" ou "isto/aquilo"
   — a estrutura de pensamento é sempre comparativa, nunca uma lista solta.
3. **Com o dado como prova, não como decoração.** O número não ilustra o
   argumento, ele É o argumento. Sem número, não tem post.
4. **Confiante, nunca hype.** Desafia a métrica errada, não o leitor. Zero
   emoji, zero exclamação, zero "🚀", zero "imperdível".

## 4. Léxico

### Vocabulário-chave (usar assim)
| Termo | Uso correto |
|---|---|
| CPL | Custo por lead. O que o Meta entrega de graça. **Não é** a métrica que decide budget. |
| CPQL | Custo por lead qualificado (validado pelo time/CRM). A métrica que decide budget. |
| Criativo | O anúncio específico (imagem/vídeo + copy), nunca "campanha" quando o ponto é o anúncio individual. |
| Venda | O evento validado no CRM, não o lead, não a conversa iniciada. |
| Painel | O produto ADX, quando citado por função (não é "dashboard" em copy pública PT-BR). |

### Siglas — não exigem expansão (audiência já fluente)
CPL, CPQL, CTR, CAC, LTV, ROAS, CRM, CTA, ROI. Expandir soa didático demais
para quem já roda tráfego pago todo dia — trate como vocabulário comum do
nicho, não como jargão a explicar.

## 5. Regras de escrita invioláveis

- **Sem travessão (—).** Vírgula, dois-pontos, ponto-e-vírgula, ponto, parênteses.
- **Todo número vem em par**: o que parecia vs o que é, ou lado A vs lado B.
  Um número sozinho, sem contraste, não sustenta um post ADX.
- **Sem superlativo sem prova.** Proibido "revolucionário", "o melhor CRM do
  mercado", "a única ferramenta que". A ADX ganha argumento com dado, não com adjetivo.
- **Enxuto.** Os 4 posts reais nunca passam de ~10 palavras no headline e
  ~25 no corpo. Preferir cortar a explicar.
- **Português BR** no conteúdo publicado; termos de produto/métrica do
  nicho ficam em inglês/sigla quando é assim que o mercado fala (CRM, CPL,
  ROAS) — não forçar tradução que soa estranha ("retorno sobre o investimento
  em anúncios" no lugar de ROAS).
- **Nunca dirige-se ao leitor com "você precisa"** — a voz afirma o fato,
  deixa o leitor tirar a conclusão. "Lead barato não paga a conta" funciona
  porque é afirmação, não conselho.

## 6. Tom por persona (o mesmo fato, 3 registros)

| Persona | Registro | Faz | Evita |
|---|---|---|---|
| **Gestor de tráfego** | Operacional, técnico | Qual métrica olhar, qual decisão ela muda na conta | Falar de ROI de negócio (isso é do dono) |
| **Dono do negócio** | Direto ao bolso | Custo por venda real, não por lead; ROI | Jargão de configuração de campanha |
| **Agência parceira** | Credibilidade com o cliente final | Como provar resultado com dado do CRM do cliente | Prometer resultado que não é a agência que entrega |

Regra: cada post declara **um** persona primário. "Para todos" é proibido.

## 7. Do / Don't (exemplos, no padrão dos posts reais)

**Headline**
- ✅ "Lead barato não paga a conta. Venda paga." (contraste, duas frases)
- ✅ "CPL não é CPQL." (afirmação direta, sem explicar ainda)
- ❌ "Descubra como otimizar suas campanhas de tráfego!" (vago, clickbait, exclamação)
- ❌ "A melhor forma de medir ROI." (superlativo sem prova)

**Corpo**
- ✅ "O mesmo criativo. Três vezes mais caro do que parecia." (número implícito no contraste)
- ❌ "Nossos clientes economizam muito dinheiro." (sem número, sem fonte)

**CTA**
- ✅ "Conecte seu CRM e veja o CPQL real da sua conta."
- ❌ "Marque um amigo que precisa saber disso!!!" (ruído, sem valor)

## 8. Imagem e marca visual (resumo — ver `design-system.html` da ADX)

- Preto `#0A0A0A` + branco + azul `#0057E7` como acento único; verde/roxo só
  para status semântico (ativo/qualificado), nunca como cor de marca.
- Bebas Neue para headline e números grandes; IBM Plex Mono para
  label/dado/sigla; IBM Plex Sans para corpo.
- Zero canto arredondado, zero sombra em repouso (mesma regra "flat" da
  Karaguá, por convergência de gosto, não por herança de marca).
- **Sem foto.** Os 4 posts publicados são 100% tipografia + dado. Não buscar
  nem gerar imagem para post ADX.

## 9. Cadência e governança

- Sem cron diário nem pauta de notícia externa: o ângulo nasce do próprio
  ADX (um aprendizado de produto, um caso de cliente, um conceito do nicho).
- Nada publica sem passar pelo Gate de Qualidade (mesmo mecanismo de
  `src/lib/gate.ts`).

---

### Referências
`ADX/README.md` · `ADX/public/landing.html` (meta description) ·
`ADX/public/post1.png` a `post4.png` · `ADX/design-system.html` ·
`docs/adx/COPY-ENGINE.md`.
