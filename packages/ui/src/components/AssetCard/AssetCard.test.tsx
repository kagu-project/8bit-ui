import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AssetCard from './AssetCard';

describe('AssetCard', () => {
  const defaultProps = {
    title: 'Test Item',
    subtitle: 'Rarity: Common',
    src: 'https://example.com/image.png', // Dummy URL
  };

  it('renders title and subtitle', () => {
    render(<AssetCard {...defaultProps} />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Rarity: Common')).toBeInTheDocument();
  });

  it('renders image with correct src and alt text', () => {
    render(<AssetCard {...defaultProps} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', defaultProps.src);
    expect(img).toHaveAttribute('alt', defaultProps.title);
  });

  it('uses single notch corners by default', () => {
    const { container } = render(<AssetCard {...defaultProps} />);
    const card = container.firstChild as HTMLElement | null;
    if (!card) throw new Error('Card root element not found');
    expect(card.className).toContain('single');
  });
});
