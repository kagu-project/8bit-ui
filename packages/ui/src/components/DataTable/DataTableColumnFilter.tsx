import type { Column } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import Input from '../Input';
import Menu from '../Menu';
import styles from './DataTable.module.css';
import type {
  DataTableColumnFilterConfig,
  DataTableColumnFilterOption,
  DataTableColumnFilterRenderContext,
  DataTableColumnFiltersPlacement,
} from './DataTableTypes';
import { areFilterValuesEqual, getColumnLabel, isFilterPrimitive } from './DataTableUtils';

const CLEAR_FILTER_VALUE_PREFIX = '__8bit_clear_filter__';

interface DataTableColumnFilterProps<TData> {
  column: Column<TData, unknown>;
  placement: DataTableColumnFiltersPlacement;
  config?: DataTableColumnFilterConfig<TData>;
  render?: (context: DataTableColumnFilterRenderContext<TData>) => ReactNode;
  globalFilterId: string;
}

const DataTableColumnFilter = <TData,>({
  column,
  placement,
  config,
  render,
  globalFilterId,
}: DataTableColumnFilterProps<TData>) => {
  const columnLabel = config?.label ?? getColumnLabel(column);

  const getColumnFilterValue = (
    col: Column<TData, unknown>,
  ): string | number | Array<string | number> | undefined => {
    const val = col.getFilterValue();
    if (isFilterPrimitive(val)) return val;
    if (Array.isArray(val)) {
      const normalizedArray = val.filter(isFilterPrimitive);
      return normalizedArray.length > 0 ? normalizedArray : undefined;
    }
    return undefined;
  };

  const value = getColumnFilterValue(column);

  const setColumnFilterValue = (col: Column<TData, unknown>, nextValue: unknown) => {
    if (Array.isArray(nextValue)) {
      const normalizedArray = nextValue.filter(isFilterPrimitive);
      if (normalizedArray.length === 0) {
        col.setFilterValue(undefined);
        return;
      }
      col.setFilterValue(normalizedArray);
      return;
    }

    if (nextValue === '' || nextValue === null || nextValue === undefined) {
      col.setFilterValue(undefined);
      return;
    }

    if (!isFilterPrimitive(nextValue)) {
      col.setFilterValue(undefined);
      return;
    }

    col.setFilterValue(nextValue);
  };

  const setValue = (nextValue: unknown) => setColumnFilterValue(column, nextValue);

  const context: DataTableColumnFilterRenderContext<TData> = {
    column,
    value,
    setValue,
  };

  const customFilterUi = config?.render?.(context) ?? render?.(context);
  const filterType = config?.type ?? 'text';
  const columnFilterId = `${globalFilterId}-${column.id}-filter`;
  const clearFilterValue = `${CLEAR_FILTER_VALUE_PREFIX}${column.id}`;
  const selectOptionsWithClear: DataTableColumnFilterOption[] = [
    {
      value: clearFilterValue,
      label: config?.placeholder ?? `All ${columnLabel}`,
    },
    ...(config?.options ?? []),
  ];

  if (customFilterUi) return customFilterUi;

  if (filterType === 'select' || filterType === 'multi-select') {
    const getColumnMultiFilterValue = (col: Column<TData, unknown>): Array<string | number> => {
      const val = getColumnFilterValue(col);
      if (!Array.isArray(val)) return [];
      return val;
    };

    const selectedValues = getColumnMultiFilterValue(column);
    const getOptionLabel = (optionValue: string | number): string => {
      const matchedOption = (config?.options ?? []).find((option) =>
        areFilterValuesEqual(option.value, optionValue),
      );
      return matchedOption ? matchedOption.label : String(optionValue);
    };

    const renderMenuOptions = (isMultiSelect: boolean) => (
      <div className={styles.filterMenuOptions} role="group" aria-label={`Filter ${columnLabel}`}>
        {(() => {
          const allSelected = isMultiSelect ? selectedValues.length === 0 : value === undefined;
          return (
            <Menu.Item
              className={`${styles.filterMenuOption} ${
                isMultiSelect ? '' : styles.filterMenuOptionSingle
              } ${!isMultiSelect && allSelected ? styles.filterMenuOptionSelected : ''}`}
              leftSlot={
                isMultiSelect ? (
                  <span
                    className={`${styles.multiSelectIndicator} ${
                      allSelected ? styles.multiSelectIndicatorChecked : ''
                    }`}
                    aria-hidden="true"
                  >
                    {allSelected ? <span className={styles.multiSelectIndicatorMark} /> : null}
                  </span>
                ) : undefined
              }
              onSelect={() => setValue(undefined)}
            >
              {config?.placeholder ?? `All ${columnLabel}`}
            </Menu.Item>
          );
        })()}

        <Menu.Separator />

        {selectOptionsWithClear.slice(1).map((option) => {
          const isSelected = isMultiSelect
            ? selectedValues.some((selectedValue) =>
                areFilterValuesEqual(selectedValue, option.value),
              )
            : isFilterPrimitive(value) && areFilterValuesEqual(value, option.value);

          return (
            <Menu.Item
              key={`${column.id}-${String(option.value)}`}
              className={`${styles.filterMenuOption} ${
                isMultiSelect ? '' : styles.filterMenuOptionSingle
              } ${!isMultiSelect && isSelected ? styles.filterMenuOptionSelected : ''}`}
              leftSlot={
                isMultiSelect ? (
                  <span
                    className={`${styles.multiSelectIndicator} ${
                      isSelected ? styles.multiSelectIndicatorChecked : ''
                    }`}
                    aria-hidden="true"
                  >
                    {isSelected ? <span className={styles.multiSelectIndicatorMark} /> : null}
                  </span>
                ) : undefined
              }
              onSelect={() => {
                if (isMultiSelect) {
                  const nextSelectedValues = isSelected
                    ? selectedValues.filter(
                        (selectedValue) => !areFilterValuesEqual(selectedValue, option.value),
                      )
                    : [...selectedValues, option.value];
                  setValue(nextSelectedValues);
                  return;
                }

                setValue(option.value);
              }}
            >
              {option.label}
            </Menu.Item>
          );
        })}
      </div>
    );

    if (filterType === 'multi-select' && placement === 'row') {
      const selectedCount = selectedValues.length;
      const summaryLabel =
        selectedCount === 0
          ? (config?.placeholder ?? `All ${columnLabel}`)
          : selectedCount === 1
            ? getOptionLabel(selectedValues[0])
            : `${selectedCount} selected`;

      return (
        <Menu closeOnSelect={false}>
          <Menu.Trigger
            className={styles.columnFilterMenuTrigger}
            ariaLabel={`Filter ${columnLabel}`}
          >
            <span className={styles.columnFilterMenuLabel}>{summaryLabel}</span>
            <span className={styles.columnFilterMenuIcon} aria-hidden="true">
              ▼
            </span>
          </Menu.Trigger>
          <Menu.Content className={styles.filterMenuContent} align="start">
            <div className={styles.filterMenuBody}>{renderMenuOptions(true)}</div>
          </Menu.Content>
        </Menu>
      );
    }

    if (placement === 'menu') {
      return renderMenuOptions(filterType === 'multi-select');
    }

    const primitiveValue = isFilterPrimitive(value) ? value : undefined;
    const selectedLabel =
      primitiveValue === undefined
        ? (config?.placeholder ?? `All ${columnLabel}`)
        : getOptionLabel(primitiveValue);

    return (
      <Menu closeOnSelect={true}>
        <Menu.Trigger
          className={styles.columnFilterMenuTrigger}
          ariaLabel={`Filter ${columnLabel}`}
        >
          <span className={styles.columnFilterMenuLabel}>{selectedLabel}</span>
          <span className={styles.columnFilterMenuIcon} aria-hidden="true">
            ▼
          </span>
        </Menu.Trigger>
        <Menu.Content className={styles.filterMenuContent} align="start">
          <div className={styles.filterMenuBody}>{renderMenuOptions(false)}</div>
        </Menu.Content>
      </Menu>
    );
  }

  return (
    <Input
      id={columnFilterId}
      type="text"
      variant="solid"
      className={styles.columnFilterInput}
      value={value === undefined ? '' : String(value)}
      placeholder={config?.placeholder ?? `Filter ${columnLabel}...`}
      aria-label={`Filter ${columnLabel}`}
      onKeyDown={(event) => {
        if (event.key === 'Escape' || event.key === 'Tab') return;
        event.stopPropagation();
      }}
      onChange={(event) => setValue(event.target.value)}
    />
  );
};

export default DataTableColumnFilter;
