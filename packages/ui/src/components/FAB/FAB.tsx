import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './FAB.module.css';

export type FABVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type FABType = 'solid' | 'outline';
export type FABShape = 'square' | 'round';

export interface FABProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children?: ReactNode;
  variant?: FABVariant;
  type?: FABType;
  shape?: FABShape;
}

const FAB = ({
  children,
  onClick,
  variant = 'primary',
  type = 'solid',
  shape = 'square',
  className = '',
  ...props
}: FABProps) => {
  return (
    <button
      className={`${styles.fab} ${styles[type]} ${styles[variant]} ${styles[shape]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default FAB;
