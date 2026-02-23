import { forwardRef } from 'react';
import type { CSSProperties, InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

export type InputVariant = 'solid' | 'ghost';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  error?: boolean;
  fullWidth?: boolean;
  style?: CSSProperties;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      style = {},
      variant = 'solid',
      error = false,
      disabled = false,
      fullWidth = false,
      ...props
    },
    ref,
  ) => {
    const wrapperClasses = [
      styles.wrapper,
      styles.single,
      styles[variant],
      error && styles.error,
      disabled && styles.disabled,
      fullWidth && styles.fullWidth,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses} style={style}>
        <input ref={ref} className={styles.input} disabled={disabled} {...props} />
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
