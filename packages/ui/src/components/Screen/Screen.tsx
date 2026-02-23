import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import styles from './Screen.module.css';

export type ScreenMode = 'inline' | 'fixed';

export interface ScreenProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  backgroundImage?: string;
  backgroundClassName?: string;
  contentClassName?: string;
  scanlines?: boolean;
  vignette?: boolean;
  grid?: boolean;
  mode?: ScreenMode;
  style?: CSSProperties;
}

const Screen = ({
  children,
  backgroundImage,
  backgroundClassName = '',
  contentClassName = '',
  scanlines = false,
  vignette = false,
  grid = true,
  mode = 'fixed',
  className = '',
  style = {},
  ...props
}: ScreenProps) => {
  const screenClasses = [styles.screen, mode === 'fixed' ? styles.fixed : styles.inline, className]
    .filter(Boolean)
    .join(' ');
  const backgroundClasses = [styles.background, backgroundClassName].filter(Boolean).join(' ');
  const contentClasses = [
    styles.content,
    mode === 'fixed' ? styles.contentFixed : styles.contentInline,
    contentClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={screenClasses} style={style} {...props}>
      <div
        className={backgroundClasses}
        style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
      />

      {grid && <div className={styles.grid} />}

      <div className={contentClasses}>{children}</div>

      <div className={styles.overlay}>
        {scanlines && <div className={styles.scanlines} />}
        {vignette && <div className={styles.vignette} />}
      </div>
    </div>
  );
};

export default Screen;
