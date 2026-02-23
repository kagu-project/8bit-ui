import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  Row,
  SortingState,
} from '@tanstack/react-table';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type DataTableMode = 'client' | 'server';

export interface DataTableState {
  globalFilter: string;
  sorting: SortingState;
  pagination: PaginationState;
  columnFilters?: ColumnFiltersState;
}

export type DataTableSelectionMode = 'single' | 'multiple';
export type DataTableColumnFilterType = 'text' | 'select' | 'multi-select';
export type DataTableColumnFiltersPlacement = 'row' | 'menu';

export interface DataTableColumnFilterOption {
  value: string | number;
  label: string;
}

export interface DataTableColumnFilterRenderContext<TData> {
  column: Column<TData, unknown>;
  value: unknown;
  setValue: (nextValue: unknown) => void;
}

export interface DataTableColumnFilterConfig<TData> {
  type?: DataTableColumnFilterType;
  label?: string;
  placeholder?: string;
  options?: DataTableColumnFilterOption[];
  enabled?: boolean;
  render?: (context: DataTableColumnFilterRenderContext<TData>) => ReactNode;
}

export interface DataTableBaseProps<TData> extends HTMLAttributes<HTMLDivElement> {
  columns: Array<ColumnDef<TData, unknown>>;
  data: TData[];
  state?: Partial<DataTableState>;
  initialState?: Partial<DataTableState>;
  onStateChange?: (nextState: DataTableState) => void;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
  pageSizeOptions?: number[];
  filterPlaceholder?: string;
  debounceMs?: number;
  enableColumnFilters?: boolean;
  columnFiltersPlacement?: DataTableColumnFiltersPlacement;
  columnFilterConfig?: Partial<Record<string, DataTableColumnFilterConfig<TData>>>;
  renderColumnFilter?: (context: DataTableColumnFilterRenderContext<TData>) => ReactNode;
  enableRowSelection?: boolean;
  selectionMode?: DataTableSelectionMode;
  selectedRowIds?: string[];
  initialSelectedRowIds?: string[];
  onSelectedRowIdsChange?: (selectedRowIds: string[]) => void;
  style?: CSSProperties;
}

export interface ClientDataTableProps<TData> extends DataTableBaseProps<TData> {
  mode?: 'client';
  totalRows?: never;
}

export interface ServerDataTableProps<TData> extends DataTableBaseProps<TData> {
  mode: 'server';
  totalRows: number;
}

export type DataTableProps<TData> = ClientDataTableProps<TData> | ServerDataTableProps<TData>;
