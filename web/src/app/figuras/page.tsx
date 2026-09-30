import type { Metadata } from 'next';
import { SlideStage } from '@/components/SlideStage';
import { BRAND_LABEL, FIGURE_LABEL, ICON_MEANING, type Brand, type IconName, type Slide } from '@/lib/carousel';
import { Icon } from '@/components/figures/icons';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Catálogo de figuras — Gerador de Posts',
};

/**
 * One illustrative slide per figure type (docs/decisions/002 catalog), plus
 * a few in the ADX brand (docs/decisions/004) to prove the same 10
 * components re-skin from data alone. Data here is invented for
 * demonstration only, never written to data/carousels/ and never passed
 * through the gate — this page exists so a person can see the shapes
 * without spending a generation.
 */
const SAMPLES: ReadonlyArray<{ type: keyof typeof FIGURE_LABEL; brand: Brand; slide: Slide }> = [
  {
    type: 'comparacao',
    brand: 'karagua',
    slide: {
      role: 'desenvolvimento',
      surface: 'shell',
      layout: 'figura',
      eyebrow: 'Exemplo',
      headline: 'Preço do crédito por tipo',
      figure: {
        type: 'comparacao',
        itens: [
          { label: 'Crédito florestal (média)', valor: 12, valorLabel: 'US$ 12' },
          { label: 'Crédito de restauração', valor: 14, valorLabel: 'US$ 14' },
          { label: 'Crédito de manguezal', valor: 17, valorLabel: 'US$ 17', destaque: true },
        ],
        unidade: 'por tCO₂e',
      },
    },
  },
  {
    type: 'analogia',
    brand: 'karagua',
    slide: {
      role: 'desenvolvimento',
      surface: 'lime',
      layout: 'figura',
      eyebrow: 'Exemplo',
      headline: 'Um hectare guarda mais carbono',
      figure: {
        type: 'analogia',
        iconBase: 'onda',
        labelBase: '1 ha de manguezal',
        icon: 'arvore',
        quantidade: 5,
        labelUnidade: '5 ha de floresta continental, no mesmo estoque de carbono',
        afirmacao: 'O manguezal guarda o carbono no sedimento, não só na árvore.',
        dado: { value: '5x', label: 'mais carbono por hectare' },
      },
    },
  },
  {
    type: 'fluxo',
    brand: 'karagua',
    slide: {
      role: 'desenvolvimento',
      surface: 'carbon',
      layout: 'figura',
      eyebrow: 'Exemplo',
      headline: 'Como funciona o mutirão',
      figure: {
        type: 'fluxo',
        etapas: [
          { label: 'Mapeamento', detalhe: 'Onde o lixo se acumula na maré' },
          { label: 'Mutirão de coleta', detalhe: 'Caiaque e a pé, entre as raízes' },
          { label: 'Triagem', detalhe: 'Separação do que retirou' },
          { label: 'Plantio de mudas', detalhe: 'Propágulos coletados no mesmo dia' },
        ],
      },
    },
  },
  {
    type: 'ciclo',
    brand: 'karagua',
    slide: {
      role: 'desenvolvimento',
      surface: 'shell',
      layout: 'figura',
      eyebrow: 'Exemplo',
      headline: 'O ciclo do carbono azul',
      figure: {
        type: 'ciclo',
        etapas: [
          { label: 'Fotossíntese', icon: 'arvore' },
          { label: 'Sedimentação' },
          { label: 'Estoque no solo' },
          { label: 'Liberação lenta' },
        ],
      },
    },
  },
  {
    type: 'camadas',
    brand: 'karagua',
    slide: {
      role: 'desenvolvimento',
      surface: 'lime',
      layout: 'figura',
      eyebrow: 'Exemplo',
      headline: 'O carbono não está só na árvore',
      figure: {
        type: 'camadas',
        camadas: [
          { label: 'Serapilheira', detalhe: 'Folhas e matéria orgânica em decomposição' },
          { label: 'Raízes e sedimento', detalhe: 'Emaranhado de pneumatóforos' },
          { label: 'Carbono azul estocado', detalhe: 'Camada anaeróbica, sem oxigênio' },
        ],
      },
    },
  },
  {
    type: 'linha-do-tempo',
    brand: 'karagua',
    slide: {
      role: 'desenvolvimento',
      surface: 'carbon',
      layout: 'figura',
      eyebrow: 'Exemplo',
      headline: 'A base legal foi se formando',
      figure: {
        type: 'linha-do-tempo',
        marcos: [
          { data: '2010', label: 'PEPSA, Lei nº 15.133' },
          { data: '2021', label: 'Política Nacional de PSA' },
          { data: '2024', label: 'ProManguezal, Decreto 12.045' },
          { data: '2024', label: 'SBCE, Lei nº 15.042' },
        ],
      },
    },
  },
  {
    type: 'balanca',
    brand: 'karagua',
    slide: {
      role: 'desenvolvimento',
      surface: 'shell',
      layout: 'figura',
      eyebrow: 'Exemplo',
      headline: 'Preservado ou aterrado',
      figure: {
        type: 'balanca',
        esquerda: {
          label: 'Manguezal preservado',
          itens: ['Estoca carbono', 'Protege a costa', 'Berçário de peixes'],
        },
        direita: {
          label: 'Manguezal aterrado',
          itens: ['Libera o carbono estocado', 'Perde a barreira natural', 'Some o berçário'],
        },
      },
    },
  },
  {
    type: 'mapa',
    brand: 'karagua',
    slide: {
      role: 'desenvolvimento',
      surface: 'lime',
      layout: 'figura',
      eyebrow: 'Exemplo',
      headline: 'Onde a Karaguá opera',
      figure: {
        type: 'mapa',
        pontos: [
          { lugar: 'barra-do-sul', nota: 'piloto, 380 ha', destaque: true },
          { lugar: 'sao-francisco-do-sul' },
          { lugar: 'joinville' },
        ],
        legenda: 'Baía da Babitonga, SC',
      },
    },
  },
  {
    type: 'serie',
    brand: 'karagua',
    slide: {
      role: 'desenvolvimento',
      surface: 'shell',
      layout: 'figura',
      eyebrow: 'Exemplo',
      headline: 'O preço subiu todo ano',
      figure: {
        type: 'serie',
        pontos: [
          { rotulo: '2021', valor: 8, valorLabel: 'US$ 8' },
          { rotulo: '2022', valor: 11, valorLabel: 'US$ 11' },
          { rotulo: '2023', valor: 13, valorLabel: 'US$ 13' },
          { rotulo: '2024', valor: 16, valorLabel: 'US$ 16' },
          { rotulo: '2025', valor: 19, valorLabel: 'US$ 19', destaque: true },
        ],
        unidade: 'por tCO₂e, dado de exemplo',
      },
    },
  },
  {
    type: 'anel',
    brand: 'karagua',
    slide: {
      role: 'desenvolvimento',
      surface: 'carbon',
      layout: 'figura',
      eyebrow: 'Exemplo',
      headline: 'A maior parte fica no chão',
      figure: {
        type: 'anel',
        valor: 68,
        valorLabel: '68%',
        rotulo: 'do carbono do manguezal está no sedimento',
        contexto: 'Não na árvore que se vê. Dado de exemplo.',
      },
    },
  },
  // ADX (docs/decisions/004) — same 8 components, different tokens.
  {
    type: 'balanca',
    brand: 'adx',
    slide: {
      role: 'desenvolvimento',
      surface: 'shell',
      layout: 'figura',
      eyebrow: 'Exemplo ADX',
      headline: 'Custo por lead qualificado',
      figure: {
        type: 'balanca',
        esquerda: { label: 'O que você vê hoje', itens: ['CPL: R$ 5,20'] },
        direita: { label: 'O que o ADX mostra', itens: ['CPQL: R$ 17,60'] },
      },
    },
  },
  {
    type: 'comparacao',
    brand: 'adx',
    slide: {
      role: 'desenvolvimento',
      surface: 'carbon',
      layout: 'figura',
      eyebrow: 'Exemplo ADX',
      headline: 'Seu painel para no primeiro número',
      figure: {
        type: 'comparacao',
        itens: [
          { label: 'Leads', valor: 312, valorLabel: '312' },
          { label: 'Qualificados', valor: 148, valorLabel: '148' },
          { label: 'Em contato', valor: 67, valorLabel: '67' },
          { label: 'Validação', valor: 21, valorLabel: '21', destaque: true },
        ],
      },
    },
  },
  {
    type: 'fluxo',
    brand: 'adx',
    slide: {
      role: 'desenvolvimento',
      surface: 'lime',
      layout: 'figura',
      eyebrow: 'Exemplo ADX',
      headline: 'Do clique até a venda',
      figure: {
        type: 'fluxo',
        etapas: [
          { label: 'Meta Ads', detalhe: 'Investimento por criativo' },
          { label: 'Lead', detalhe: 'O que o Meta já entrega' },
          { label: 'CRM', detalhe: 'Qualificação real do time' },
          { label: 'Venda', detalhe: 'O único número que paga a conta' },
        ],
      },
    },
  },
  {
    type: 'serie',
    brand: 'adx',
    slide: {
      role: 'desenvolvimento',
      surface: 'shell',
      layout: 'figura',
      eyebrow: 'Exemplo ADX',
      headline: 'O CPL caiu, o CPQL não',
      figure: {
        type: 'serie',
        pontos: [
          { rotulo: 'jan', valor: 5.2, valorLabel: 'R$ 5,20' },
          { rotulo: 'fev', valor: 4.8, valorLabel: 'R$ 4,80' },
          { rotulo: 'mar', valor: 4.1, valorLabel: 'R$ 4,10' },
          { rotulo: 'abr', valor: 3.9, valorLabel: 'R$ 3,90', destaque: true },
        ],
        unidade: 'custo por lead, dado de exemplo',
      },
    },
  },
  {
    type: 'anel',
    brand: 'adx',
    slide: {
      role: 'desenvolvimento',
      surface: 'lime',
      layout: 'figura',
      eyebrow: 'Exemplo ADX',
      headline: 'O lead que chega não é o que compra',
      figure: {
        type: 'anel',
        valor: 47,
        valorLabel: '47%',
        rotulo: 'dos leads são qualificados pelo time',
        contexto: 'O resto ocupa o CRM e não vira venda. Dado de exemplo.',
      },
    },
  },
  {
    type: 'analogia',
    brand: 'adx',
    slide: {
      role: 'desenvolvimento',
      surface: 'carbon',
      layout: 'figura',
      eyebrow: 'Exemplo ADX',
      headline: 'Cada venda custa muitas conversas',
      figure: {
        type: 'analogia',
        iconBase: 'carrinho',
        labelBase: '1 venda fechada',
        icon: 'mensagem',
        quantidade: 12,
        labelUnidade: '12 conversas no WhatsApp até chegar nela',
        afirmacao: 'O lead que chega não é o que compra.',
        dado: { value: '12x', label: 'conversas por venda. Dado de exemplo.' },
      },
    },
  },
  {
    type: 'ciclo',
    brand: 'karagua',
    slide: {
      role: 'desenvolvimento',
      surface: 'lime',
      layout: 'figura',
      eyebrow: 'Exemplo',
      headline: 'Do sol ao crédito',
      figure: {
        type: 'ciclo',
        etapas: [
          { label: 'Sol e água', icon: 'sol' },
          { label: 'Manguezal cresce', icon: 'folha' },
          { label: 'Carbono no sedimento', icon: 'nuvem' },
          { label: 'Crédito emitido', icon: 'documento' },
        ],
      },
    },
  },
];

