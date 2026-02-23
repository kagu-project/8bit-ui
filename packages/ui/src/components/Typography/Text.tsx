import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';
import styles from './Typography.module.css';

export type TextSize = 'sm' | 'md' | 'lg';
export type TextWeight = 'normal' | 'bold';
export type TextVariant = 'primary' | 'secondary' | 'danger' | 'neutral';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  size?: TextSize;
  weight?: TextWeight;
  variant?: TextVariant;
  mono?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}

const Text = ({
  as: Tag = 'p',
  size = 'md',
  weight = 'normal',
  variant = 'neutral',
  mono = false,
  children,
  className = '',
  style = {},
  ...props
}: TextProps) => {
  const classes = [
    styles.text,
    styles[size],
    styles[weight],
    styles[variant],
    mono && styles.mono,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} style={style} {...props}>
      {children}
    </Tag>
  );
};

export default Text;
