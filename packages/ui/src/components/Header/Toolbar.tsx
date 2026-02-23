import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import styles from './Toolbar.module.css';

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  dense?: boolean;
  disableGutters?: boolean;
  style?: CSSProperties;
}

const Toolbar = ({
  children,
  className = '',
  dense = false,
  disableGutters = false,
  style,
  ...props
}: ToolbarProps) => {
  return (
    <div
      className={`
        ${styles.toolbar}
        ${dense ? styles.dense : ''}
        ${disableGutters ? styles.disableGutters : ''}
        ${className}
      `}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

export default Toolbar;
