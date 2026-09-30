import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function useFocusTrap<T extends HTMLElement>(
  active: boolean,
): RefObject<T | null> {
  const containerRef = useRef<T | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    restoreRef.current = (document.activeElement as HTMLElement) ?? null;

    const inertSiblings: HTMLElement[] = [];
    const rootBoundary = container.closest('body > *') ?? container;
    if (rootBoundary.parentElement) {
      for (const child of Array.from(rootBoundary.parentElement.children)) {
        if (child === rootBoundary) continue;
        if (child instanceof HTMLElement && !child.hasAttribute('inert')) {
          child.setAttribute('inert', '');
          child.setAttribute('aria-hidden', 'true');
          inertSiblings.push(child);
        }
      }
    }

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
      );

    const first = focusables()[0];
    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (activeEl === firstEl || !container.contains(activeEl)) {
          e.preventDefault();
          lastEl?.focus();
        }
      } else {
        if (activeEl === lastEl) {
          e.preventDefault();
          firstEl?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      for (const el of inertSiblings) {
        el.removeAttribute('inert');
        el.removeAttribute('aria-hidden');
      }
      restoreRef.current?.focus();
    };
  }, [active]);

  return containerRef;
}
