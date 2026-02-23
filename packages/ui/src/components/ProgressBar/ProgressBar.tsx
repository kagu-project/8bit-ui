import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import styles from './ProgressBar.module.css';

export type ProgressBarColor = 'primary' | 'danger' | 'secondary' | 'success' | 'warning' | string;
export type ProgressBarVariant = 'solid' | 'striped';
export type ProgressBarSize = 'sm' | 'md' | 'lg';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  color?: ProgressBarColor;
  variant?: ProgressBarVariant;
  animated?: boolean;
  size?: ProgressBarSize;
  label?: ReactNode;
  showValue?: boolean;
  style?: CSSProperties;
}

const ProgressBar = ({
  value = 0,
  max = 100,
  color = 'primary',
  variant = 'solid',
  animated = false,
  size = 'md',
  label,
  showValue = false,
  className = '',
  style = {},
  ...props
}: ProgressBarProps) => {
  const clampedValue = Math.min(Math.max(value, 0), max);
  const percentage = Math.round((clampedValue / max) * 100);

  const isPresetColor = ['primary', 'danger', 'secondary', 'success', 'warning'].includes(color);

  const containerClasses = [
    styles.container,
    styles[size],
    isPresetColor ? styles[color] : undefined,
    variant === 'striped' ? styles.striped : '',
    animated ? styles.animated : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const customStyles = {
    ...style,
    ...(!isPresetColor && color ? { '--progress-color': color } : {}),
  } as CSSProperties;

  return (
    <div
      className={containerClasses}
      style={customStyles}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={max}
      {...props}
    >
      {(label || showValue) && (
        <div className={styles.label}>
          <span>{label}</span>
          {showValue && (
            <span>
              {clampedValue} / {max}
            </span>
          )}
        </div>
      )}

      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;
