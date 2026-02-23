import { Children } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import styles from './Grid.module.css';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  columns?: number | 'auto';
  gap?: number | string;
  minWidth?: number | string;
  emptyState?: ReactNode;
  style?: CSSProperties;
}

const Grid = ({
  children,
  columns = 'auto',
  gap,
  minWidth = '240px',
  emptyState,
  className = '',
  style = {},
  ...props
}: GridProps) => {
  const isList = columns === 1;

  const dynamicStyles = {
    '--grid-gap': typeof gap === 'number' ? `${gap}px` : gap,
    '--grid-min-width': typeof minWidth === 'number' ? `${minWidth}px` : minWidth,
    ...style,
  } as CSSProperties;

  const hasChildren = Children.count(children) > 0;

  if (!hasChildren && emptyState) {
    return (
      <div className={`${styles.empty} ${className}`} style={dynamicStyles}>
        {emptyState}
      </div>
    );
  }

  return (
    <div
      className={`${isList ? styles['layout-list'] : styles['layout-grid']} ${className}`}
      style={dynamicStyles}
      {...props}
    >
      {children}
    </div>
  );
};

export default Grid;
