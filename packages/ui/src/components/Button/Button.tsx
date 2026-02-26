'use client';

import { forwardRef, useState } from 'react';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ForwardedRef,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'solid' | 'outline' | 'link';
export type ButtonColor = 'primary' | 'secondary' | 'danger' | 'neutral';

interface ButtonSharedProps {
  children?: ReactNode;
  variant?: ButtonVariant;
  color?: ButtonColor;
}

type ButtonAsButtonProps = ButtonSharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsAnchorProps = ButtonSharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    disabled?: boolean;
    type?: never;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ children, variant = 'solid', color = 'primary', className = '', ...props }, ref) => {
    const [isPressed, setIsPressed] = useState(false);

    const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        setIsPressed(true);
      }
    };

    const handleKeyUp = () => {
      setIsPressed(false);
    };

    const wrapperClasses = [styles.button, styles[variant], styles[color], className]
      .filter(Boolean)
      .join(' ');

    const shapeClasses = styles.shape;
    const isLinkButton = 'href' in props && typeof props.href === 'string';

    if (isLinkButton) {
      const {
        href,
        disabled = false,
        onClick,
        onKeyDown,
        onKeyUp,
        onBlur,
        tabIndex,
        ...anchorProps
      } = props as ButtonAsAnchorProps;

      const handleAnchorClick = (e: MouseEvent<HTMLAnchorElement>) => {
        if (disabled) {
          e.preventDefault();
          return;
        }

        onClick?.(e);
      };

      return (
        <a
          ref={ref as ForwardedRef<HTMLAnchorElement>}
          href={href}
          className={wrapperClasses}
          data-pressed={isPressed}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : tabIndex}
          onClick={handleAnchorClick}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            handleKeyDown(e);
          }}
          onKeyUp={(e) => {
            onKeyUp?.(e);
            handleKeyUp();
          }}
          onBlur={(e) => {
            onBlur?.(e);
            setIsPressed(false);
          }}
          {...anchorProps}
        >
          <span className={shapeClasses} />
          <span className={styles.label}>{children}</span>
        </a>
      );
    }

    const { onKeyDown, onKeyUp, onBlur, type = 'button', ...buttonProps } =
      props as ButtonAsButtonProps;
    const nativeType = type === 'submit' || type === 'reset' || type === 'button' ? type : 'button';

    return (
      <button
        ref={ref as ForwardedRef<HTMLButtonElement>}
        className={wrapperClasses}
        data-pressed={isPressed}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          handleKeyDown(e);
        }}
        onKeyUp={(e) => {
          onKeyUp?.(e);
          handleKeyUp();
        }}
        onBlur={(e) => {
          onBlur?.(e);
          setIsPressed(false);
        }}
        type={nativeType}
        {...buttonProps}
      >
        <span className={shapeClasses} />
        <span className={styles.label}>{children}</span>
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
