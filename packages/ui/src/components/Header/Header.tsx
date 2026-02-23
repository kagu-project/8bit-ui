import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import styles from './Header.module.css';

export type HeaderVariant = 'default' | 'primary' | 'secondary' | 'transparent';

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  fixed?: boolean;
  variant?: HeaderVariant;
  elevation?: number;
  style?: CSSProperties;
}

const Header = ({
  children,
  className = '',
  fixed = false,
  variant = 'default',
  elevation = 0,
  style,
  ...props
}: HeaderProps) => {
  return (
    <header
      className={`
        ${styles.header}
        ${fixed ? styles.fixed : styles.static}
        ${styles[variant] || ''}
        ${elevation > 0 ? styles[`elevation${elevation}`] : ''}
        ${className}
      `}
      style={style}
      {...props}
    >
      {children}
    </header>
  );
};

export default Header;
