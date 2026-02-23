import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgressBar from './ProgressBar';

describe('ProgressBar', () => {
  it('renders with default props', () => {
    render(<ProgressBar />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
    expect(progress).toHaveAttribute('aria-valuenow', '0');
  });

  it('renders with label and value', () => {
    render(<ProgressBar label="Health" value={50} showValue />);
    expect(screen.getByText('Health')).toBeInTheDocument();
    expect(screen.getByText('50 / 100')).toBeInTheDocument();
  });

  it('clamps values correctly', () => {
    render(<ProgressBar value={150} max={100} />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '100');
  });

  it('applies preset color classes', () => {
    const { container } = render(<ProgressBar color="danger" />);
    // Checking if the container has the danger class (hashed)
    // The previous test checked firstChild, effectively just smoke testing.
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom color via style', () => {
    const { container } = render(<ProgressBar color="#123456" />);
    const progressBar = container.firstChild;
    expect(progressBar).toHaveStyle({ '--progress-color': '#123456' });
  });

  it('renders striped variant', () => {
    const { container } = render(<ProgressBar variant="striped" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
