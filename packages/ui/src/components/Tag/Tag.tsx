import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Tag.module.css';

export type TagVariant = 'solid' | 'outline';
export type TagColor = 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type TagSize = 'sm' | 'md' | 'lg';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  label?: ReactNode;
  variant?: TagVariant;
  color?: TagColor;
  size?: TagSize;
  icon?: ReactNode;
}

export const Tag = ({
  label,
  variant = 'solid',
  color = 'neutral',
  size = 'md',
  icon,
  className = '',
  ...props
}: TagProps) => {
  const wrapperClasses = [styles.tag, styles[variant], styles[color], styles[size], className]
    .filter(Boolean)
    .join(' ');

  const shapeClasses = [styles.shape, styles.single].filter(Boolean).join(' ');

  return (
    <span className={wrapperClasses} {...props}>
      <span className={shapeClasses} />
      <span className={styles.content}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {label}
      </span>
    </span>
  );
};

export default Tag;
