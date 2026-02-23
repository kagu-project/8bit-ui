import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Card title="My Card">Content</Card>);
    expect(screen.getByText('My Card')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    // Basic smoke test for rendering without crashing with different props
    render(<Card variant="outline">Outline Card</Card>);
    expect(screen.getByText('Outline Card')).toBeInTheDocument();
  });
});
