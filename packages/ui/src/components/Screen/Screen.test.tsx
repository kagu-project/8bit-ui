import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Screen from './Screen';

describe('Screen', () => {
  it('renders children', () => {
    render(
      <Screen>
        <div>Game Screen</div>
      </Screen>,
    );
    expect(screen.getByText('Game Screen')).toBeInTheDocument();
  });

  it('renders background layer', () => {
    // Screen has a background image and grid
    const { container } = render(<Screen>Content</Screen>);
    // Just checking if we have multiple layers (divs)
    expect(container.querySelectorAll('div').length).toBeGreaterThan(1);
  });

  it('supports fixed mode class and custom background class', () => {
    const { container } = render(
      <Screen mode="fixed" backgroundClassName="hero-bg">
        Content
      </Screen>,
    );

    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('fixed');
    expect(container.querySelector('.hero-bg')).toBeInTheDocument();
  });

  it('supports inline mode class and custom content class', () => {
    const { container } = render(
      <Screen mode="inline" contentClassName="inline-content">
        Content
      </Screen>,
    );

    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('inline');
    expect(container.querySelector('.inline-content')).toBeInTheDocument();
  });
});
