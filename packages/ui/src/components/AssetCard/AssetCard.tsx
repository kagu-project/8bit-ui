'use client';

import { useState } from 'react';
import type { DragEvent, HTMLAttributes, MouseEvent, ReactNode } from 'react';
import styles from './AssetCard.module.css';

export type AssetCardLayout = 'vertical' | 'horizontal';

export interface AssetCardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title' | 'onDrop' | 'onSelect'
> {
  src?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  layout?: AssetCardLayout;
  onDrop?: (files: File[]) => void;
  accept?: string;
  isLoading?: boolean;
  actions?: ReactNode;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
}

const AssetCard = ({
  src,
  title,
  subtitle,
  layout = 'vertical',
  onDrop,
  accept,
  isLoading = false,
  actions,
  selected = false,
  onSelect,
  className = '',
  ...props
}: AssetCardProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onDrop || isLoading) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (onDrop && !isLoading) {
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) onDrop(files);
    }
  };

  const handleSelect = (e: MouseEvent<HTMLDivElement>) => {
    if (onSelect) {
      e.stopPropagation();
      onSelect(!selected);
    }
  };

  return (
    <div
      className={`${styles.card} ${styles[layout]} ${styles.single} ${selected ? styles.selected : ''} ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-accept={accept}
      {...props}
    >
      {onSelect && (
        <div
          className={styles.checkbox}
          onClick={handleSelect}
          role="checkbox"
          aria-checked={selected}
        />
      )}

      {isDragOver && <div className={styles.dropInfo}>DROP TO UPLOAD</div>}

      {src ? (
        <img
          src={src}
          alt={typeof title === 'string' ? title : 'Asset preview'}
          className={styles.preview}
          draggable={false}
        />
      ) : (
        <div
          className={styles.preview}
          style={{
            background: '#eee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 24, opacity: 0.3 }}>IMG</span>
        </div>
      )}

      <div className={styles.content}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        {actions && (
          <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetCard;
