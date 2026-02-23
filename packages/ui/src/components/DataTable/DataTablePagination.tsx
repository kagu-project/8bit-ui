import type { FC } from 'react';
import Button from '../Button';
import Select from '../Select';
import { getPaginationItems } from './DataTableUtils';
import styles from './DataTable.module.css';

interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRowsCount: number;
  rangeStart: number;
  rangeEnd: number;
  pageSizeOptions: Array<{ value: number; label: string }>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const DataTablePagination: FC<DataTablePaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalRowsCount,
  rangeStart,
  rangeEnd,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}) => {
  const pageItems = getPaginationItems(currentPage, totalPages);

  return (
    <div className={styles.footer}>
      <div className={styles.pageInfo}>
        Showing {rangeStart}-{rangeEnd} of {totalRowsCount}
      </div>

      <div className={styles.paginationControls}>
        <div className={styles.pageSizeControl}>
          <span className={styles.pageSizeLabel}>Rows</span>
          <Select
            className={styles.pageSizeSelect}
            options={pageSizeOptions}
            value={pageSize}
            variant="outline"
            aria-label="Rows per page"
            onChange={(value) => {
              const nextPageSize = typeof value === 'number' ? value : Number(value);
              onPageSizeChange(nextPageSize);
            }}
          />
        </div>

        <div className={styles.pager}>
          <Button
            type="button"
            variant="outline"
            color="primary"
            className={styles.pageButton}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Go to previous page"
          >
            Prev
          </Button>

          {pageItems.map((page, index) =>
            page === '...' ? (
              <span key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden="true">
                ...
              </span>
            ) : (
              <Button
                type="button"
                key={page}
                variant={page === currentPage ? 'solid' : 'outline'}
                color="primary"
                className={styles.pageButton}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ),
          )}

          <Button
            type="button"
            variant="outline"
            color="primary"
            className={styles.pageButton}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Go to next page"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTablePagination;
