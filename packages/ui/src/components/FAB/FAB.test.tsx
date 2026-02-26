import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FAB from './FAB';

describe('FAB Component', () => {
  it('renders children correctly', () => {
    render(
      <FAB>
        <span>+</span>
      </FAB>,
    );
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('handles onClick events', () => {
    const handleClick = vi.fn();
    render(<FAB onClick={handleClick}>Click Me</FAB>);

    // FAB renders a button
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes', () => {
    render(<FAB variant="danger">X</FAB>);
    // Check if the button has the danger class (mapped from module CSS)
    // Note: CSS modules hash classes, but testing-library usually handles this if configured or we check for partial match if needed.
    // However, usually we test logic. Visuals are for Storybook.
    const button = screen.getByRole('button');
    expect(button.className).toContain('fab');
    expect(button.className).toContain('danger');
  });

  it('supports custom className for external positioning', () => {
    render(<FAB className="fabFloating">TL</FAB>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('fabFloating');
  });

  it('tracks keyboard pressed state like Button', () => {
    render(<FAB>Action</FAB>);
    const button = screen.getByRole('button');

    fireEvent.keyDown(button, { key: 'Enter' });
    expect(button).toHaveAttribute('data-pressed', 'true');

    fireEvent.keyUp(button, { key: 'Enter' });
    expect(button).toHaveAttribute('data-pressed', 'false');
  });
});
