'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  ButtonHTMLAttributes,
  FC,
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  MutableRefObject,
  ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import styles from './Menu.module.css';

export type MenuSide = 'bottom' | 'top';
export type MenuAlign = 'start' | 'center' | 'end';

interface MenuContextValue {
  closeOnSelect: boolean;
  contentId: string;
  contentRef: MutableRefObject<HTMLDivElement | null>;
  isOpen: boolean;
  setOpen: (next: boolean) => void;
  triggerRef: MutableRefObject<HTMLButtonElement | null>;
}

const MenuContext = createContext<MenuContextValue | null>(null);

const useMenuContext = (name: string): MenuContextValue => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error(`${name} must be used within Menu.`);
  }
  return context;
};

const getEnabledItems = (
  contentRef: MutableRefObject<HTMLDivElement | null>,
): HTMLButtonElement[] => {
  if (!contentRef.current) return [];
  return Array.from(
    contentRef.current.querySelectorAll('[data-menu-item="true"]:not([data-disabled="true"])'),
  ) as HTMLButtonElement[];
};

export interface MenuProps {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnSelect?: boolean;
}

export interface MenuTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
}

export interface MenuContentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: ReactNode;
  side?: MenuSide;
  align?: MenuAlign;
  offset?: number;
  collisionPadding?: number;
}

export interface MenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  danger?: boolean;
  selected?: boolean;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
}

export interface MenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

export interface MenuComponent extends FC<MenuProps> {
  Trigger: FC<MenuTriggerProps>;
  Content: FC<MenuContentProps>;
  Item: FC<MenuItemProps>;
  Separator: FC<MenuSeparatorProps>;
}

const MenuBase = ({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnSelect = true,
}: MenuProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const contentId = useId();

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || contentRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, setOpen]);

  const contextValue = useMemo<MenuContextValue>(
    () => ({
      closeOnSelect,
      contentId,
      contentRef,
      isOpen,
      setOpen,
      triggerRef,
    }),
    [closeOnSelect, contentId, isOpen, setOpen],
  );

  return <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>;
};

const Trigger = ({
  children,
  ariaLabel,
  className = '',
  disabled = false,
  onClick,
  onKeyDown,
  ...props
}: MenuTriggerProps) => {
  const { contentId, isOpen, setOpen, triggerRef } = useMenuContext('Menu.Trigger');

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    setOpen(!isOpen);
    onClick?.(event);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (disabled) {
      onKeyDown?.(event);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(!isOpen);
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
    }

    onKeyDown?.(event);
  };

  return (
    <button
      type="button"
      ref={triggerRef}
      className={`${styles.trigger} ${className}`}
      aria-label={ariaLabel}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-controls={contentId}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </button>
  );
};

const Content = ({
  children,
  side = 'bottom',
  align = 'end',
  offset = 8,
  collisionPadding = 8,
  className = '',
  ...props
}: MenuContentProps) => {
  const { contentId, contentRef, isOpen, setOpen, triggerRef } = useMenuContext('Menu.Content');
  const [position, setPosition] = useState({
    left: -10000,
    side,
    top: -10000,
    width: 180,
  });

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    const spaceBelow = window.innerHeight - triggerRect.bottom - collisionPadding;
    const spaceAbove = triggerRect.top - collisionPadding;

    let resolvedSide = side;
    if (side === 'bottom' && spaceBelow < contentRect.height && spaceAbove > spaceBelow) {
      resolvedSide = 'top';
    }
    if (side === 'top' && spaceAbove < contentRect.height && spaceBelow > spaceAbove) {
      resolvedSide = 'bottom';
    }

    let top =
      resolvedSide === 'bottom'
        ? triggerRect.bottom + offset
        : triggerRect.top - contentRect.height - offset;

    let left = triggerRect.left;
    if (align === 'center') {
      left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
    }
    if (align === 'end') {
      left = triggerRect.right - contentRect.width;
    }

    const maxLeft = window.innerWidth - contentRect.width - collisionPadding;
    const maxTop = window.innerHeight - contentRect.height - collisionPadding;

    left = Math.min(Math.max(left, collisionPadding), Math.max(collisionPadding, maxLeft));
    top = Math.min(Math.max(top, collisionPadding), Math.max(collisionPadding, maxTop));

    setPosition({
      left,
      side: resolvedSide,
      top,
      width: Math.max(160, triggerRect.width),
    });
  }, [align, collisionPadding, offset, side, triggerRef, contentRef]);

  useLayoutEffect(() => {
    if (!isOpen) return undefined;

    const raf = requestAnimationFrame(updatePosition);
    const handleReposition = () => updatePosition();

    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const raf = requestAnimationFrame(() => {
      const firstEnabled = getEnabledItems(contentRef)[0];
      firstEnabled?.focus();
    });

    return () => cancelAnimationFrame(raf);
  }, [isOpen, contentRef]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const enabledItems = getEnabledItems(contentRef);

    if (event.key === 'Tab') {
      setOpen(false);
      return;
    }

    if (!enabledItems.length) return;

    const currentIndex = enabledItems.indexOf(document.activeElement as HTMLButtonElement);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % enabledItems.length;
      enabledItems[nextIndex].focus();
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const previousIndex =
        currentIndex === -1
          ? enabledItems.length - 1
          : (currentIndex - 1 + enabledItems.length) % enabledItems.length;
      enabledItems[previousIndex].focus();
    }

    if (event.key === 'Home') {
      event.preventDefault();
      enabledItems[0].focus();
    }

    if (event.key === 'End') {
      event.preventDefault();
      enabledItems[enabledItems.length - 1].focus();
    }
  };

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      id={contentId}
      ref={contentRef}
      role="menu"
      className={`${styles.content} ${styles.single} ${className}`}
      data-side={position.side}
      style={{
        left: `${position.left}px`,
        minWidth: `${position.width}px`,
        top: `${position.top}px`,
      }}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>,
    document.body,
  );
};

const Item = ({
  children,
  onSelect,
  disabled = false,
  danger = false,
  selected,
  leftSlot,
  rightSlot,
  className = '',
  onClick,
  ...props
}: MenuItemProps) => {
  const { closeOnSelect, setOpen } = useMenuContext('Menu.Item');
  const hasSelectableState = typeof selected === 'boolean';

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    onSelect?.();
    onClick?.(event);

    if (closeOnSelect) {
      setOpen(false);
    }
  };

  return (
    <button
      type="button"
      role={hasSelectableState ? 'menuitemradio' : 'menuitem'}
      tabIndex={-1}
      className={`${styles.item} ${danger ? styles.danger : ''} ${disabled ? styles.disabled : ''} ${className}`}
      data-menu-item="true"
      data-disabled={disabled ? 'true' : 'false'}
      data-selected={selected ? 'true' : 'false'}
      aria-disabled={disabled}
      aria-checked={hasSelectableState ? selected : undefined}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {leftSlot && <span className={styles.leftSlot}>{leftSlot}</span>}
      <span className={styles.itemLabel}>{children}</span>
      {rightSlot && <span className={styles.rightSlot}>{rightSlot}</span>}
    </button>
  );
};

const Separator = ({ className = '', ...props }: MenuSeparatorProps) => (
  <div role="separator" className={`${styles.separator} ${className}`} {...props} />
);

const Menu = MenuBase as MenuComponent;

Menu.Trigger = Trigger;
Menu.Content = Content;
Menu.Item = Item;
Menu.Separator = Separator;

export default Menu;
