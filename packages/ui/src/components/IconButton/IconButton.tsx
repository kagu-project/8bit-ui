import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react';
import styles from './IconButton.module.css';

export type IconButtonVariant = 'default' | 'outline' | 'ghost';
export type IconButtonColor = 'primary' | 'secondary' | 'danger' | 'neutral';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The icon content (emoji, SVG, text character, etc.) */
  children: ReactNode;
  /** Visual style variant */
  variant?: IconButtonVariant;
  /** Color scheme */
  color?: IconButtonColor;
  /** Button size */
  size?: IconButtonSize;
  /** Accessible label (required when children is not text) */
  'aria-label': string;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { children, variant = 'ghost', color = 'neutral', size = 'md', className = '', ...props },
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const classes = [styles.iconButton, styles[variant], styles[color], styles[size], className]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} className={classes} {...props}>
        <span className={styles.icon}>{children}</span>
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';

export default IconButton;
