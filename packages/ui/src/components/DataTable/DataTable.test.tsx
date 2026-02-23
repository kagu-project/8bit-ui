import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ColumnDef } from '@tanstack/react-table';
import DataTable from './DataTable';
import { createDataTableActionsColumn } from './DataTableActionsColumn';
import styles from './DataTable.module.css';

interface Fighter {
  id: number;
  name: string;
  city: string;
}

const fighters: Fighter[] = [
  { id: 1, name: 'Ryu', city: 'Tokyo' },
  { id: 2, name: 'Ken', city: 'Los Angeles' },
  { id: 3, name: 'Chun-Li', city: 'Shanghai' },
];

const columns: Array<ColumnDef<Fighter, unknown>> = [
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
  },
  {
    accessorKey: 'city',
    header: 'City',
    enableSorting: true,
  },
];

describe('DataTable', () => {
  it('sorts rows with single-column sorting', () => {
    render(<DataTable columns={columns} data={fighters} />);

    const sortButton = screen.getByRole('button', { name: 'Sort by Name' });
    fireEvent.click(sortButton);

    let bodyRows = screen.getAllByRole('row').slice(1);
    let firstRowCells = within(bodyRows[0]).getAllByRole('cell');
    expect(firstRowCells[0]).toHaveTextContent('Chun-Li');

    fireEvent.click(sortButton);

    bodyRows = screen.getAllByRole('row').slice(1);
    firstRowCells = within(bodyRows[0]).getAllByRole('cell');
    expect(firstRowCells[0]).toHaveTextContent('Ryu');
  });

  it('applies global filter using debounce', () => {
    vi.useFakeTimers();

    render(<DataTable columns={columns} data={fighters} />);

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Ken' } });

    act(() => {
      vi.advanceTimersByTime(301);
    });

    expect(screen.getByText('Ken')).toBeInTheDocument();
    expect(screen.queryByText('Ryu')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('combines global and column filters in client mode', () => {
    vi.useFakeTimers();

    render(
      <DataTable
        columns={columns}
        data={fighters}
        enableColumnFilters
        columnFilterConfig={{
          city: {
            type: 'select',
            options: [
              { value: 'Tokyo', label: 'Tokyo' },
              { value: 'Los Angeles', label: 'Los Angeles' },
              { value: 'Shanghai', label: 'Shanghai' },
            ],
          },
        }}
      />,
    );

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'k' } });
    act(() => {
      vi.advanceTimersByTime(301);
    });

    expect(screen.getByText('Ryu')).toBeInTheDocument();
    expect(screen.getByText('Ken')).toBeInTheDocument();
    expect(screen.queryByText('Chun-Li')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('All City'));
    fireEvent.click(
      within(screen.getByRole('menu')).getByRole('menuitem', { name: 'Los Angeles' }),
    );

    expect(screen.getByText('Ken')).toBeInTheDocument();
    expect(screen.queryByText('Ryu')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('supports custom column filter rendering via renderColumnFilter', () => {
    render(
      <DataTable
        columns={columns}
        data={fighters}
        enableColumnFilters
        renderColumnFilter={({ column, value, setValue }) => {
          if (column.id !== 'city') return null;
          return (
            <input
              aria-label="Custom city filter"
              value={value === undefined ? '' : String(value)}
              onChange={(event) => setValue(event.target.value)}
            />
          );
        }}
      />,
    );

    fireEvent.change(screen.getByLabelText('Custom city filter'), { target: { value: 'shang' } });

    expect(screen.getByText('Chun-Li')).toBeInTheDocument();
    expect(screen.queryByText('Ryu')).not.toBeInTheDocument();
    expect(screen.queryByText('Ken')).not.toBeInTheDocument();
  });

  it('allows clearing a select column filter back to all rows', () => {
    render(
      <DataTable
        columns={columns}
        data={fighters}
        enableColumnFilters
        columnFilterConfig={{
          city: {
            type: 'select',
            options: [
              { value: 'Tokyo', label: 'Tokyo' },
              { value: 'Los Angeles', label: 'Los Angeles' },
              { value: 'Shanghai', label: 'Shanghai' },
            ],
          },
        }}
      />,
    );

    fireEvent.click(screen.getByText('All City'));
    fireEvent.click(within(screen.getByRole('menu')).getByRole('menuitem', { name: 'Tokyo' }));

    expect(screen.getByText('Ryu')).toBeInTheDocument();
    expect(screen.queryByText('Ken')).not.toBeInTheDocument();
    expect(screen.queryByText('Chun-Li')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Filter City' })); // Use consistent button selector
    fireEvent.click(within(screen.getByRole('menu')).getByRole('menuitem', { name: 'All City' }));

    expect(screen.getByText('Ryu')).toBeInTheDocument();
    expect(screen.getByText('Ken')).toBeInTheDocument();
    expect(screen.getByText('Chun-Li')).toBeInTheDocument();
  });

  it('supports menu placement for per-column filters', () => {
    render(
      <DataTable
        columns={columns}
        data={fighters}
        enableColumnFilters
        columnFiltersPlacement="menu"
        columnFilterConfig={{
          city: {
            type: 'text',
          },
        }}
      />,
    );

    expect(screen.queryByLabelText('Filter City')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open City filter' }));
    fireEvent.change(screen.getByLabelText('Filter City'), { target: { value: 'tok' } });

    expect(screen.getByText('Ryu')).toBeInTheDocument();
    expect(screen.queryByText('Ken')).not.toBeInTheDocument();
    expect(screen.queryByText('Chun-Li')).not.toBeInTheDocument();
  });

  it('shows and applies select filter options in menu placement', () => {
    render(
      <DataTable
        columns={columns}
        data={fighters}
        enableColumnFilters
        columnFiltersPlacement="menu"
        columnFilterConfig={{
          city: {
            type: 'select',
            options: [
              { value: 'Tokyo', label: 'Tokyo' },
              { value: 'Los Angeles', label: 'Los Angeles' },
              { value: 'Shanghai', label: 'Shanghai' },
            ],
          },
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open City filter' }));

    const filterMenu = screen.getByRole('menu');
    fireEvent.click(within(filterMenu).getByRole('menuitem', { name: 'Los Angeles' }));

    expect(screen.getByText('Ken')).toBeInTheDocument();
    expect(screen.queryByText('Ryu')).not.toBeInTheDocument();
    expect(screen.queryByText('Chun-Li')).not.toBeInTheDocument();
  });

  it('supports multi-select filters in row placement', () => {
    render(
      <DataTable
        columns={columns}
        data={fighters}
        enableColumnFilters
        columnFilterConfig={{
          city: {
            type: 'multi-select',
            options: [
              { value: 'Tokyo', label: 'Tokyo' },
              { value: 'Los Angeles', label: 'Los Angeles' },
              { value: 'Shanghai', label: 'Shanghai' },
            ],
          },
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Filter City' }));
    const filterMenu = screen.getByRole('menu');
    fireEvent.click(within(filterMenu).getByRole('menuitem', { name: 'Tokyo' }));
    fireEvent.click(within(filterMenu).getByRole('menuitem', { name: 'Los Angeles' }));

    expect(screen.getByText('Ryu')).toBeInTheDocument();
    expect(screen.getByText('Ken')).toBeInTheDocument();
    expect(screen.queryByText('Chun-Li')).not.toBeInTheDocument();

    fireEvent.click(within(filterMenu).getByRole('menuitem', { name: 'All City' }));

    expect(screen.getByText('Ryu')).toBeInTheDocument();
    expect(screen.getByText('Ken')).toBeInTheDocument();
    expect(screen.getByText('Chun-Li')).toBeInTheDocument();
  });

  it('supports multi-select filters in menu placement', () => {
    render(
      <DataTable
        columns={columns}
        data={fighters}
        enableColumnFilters
        columnFiltersPlacement="menu"
        columnFilterConfig={{
          city: {
            type: 'multi-select',
            options: [
              { value: 'Tokyo', label: 'Tokyo' },
              { value: 'Los Angeles', label: 'Los Angeles' },
              { value: 'Shanghai', label: 'Shanghai' },
            ],
          },
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open City filter' }));
    const filterMenu = screen.getByRole('menu');
    fireEvent.click(within(filterMenu).getByRole('menuitem', { name: 'Tokyo' }));
    fireEvent.click(within(filterMenu).getByRole('menuitem', { name: 'Los Angeles' }));

    expect(screen.getByText('Ryu')).toBeInTheDocument();
    expect(screen.getByText('Ken')).toBeInTheDocument();
    expect(screen.queryByText('Chun-Li')).not.toBeInTheDocument();
  });

  it('paginates rows with numbered controls', () => {
    const pagedRows = Array.from({ length: 30 }, (_, index) => ({
      id: index + 1,
      name: `Player ${index + 1}`,
      city: 'Metro City',
    }));

    render(<DataTable columns={columns} data={pagedRows} />);

    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.queryByText('Player 26')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Go to page 2' }));

    expect(screen.getByText('Player 26')).toBeInTheDocument();
    expect(screen.queryByText('Player 1')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('emits state changes in server mode', () => {
    vi.useFakeTimers();
    const handleStateChange = vi.fn();

    render(
      <DataTable
        columns={columns}
        data={fighters}
        mode="server"
        totalRows={40}
        state={{
          globalFilter: '',
          sorting: [],
          columnFilters: [],
          pagination: { pageIndex: 0, pageSize: 10 },
        }}
        enableColumnFilters
        columnFilterConfig={{
          city: {
            type: 'text',
          },
        }}
        onStateChange={handleStateChange}
      />,
    );

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'ry' } });
    act(() => {
      vi.advanceTimersByTime(401);
    });

    fireEvent.change(screen.getByLabelText('Filter City'), { target: { value: 'tok' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sort by Name' }));
    fireEvent.click(screen.getByRole('button', { name: 'Go to page 2' }));

    expect(handleStateChange).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        globalFilter: 'ry',
      }),
    );
    expect(handleStateChange).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        columnFilters: [{ id: 'city', value: 'tok' }],
      }),
    );
    expect(handleStateChange).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        sorting: [{ id: 'name', desc: false }],
      }),
    );
    expect(handleStateChange).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        pagination: { pageIndex: 1, pageSize: 10 },
      }),
    );
    expect(handleStateChange).toHaveBeenCalledTimes(4);

    vi.useRealTimers();
  });

  it('clamps out-of-range page index and requests a valid server page', async () => {
    const handleStateChange = vi.fn();

    render(
      <DataTable
        columns={columns}
        data={[]}
        mode="server"
        totalRows={10}
        state={{
          globalFilter: '',
          sorting: [],
          pagination: { pageIndex: 12, pageSize: 10 },
        }}
        onStateChange={handleStateChange}
      />,
    );

    expect(screen.getByText('Showing 1-10 of 10')).toBeInTheDocument();

    await waitFor(() => {
      expect(handleStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      );
    });
  });

  it('supports multi-row selection and select-all on page', () => {
    const handleSelectedRowIdsChange = vi.fn();

    render(
      <DataTable
        columns={columns}
        data={fighters}
        enableRowSelection
        getRowId={(row) => String(row.id)}
        onSelectedRowIdsChange={handleSelectedRowIdsChange}
      />,
    );

    fireEvent.click(screen.getByLabelText('Select row 2'));
    expect(handleSelectedRowIdsChange).toHaveBeenLastCalledWith(['2']);
    expect(handleSelectedRowIdsChange).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText('Select row 1'));
    expect(handleSelectedRowIdsChange).toHaveBeenLastCalledWith(['1', '2']);
    expect(handleSelectedRowIdsChange).toHaveBeenCalledTimes(2);

    fireEvent.click(screen.getByLabelText('Select all rows on page'));
    expect(handleSelectedRowIdsChange).toHaveBeenLastCalledWith(['1', '2', '3']);
    expect(handleSelectedRowIdsChange).toHaveBeenCalledTimes(3);
  });

  it('clears off-page selections when deselecting all from the header checkbox', () => {
    const handleSelectedRowIdsChange = vi.fn();
    const rows = Array.from({ length: 12 }, (_, index) => ({
      id: index + 1,
      name: `Fighter ${index + 1}`,
      city: 'Metro City',
    }));

    render(
      <DataTable
        columns={columns}
        data={rows}
        enableRowSelection
        getRowId={(row) => String(row.id)}
        pageSizeOptions={[10, 12]}
        initialState={{
          pagination: { pageIndex: 0, pageSize: 10 },
        }}
        initialSelectedRowIds={Array.from({ length: 12 }, (_, index) => String(index + 1))}
        onSelectedRowIdsChange={handleSelectedRowIdsChange}
      />,
    );

    fireEvent.click(screen.getByLabelText('Select all rows on page'));

    expect(handleSelectedRowIdsChange).toHaveBeenLastCalledWith([]);
    expect(handleSelectedRowIdsChange).toHaveBeenCalledTimes(1);
  });

  it('enforces single selection mode', () => {
    render(
      <DataTable
        columns={columns}
        data={fighters}
        enableRowSelection
        selectionMode="single"
        getRowId={(row) => String(row.id)}
      />,
    );

    const row1Checkbox = screen.getByLabelText('Select row 1');
    const row2Checkbox = screen.getByLabelText('Select row 2');

    fireEvent.click(row1Checkbox);
    expect(row1Checkbox).toBeChecked();

    fireEvent.click(row2Checkbox);
    expect(row1Checkbox).not.toBeChecked();
    expect(row2Checkbox).toBeChecked();
    expect(screen.queryByLabelText('Select all rows on page')).not.toBeInTheDocument();
  });

  it('renders a single selection header cell with grouped columns', () => {
    const groupedColumns: Array<ColumnDef<Fighter, unknown>> = [
      {
        header: 'Identity',
        columns: [
          {
            accessorKey: 'name',
            header: 'Name',
          },
        ],
      },
      {
        header: 'Location',
        columns: [
          {
            accessorKey: 'city',
            header: 'City',
          },
        ],
      },
    ];

    render(
      <DataTable
        columns={groupedColumns}
        data={fighters}
        enableRowSelection
        selectionMode="single"
        getRowId={(row) => String(row.id)}
      />,
    );

    expect(screen.getAllByRole('columnheader', { name: 'Row selection' })).toHaveLength(1);
  });

  it('does not apply selected-row styling when row selection is disabled', () => {
    render(
      <DataTable
        columns={columns}
        data={fighters}
        selectedRowIds={['1']}
        getRowId={(row) => String(row.id)}
      />,
    );

    const row = screen.getByText('Ryu').closest('tr');
    expect(row).not.toHaveClass(styles.selectedRow);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('supports row actions via createDataTableActionsColumn helper', () => {
    const onView = vi.fn();
    const onDelete = vi.fn();

    const actionsColumn = createDataTableActionsColumn<Fighter>({
      getTriggerAriaLabel: ({ originalRow }) => `Row actions for ${originalRow.name}`,
      getActions: ({ originalRow }) => [
        {
          id: 'view',
          label: 'View',
          onSelect: () => onView(originalRow.id),
        },
        {
          id: 'delete',
          label: 'Delete',
          danger: true,
          onSelect: () => onDelete(originalRow.id),
        },
      ],
    });

    render(<DataTable columns={[...columns, actionsColumn]} data={fighters} />);

    fireEvent.click(screen.getByRole('button', { name: 'Row actions for Ryu' }));
    fireEvent.click(within(screen.getByRole('menu')).getByRole('menuitem', { name: 'View' }));
    expect(onView).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: 'Row actions for Ken' }));
    fireEvent.click(within(screen.getByRole('menu')).getByRole('menuitem', { name: 'Delete' }));
    expect(onDelete).toHaveBeenCalledWith(2);
  });

  it('supports disabled row actions via helper options', () => {
    const actionsColumn = createDataTableActionsColumn<Fighter>({
      getTriggerAriaLabel: ({ originalRow }) => `Row actions for ${originalRow.name}`,
      isMenuDisabled: ({ originalRow }) => originalRow.id === 1,
      getActions: () => [
        {
          id: 'view',
          label: 'View',
          onSelect: () => undefined,
        },
      ],
    });

    render(<DataTable columns={[...columns, actionsColumn]} data={fighters} />);

    expect(screen.getByRole('button', { name: 'Row actions for Ryu' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Row actions for Ken' })).not.toBeDisabled();
  });
});
