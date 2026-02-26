import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import IconButton from './IconButton';

describe('IconButton', () => {
  it('renders children correctly', () => {
    render(<IconButton aria-label="Menu">☰</IconButton>);
    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveTextContent('☰');
  });

  it('forwards the aria-label', () => {
    render(<IconButton aria-label="Close">✕</IconButton>);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('handles onClick events', () => {
    const handleClick = vi.fn();
    render(
      <IconButton aria-label="Menu" onClick={handleClick}>
        ☰
      </IconButton>,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('respects the disabled prop', () => {
    const handleClick = vi.fn();
    render(
      <IconButton aria-label="Menu" disabled onClick={handleClick}>
        ☰
      </IconButton>,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('merges custom className', () => {
    render(
      <IconButton aria-label="Menu" className="custom-class">
        ☰
      </IconButton>,
    );
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('forwards refs', () => {
    const ref = vi.fn();
    render(
      <IconButton ref={ref} aria-label="Menu">
        ☰
      </IconButton>,
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it('defaults type to button', () => {
    render(<IconButton aria-label="Menu">☰</IconButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('respects explicit type prop', () => {
    render(
      <IconButton aria-label="Submit" type="submit">
        ✓
      </IconButton>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
