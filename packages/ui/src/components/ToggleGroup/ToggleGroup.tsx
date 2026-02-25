'use client';

import {
  useId,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import styles from './ToggleGroup.module.css';

export interface ToggleGroupItem<T extends string = string> {
  value: T;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps<T extends string = string> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  items: ReadonlyArray<ToggleGroupItem<T>>;
  value?: T;
  onValueChange?: (value: T) => void;
  allowReselect?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  className?: string;
  style?: CSSProperties;
}

const ToggleGroup = <T extends string = string>({
  items,
  value,
  onValueChange,
  allowReselect = false,
  disabled = false,
  ariaLabel,
  ariaLabelledBy,
  className = '',
  style = {},
  ...props
}: ToggleGroupProps<T>) => {
  const groupId = useId();
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const enabledIndexes = items
    .map((item, index) => ({ index, disabled: disabled || Boolean(item.disabled) }))
    .filter((entry) => !entry.disabled)
    .map((entry) => entry.index);

  const activeIndex = items.findIndex((item) => item.value === value);
  const firstEnabledIndex = enabledIndexes[0] ?? -1;

  const emitValue = (nextValue: T) => {
    if (!onValueChange) {
      return;
    }

    if (!allowReselect && nextValue === value) {
      return;
    }

    onValueChange(nextValue);
  };

  const focusIndex = (index: number) => {
    buttonRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    if (enabledIndexes.length === 0) {
      return;
    }

    let nextIndex = -1;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const position = enabledIndexes.indexOf(currentIndex);
      nextIndex = enabledIndexes[(position + 1) % enabledIndexes.length];
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const position = enabledIndexes.indexOf(currentIndex);
      nextIndex = enabledIndexes[(position - 1 + enabledIndexes.length) % enabledIndexes.length];
    } else if (event.key === 'Home') {
      event.preventDefault();
      nextIndex = enabledIndexes[0];
    } else if (event.key === 'End') {
      event.preventDefault();
      nextIndex = enabledIndexes[enabledIndexes.length - 1];
    }

    if (nextIndex < 0) {
      return;
    }

    focusIndex(nextIndex);
    emitValue(items[nextIndex].value);
  };

  return (
    <div
      className={[styles.container, className].filter(Boolean).join(' ')}
      style={style}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      {...props}
    >
      {items.map((item, index) => {
        const isDisabled = disabled || Boolean(item.disabled);
        const isActive = item.value === value;
        const tabIndex =
          isDisabled || enabledIndexes.length === 0
            ? -1
            : index === (activeIndex >= 0 ? activeIndex : firstEnabledIndex)
              ? 0
              : -1;

        return (
          <button
            key={item.value}
            ref={(element) => {
              buttonRefs.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={item.label}
            title={item.label}
            disabled={isDisabled}
            tabIndex={tabIndex}
            onClick={() => emitValue(item.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={[
              styles.button,
              isActive && styles.buttonActive,
              isDisabled && styles.buttonDisabled,
            ]
              .filter(Boolean)
              .join(' ')}
            data-group={`${groupId}-${item.value}`}
          >
            {item.icon ? <span className={styles.icon}>{item.icon}</span> : item.label}
          </button>
        );
      })}
    </div>
  );
};

export default ToggleGroup;
