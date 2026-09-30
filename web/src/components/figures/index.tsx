import type { Brand, Figure as FigureData, Surface } from '@/lib/carousel';
import { Analogia } from './Analogia';
import { Balanca } from './Balanca';
import { Camadas } from './Camadas';
import { Ciclo } from './Ciclo';
import { Comparacao } from './Comparacao';
import { Fluxo } from './Fluxo';
import { LinhaDoTempo } from './LinhaDoTempo';
import { Anel } from './Anel';
import { Mapa } from './Mapa';
import { Serie } from './Serie';

/**
 * Dispatches to one of the fixed figure components (docs/PRD figure catalog).
 * The generator only ever supplies data for one of these types; it never
 * writes SVG itself, which is what keeps every diagram on-brand.
 *
 * Color reaches the figures as the `--fig-*` tokens the slide surface sets,
 * so none of them decides a color. `surface` is passed explicitly only where
 * a decision depends on it: `camadas` picks label ink from the luminance of
 * the ramp step it lands on.
 */
export function Figure({ figure, surface, brand }: { figure: FigureData; surface: Surface; brand: Brand }) {
  switch (figure.type) {
    case 'comparacao':
      return <Comparacao data={figure} />;
    case 'analogia':
      return <Analogia data={figure} />;
    case 'fluxo':
      return <Fluxo data={figure} />;
    case 'ciclo':
      return <Ciclo data={figure} />;
    case 'camadas':
      return <Camadas data={figure} surface={surface} brand={brand} />;
    case 'linha-do-tempo':
      return <LinhaDoTempo data={figure} />;
    case 'balanca':
      return <Balanca data={figure} />;
    case 'mapa':
      return <Mapa data={figure} />;
    case 'serie':
      return <Serie data={figure} />;
    case 'anel':
      return <Anel data={figure} />;
  }
}
