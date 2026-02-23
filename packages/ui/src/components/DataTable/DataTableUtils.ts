import type {
  Column,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  Updater,
} from '@tanstack/react-table';

export const resolveUpdater = <T>(updater: Updater<T>, previous: T): T => {
  if (typeof updater === 'function') {
    return (updater as (old: T) => T)(previous);
  }
  return updater;
};

export const normalizeSorting = (sorting?: SortingState): SortingState => {
  if (!sorting || sorting.length === 0) return [];
  return [sorting[0]];
};

export const normalizePagination = (
  pagination: Partial<PaginationState> | undefined,
  fallbackPageSize: number,
): PaginationState => {
  const pageIndex = pagination?.pageIndex ?? 0;
  const pageSize = pagination?.pageSize ?? fallbackPageSize;

  return {
    pageIndex: Math.max(0, pageIndex),
    pageSize: pageSize > 0 ? pageSize : fallbackPageSize,
  };
};

export const normalizeColumnFilters = (filters?: ColumnFiltersState): ColumnFiltersState =>
  (filters ?? []).filter((filter) => typeof filter.id === 'string');

export const getPaginationItems = (
  currentPage: number,
  totalPages: number,
): Array<number | '...'> => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | '...'> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) pages.push('...');

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages - 1) pages.push('...');
  pages.push(totalPages);

  return pages;
};

export const getSortAriaLabel = (headerId: string, headerValue: unknown): string => {
  if (typeof headerValue === 'string' || typeof headerValue === 'number') {
    return `Sort by ${headerValue}`;
  }
  return `Sort by ${headerId}`;
};

export const getColumnLabel = <TData>(column: Column<TData, unknown>): string => {
  const header = column.columnDef.header;
  if (typeof header === 'string' || typeof header === 'number') {
    return String(header);
  }
  return column.id;
};

export const isFilterPrimitive = (value: unknown): value is string | number =>
  typeof value === 'string' || typeof value === 'number';

export const areFilterValuesEqual = (left: string | number, right: string | number): boolean =>
  left === right || String(left) === String(right);

export const rowSelectionFromIds = (ids: string[]): RowSelectionState =>
  ids.reduce<RowSelectionState>((accumulator, id) => {
    accumulator[id] = true;
    return accumulator;
  }, {});

export const selectedIdsFromRowSelection = (rowSelection: RowSelectionState): string[] =>
  Object.entries(rowSelection)
    .filter(([, selected]) => selected)
    .map(([id]) => id)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
