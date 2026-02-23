import type { CSSProperties, ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
import styles from './Radio.module.css';
import formStyles from '../Form/Form.module.css';

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> {
  label?: ReactNode;
  checked?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  style?: CSSProperties;
}

const Radio = ({
  label,
  checked,
  onChange,
  value,
  name,
  disabled = false,
  className = '',
  style = {},
  ...props
}: RadioProps) => {
  return (
    <label
      className={`${formStyles.container} ${disabled ? formStyles.disabled : ''} ${className}`}
      style={style}
    >
      <input
        type="radio"
        className={formStyles.input}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        name={name}
        value={value}
        {...props}
      />

      <span className={`${styles.radio} ${checked ? styles.checked : ''}`}>
        {checked && <span className={styles.dot} />}
      </span>

      {label && <span className={formStyles.label}>{label}</span>}
    </label>
  );
};

export default Radio;
