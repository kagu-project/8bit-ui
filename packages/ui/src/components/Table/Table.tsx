import { forwardRef } from 'react';
import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';
import styles from './Table.module.css';

const cx = (...values: Array<string | undefined | false>): string =>
  values.filter(Boolean).join(' ');

export interface TableProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  tableClassName?: string;
  tableStyle?: CSSProperties;
  tableProps?: TableHTMLAttributes<HTMLTableElement>;
  scrollClassName?: string;
}

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children?: ReactNode;
}

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children?: ReactNode;
}

export interface TableFooterProps extends HTMLAttributes<HTMLTableSectionElement> {
  children?: ReactNode;
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children?: ReactNode;
}

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
}

const TableBase = forwardRef<HTMLDivElement, TableProps>(
  (
    {
      children,
      className = '',
      style = {},
      tableClassName = '',
      tableStyle = {},
      tableProps,
      scrollClassName = '',
      ...props
    },
    ref,
  ) => {
    const {
      className: nativeTableClassName = '',
      style: nativeTableStyle = {},
      ...nativeTableProps
    } = tableProps ?? {};

    return (
      <div ref={ref} className={cx(styles.frame, className)} style={style} {...props}>
        <div className={cx(styles.scrollContainer, scrollClassName)}>
          <table
            className={cx(styles.table, tableClassName, nativeTableClassName)}
            style={{ ...tableStyle, ...nativeTableStyle }}
            {...nativeTableProps}
          >
            {children}
          </table>
        </div>
      </div>
    );
  },
);

TableBase.displayName = 'Table';

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className = '', children, ...props }, ref) => (
    <thead ref={ref} className={cx(styles.header, className)} {...props}>
      {children}
    </thead>
  ),
);
TableHeader.displayName = 'Table.Header';

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className = '', children, ...props }, ref) => (
    <tbody ref={ref} className={cx(styles.body, className)} {...props}>
      {children}
    </tbody>
  ),
);
TableBody.displayName = 'Table.Body';

const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className = '', children, ...props }, ref) => (
    <tfoot ref={ref} className={cx(styles.footer, className)} {...props}>
      {children}
    </tfoot>
  ),
);
TableFooter.displayName = 'Table.Footer';

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className = '', children, ...props }, ref) => (
    <tr ref={ref} className={cx(styles.row, className)} {...props}>
      {children}
    </tr>
  ),
);
TableRow.displayName = 'Table.Row';

const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  ({ className = '', children, ...props }, ref) => (
    <th ref={ref} className={cx(styles.headerCell, className)} {...props}>
      {children}
    </th>
  ),
);
TableHeaderCell.displayName = 'Table.HeaderCell';

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className = '', children, ...props }, ref) => (
    <td ref={ref} className={cx(styles.cell, className)} {...props}>
      {children}
    </td>
  ),
);
TableCell.displayName = 'Table.Cell';

export interface TableComponent {
  (props: TableProps): JSX.Element;
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Footer: typeof TableFooter;
  Row: typeof TableRow;
  HeaderCell: typeof TableHeaderCell;
  Cell: typeof TableCell;
}

const Table = Object.assign(TableBase, {
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  HeaderCell: TableHeaderCell,
  Cell: TableCell,
}) as TableComponent;

export default Table;
export { TableHeader, TableBody, TableFooter, TableRow, TableHeaderCell, TableCell };
