import type { IconName } from '@/lib/carousel';

/**
 * Small flat icon set for `analogia`/`ciclo` figures. Fixed catalog, filled
 * with `currentColor` so it inherits whatever the slide surface sets, never
 * a color the generator picks. Geometric, no gradients, no rounded frame
 * (DESIGN.md flat-at-rest) — only the glyph itself may use a circle/curve
 * where that is the natural shape (a wheel, a coin).
 */

type IconProps = { className?: string };

function Arvore({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <rect x="14" y="20" width="4" height="10" />
      <polygon points="16,2 26,18 6,18" />
    </svg>
  );
}

function Carro({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <polygon points="4,20 8,10 24,10 28,20" />
      <rect x="2" y="18" width="28" height="6" />
      <circle cx="9" cy="26" r="3" />
      <circle cx="23" cy="26" r="3" />
    </svg>
  );
}

function Moeda({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="16" cy="16" r="14" />
      <rect x="14" y="8" width="4" height="16" fill="var(--k-color-surface-carbon)" />
    </svg>
  );
}

function Casa({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <polygon points="16,3 30,16 24,16 24,29 8,29 8,16 2,16" />
    </svg>
  );
}

function Peixe({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <ellipse cx="14" cy="16" rx="11" ry="7" />
      <polygon points="24,10 32,16 24,22" />
    </svg>
  );
}

function Onda({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <path
        d="M2,20 C7,12 11,12 16,20 C21,28 25,28 30,20"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  );
}

function Fabrica({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <rect x="2" y="16" width="28" height="14" />
      <polygon points="4,16 4,8 11,13 11,8 18,13 18,7 24,12 24,16" />
    </svg>
  );
}

function Pessoa({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="16" cy="9" r="6" />
      <polygon points="6,30 8,18 24,18 26,30" />
    </svg>
  );
}

function Folha({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M5,27 C5,12 13,4 28,4 C28,19 20,27 5,27 Z M9.6,23.4 L21,12 L22.4,13.4 L11,24.8 Z" />
    </svg>
  );
}

function Gota({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16,2 C16,2 5,14.5 5,20.5 A11,11 0 0 0 27,20.5 C27,14.5 16,2 16,2 Z" />
    </svg>
  );
}

function Nuvem({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="9.5" cy="20" r="6" />
      <circle cx="17" cy="14" r="8" />
      <circle cx="25" cy="20" r="6" />
      <rect x="9.5" y="20" width="15.5" height="6" />
    </svg>
  );
}

function Sol({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="16" cy="16" r="7" />
      <g stroke="currentColor" strokeWidth="3">
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="16" y1="26" x2="16" y2="30" />
        <line x1="2" y1="16" x2="6" y2="16" />
        <line x1="26" y1="16" x2="30" y2="16" />
        <line x1="6.1" y1="6.1" x2="9" y2="9" />
        <line x1="25.9" y1="6.1" x2="23" y2="9" />
        <line x1="6.1" y1="25.9" x2="9" y2="23" />
        <line x1="25.9" y1="25.9" x2="23" y2="23" />
      </g>
    </svg>
  );
}

function Barco({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <rect x="15" y="4" width="2" height="16" />
      <polygon points="13.5,6 13.5,17 5,17" />
      <polygon points="18.5,9 18.5,17 27,17" />
      <polygon points="2,20 30,20 25,28 7,28" />
    </svg>
  );
}

function Predio({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M6,3 H26 V30 H6 Z M10,7 h4 v4 h-4 Z M18,7 h4 v4 h-4 Z M10,14 h4 v4 h-4 Z M18,14 h4 v4 h-4 Z M14,23 h4 v7 h-4 Z" />
    </svg>
  );
}

function Documento({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M7,2 H20 L26,8 V30 H7 Z M11,14 H22 V16 H11 Z M11,19 H22 V21 H11 Z M11,24 H18 V26 H11 Z" />
    </svg>
  );
}

function Grafico({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <rect x="4" y="18" width="6" height="12" />
      <rect x="13" y="10" width="6" height="20" />
      <rect x="22" y="3" width="6" height="27" />
    </svg>
  );
}

function Alvo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="3">
        <circle cx="16" cy="16" r="12.5" />
        <circle cx="16" cy="16" r="6.5" />
      </g>
      <circle cx="16" cy="16" r="2.6" />
    </svg>
  );
}

function Funil({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M3,4 H29 L19,15 V27 L13,23 V15 Z" />
    </svg>
  );
}

function Telefone({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M9,2 H23 V30 H9 Z M11.5,5.5 H20.5 V23.5 H11.5 Z M14.5,25.6 H17.5 V28 H14.5 Z" />
    </svg>
  );
}

function Mensagem({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M3,5 H29 V22 H15 L8,29 V22 H3 Z M8,10 H24 V12 H8 Z M8,15 H19 V17 H8 Z" />
    </svg>
  );
}

function Carrinho({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M2,4 H7 L10,20 H25 L28,8 H8.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="miter" />
      <circle cx="12" cy="26" r="2.6" />
      <circle cx="23" cy="26" r="2.6" />
    </svg>
  );
}

function Relogio({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="3">
        <circle cx="16" cy="16" r="13" />
        <polyline points="16,8 16,16 22,19.5" />
      </g>
    </svg>
  );
}

function Usuarios({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="16" cy="10" r="5" />
      <polygon points="10,29 11,18 21,18 22,29" />
      <circle cx="6" cy="12" r="3.6" />
      <polygon points="1,27 2,18 9,18 8,27" />
      <circle cx="26" cy="12" r="3.6" />
      <polygon points="24,18 30,18 31,27 24,27" />
    </svg>
  );
}

function Alerta({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M16,3 L30,28 H2 Z M14.5,11 H17.5 V19 H14.5 Z M14.5,21.5 H17.5 V24.5 H14.5 Z" />
    </svg>
  );
}

const ICON: Record<IconName, (props: IconProps) => React.JSX.Element> = {
  arvore: Arvore,
  carro: Carro,
  moeda: Moeda,
  casa: Casa,
  peixe: Peixe,
  onda: Onda,
  fabrica: Fabrica,
  pessoa: Pessoa,
  folha: Folha,
  gota: Gota,
  nuvem: Nuvem,
  sol: Sol,
  barco: Barco,
  predio: Predio,
  documento: Documento,
  grafico: Grafico,
  alvo: Alvo,
  funil: Funil,
  telefone: Telefone,
  mensagem: Mensagem,
  carrinho: Carrinho,
  relogio: Relogio,
  usuarios: Usuarios,
  alerta: Alerta,
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Cmp = ICON[name];
  return <Cmp className={className} />;
}
