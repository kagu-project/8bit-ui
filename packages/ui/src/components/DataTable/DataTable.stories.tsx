import { useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';
import DataTable, {
  createDataTableActionsColumn,
  type DataTableColumnFilterConfig,
  type DataTableProps,
  type DataTableState,
} from './DataTable';

interface PlayerRow {
  id: number;
  player: string;
  role: string;
  score: number;
}

const rows: PlayerRow[] = [
  { id: 1, player: 'Nova', role: 'Engineer', score: 94 },
  { id: 2, player: 'Echo', role: 'Designer', score: 88 },
  { id: 3, player: 'Bolt', role: 'QA', score: 79 },
  { id: 4, player: 'Sage', role: 'Engineer', score: 86 },
  { id: 5, player: 'Kilo', role: 'PM', score: 91 },
  { id: 6, player: 'Rift', role: 'Support', score: 74 },
  { id: 7, player: 'Vega', role: 'Engineer', score: 98 },
  { id: 8, player: 'Pixel', role: 'Designer', score: 84 },
  { id: 9, player: 'Jinx', role: 'QA', score: 80 },
  { id: 10, player: 'Rune', role: 'PM', score: 89 },
  { id: 11, player: 'Iris', role: 'Engineer', score: 95 },
  { id: 12, player: 'Mako', role: 'Support', score: 78 },
];

const columns: Array<ColumnDef<PlayerRow, unknown>> = [
  {
    accessorKey: 'player',
    header: 'Player',
    enableSorting: true,
  },
  {
    accessorKey: 'role',
    header: 'Role',
    enableSorting: true,
  },
  {
    accessorKey: 'score',
    header: 'Score',
    enableSorting: true,
  },
];

const columnFilterConfig: Partial<Record<string, DataTableColumnFilterConfig<PlayerRow>>> = {
  player: {
    type: 'text',
    placeholder: 'Player name...',
  },
  role: {
    type: 'select',
    options: [
      { value: 'Engineer', label: 'Engineer' },
      { value: 'Designer', label: 'Designer' },
      { value: 'QA', label: 'QA' },
      { value: 'PM', label: 'PM' },
      { value: 'Support', label: 'Support' },
    ],
  },
};

const multiSelectColumnFilterConfig: Partial<
  Record<string, DataTableColumnFilterConfig<PlayerRow>>
> = {
  role: {
    type: 'multi-select',
    placeholder: 'All Roles',
    options: [
      { value: 'Engineer', label: 'Engineer' },
      { value: 'Designer', label: 'Designer' },
      { value: 'QA', label: 'QA' },
      { value: 'PM', label: 'PM' },
      { value: 'Support', label: 'Support' },
    ],
  },
};

type StoryProps = DataTableProps<PlayerRow>;

const meta = {
  title: '8bitUI/Components/DataTable',
  args: {
    columns,
    data: rows,
  },
  render: (args) => <DataTable<PlayerRow> {...args} />,
} satisfies Meta<StoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ClientMode: Story = {
  args: {},
};

export const ColumnFilters: Story = {
  args: {
    enableColumnFilters: true,
    columnFilterConfig,
  },
};

export const ColumnFiltersMenu: Story = {
  args: {
    enableColumnFilters: true,
    columnFiltersPlacement: 'menu',
    columnFilterConfig,
  },
};

export const MultiSelectColumnFilter: Story = {
  args: {
    enableColumnFilters: true,
    columnFilterConfig: multiSelectColumnFilterConfig,
  },
};

const ServerModeStory = () => {
  const [tableState, setTableState] = useState<DataTableState>({
    globalFilter: '',
    sorting: [],
    columnFilters: [],
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
  });
  const [pageRows, setPageRows] = useState<PlayerRow[]>([]);
  const [totalRows, setTotalRows] = useState(rows.length);

  const filteredAndSorted = useMemo(() => {
    const activeColumnFilters = tableState.columnFilters ?? [];
    const columnFiltered = activeColumnFilters.reduce((accumulator, filter) => {
      return accumulator.filter((row) => {
        const target = row[filter.id as keyof PlayerRow];
        if (target === undefined || target === null) return false;
        const normalizedTarget = String(target).toLowerCase();

        const isRoleFilter = filter.id === 'role';
        if (Array.isArray(filter.value)) {
          const selectedValues = filter.value
            .map((value) => String(value).toLowerCase().trim())
            .filter(Boolean);
          if (selectedValues.length === 0) return true;
          return selectedValues.includes(normalizedTarget);
        }

        const search = String(filter.value ?? '')
          .toLowerCase()
          .trim();
        if (!search) return true;

        if (isRoleFilter) {
          return normalizedTarget === search;
        }

        return normalizedTarget.includes(search);
      });
    }, rows);

    const loweredFilter = tableState.globalFilter.toLowerCase().trim();

    const filtered = columnFiltered.filter((row) => {
      if (!loweredFilter) return true;
      const target = `${row.player} ${row.role} ${row.score}`.toLowerCase();
      return target.includes(loweredFilter);
    });

    const sorting = tableState.sorting[0];
    if (!sorting) return filtered;

    const sorted = [...filtered];
    const sortKey = sorting.id as keyof PlayerRow;
    sorted.sort((a, b) => {
      if (a[sortKey] === b[sortKey]) return 0;
      const isLower = a[sortKey] < b[sortKey];
      return sorting.desc ? (isLower ? 1 : -1) : isLower ? -1 : 1;
    });

    return sorted;
  }, [tableState.columnFilters, tableState.globalFilter, tableState.sorting]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const start = tableState.pagination.pageIndex * tableState.pagination.pageSize;
      const end = start + tableState.pagination.pageSize;
      setPageRows(filteredAndSorted.slice(start, end));
      setTotalRows(filteredAndSorted.length);
    }, 450);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [filteredAndSorted, tableState.pagination.pageIndex, tableState.pagination.pageSize]);

  return (
    <DataTable
      columns={columns}
      data={pageRows}
      mode="server"
      totalRows={totalRows}
      enableColumnFilters
      columnFilterConfig={columnFilterConfig}
      state={tableState}
      onStateChange={setTableState}
    />
  );
};

