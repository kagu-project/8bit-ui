import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import type {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Input from '../Input';
import Menu from '../Menu';
import Table from '../Table';
import DataTableColumnFilter from './DataTableColumnFilter';
import styles from './DataTable.module.css';
import DataTablePagination from './DataTablePagination';
import type { DataTableProps, DataTableState } from './DataTableTypes';
import {
  getColumnLabel,
  getSortAriaLabel,
  normalizeColumnFilters,
  normalizePagination,
  normalizeSorting,
  resolveUpdater,
  rowSelectionFromIds,
  selectedIdsFromRowSelection,
} from './DataTableUtils';

const DEFAULT_PAGE_SIZE = 25;
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const CLIENT_DEBOUNCE_MS = 300;
const SERVER_DEBOUNCE_MS = 400;

const isPromiseLike = (value: unknown): value is PromiseLike<unknown> =>
  typeof value === 'object' &&
  value !== null &&
  'then' in value &&
  typeof (value as { then?: unknown }).then === 'function';

const normalizeRenderValue = (value: unknown): ReactNode => {
  if (typeof value === 'bigint') return value.toString();
  if (isPromiseLike(value)) return null;
  return value as ReactNode;
};

const DataTable = <TData,>({
  columns,
  data,
  mode = 'client',
  totalRows,
  state,
  initialState,
  onStateChange,
  getRowId,
  loading = false,
  error = null,
  onRetry,
  emptyMessage = 'No rows found.',
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  filterPlaceholder = 'Search table...',
  debounceMs,
  enableColumnFilters = false,
  columnFiltersPlacement = 'row',
  columnFilterConfig,
  renderColumnFilter,
  enableRowSelection = false,
  selectionMode = 'multiple',
  selectedRowIds,
  initialSelectedRowIds = [],
  onSelectedRowIdsChange,
  className = '',
  style = {},
  ...props
}: DataTableProps<TData>) => {
  const globalFilterId = useId();

  const safePageSizeOptions = useMemo(() => {
    const cleaned = Array.from(new Set(pageSizeOptions.filter((size) => size > 0))).sort(
      (a, b) => a - b,
    );
    return cleaned.length > 0 ? cleaned : DEFAULT_PAGE_SIZE_OPTIONS;
  }, [pageSizeOptions]);

  const fallbackPageSize = safePageSizeOptions.includes(DEFAULT_PAGE_SIZE)
    ? DEFAULT_PAGE_SIZE
    : safePageSizeOptions[0];

  const [internalGlobalFilter, setInternalGlobalFilter] = useState(
    initialState?.globalFilter ?? '',
  );
  const [internalSorting, setInternalSorting] = useState<SortingState>(
    normalizeSorting(initialState?.sorting),
  );
  const [internalPagination, setInternalPagination] = useState<PaginationState>(
    normalizePagination(initialState?.pagination, fallbackPageSize),
  );
  const [internalColumnFilters, setInternalColumnFilters] = useState(
    normalizeColumnFilters(initialState?.columnFilters),
  );
  const [internalSelectedRowIds, setInternalSelectedRowIds] =
    useState<string[]>(initialSelectedRowIds);
  const lastClampRequestRef = useRef<string | null>(null);

  const resolvedSelectedRowIds = selectedRowIds ?? internalSelectedRowIds;
  const rowSelection = useMemo(() => {
    if (!enableRowSelection) return {};
    return rowSelectionFromIds(resolvedSelectedRowIds);
  }, [enableRowSelection, resolvedSelectedRowIds]);

  const resolvedColumns = useMemo(() => {
    if (!enableColumnFilters) return columns;

    const applyColumnFilterDefaults = (
      defs: Array<ColumnDef<TData, unknown>>,
    ): Array<ColumnDef<TData, unknown>> =>
      defs.map((definition) => {
        const maybeGrouped = definition as ColumnDef<TData, unknown> & {
          columns?: Array<ColumnDef<TData, unknown>>;
          id?: string;
          accessorKey?: string | number;
          filterFn?: unknown;
          enableColumnFilter?: boolean;
        };

        if (Array.isArray(maybeGrouped.columns)) {
          return {
            ...definition,
            columns: applyColumnFilterDefaults(maybeGrouped.columns),
          } as ColumnDef<TData, unknown>;
        }

        const columnId =
          typeof maybeGrouped.id === 'string'
            ? maybeGrouped.id
            : typeof maybeGrouped.accessorKey === 'string'
              ? maybeGrouped.accessorKey
              : undefined;

        if (!columnId) return definition;
        const config = columnFilterConfig?.[columnId];
        if (config?.enabled === false) {
          return {
            ...definition,
            enableColumnFilter: false,
          } as ColumnDef<TData, unknown>;
        }

        const nextDefinition = {
          ...definition,
          enableColumnFilter: true,
        } as ColumnDef<TData, unknown> & {
          filterFn?: unknown;
        };

        if (config?.type === 'select' && nextDefinition.filterFn === undefined) {
          nextDefinition.filterFn = (row, colId, filterVal) => {
            if (typeof filterVal !== 'string' && typeof filterVal !== 'number') return true;
            const rowValue = row.getValue(colId);
            if (typeof rowValue !== 'string' && typeof rowValue !== 'number') return false;
            return String(rowValue) === String(filterVal);
          };
        }

        if (config?.type === 'multi-select' && nextDefinition.filterFn === undefined) {
          nextDefinition.filterFn = (row, colId, filterVal) => {
            if (!Array.isArray(filterVal) || filterVal.length === 0) return true;
            const normalizedFilterValues = filterVal.filter(
              (v) => typeof v === 'string' || typeof v === 'number',
            );
            if (normalizedFilterValues.length === 0) return true;

            const rowValue = row.getValue(colId);
            if (typeof rowValue !== 'string' && typeof rowValue !== 'number') return false;

            return normalizedFilterValues.some(
              (candidate) => String(candidate) === String(rowValue),
            );
          };
        }

        return nextDefinition;
      });

    return applyColumnFilterDefaults(columns);
  }, [columns, columnFilterConfig, enableColumnFilters]);

  const resolvedState: DataTableState = useMemo(
    () => ({
      globalFilter: state?.globalFilter ?? internalGlobalFilter,
      sorting: normalizeSorting(state?.sorting ?? internalSorting),
      pagination: normalizePagination(state?.pagination ?? internalPagination, fallbackPageSize),
      columnFilters: normalizeColumnFilters(state?.columnFilters ?? internalColumnFilters),
    }),
    [
      fallbackPageSize,
      internalColumnFilters,
      internalGlobalFilter,
      internalPagination,
      internalSorting,
      state?.columnFilters,
      state?.globalFilter,
      state?.pagination,
      state?.sorting,
    ],
  );

  const setNextState = useCallback(
    (nextState: DataTableState) => {
      if (state?.globalFilter === undefined) {
        setInternalGlobalFilter(nextState.globalFilter);
      }
      if (state?.sorting === undefined) {
        setInternalSorting(nextState.sorting);
      }
      if (state?.pagination === undefined) {
        setInternalPagination(nextState.pagination);
      }
      if (state?.columnFilters === undefined) {
        setInternalColumnFilters(nextState.columnFilters ?? []);
      }
      onStateChange?.(nextState);
    },
    [onStateChange, state?.columnFilters, state?.globalFilter, state?.pagination, state?.sorting],
  );

  const setGlobalFilter = useCallback(
    (nextGlobalFilter: string) => {
      if (nextGlobalFilter === resolvedState.globalFilter) return;

      const nextState: DataTableState = {
        ...resolvedState,
        globalFilter: nextGlobalFilter,
        pagination: {
          ...resolvedState.pagination,
          pageIndex: 0,
        },
      };

      setNextState(nextState);
    },
    [resolvedState, setNextState],
  );

  const handleSortingChange = useCallback<OnChangeFn<SortingState>>(
    (updater) => {
      const nextSorting = normalizeSorting(resolveUpdater(updater, resolvedState.sorting));

      const nextState: DataTableState = {
        ...resolvedState,
        sorting: nextSorting,
        pagination: {
          ...resolvedState.pagination,
          pageIndex: 0,
        },
      };

      setNextState(nextState);
    },
    [resolvedState, setNextState],
  );

  const handlePaginationChange = useCallback<OnChangeFn<PaginationState>>(
    (updater) => {
      const updatedPagination = resolveUpdater(updater, resolvedState.pagination);
      const nextPagination = normalizePagination(
        updatedPagination,
        resolvedState.pagination.pageSize,
      );

      const nextState: DataTableState = {
        ...resolvedState,
        pagination: nextPagination,
      };

      setNextState(nextState);
    },
    [resolvedState, setNextState],
  );

  const handleColumnFiltersChange = useCallback<OnChangeFn<ColumnFiltersState>>(
    (updater) => {
      const nextColumnFilters = normalizeColumnFilters(
        resolveUpdater(updater, resolvedState.columnFilters ?? []),
      );

      const nextState: DataTableState = {
        ...resolvedState,
        columnFilters: nextColumnFilters,
        pagination: {
          ...resolvedState.pagination,
          pageIndex: 0,
        },
      };

      setNextState(nextState);
    },
    [resolvedState, setNextState],
  );

  const setNextSelectedRowIds = useCallback(
    (nextSelectedRowIds: string[]) => {
      if (selectedRowIds === undefined) {
        setInternalSelectedRowIds(nextSelectedRowIds);
      }
      onSelectedRowIdsChange?.(nextSelectedRowIds);
    },
    [onSelectedRowIdsChange, selectedRowIds],
  );

  const handleRowSelectionChange = useCallback<OnChangeFn<RowSelectionState>>(
    (updater) => {
      const updatedRowSelection = resolveUpdater(updater, rowSelection);
      const nextSelectedRowIds = selectedIdsFromRowSelection(updatedRowSelection);
      setNextSelectedRowIds(nextSelectedRowIds);
    },
    [rowSelection, setNextSelectedRowIds],
  );

  const [filterInput, setFilterInput] = useState(resolvedState.globalFilter);
  const resolvedDebounceMs =
    debounceMs ?? (mode === 'server' ? SERVER_DEBOUNCE_MS : CLIENT_DEBOUNCE_MS);

  useEffect(() => {
    setFilterInput(resolvedState.globalFilter);
  }, [resolvedState.globalFilter]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setGlobalFilter(filterInput);
    }, resolvedDebounceMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [filterInput, resolvedDebounceMs, setGlobalFilter]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: resolvedColumns,
    state: {
      globalFilter: resolvedState.globalFilter,
      sorting: resolvedState.sorting,
      pagination: resolvedState.pagination,
      columnFilters: enableColumnFilters ? (resolvedState.columnFilters ?? []) : [],
      rowSelection,
    },
    onSortingChange: handleSortingChange,
    onPaginationChange: handlePaginationChange,
    onColumnFiltersChange: enableColumnFilters ? handleColumnFiltersChange : undefined,
    onRowSelectionChange: enableRowSelection ? handleRowSelectionChange : undefined,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: mode === 'client' ? getFilteredRowModel() : undefined,
    getSortedRowModel: mode === 'client' ? getSortedRowModel() : undefined,
    getPaginationRowModel: mode === 'client' ? getPaginationRowModel() : undefined,
    manualFiltering: mode === 'server',
    manualSorting: mode === 'server',
    manualPagination: mode === 'server',
    enableMultiSort: false,
    enableRowSelection,
    enableMultiRowSelection: selectionMode === 'multiple',
    autoResetPageIndex: false,
    rowCount: mode === 'server' ? Math.max(0, totalRows ?? 0) : undefined,
    getRowId,
  });

  const columnCount = Math.max(1, table.getVisibleLeafColumns().length);
  const selectionColumnCount = enableRowSelection ? 1 : 0;
  const totalColumnCount = columnCount + selectionColumnCount;
  const rows = table.getRowModel().rows;

  const totalRowsCount =
    mode === 'server' ? Math.max(0, totalRows ?? 0) : table.getFilteredRowModel().rows.length;
  const totalPages = Math.max(1, Math.ceil(totalRowsCount / resolvedState.pagination.pageSize));
  const maxPageIndex = Math.max(0, totalPages - 1);
  const effectivePageIndex = Math.min(resolvedState.pagination.pageIndex, maxPageIndex);
  const currentPage = effectivePageIndex + 1;

  useEffect(() => {
    if (resolvedState.pagination.pageIndex <= maxPageIndex) return;
    const clampKey = `${resolvedState.pagination.pageIndex}:${maxPageIndex}:${resolvedState.pagination.pageSize}`;
    if (lastClampRequestRef.current === clampKey) return;
    lastClampRequestRef.current = clampKey;

    setNextState({
      ...resolvedState,
      pagination: {
        ...resolvedState.pagination,
        pageIndex: maxPageIndex,
      },
    });
  }, [maxPageIndex, resolvedState, setNextState]);

  useEffect(() => {
    if (resolvedState.pagination.pageIndex <= maxPageIndex) {
      lastClampRequestRef.current = null;
    }
  }, [maxPageIndex, resolvedState.pagination.pageIndex]);

  const rangeStart =
    totalRowsCount === 0 ? 0 : effectivePageIndex * resolvedState.pagination.pageSize + 1;
  const rangeEnd =
    totalRowsCount === 0
      ? 0
      : Math.min((effectivePageIndex + 1) * resolvedState.pagination.pageSize, totalRowsCount);
  const pageSizeSelectOptions = safePageSizeOptions.map((size) => ({
    value: size,
    label: String(size),
  }));
  const visibleLeafColumns = table.getVisibleLeafColumns();
  const hasAnyColumnFilters =
    enableColumnFilters &&
    visibleLeafColumns.some((column) => {
      const config = columnFilterConfig?.[column.id];
      if (config?.enabled === false) return false;
      return column.getCanFilter();
    });
  const showColumnFilterRow = hasAnyColumnFilters && columnFiltersPlacement === 'row';

  const renderSortIcon = (sortDirection: false | 'asc' | 'desc'): string => {
    if (sortDirection === 'asc' || sortDirection === 'desc') return 'v';
    return '-';
  };

  const getSortIconClassName = (sortDirection: false | 'asc' | 'desc'): string => {
    if (sortDirection === 'asc') return styles.sortIconAsc;
    if (sortDirection === 'desc') return styles.sortIconDesc;
    return styles.sortIconNone;
  };

  const goToPage = (page: number) => {
    const nextPage = Math.min(Math.max(1, page), totalPages);
    if (nextPage === currentPage) return;

    handlePaginationChange({
      ...resolvedState.pagination,
      pageIndex: Math.max(0, nextPage - 1),
    });
  };

  const rootClassName = [styles.container, className].filter(Boolean).join(' ');
  const isInitialLoading = loading && rows.length === 0 && !error;

  return (
    <div className={rootClassName} style={style} {...props}>
      <div className={styles.toolbar}>
        <div className={styles.filterWrap}>
          <label className={styles.filterLabel} htmlFor={globalFilterId}>
            Filter
          </label>
          <Input
            id={globalFilterId}
            type="search"
            value={filterInput}
            variant="solid"
            fullWidth
            className={styles.filterInput}
            placeholder={filterPlaceholder}
            onChange={(event) => setFilterInput(event.target.value)}
          />
        </div>

        {loading && rows.length > 0 ? (
          <span className={styles.statusText} role="status" aria-live="polite">
            Updating...
          </span>
        ) : null}
      </div>

      <Table tableProps={{ 'aria-busy': loading }}>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup, headerGroupIndex, allHeaderGroups) => (
            <Table.Row key={headerGroup.id}>
              {enableRowSelection && headerGroupIndex === 0 ? (
                <Table.HeaderCell
                  scope="col"
                  className={styles.selectionHeaderCell}
                  aria-label="Row selection"
                  rowSpan={allHeaderGroups.length + (showColumnFilterRow ? 1 : 0)}
                >
                  {selectionMode === 'multiple' ? (
                    <Checkbox
                      className={styles.selectionCheckbox}
                      checked={table.getIsAllPageRowsSelected()}
                      indeterminate={
                        table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
                      }
                      aria-label="Select all rows on page"
                      aria-checked={
                        table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
                          ? 'mixed'
                          : undefined
                      }
                      onChange={(event) => {
                        if (event.target.checked) {
                          table.toggleAllPageRowsSelected(true);
                          return;
                        }
                        setNextSelectedRowIds([]);
                      }}
                    />
                  ) : null}
                </Table.HeaderCell>
              ) : null}

              {headerGroup.headers.map((header) => {
                if (header.isPlaceholder) {
                  return <Table.HeaderCell key={header.id} />;
                }

                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();
                const ariaSort =
                  sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none';
                const columnFilterConfigForHeader = columnFilterConfig?.[header.column.id];
                const canFilterInHeaderMenu =
                  enableColumnFilters &&
                  columnFiltersPlacement === 'menu' &&
                  columnFilterConfigForHeader?.enabled !== false &&
                  header.column.getCanFilter();
                const filterTypeForHeaderMenu = columnFilterConfigForHeader?.type ?? 'text';
                const hasActiveFilter = header.column.getFilterValue() !== undefined;
                const headerLabel = normalizeRenderValue(
                  flexRender(header.column.columnDef.header, header.getContext()),
                );
                const filterTriggerLabel = `Open ${getColumnLabel(header.column)} filter`;
                const hasInteractiveHeader = canSort || canFilterInHeaderMenu;

                return (
                  <Table.HeaderCell
                    key={header.id}
                    scope="col"
                    aria-sort={canSort ? ariaSort : undefined}
                    className={canSort ? styles.sortableHeader : ''}
                  >
                    {hasInteractiveHeader ? (
                      <div className={styles.headerControls}>
                        {canSort ? (
                          <button
                            type="button"
                            className={styles.sortButton}
                            onClick={header.column.getToggleSortingHandler()}
                            aria-label={getSortAriaLabel(header.id, header.column.columnDef.header)}
                          >
                            <span>{headerLabel}</span>
                            <span
                              className={`${styles.sortIcon} ${getSortIconClassName(sorted)}`}
                              aria-hidden="true"
                            >
                              {renderSortIcon(sorted)}
                            </span>
                          </button>
                        ) : (
                          <span className={styles.headerLabel}>{headerLabel}</span>
                        )}

                        {canFilterInHeaderMenu ? (
                          <Menu
                            closeOnSelect={
                              filterTypeForHeaderMenu === 'multi-select' ? false : true
                            }
                          >
                            <Menu.Trigger
                              className={`${styles.filterMenuTrigger} ${
                                hasActiveFilter ? styles.filterMenuTriggerActive : ''
                              }`}
                              ariaLabel={filterTriggerLabel}
                            >
                              <span className={styles.kebabIcon} aria-hidden="true">
                                <span className={styles.kebabDot} />
                                <span className={styles.kebabDot} />
                                <span className={styles.kebabDot} />
                              </span>
                            </Menu.Trigger>
                            <Menu.Content className={styles.filterMenuContent} align="end">
                              <div className={styles.filterMenuBody}>
                                <DataTableColumnFilter
                                  column={header.column}
                                  placement="menu"
                                  config={columnFilterConfigForHeader}
                                  render={renderColumnFilter}
                                  globalFilterId={globalFilterId}
                                />
                              </div>
                            </Menu.Content>
                          </Menu>
                        ) : null}
                      </div>
                    ) : (
                      headerLabel
                    )}
                  </Table.HeaderCell>
                );
              })}
            </Table.Row>
          ))}

          {showColumnFilterRow ? (
            <Table.Row className={styles.columnFilterRow} role="row">
              {visibleLeafColumns.map((column) => {
                const config = columnFilterConfig?.[column.id];
                const canFilter = config?.enabled !== false && column.getCanFilter();

                if (!canFilter) {
                  return (
                    <Table.HeaderCell
                      key={`${column.id}-filter`}
                      className={styles.columnFilterCell}
                    />
                  );
                }

                return (
                  <Table.HeaderCell key={`${column.id}-filter`} className={styles.columnFilterCell}>
                    <DataTableColumnFilter
                      column={column}
                      placement="row"
                      config={config}
                      render={renderColumnFilter}
                      globalFilterId={globalFilterId}
                    />
                  </Table.HeaderCell>
                );
              })}
            </Table.Row>
          ) : null}
        </Table.Header>

        <Table.Body>
          {error ? (
            <Table.Row className={styles.errorRow}>
              <Table.Cell className={styles.stateCell} colSpan={totalColumnCount}>
                <span>{error}</span>
                {onRetry ? (
                  <Button
                    type="button"
                    variant="outline"
                    color="danger"
                    className={styles.retryButton}
                    onClick={onRetry}
                  >
                    Retry
                  </Button>
                ) : null}
              </Table.Cell>
            </Table.Row>
          ) : null}

          {!error && isInitialLoading
            ? Array.from({
                length: Math.min(8, Math.max(3, resolvedState.pagination.pageSize)),
              }).map((_, rowIndex) => (
                <Table.Row key={`skeleton-${rowIndex}`} aria-hidden="true">
                  {enableRowSelection ? (
                    <Table.Cell className={styles.selectionCell}>
                      <span className={styles.skeletonCell} />
                    </Table.Cell>
                  ) : null}

                  {Array.from({ length: columnCount }).map((__, cellIndex) => (
                    <Table.Cell key={`skeleton-${rowIndex}-${cellIndex}`}>
                      <span className={styles.skeletonCell} />
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            : null}

          {!error && !isInitialLoading && rows.length === 0 ? (
            <Table.Row>
              <Table.Cell className={styles.stateCell} colSpan={totalColumnCount}>
                {emptyMessage}
              </Table.Cell>
            </Table.Row>
          ) : null}

          {!error && !isInitialLoading
            ? rows.map((row) => (
                <Table.Row
                  key={row.id}
                  className={enableRowSelection && row.getIsSelected() ? styles.selectedRow : ''}
                >
                  {enableRowSelection ? (
                    <Table.Cell className={styles.selectionCell}>
                      <Checkbox
                        className={styles.selectionCheckbox}
                        checked={row.getIsSelected()}
                        aria-label={`Select row ${row.index + 1}`}
                        onChange={(event) => row.toggleSelected(event.target.checked)}
                      />
                    </Table.Cell>
                  ) : null}

                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell key={cell.id}>
                      {normalizeRenderValue(
                        flexRender(cell.column.columnDef.cell, cell.getContext()),
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            : null}
        </Table.Body>
      </Table>

      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={resolvedState.pagination.pageSize}
        totalRowsCount={totalRowsCount}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        pageSizeOptions={pageSizeSelectOptions}
        onPageChange={goToPage}
        onPageSizeChange={(pageSize) =>
          handlePaginationChange({
            pageIndex: 0,
            pageSize,
          })
        }
      />
    </div>
  );
};

export * from './DataTableTypes';
export * from './DataTableActionsColumn';
export default DataTable;
