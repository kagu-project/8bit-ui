'use client';

import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';
import type { AriaRole, FC, HTMLAttributes, MouseEvent, ReactNode } from 'react';
import styles from './Drawer.module.css';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg';

export interface DrawerProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the drawer is open. */
  isOpen?: boolean;
  /** Called when the user requests the drawer to close (overlay click, Escape). */
  onClose?: () => void;
  /** Which edge the drawer slides in from. @default 'left' */
  placement?: DrawerPlacement;
  /** Width preset for left/right drawers. Ignored for top/bottom. @default 'md' */
  size?: DrawerSize;
  /** ARIA role. @default 'dialog' */
  role?: AriaRole;
  children?: ReactNode;
}

export interface DrawerHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  onClose?: () => void;
  children?: ReactNode;
}

export interface DrawerBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface DrawerFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface DrawerComponent extends FC<DrawerProps> {
  Header: FC<DrawerHeaderProps>;
  Body: FC<DrawerBodyProps>;
  Footer: FC<DrawerFooterProps>;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([type="hidden"]):not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const DrawerBase = ({
  isOpen,
  onClose,
  placement = 'left',
  size = 'md',
  children,
  className = '',
  role = 'dialog',
  ...props
}: DrawerProps) => {
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const previousBodyOverflowRef = useRef<string>('');

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElementRef.current = document.activeElement as HTMLElement | null;
    previousBodyOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const getFocusableElements = () => {
      const drawer = drawerRef.current;
      if (!drawer) return [];
      return Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
      );
    };

    const focusInitialElement = () => {
      const focusables = getFocusableElements();
      if (focusables.length > 0) {
        focusables[0]?.focus();
      } else {
        drawerRef.current?.focus();
      }
    };

    focusInitialElement();

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
        return;
      }

      if (e.key !== 'Tab') return;

      const drawer = drawerRef.current;
      if (!drawer) return;

      const focusables = getFocusableElements();
      if (focusables.length === 0) {
        e.preventDefault();
        drawer.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!active || !drawer.contains(active)) {
        e.preventDefault();
        first?.focus();
        return;
      }

      if (e.shiftKey && (active === first || active === drawer)) {
        e.preventDefault();
        last?.focus();
        return;
      }

      if (!e.shiftKey && active === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.body.style.overflow = previousBodyOverflowRef.current;
      document.removeEventListener('keydown', handleKeydown);

      const previous = previousActiveElementRef.current;
      if (previous && typeof previous.focus === 'function') {
        previous.focus();
      }
      previousActiveElementRef.current = null;
      previousBodyOverflowRef.current = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onClose?.();
  };

  const handleDrawerClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const isHorizontal = placement === 'left' || placement === 'right';
  const sizeClass = isHorizontal ? styles[size] : '';

  return createPortal(
    <>
      <div className={styles.overlay} onClick={handleOverlayClick} aria-hidden="true" />
      <div
        className={`${styles.drawer} ${styles[placement]} ${sizeClass} ${className}`.trim()}
        role={role}
        aria-modal="true"
        onClick={handleDrawerClick}
        tabIndex={-1}
        ref={drawerRef}
        {...props}
      >
        {children}
      </div>
    </>,
    document.body,
  );
};

const Header = ({ title, onClose, children, className = '', ...props }: DrawerHeaderProps) => (
  <div className={`${styles.header} ${className}`} {...props}>
    {title && <h2 className={styles.title}>{title}</h2>}
    {children}
    {onClose && (
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close drawer" type="button">
        ×
      </button>
    )}
  </div>
);

const Body = ({ children, className = '', ...props }: DrawerBodyProps) => (
  <div className={`${styles.body} ${className}`} {...props}>
    {children}
  </div>
);

const Footer = ({ children, className = '', ...props }: DrawerFooterProps) => (
  <div className={`${styles.footer} ${className}`} {...props}>
    {children}
  </div>
);

const Drawer = DrawerBase as DrawerComponent;

Drawer.Header = Header;
Drawer.Body = Body;
Drawer.Footer = Footer;

export default Drawer;
