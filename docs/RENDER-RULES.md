# Render Rules — legibilidade do slide

> Regras de renderização que o template aplica em todo slide, para que o texto seja
> sempre legível e bem quebrado, independentemente da foto de fundo. Complementa
> `COPY-ENGINE.md` (o que escrever) e `COMMUNICATION-MANUAL.md` (voz/visual).

## 1. Quebra de linha (line-breaking)

- **Forma da silhueta (ragging intencional)**: a quebra do headline não é deixada ao acaso (`balance` produz ragging arbitrário). Um algoritmo mede a largura real de cada linha (canvas `measureText`) e escolhe as quebras que formam uma das três silhuetas, atribuída por slide:
  - **quadrado** — linhas de largura equilibrada (menor variância);
  - **triângulo crescente (↑)** — cada linha maior que a anterior;
  - **triângulo decrescente (↓)** — cada linha menor que a anterior.
- **Quebra semântica**: bonifica quebrar após pontuação (`. , : ;`), penaliza fortemente linha que termina em preposição/artigo, e testa 2 e 3 linhas escolhendo a de melhor pontuação forma+semântica.
- **Medida curta**: headline não excede a largura útil do slide; 2–3 linhas.
- **Corpo/legenda**: `text-wrap: pretty` (evita última linha órfã).
- **Sem hifenização**: `hyphens: none` — nunca partir palavra no meio.
- **Tokens atômicos nunca quebram** (`white-space: nowrap` / `&nbsp;`): valores e unidades (`US$ 26`, `tCO₂e`, `6%`), siglas e códigos (`VM0033`, `PSA`, `SBCE`, `REDD+`), referências legais (`Lei nº 15.042/2024`), nomes próprios (`Karaguá`, `Babitonga`, `Verra`).
- **Preposições e artigos colados**: palavras de 1–2 letras e conectivos PT-BR (a, o, e, de, da, do, na, no, em, ao, se, que, por, com, não, só) ganham `&nbsp;` com a palavra seguinte, para não terminarem a linha sozinhos.
- **1 ideia por linha quando possível**: preferir quebra semântica (onde a frase respira) a quebra por largura.

## 2. Cor da fonte por contraste (automático)

- Paleta de texto: claro `#f7f5f0` (shell) e escuro `#1a2332` (carbon). Acentos de marca (amarelo `#c7d926`, oliva `#828e1a`) são para eyebrow/realce, não para corpo longo.
- **Escolha por luminância**: mede-se a luminância relativa (WCAG) do fundo sob o texto; usa-se a cor de texto (claro ou escuro) que der o **maior contraste**.
- **Mínimo obrigatório**: contraste ≥ **4.5:1** para corpo/headline (WCAG AA). Rótulo pequeno (eyebrow) mira ≥ 4.5:1 também por segurança.
- Em superfície sólida (carbon, amarelo, shell) a decisão é direta: carbon → texto claro; amarelo → texto carbon; shell → texto carbon.

## 3. Overlay adaptativo entre imagem e texto (só quando preciso)

Sobre foto, a cor sozinha não garante contraste (a foto varia). Então:

- Mede-se a **luminância média da faixa da imagem exatamente onde o texto fica** (amostragem por região, topo e base do slide).
- O texto sobre foto é claro (`#f7f5f0`, padrão editorial). Calcula-se o **overlay carbon** (gradiente, cor da marca `#1a2332`) com a opacidade mínima `α` que baixa a luminância da faixa até o texto atingir 4.5:1 — nem mais, nem menos:
  - `α = clamp((L − Lalvo) / (L − Lcarbon), 0.18, 0.9)`, com `Lalvo ≈ 0.16`.
  - Faixa já escura → overlay quase nulo (`α≈0.18`, só para dar corpo ao texto). Faixa clara (céu, reflexo do sol) → overlay mais forte.
- O overlay é **por faixa** (topo e base independentes), então uma foto com céu claro em cima e água escura embaixo recebe scrim forte só onde precisa.
- Reforço opcional: `text-shadow` sutil no headline sobre foto, para bordas de alto detalhe.

## 4. Ordem de aplicação (pipeline de render)

1. Escolher/gerar a imagem do slide.
2. Amostrar luminância das faixas de texto.
3. Definir cor de texto por contraste; se sobre foto, calcular α do overlay por faixa.
4. Aplicar tipografia: medida curta, balance/pretty, tokens atômicos e preposições coladas.
5. Validar contraste final ≥ 4.5:1 (gate). Se falhar, aumentar α e revalidar.

> No app (satori/resvg), a amostragem de luminância roda no servidor sobre a imagem
> escolhida antes de compor o PNG; as mesmas constantes (Lalvo, α) valem.
