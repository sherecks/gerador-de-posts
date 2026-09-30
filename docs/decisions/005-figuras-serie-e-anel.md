# 005 — Duas figuras novas: série e anel

**Status**: aceito
**Data**: 2026-09-30

## Contexto

O catálogo tinha 8 figuras. Duas coisas que o nicho pede o tempo todo não tinham
figura: **um número que muda no tempo** (o preço do crédito por ano, os leads por
mês) e **uma fração de um todo** ("68% dos leads..."). Sem elas, o gerador desenhava
a série como `comparacao` com anos no lugar de itens (barras que fingem ser tempo)
ou deixava o percentual só no texto.

A análise das skills do Hyperframes (`data-chart`, `chart-story`, `mk-line-graph`,
`mk-usage-arc`) apontou o mesmo buraco: gráfico de linha e anel de percentual.
Foi aproveitada só a ideia; nenhum código, animação ou estilo foi copiado. Cada figura
é um componente do POSTS, com os tokens `--fig-*` da marca.

## Decisão

- `serie`: 3 a 8 pontos em ordem, cada um com `rotulo`, `valor` e `valorLabel`, um
  `destaque` opcional, `unidade` e uma única `source` para a série. O eixo **começa em
  zero**: um slide não tem eixo rotulado para avisar que ele foi cortado, então uma linha
  que parece ter dobrado tem que ter dobrado. Todo ponto tem o valor escrito, como em
  `comparacao`.
- `anel`: `valor` de 0 a 100 desenha o arco, `valorLabel` é o texto no centro, `rotulo`
  diz o que a fatia mede e `contexto` é uma linha opcional. Pontas retas (a marca não tem
  raio).
- Gate: `fonte-figura` passa a cobrar `source` das duas (bloqueante);
  `figura-consistente` (bloqueante) recusa um anel cujo texto diz um número e o desenho
  outro; `figura-uso` (aviso) cobra no máximo 2 slides com figura e um destaque por série.
- Prompt: além do formato de cada tipo, uma seção "Qual figura para qual dado" e a regra de
  não inventar série nem anel quando a fonte não traz o número.

## Não foi feito

- Animação: os posts são PNG. A versão animada da mesma figura pertence ao vídeo.
- Mapa real (os do Hyperframes são de EUA, mundo e Espanha) e mais ícones: ficam para depois.
- As figuras existentes não mudaram.
