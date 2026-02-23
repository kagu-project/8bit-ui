import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Tag from './Tag';

describe('Tag', () => {
  it('renders label correctly', () => {
    render(<Tag label="Test Tag" />);
    expect(screen.getByText('Test Tag')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<Tag label="Icon Tag" icon="★" />);
    expect(screen.getByText('★')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container } = render(<Tag label="Tag" variant="outline" />);
    // Check if the container (span) has the outline class.
    // Since styles are localized, we check if classname contains part of the localized name or we rely on functionality.
    // Testing implementation details like exact class names with CSS modules is tricky without a transformer.
    // We'll trust the component logic for now or look for class attribute presence.
    const tag = container.firstChild as HTMLElement | null;
    if (!tag) throw new Error('Tag root element not found');
    expect(tag.className).toContain('_outline_');
  });
});
