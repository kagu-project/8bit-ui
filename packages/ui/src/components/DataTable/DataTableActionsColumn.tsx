import type { ColumnDef, Row } from '@tanstack/react-table';
import type { CSSProperties, ReactNode } from 'react';
import Menu from '../Menu';
import styles from './DataTableActionsColumn.module.css';

const DEFAULT_COLUMN_WIDTH = 92;

export interface DataTableRowActionsContext<TData> {
  row: Row<TData>;
  originalRow: TData;
}

export interface DataTableRowAction<TData> {
  id: string;
  label: ReactNode;
  onSelect: (context: DataTableRowActionsContext<TData>) => void;
  danger?: boolean;
  disabled?: boolean;
}

export interface CreateDataTableActionsColumnOptions<TData> {
  id?: string;
  headerLabel?: ReactNode;
  width?: number;
  menuAlign?: 'start' | 'center' | 'end';
  getTriggerAriaLabel?: (context: DataTableRowActionsContext<TData>) => string;
  getActions: (context: DataTableRowActionsContext<TData>) => DataTableRowAction<TData>[];
  isMenuDisabled?: (context: DataTableRowActionsContext<TData>) => boolean;
}

export const createDataTableActionsColumn = <TData,>({
  id = 'actions',
  headerLabel = 'Actions',
  width = DEFAULT_COLUMN_WIDTH,
  menuAlign = 'end',
  getTriggerAriaLabel,
  getActions,
  isMenuDisabled,
}: CreateDataTableActionsColumnOptions<TData>): ColumnDef<TData, unknown> => {
  const widthStyle: CSSProperties = {
    minWidth: width,
    width,
  };

  return {
    id,
    header: () => (
      <span className={styles.header} style={widthStyle}>
        {headerLabel}
      </span>
    ),
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => {
      const context: DataTableRowActionsContext<TData> = {
        row,
        originalRow: row.original,
      };
      const actions = getActions(context);
      const isDisabled = (isMenuDisabled?.(context) ?? false) || actions.length === 0;
      const ariaLabel = getTriggerAriaLabel?.(context) ?? `Row actions for row ${row.id}`;

      return (
        <div className={styles.cell} style={widthStyle}>
          <Menu closeOnSelect>
            <Menu.Trigger className={styles.trigger} ariaLabel={ariaLabel} disabled={isDisabled}>
              <span className={styles.icon} aria-hidden="true">
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </span>
            </Menu.Trigger>
            <Menu.Content align={menuAlign}>
              {actions.map((action) => (
                <Menu.Item
                  key={action.id}
                  danger={action.danger}
                  disabled={action.disabled}
                  onSelect={() => action.onSelect(context)}
                >
                  {action.label}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu>
        </div>
      );
    },
  };
};
