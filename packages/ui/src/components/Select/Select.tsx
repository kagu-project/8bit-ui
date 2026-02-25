'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import styles from './Select.module.css';

export type SelectVariant = 'solid' | 'outline' | 'ghost';
export type SelectOptionValue = string | number;

export interface SelectOption {
  value: SelectOptionValue;
  label: ReactNode;
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options?: Array<SelectOption | SelectOptionValue>;
  value?: SelectOptionValue;
  onChange?: (value: SelectOptionValue) => void;
  placeholder?: string;
  variant?: SelectVariant;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: CSSProperties;
}

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select option',
  variant = 'solid',
  disabled = false,
  fullWidth = false,
  className = '',
  style = {},
  ...props
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  const handleSelect = (option: SelectOption) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  const normalizedOptions: SelectOption[] = options.map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  const wrapperClasses = [styles.container, fullWidth && styles.fullWidth, className]
    .filter(Boolean)
    .join(' ');

  const triggerClasses = [
    styles.trigger,
    styles.single,
    styles[variant],
    disabled && styles.disabled,
    isOpen && styles.open,
  ]
    .filter(Boolean)
    .join(' ');

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={wrapperClasses} style={style} ref={containerRef} {...props}>
      <div
        className={triggerClasses}
        onClick={handleToggle}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleTriggerKeyDown}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`${styles.label} ${!selectedOption ? styles.placeholder : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={styles.icon}>▼</span>
      </div>

      {isOpen && (
        <div className={`${styles.dropdown} ${styles.dropdownNotched}`}>
          <div className={styles.dropdownInner} role="listbox">
            {normalizedOptions.map((option) => (
              <div
                key={String(option.value)}
                className={`${styles.option} ${value === option.value ? styles.selected : ''}`}
                role="option"
                aria-selected={value === option.value}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;
