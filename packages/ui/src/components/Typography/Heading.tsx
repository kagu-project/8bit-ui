import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import styles from './Typography.module.css';

export type HeadingVariant = 'primary' | 'secondary' | 'danger' | 'neutral';
export type HeadingAlign = 'left' | 'center' | 'right';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children?: ReactNode;
  variant?: HeadingVariant;
  align?: HeadingAlign;
  style?: CSSProperties;
}

const Heading = ({
  level = 1,
  children,
  variant = 'neutral',
  align = 'left',
  className = '',
  style = {},
  ...props
}: HeadingProps) => {
  const clampedLevel = Math.min(Math.max(level, 1), 6) as 1 | 2 | 3 | 4 | 5 | 6;
  const Tag = `h${clampedLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  const classes = [
    styles.heading,
    styles[`h${clampedLevel}`],
    styles[variant],
    styles[align],
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

export default Heading;
