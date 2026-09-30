# 002 — O gerador entra no mesmo app, como uma segunda rota

**Status**: aceito
**Data**: 2026-09-17

## Contexto

A decisão 001 fixou `web/` como visualizador puro: lê `data/carousels/*.json`,
nunca escreve. Isso ficou correto enquanto não havia gerador nenhum, escrito
ou planejado, para o repo rodar.

O pedido agora é diferente: gerar carrossel de verdade, com uma chave da
OpenAI, no mesmo visual que já existe (o mesmo dos posts publicados no
Instagram da Karaguá) e incluindo figuras/esquemas em SVG para analogias e
explicações, não só foto e texto.

## Decisão

`web/` ganha uma segunda rota, `/gerar`, e uma rota de API, `POST
/api/gerar`. Ela lê `docs/COPY-ENGINE.md`, `COMMUNICATION-MANUAL.md`,
`EDITORIAL-REFERENCE.md` e `RENDER-RULES.md` do disco a cada chamada (nunca
uma cópia congelada), monta o prompt, chama a OpenAI e grava um JSON novo em
`data/carousels/`, no mesmo contrato que o visualizador já lia. O
visualizador continua sem saber a diferença entre um arquivo escrito à mão e
um escrito pelo gerador: ambos passam pelo mesmo Zod, pelo mesmo gate.

Por que não um segundo app/pasta para a "fábrica": o contrato de dados, o
gate de qualidade e os componentes de slide já existem aqui, testados contra
os dois JSONs de exemplo. Duplicar isso em outro projeto custaria mais do
que abre risco de os dois divergirem (exatamente o problema que a decisão
001 evitou ao escolher `karagua-design-system` como origem única do visual).

Três coisas que mudam de propósito em relação a 001:

1. **`web/` deixa de ser só leitor.** Continua sem editor de campo a campo,
   sem fila de aprovação, sem export para PNG/PDF (isso segue fora do
   escopo desta rodada, RF12–RF17 do PRD). Mas agora escreve um tipo de
   arquivo: o rascunho que a `/api/gerar` produz.
2. **O gerador nunca inventa a fonte.** O formulário exige uma URL antes de
   chamar o modelo; o prompt manda o modelo reproduzir exatamente essa URL
   em todo `source`, nunca criar uma nova. Isso é mais estrito que o gate
   (que só cobra *ter* fonte, não cobra que ela seja a mesma) porque não dá
   pra confiar num modelo de linguagem para inventar uma URL plausível.
3. **A resposta do modelo é só copy, nunca proveniência.** `id`, `status`,
   `createdAt`, `pauta`, `framework`, `persona`, `depth` e `notes` são
   decididos pelo operador (no formulário) ou pelo servidor, nunca pelo
   modelo (`carouselDraftSchema` em `src/lib/carousel.ts`, um `.pick()` de
   `title`/`slides`/`caption`). Separa "o que é fato sobre a geração" de "o
   que o modelo escreveu", para o segundo nunca contaminar o primeiro.

## Modelos visuais e figuras

O schema ganhou `layout` (`capa-onda`, `faixa`, `numero`, `figura`,
`fechamento`) e `highlight` (caixa de cor atrás de uma palavra do headline),
inspirados no que já está no ar no Instagram da Karaguá — sem trocar a
paleta: continua tudo em cima dos tokens `--k-*` de `karagua-design-system`
(lima/carbon/shell), não uma cor nova. Um post sem `layout` explícito
continua renderizando (`src/lib/layout.ts` infere pelo `role`/conteúdo), os
dois JSONs de exemplo escritos antes deste campo existir não quebraram.

`figure` é um catálogo fechado de 8 tipos (`comparacao`, `analogia`,
`fluxo`, `ciclo`, `camadas`, `linha-do-tempo`, `balanca`, `mapa`) em
`src/components/figures/`. O modelo nunca escreve SVG: só preenche os dados
de um tipo já desenhado. É a mesma lógica do design system inteiro, aplicada
a diagrama: um catálogo fixo desenhado uma vez, nunca inventado por
geração. `comparacao` e `analogia` carregam número com fonte opcional; o
gate ganhou um check (`fonte-figura`, bloqueante) que cobra isso do mesmo
jeito que já cobrava de `datum`.

## Biblioteca de fotos (mesmo dia, adicionada depois do rascunho acima)

22 fotos reais do mutirão SOS Manguezal e do manguezal da Babitonga entraram
em `web/public/images/`, catalogadas à mão (cada `alt` escrito depois de
olhar a foto, nunca adivinhado pelo nome do arquivo `DSC_NNNN.jpg`) em
`web/src/lib/photos.ts`. O prompt oferece a lista ao modelo; o servidor
reconfere `path`/`alt` contra o catálogo antes de salvar e descarta qualquer
imagem que não bata exatamente, em vez de arriscar uma referência quebrada.

Consequência para `capa-onda`: sem foto, esse layout deixava metade do slide
vazia (bug visto e corrigido no mesmo dia). `SlideStage` agora recua para
`faixa` quando `capa-onda` é declarado sem `image`, e o prompt só oferece
`capa-onda` como opção real quando junto da biblioteca de fotos.

## O que ainda falta (fora desta rodada)

- `gpt-image-2` como fallback de imagem quando nenhuma foto real da
  biblioteca serve (PRD RF11) — hoje o operador ainda faz upload manual fora
  deste fluxo se precisar de algo que não está no catálogo.
- Export para PNG/PDF, fila de aprovação, edição campo a campo.
- Busca automática de pauta (firecrawl) — o gerador de hoje é sob demanda,
  não o cron diário do PRD §4.
