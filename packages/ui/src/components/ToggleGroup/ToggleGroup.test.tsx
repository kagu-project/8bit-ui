import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ToggleGroup from './ToggleGroup';

describe('ToggleGroup', () => {
  const items = [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' },
  ] as const;

  it('renders radiogroup semantics', () => {
    render(<ToggleGroup items={items} value="one" ariaLabel="Example" />);

    expect(screen.getByRole('radiogroup', { name: 'Example' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('emits new value on click', () => {
    const onValueChange = vi.fn();

    render(<ToggleGroup items={items} value="one" onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Two' }));

    expect(onValueChange).toHaveBeenCalledWith('two');
  });

  it('does not emit active value click by default', () => {
    const onValueChange = vi.fn();

    render(<ToggleGroup items={items} value="one" onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'One' }));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('supports active reselect when allowReselect is true', () => {
    const onValueChange = vi.fn();

    render(<ToggleGroup items={items} value="one" onValueChange={onValueChange} allowReselect />);
    fireEvent.click(screen.getByRole('radio', { name: 'One' }));

    expect(onValueChange).toHaveBeenCalledWith('one');
  });

  it('supports keyboard navigation and skips disabled items', () => {
    const onValueChange = vi.fn();
    const itemsWithDisabled = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two', disabled: true },
      { value: 'three', label: 'Three' },
    ] as const;

    const ControlledToggleGroup = () => {
      const [value, setValue] = useState<'one' | 'two' | 'three'>('one');

      return (
        <ToggleGroup
          items={itemsWithDisabled}
          value={value}
          onValueChange={(nextValue) => {
            onValueChange(nextValue);
            setValue(nextValue);
          }}
        />
      );
    };

    render(<ControlledToggleGroup />);

    const one = screen.getByRole('radio', { name: 'One' });
    const three = screen.getByRole('radio', { name: 'Three' });

    one.focus();
    fireEvent.keyDown(one, { key: 'ArrowRight' });
    expect(three).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith('three');

    fireEvent.keyDown(three, { key: 'ArrowLeft' });
    expect(one).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith('one');

    fireEvent.keyDown(one, { key: 'End' });
    expect(three).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith('three');

    fireEvent.keyDown(three, { key: 'Home' });
    expect(one).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith('one');
  });

  it('does not allow disabled items to be selected and handles all-disabled groups', () => {
    const onValueChange = vi.fn();
    const partiallyDisabledItems = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two', disabled: true },
    ] as const;

    const { unmount } = render(
      <ToggleGroup items={partiallyDisabledItems} value="one" onValueChange={onValueChange} />,
    );

    const disabledItem = screen.getByRole('radio', { name: 'Two' });
    expect(disabledItem).toBeDisabled();
    fireEvent.click(disabledItem);
    expect(onValueChange).not.toHaveBeenCalled();
    unmount();

    const allDisabledOnChange = vi.fn();
    const allDisabledItems = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' },
    ] as const;

    render(
      <ToggleGroup
        items={allDisabledItems}
        value="one"
        disabled
        onValueChange={allDisabledOnChange}
        ariaLabel="All disabled"
      />,
    );

    const allDisabledRadios = screen.getAllByRole('radio');
    allDisabledRadios.forEach((radio) => {
      expect(radio).toBeDisabled();
      expect(radio).toHaveAttribute('tabindex', '-1');
    });

    fireEvent.click(allDisabledRadios[0]);
    expect(allDisabledOnChange).not.toHaveBeenCalled();
  });
});
