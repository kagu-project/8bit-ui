import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

export type CardVariant = 'solid' | 'outline';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  children?: ReactNode;
  title?: ReactNode;
  variant?: CardVariant;
}

const Card = ({ children, title, variant = 'solid', className = '', ...props }: CardProps) => {
  const classes = [styles.card, styles[variant], styles.single, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {title && <div className={styles.header}>{title}</div>}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Card;
