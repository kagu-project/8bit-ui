import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';
import type { AriaRole, FC, HTMLAttributes, MouseEvent, ReactNode } from 'react';
import styles from './Modal.module.css';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  isOpen?: boolean;
  onClose?: () => void;
  size?: ModalSize;
  title?: ReactNode;
  children?: ReactNode;
  role?: AriaRole;
}

export interface ModalHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  onClose?: () => void;
  children?: ReactNode;
}

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface ModalComponent extends FC<ModalProps> {
  Header: FC<ModalHeaderProps>;
  Body: FC<ModalBodyProps>;
  Footer: FC<ModalFooterProps>;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([type="hidden"]):not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const ModalBase = ({
  isOpen,
  onClose,
  size = 'md',
  title,
  children,
  className = '',
  role = 'dialog',
  ...props
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const previousBodyOverflowRef = useRef<string>('');

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElementRef.current = document.activeElement as HTMLElement | null;
    previousBodyOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const getFocusableElements = () => {
      const modal = modalRef.current;
      if (!modal) return [];
      return Array.from(modal.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
      );
    };

    const focusInitialElement = () => {
      const focusables = getFocusableElements();
      if (focusables.length > 0) {
        focusables[0]?.focus();
      } else {
        modalRef.current?.focus();
      }
    };

    focusInitialElement();

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
        return;
      }

      if (e.key !== 'Tab') return;

      const modal = modalRef.current;
      if (!modal) return;

      const focusables = getFocusableElements();
      if (focusables.length === 0) {
        e.preventDefault();
        modal.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!active || !modal.contains(active)) {
        e.preventDefault();
        first?.focus();
        return;
      }

      if (e.shiftKey && (active === first || active === modal)) {
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

  const handleContainerClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modal} ${styles[size]} ${className}`}
        role={role}
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        onClick={handleContainerClick}
        tabIndex={-1}
        ref={modalRef}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

const Header = ({ title, onClose, children, className = '', ...props }: ModalHeaderProps) => (
  <div className={`${styles.header} ${className}`} {...props}>
    {title && (
      <h2 id="modal-title" className={styles.title}>
        {title}
      </h2>
    )}
    {children}
    {onClose && (
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close" type="button">
        ×
      </button>
    )}
  </div>
);

const Body = ({ children, className = '', ...props }: ModalBodyProps) => (
  <div className={`${styles.body} ${className}`} {...props}>
    {children}
  </div>
);

const Footer = ({ children, className = '', ...props }: ModalFooterProps) => (
  <div className={`${styles.footer} ${className}`} {...props}>
    {children}
  </div>
);

const Modal = ModalBase as ModalComponent;

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;
