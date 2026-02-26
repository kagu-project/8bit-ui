'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import styles from './Layout.module.css';

export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  bottomNav?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
}

const Layout = ({ header, bottomNav, children, className = '', style, ...props }: LayoutProps) => {
  const [paddingBottom, setPaddingBottom] = useState(0);
  const bottomNavRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bottomNavRef.current) {
      setPaddingBottom(bottomNavRef.current.offsetHeight);
    }
  }, [bottomNav]);

  return (
    <div className={`${styles.layout} ${className}`} style={style} {...props}>
      {header && <div style={{ position: 'sticky', top: 0, zIndex: 1100 }}>{header}</div>}

      <main className={styles.content} style={{ paddingBottom: bottomNav ? paddingBottom : 0 }}>
        {children}
      </main>

      {bottomNav && (
        <div
          ref={bottomNavRef}
          style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }}
        >
          {bottomNav}
        </div>
      )}
    </div>
  );
};

export default Layout;
