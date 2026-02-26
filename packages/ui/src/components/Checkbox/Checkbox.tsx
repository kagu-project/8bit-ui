'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties, ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
import styles from './Checkbox.module.css';
import formStyles from '../Form/Form.module.css';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> {
  label?: ReactNode;
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  style?: CSSProperties;
}

const Checkbox = ({
  label,
  checked,
  indeterminate = false,
  onChange,
  disabled = false,
  className = '',
  style = {},
  ...props
}: CheckboxProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.indeterminate = indeterminate && !(checked ?? inputRef.current.checked);
  }, [checked, indeterminate]);

  return (
    <label
      className={`${formStyles.container} ${disabled ? formStyles.disabled : ''} ${className}`}
      style={style}
    >
      <input
        ref={inputRef}
        type="checkbox"
        className={formStyles.input}
        {...props}
        {...(checked !== undefined ? { checked } : {})}
        onChange={onChange}
        disabled={disabled}
      />

      <span className={styles.checkmark}>
        <span className={styles.icon} />
        <span className={styles.mixedIcon} />
      </span>

      {label && <span className={formStyles.label}>{label}</span>}
    </label>
  );
};

export default Checkbox;
