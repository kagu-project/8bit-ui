import type { CSSProperties, TextareaHTMLAttributes } from 'react';
import styles from './TextArea.module.css';

export type TextAreaVariant = 'solid' | 'ghost';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: TextAreaVariant;
  error?: boolean;
  fullWidth?: boolean;
  style?: CSSProperties;
}

const TextArea = ({
  variant = 'solid',
  error = false,
  disabled = false,
  fullWidth = false,
  className = '',
  rows = 4,
  style = {},
  ...props
}: TextAreaProps) => {
  const wrapperClasses = [
    styles.wrapper,
    styles[variant],
    styles.single,
    error && styles.error,
    disabled && styles.disabled,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses} style={style}>
      <textarea className={styles.textarea} disabled={disabled} rows={rows} {...props} />
    </div>
  );
};

export default TextArea;
