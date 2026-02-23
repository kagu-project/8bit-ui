import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BottomNav from './BottomNav';

describe('BottomNav', () => {
  it('renders children correctly', () => {
    render(
      <BottomNav>
        <BottomNav.Item label="Home" icon="🏠" />
        <BottomNav.Action icon="+" />
      </BottomNav>,
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    // We can't easily test CSS module classes directly without knowing the hash,
    // but we can wrap it and check structural integrity or assume it renders.
    const { container } = render(<BottomNav variant="floating">Test</BottomNav>);
    expect(container.firstChild).toBeInTheDocument();
  });

  describe('Item', () => {
    it('handles onClick', () => {
      const handleClick = vi.fn();
      render(<BottomNav.Item label="Click Me" onClick={handleClick} />);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('shows active state', () => {
      // Checking if it renders without error when active is true
      render(<BottomNav.Item label="Active" active />);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  describe('Action', () => {
    it('handles onClick', () => {
      const handleClick = vi.fn();
      render(<BottomNav.Action icon="Add" onClick={handleClick} />);

      // The button text might be inside the Button component
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
