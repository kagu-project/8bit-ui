import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Radio from './Radio';

describe('Radio', () => {
  it('renders with label', () => {
    render(<Radio label="Option A" />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
  });

  it('calls onChange when clicked', () => {
    const handleChange = vi.fn();
    render(<Radio value="A" onChange={handleChange} />);

    // Radios are usually part of a group, but individually they just fire onChange
    const input = screen.getByRole('radio');
    fireEvent.click(input);
    expect(handleChange).toHaveBeenCalled();
  });

  it('respects checked prop', () => {
    render(<Radio checked readOnly />);
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('respects disabled prop', () => {
    render(<Radio disabled />);
    expect(screen.getByRole('radio')).toBeDisabled();
  });
});
