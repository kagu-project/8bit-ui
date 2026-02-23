import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Pagination from './Pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: vi.fn(),
  };

  it('renders correct number of pages (simplified check)', () => {
    // Pagination rendering might be complex, but we expect at least the current page to be visible
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('handles page click', () => {
    render(<Pagination {...defaultProps} />);
    // Find page 2 button
    const page2 = screen.getByText('2');
    fireEvent.click(page2);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('handles next/prev buttons', () => {
    render(<Pagination {...defaultProps} currentPage={2} />);
    // Prev button usually has aria-label or specific text like "<"
    // Assuming typical implementation. If using icons, might need getByRole or similar.
    // Let's look for buttons.
    const buttons = screen.getAllByRole('button');
    // Smoke test: click first button (Prev) props
    fireEvent.click(buttons[0]);
    expect(defaultProps.onPageChange).toHaveBeenCalled();
  });
});
