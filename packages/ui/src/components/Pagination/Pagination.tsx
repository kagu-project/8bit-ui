import type { CSSProperties, HTMLAttributes } from 'react';
import styles from './Pagination.module.css';

export interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  style?: CSSProperties;
}

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
  style = {},
  ...props
}: PaginationProps) => {
  const handlePageChange = (page: number) => {
    if (onPageChange && page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const getPageNumbers = (): Array<number | string> => {
    const pages: Array<number | string> = [];
    const windowSize = 1;

    pages.push(1);

    const rangeStart = Math.max(2, currentPage - windowSize);
    const rangeEnd = Math.min(totalPages - 1, currentPage + windowSize);

    if (rangeStart > 2) pages.push('...');

    for (let i = rangeStart; i <= rangeEnd; i += 1) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) pages.push('...');

    if (totalPages > 1) pages.push(totalPages);

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className={`${styles.container} ${className}`} style={style} {...props}>
      <button
        type="button"
        className={`${styles.pageBtn} ${styles.disabled}`}
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        aria-label="Previous Page"
      >
        &lt;
      </button>

      {pages.map((p, idx) => (
        <button
          type="button"
          key={`${p}-${idx}`}
          className={`${styles.pageBtn} ${p === currentPage ? styles.active : ''} ${p === '...' ? styles.disabled : ''}`}
          disabled={p === '...'}
          onClick={() => typeof p === 'number' && handlePageChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        className={`${styles.pageBtn} ${styles.disabled}`}
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        aria-label="Next Page"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