export default function FigurasPage() {
  return (
    <>
      <h1 className={styles.title}>Catálogo de figuras</h1>
      <p className={styles.lede}>
        Os 10 tipos de diagrama que <code>slide.figure</code> pode desenhar (
        <code>src/components/figures/</code>), cada um com dado de exemplo — inclusive em mais de uma marca,
        pra mostrar que o mesmo componente muda de cor e tipografia sozinho a partir de <code>brand</code>{' '}
        (docs/decisions/004). O gerador só preenche dados; o desenho em si é fixo. Nenhum destes é uma geração
        real: não passa pelo gate e não fica salvo em <code>data/carousels/</code>.
      </p>

      <div className={styles.grid}>
        {SAMPLES.map(({ type, brand, slide }, index) => (
          <div className={styles.card} key={`${type}-${brand}-${index}`}>
            <div className={styles.cardLabel}>
              <span className={styles.label}>{FIGURE_LABEL[type]}</span>
              <span className={styles.brandLabel}>{BRAND_LABEL[brand]}</span>
            </div>
            <div className={styles.stage}>
              <SlideStage slide={slide} index={1} total={1} brand={brand} />
            </div>
          </div>
        ))}
      </div>

      <h2 className={styles.subtitle}>Ícones</h2>
      <p className={styles.lede}>
        Os {Object.keys(ICON_MEANING).length} ícones que <code>analogia</code> e <code>ciclo</code> podem usar. O
        gerador escolhe pelo significado escrito abaixo de cada um (<code>ICON_MEANING</code> em{' '}
        <code>src/lib/carousel.ts</code>), e o mesmo texto vai para o prompt dele.
      </p>
      <div className={styles.icons}>
        {(Object.keys(ICON_MEANING) as IconName[]).map((name) => (
          <div className={styles.iconCell} key={name}>
            <span className={styles.iconGlyph}>
              <Icon name={name} className={styles.iconSvg} />
            </span>
            <span className={styles.iconName}>{name}</span>
            <span className={styles.iconMeaning}>{ICON_MEANING[name]}</span>
          </div>
        ))}
      </div>
    </>
  );
}
