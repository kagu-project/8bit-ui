'use client';

import { useState } from 'react';
import type { ButtonHTMLAttributes, KeyboardEvent, ReactNode } from 'react';
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
  variant = 'primary',
  type = 'solid',
  shape = 'square',
  className = '',
  onKeyDown,
  onKeyUp,
  onBlur,
  ...props
}: FABProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      setIsPressed(true);
    }
  };

  const handleKeyUp = () => {
    setIsPressed(false);
  };

  return (
    <button
      className={`${styles.fab} ${styles[type]} ${styles[variant]} ${styles[shape]} ${className}`}
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
      {...props}
    >
      {children}
    </button>
  );
};

export default FAB;
