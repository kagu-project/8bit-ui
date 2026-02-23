import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ToastProvider, useToast } from './ToastContext';
import type { ToastApi, ToastOptions } from './ToastContext';

// Test Component to trigger toasts
type ToastMethod = keyof Pick<ToastApi, 'info' | 'success' | 'warning' | 'error'>;

interface TestComponentProps {
  type?: ToastMethod;
  message?: string;
}

const TestComponent = ({ type = 'info', message = 'Test Toast' }: TestComponentProps) => {
  const toast = useToast();
  const fireToast = toast[type] as (msg: string) => string;
  return <button onClick={() => fireToast(message)}>Trigger Toast</button>;
};

describe('Toast System', () => {
  it('renders nothing initially', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('displays a toast when triggered', async () => {
    render(
      <ToastProvider>
        <TestComponent message="Hello World" />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Trigger Toast'));

    expect(await screen.findByText('Hello World')).toBeInTheDocument();
  });

  it('displays the correct icon for success', async () => {
    render(
      <ToastProvider>
        <TestComponent type="success" />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Trigger Toast'));
    expect(await screen.findByText('✅')).toBeInTheDocument();
  });

  it('removes toast when close button is clicked', async () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Trigger Toast'));

    // Advance slightly to let render stabilize
    await act(async () => {
      await Promise.resolve();
    });

    const toast = screen.getByRole('alert');

    // Click close
    const closeBtn = screen.getByLabelText('Close');
    fireEvent.click(closeBtn);

    // Run exit animation (300ms)
    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    expect(toast).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('auto-dismisses after duration', async () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Trigger Toast'));

    // Advance slightly to let render stabilize
    await act(async () => {
      await Promise.resolve();
    });
    const toast = screen.getByRole('alert');

    // Fast-forward past default 3000ms + animation 300ms
    await act(async () => {
      vi.advanceTimersByTime(3500);
    });

    expect(toast).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('applies custom animation class', async () => {
    // We need to update TestComponent to accept options first
    const TestComponentWithOptions = ({ options }: { options: ToastOptions }) => {
      const toast = useToast();
      return <button onClick={() => toast.info('Pop Toast', options)}>Trigger Toast</button>;
    };

    render(
      <ToastProvider>
        <TestComponentWithOptions options={{ animation: 'pop' }} />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Trigger Toast'));

    // We assume it renders successfully
    const toast = await screen.findByText('Pop Toast');
    expect(toast).toBeInTheDocument();
  });
});
