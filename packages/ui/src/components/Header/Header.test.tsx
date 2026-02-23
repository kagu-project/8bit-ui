import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header, Toolbar } from './'; // Testing the index export too

describe('Header', () => {
  it('renders children', () => {
    render(
      <Header>
        <div>Header Content</div>
      </Header>,
    );
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('renders fixed variant', () => {
    // Smoke test for class application
    const { container } = render(<Header fixed>Content</Header>);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('Toolbar', () => {
  it('renders children', () => {
    render(
      <Toolbar>
        <div>Toolbar Content</div>
      </Toolbar>,
    );
    expect(screen.getByText('Toolbar Content')).toBeInTheDocument();
  });
});
