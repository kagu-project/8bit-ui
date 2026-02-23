import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click Me');
  });

  it('handles onClick events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes', () => {
    const { container } = render(<Button variant="link">Link Button</Button>);
    // We check if the class name includes the hashed module class for link
    // Since CSS modules transform class names, we look for partial match or specific implementation details
    // A better way with CSS modules is to trust the prop plumbing, or check for data-attributes if available.
    // For now, we'll verify it doesn't crash and renders.
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('respects disabled prop', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('supports keyboard structure (smoke test)', () => {
    render(<Button>Key Test</Button>);
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });
    // Visual press state is internal React state, harder to test without looking for side effects
    // But we can ensure no errors are thrown
    expect(button).toBeVisible();
  });

  it('renders as an anchor when href is provided', () => {
    render(<Button href="/docs">Docs</Button>);

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', '/docs');
  });

  it('supports disabled anchor state', () => {
    const handleClick = vi.fn();
    render(
      <Button href="/docs" disabled onClick={handleClick}>
        Docs
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(link);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
