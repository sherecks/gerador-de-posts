'use client';

import {
  type ReactNode,
  type ReactElement,
  type KeyboardEvent,
  cloneElement,
  isValidElement,
  useId,
  useState,
  useRef,
  useEffect,
} from 'react';
import styles from './Tooltip.module.css';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: string;
  position?: TooltipPosition;
  children: ReactNode;
  className?: string;
}

export function Tooltip({
  content,
  position = 'top',
  children,
  className,
}: TooltipProps) {
  const tipId = useId();
  const [dismissed, setDismissed] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!dismissed) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const reset = () => setDismissed(false);
    wrapper.addEventListener('mouseleave', reset, { once: true });
    wrapper.addEventListener('blur', reset, { once: true, capture: true });
    return () => {
      wrapper.removeEventListener('mouseleave', reset);
      wrapper.removeEventListener('blur', reset, { capture: true } as EventListenerOptions);
    };
  }, [dismissed]);

  const wrapperClasses = [
    styles.wrapper,
    dismissed && styles.dismissed,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const tipClasses = [
    styles.tip,
    styles[`pos-${position}`],
  ]
    .filter(Boolean)
    .join(' ');

  const trigger = isValidElement(children)
    ? cloneElement(
        children as ReactElement<{
          'aria-describedby'?: string;
          onKeyDown?: (e: KeyboardEvent) => void;
        }>,
        {
          'aria-describedby': tipId,
          onKeyDown: (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
              setDismissed(true);
              (e.currentTarget as HTMLElement).blur();
            }
            const original = (
              children as ReactElement<{ onKeyDown?: (e: KeyboardEvent) => void }>
            ).props.onKeyDown;
            original?.(e);
          },
        },
      )
    : children;

  return (
    <span ref={wrapperRef} className={wrapperClasses}>
      {trigger}
      <span id={tipId} className={tipClasses} role="tooltip">
        {content}
      </span>
    </span>
  );
}
