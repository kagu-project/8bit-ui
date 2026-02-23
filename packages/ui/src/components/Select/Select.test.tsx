import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Select from './Select';

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
];

describe('Select', () => {
  it('renders with placeholder', () => {
    render(<Select options={options} placeholder="Select One" />);
    expect(screen.getByText('Select One')).toBeInTheDocument();
  });

  it('opens dropdown on click', () => {
    render(<Select options={options} />);
    // Select renders a div as trigger
    fireEvent.click(screen.getByText('Select option'));
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('selects an option', () => {
    const handleChange = vi.fn();
    render(<Select options={options} onChange={handleChange} />);

    fireEvent.click(screen.getByText('Select option')); // Open
    fireEvent.click(screen.getByText('Option 2')); // Select

    expect(handleChange).toHaveBeenCalledWith('2');
  });

  it('supports keyboard toggle (Enter)', () => {
    render(<Select options={options} />);
    const trigger = screen.getByRole('button'); // We added role="button" in previous step

    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'Enter' });

    expect(screen.getByText('Option 1')).toBeVisible();
  });
});
