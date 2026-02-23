import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TextArea from './TextArea';

describe('TextArea', () => {
  it('renders with placeholder', () => {
    render(<TextArea placeholder="Type here..." />);
    expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument();
  });

  it('handles input change', () => {
    const handleChange = vi.fn();
    render(<TextArea onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Line 1\nLine 2' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('respects rows prop', () => {
    render(<TextArea rows={5} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('rows', '5');
  });
});