export const ServerMode: Story = {
  render: () => <ServerModeStory />,
};

export const Loading: Story = {
  args: {
    data: [],
    loading: true,
  },
};

export const ErrorState: Story = {
  args: {
    data: [],
    error: 'Failed to load rows.',
  },
};

const CustomColumnFilterUiStory = () => (
  <DataTable
    columns={columns}
    data={rows}
    enableColumnFilters
    columnFilterConfig={columnFilterConfig}
    renderColumnFilter={({ column, value, setValue }) => {
      if (column.id !== 'player') return null;

      return (
        <input
          value={value === undefined ? '' : String(value)}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Custom player filter..."
          style={{
            minHeight: 36,
            border: '2px solid #15100b',
            padding: '0 8px',
            fontFamily: 'var(--8bit-font-body)',
            fontSize: '0.75rem',
            background: '#fff',
          }}
        />
      );
    }}
  />
);

export const CustomColumnFilterUi: Story = {
  render: () => <CustomColumnFilterUiStory />,
};

const SelectableRowsStory = () => {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ fontSize: '0.9rem' }}>Rows selected: [{selectedRowIds.join(', ')}]</div>
      <DataTable
        columns={columns}
        data={rows}
        enableRowSelection
        getRowId={(row) => String(row.id)}
        selectedRowIds={selectedRowIds}
        onSelectedRowIdsChange={setSelectedRowIds}
      />
    </div>
  );
};

export const SelectableRows: Story = {
  render: () => <SelectableRowsStory />,
};

const SingleSelectionStory = () => {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ fontSize: '0.9rem' }}>Row selected: {selectedRowIds[0] ?? '-'}</div>
      <DataTable
        columns={columns}
        data={rows}
        enableRowSelection
        selectionMode="single"
        getRowId={(row) => String(row.id)}
        selectedRowIds={selectedRowIds}
        onSelectedRowIdsChange={setSelectedRowIds}
      />
    </div>
  );
};

export const SingleSelection: Story = {
  render: () => <SingleSelectionStory />,
};

const RowActionsStory = () => {
  const [lastAction, setLastAction] = useState<string>('None');

  const actionsColumn = useMemo(
    () =>
      createDataTableActionsColumn<PlayerRow>({
        getTriggerAriaLabel: ({ originalRow }) => `Row actions for ${originalRow.player}`,
        getActions: ({ originalRow }) => [
          {
            id: 'view',
            label: 'View',
            onSelect: () => setLastAction(`View ${originalRow.player}`),
          },
          {
            id: 'edit',
            label: 'Edit',
            onSelect: () => setLastAction(`Edit ${originalRow.player}`),
          },
          {
            id: 'delete',
            label: 'Delete',
            danger: true,
            onSelect: () => setLastAction(`Delete ${originalRow.player}`),
          },
        ],
      }),
    [],
  );
  const columnsWithActions = useMemo(() => [...columns, actionsColumn], [actionsColumn]);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ fontSize: '0.9rem' }}>Last action: {lastAction}</div>
      <DataTable columns={columnsWithActions} data={rows} />
    </div>
  );
};

export const RowActions: Story = {
  render: () => <RowActionsStory />,
};

const RowActionsBulkSafeStory = () => {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [lastAction, setLastAction] = useState<string>('None');
  const selectionCount = selectedRowIds.length;

  const actionsColumn = useMemo(
    () =>
      createDataTableActionsColumn<PlayerRow>({
        getTriggerAriaLabel: ({ originalRow }) => `Row actions for ${originalRow.player}`,
        isMenuDisabled: () => selectionCount > 1,
        getActions: ({ originalRow }) => [
          {
            id: 'view',
            label: 'View',
            onSelect: () => setLastAction(`View ${originalRow.player}`),
          },
          {
            id: 'edit',
            label: 'Edit',
            onSelect: () => setLastAction(`Edit ${originalRow.player}`),
          },
          {
            id: 'delete',
            label: 'Delete',
            danger: true,
            onSelect: () => setLastAction(`Delete ${originalRow.player}`),
          },
        ],
      }),
    [selectionCount],
  );
  const columnsWithActions = useMemo(() => [...columns, actionsColumn], [actionsColumn]);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ fontSize: '0.9rem' }}>Rows selected: [{selectedRowIds.join(', ')}]</div>
      <div style={{ fontSize: '0.9rem' }}>
        Row actions: {selectionCount > 1 ? 'Disabled while multiple rows are selected' : 'Enabled'}
      </div>
      <div style={{ fontSize: '0.9rem' }}>Last action: {lastAction}</div>
      <DataTable
        columns={columnsWithActions}
        data={rows}
        enableRowSelection
        getRowId={(row) => String(row.id)}
        selectedRowIds={selectedRowIds}
        onSelectedRowIdsChange={setSelectedRowIds}
      />
    </div>
  );
};

export const RowActionsBulkSafe: Story = {
  render: () => <RowActionsBulkSafeStory />,
};
