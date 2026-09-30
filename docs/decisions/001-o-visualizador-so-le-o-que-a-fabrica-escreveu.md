# 001 — O visualizador só lê o que a fábrica escreveu

**Status**: aceito
**Data**: 2026-09-17

## Contexto

O PRD descreve uma fábrica completa (discovery, duas filas, editor, render,
export) que ainda não existe: até hoje o repo tinha só `docs/`, a skill
`karagua-image` e os renders em `output/`. Nenhum frontend jamais foi escrito
aqui, e a pasta não estava sob git, então também não havia o que recuperar.

O pedido imediato era ver as gerações de carrossel, não construir a fábrica.

## Decisão

`web/` é um **visualizador**, não a fábrica. Ele lê um JSON por carrossel em
`data/carousels/`, valida contra um schema Zod (`web/src/lib/carousel.ts`) e
renderiza os slides em 4:5 com os tokens da marca. Não gera, não edita, não
aprova, não exporta.

Três consequências que valem escrever:

1. **O contrato de dados nasce aqui.** Quando a fábrica for construída, ela
   escreve nesse formato, ou o formato muda de propósito, nunca por acidente.
   Arquivo fora do contrato aparece na home como erro nomeado, jamais é ignorado.
2. **O gate de qualidade só afirma o que consegue provar.** Travessão, número
   sem fonte, budget, contagem, estrutura, superlativo e sigla são verificados
   por código. Hook, loop, uma ideia por slide, persona e promessa = payoff
   aparecem como item de revisão humana. Um `[ok]` inventado nesses seis seria
   pior que não ter gate.
3. **A imagem do slide vem de fora do `public/`.** A fábrica escreve em
   `output/`; a rota `/api/asset` serve arquivo de dentro do repo e recusa
   caminho que escape dele.

## Design system: `karagua-design-system`, não `plataforma-product-ops`

O PRD §7 previa copiar o design system da `plataforma-product-ops`. Copiamos o
de `~/Projetos/karagua-design-system`: ele já é a identidade Karaguá v3.0
(tokens `--k-*`, Aileron self-hosted, superfícies bege, zero canto arredondado),
enquanto o da plataforma é a identidade STLFLIX e precisaria ser re-tematizado.
São 480 KB e duas dependências que o projeto já usa.

Custo aceito: a cópia diverge da origem com o tempo. Mudança de marca nasce no
`karagua-design-system` e é recopiada, nunca editada só deste lado.

## Alternativas descartadas

- **Adaptar o Carousel Studio da `plataforma-product-ops`** (16 componentes,
  editor e export prontos): é um editor acoplado ao backend e ao tema daquela
  plataforma. Traria a fábrica junto, que não era o pedido.
- **Galeria estática de `output/`**: mostraria PNG, não o carrossel. Sem copy,
  sem fonte, sem gate: não responde "esta geração pode ser postada?".

## Observação sobre o `output/`

São 124 MB de renders 4K, regeneráveis pela skill `karagua-image`. Ficam fora do
git (`.gitignore`), e com isso o histórico começa leve.
