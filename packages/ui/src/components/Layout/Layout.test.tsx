import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Layout from './Layout';

describe('Layout', () => {
  it('renders children', () => {
    render(
      <Layout>
        <div>Main Content</div>
      </Layout>,
    );
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('renders header and bottomNav slots', () => {
    render(
      <Layout header={<div>Header Slot</div>} bottomNav={<div>BottomNav Slot</div>}>
        Content
      </Layout>,
    );
    expect(screen.getByText('Header Slot')).toBeInTheDocument();
    expect(screen.getByText('BottomNav Slot')).toBeInTheDocument();
  });
});
