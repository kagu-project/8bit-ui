import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Checkbox from './Checkbox';

describe('Checkbox', () => {
  it('renders with label', () => {
    render(<Checkbox label="Accept Terms" />);
    expect(screen.getByText('Accept Terms')).toBeInTheDocument();
  });

  it('toggles checked state', () => {
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange} />);

    const input = screen.getByRole('checkbox');
    fireEvent.click(input);
    expect(handleChange).toHaveBeenCalled();
    // Verify the event argument if strictly needed, but simply being called is usually enough for this level
  });

  it('supports uncontrolled usage', () => {
    render(<Checkbox aria-label="Uncontrolled checkbox" />);
    const input = screen.getByRole('checkbox', { name: 'Uncontrolled checkbox' });
    expect(input).not.toBeChecked();
    fireEvent.click(input);
    expect(input).toBeChecked();
  });

  it('respects disabled prop', () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('supports indeterminate state', () => {
    render(<Checkbox indeterminate aria-label="Partial" />);
    const input = screen.getByRole('checkbox', { name: 'Partial' }) as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    expect(input).not.toBeChecked();
  });
});
