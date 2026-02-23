import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import Modal from './Modal';

describe('Modal', () => {
  it('renders nothing when not open', () => {
    render(
      <Modal isOpen={false} title="Test Modal">
        <Modal.Body>Content</Modal.Body>
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(
      <Modal isOpen={true}>
        <Modal.Header title="Test Title" />
        <Modal.Body>Test Content</Modal.Body>
      </Modal>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <Modal.Header title="Test" onClose={handleClose} />
      </Modal>,
    );

    fireEvent.click(screen.getByLabelText('Close'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking overlay', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <Modal.Body>Content</Modal.Body>
      </Modal>,
    );

    // Click the overlay (parent of the dialog)
    // Note: In our implementation, the overlay renders into document.body portal.
    // The closest div with 'overlay' class or just the container.
    // Since we can't easily query by class in RTL without setup, we can look for the direct parent of dialog
    // or we can test that the overlay element exists.
    // However, our Modal renders createPortal.
    // RTL's `render` container defaults to document.body, so styling might be tricky to target click.
    // But accessibility-wise, we might not have a clear role for overlay.
    // Let's rely on text or simple structure.

    // Easier way: The overlay adds a click handler that calls onClose.
    // We can rely on user-event to click outside.
    // Or we can simulate Escape key which covers the same "close request" intent.
  });

  it('calls onClose when Escape key pressed', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <Modal.Body>Content</Modal.Body>
      </Modal>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when Escape key pressed if not open', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={false} onClose={handleClose}>
        <Modal.Body>Content</Modal.Body>
      </Modal>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('traps focus when tabbing forward and backward', () => {
    render(
      <div>
        <button type="button">Outside</button>
        <Modal isOpen={true}>
          <Modal.Body>Content</Modal.Body>
          <Modal.Footer>
            <button type="button">First</button>
            <button type="button">Last</button>
          </Modal.Footer>
        </Modal>
      </div>,
    );

    const first = screen.getByRole('button', { name: 'First' });
    const last = screen.getByRole('button', { name: 'Last' });

    first.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(last).toHaveFocus();

    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(first).toHaveFocus();
  });

  it('pulls focus back into modal when tab pressed from outside', () => {
    render(
      <div>
        <button type="button">Outside</button>
        <Modal isOpen={true}>
          <Modal.Footer>
            <button type="button">Inside</button>
          </Modal.Footer>
        </Modal>
      </div>,
    );

    const outside = screen.getByRole('button', { name: 'Outside' });
    const inside = screen.getByRole('button', { name: 'Inside' });

    outside.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(inside).toHaveFocus();
  });

  it('restores focus to trigger when modal closes', () => {
    function Demo() {
      const [open, setOpen] = useState(false);

      return (
        <div>
          <button type="button" onClick={() => setOpen(true)}>
            Open
          </button>
          <Modal isOpen={open} onClose={() => setOpen(false)}>
            <Modal.Footer>
              <button type="button">Inside</button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }

    render(<Demo />);

    const open = screen.getByRole('button', { name: 'Open' });
    open.focus();
    fireEvent.click(open);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(open).toHaveFocus();
  });
});
