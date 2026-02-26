'use client';

import { useMemo, useState } from 'react';
import {
  createDataTableActionsColumn,
  DataTable,
  type DataTableProps,
  type DataTableState,
} from '@kagu-project/8bit-ui';

type Player = {
  id: number;
  name: string;
  role: string;
  score: number;
};

const PLAYER_ROWS: Player[] = [
  { id: 1, name: 'Nova', role: 'Engineer', score: 94 },
  { id: 2, name: 'Echo', role: 'Designer', score: 88 },
  { id: 3, name: 'Bolt', role: 'QA', score: 79 },
  { id: 4, name: 'Sage', role: 'PM', score: 86 },
  { id: 5, name: 'Kilo', role: 'Support', score: 91 },
  { id: 6, name: 'Rift', role: 'Engineer', score: 74 },
  { id: 7, name: 'Vega', role: 'Designer', score: 98 },
  { id: 8, name: 'Mika', role: 'QA', score: 83 },
];

const BASE_COLUMNS: DataTableProps<Player>['columns'] = [
  { accessorKey: 'name', header: 'Name', enableSorting: true },
  { accessorKey: 'role', header: 'Role', enableSorting: true },
  { accessorKey: 'score', header: 'Score', enableSorting: true },
];

export const DataTableQuickStartPreview = () => (
  <DataTable
    columns={BASE_COLUMNS}
    data={[
      { id: 1, name: 'Nova', role: 'Engineer', score: 94 },
      { id: 2, name: 'Echo', role: 'Designer', score: 88 },
    ]}
  />
);

export const DataTableRowSelectionPreview = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <>
      <DataTable
        columns={BASE_COLUMNS}
        data={PLAYER_ROWS.slice(0, 6)}
        enableRowSelection
        selectionMode="multiple"
        getRowId={(row) => String(row.id)}
        selectedRowIds={selectedIds}
        onSelectedRowIdsChange={setSelectedIds}
      />
      <p className="previewMetaText">
        Rows selected: {selectedIds.length > 0 ? selectedIds.join(', ') : 'none'}
      </p>
    </>
  );
};

export const DataTableColumnFiltersPreview = () => (
  <DataTable
    columns={BASE_COLUMNS}
    data={PLAYER_ROWS}
    enableColumnFilters
    columnFiltersPlacement="menu"
    columnFilterConfig={{
      role: {
        type: 'multi-select',
        options: [
          { value: 'Engineer', label: 'Engineer' },
          { value: 'Designer', label: 'Designer' },
          { value: 'QA', label: 'QA' },
          { value: 'PM', label: 'PM' },
          { value: 'Support', label: 'Support' },
        ],
      },
    }}
  />
);

export const DataTableActionsPreview = () => {
  const [lastAction, setLastAction] = useState('none');

  const actionsColumn = useMemo(
    () =>
      createDataTableActionsColumn<Player>({
        getTriggerAriaLabel: ({ originalRow }) => `Row actions for ${originalRow.name}`,
        getActions: ({ originalRow }) => [
          {
            id: 'view',
            label: 'View',
            onSelect: () => setLastAction(`view ${originalRow.id}`),
          },
          {
            id: 'edit',
            label: 'Edit',
            onSelect: () => setLastAction(`edit ${originalRow.id}`),
          },
          {
            id: 'delete',
            label: 'Delete',
            danger: true,
            onSelect: () => setLastAction(`delete ${originalRow.id}`),
          },
        ],
      }),
    [],
  );

  const columns = useMemo(() => [...BASE_COLUMNS, actionsColumn], [actionsColumn]);

  return (
    <>
      <DataTable columns={columns} data={PLAYER_ROWS.slice(0, 5)} />
      <p className="previewMetaText">Last action: {lastAction}</p>
    </>
  );
};

const applyGlobalFilter = (rows: Player[], globalFilter: string) => {
  const trimmed = globalFilter.trim().toLowerCase();
  if (trimmed === '') {
    return rows;
  }

  return rows.filter((row) => {
    return `${row.name} ${row.role} ${row.score}`.toLowerCase().includes(trimmed);
  });
};

const applySorting = (rows: Player[], state: DataTableState) => {
  const [firstSort] = state.sorting;
  if (!firstSort) {
    return rows;
  }

  const direction = firstSort.desc ? -1 : 1;
  const key = firstSort.id as keyof Player;

  return [...rows].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue < bValue) {
      return -1 * direction;
    }
    if (aValue > bValue) {
      return 1 * direction;
    }

    return 0;
  });
};

export const DataTableServerModePreview = () => {
  const [state, setState] = useState<DataTableState>({
    globalFilter: '',
    sorting: [],
    columnFilters: [],
    pagination: { pageIndex: 0, pageSize: 5 },
  });

  const filteredAndSorted = useMemo(() => {
    const filtered = applyGlobalFilter(PLAYER_ROWS, state.globalFilter);
    return applySorting(filtered, state);
  }, [state]);

  const startIndex = state.pagination.pageIndex * state.pagination.pageSize;
  const pagedRows = filteredAndSorted.slice(startIndex, startIndex + state.pagination.pageSize);

  return (
    <DataTable
      columns={BASE_COLUMNS}
      data={pagedRows}
      mode="server"
      totalRows={filteredAndSorted.length}
      state={state}
      onStateChange={setState}
      pageSizeOptions={[5, 10, 25]}
    />
  );
};
