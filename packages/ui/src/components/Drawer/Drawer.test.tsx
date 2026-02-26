import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import Drawer from './Drawer';

describe('Drawer', () => {
  it('renders nothing when not open', () => {
    render(
      <Drawer isOpen={false}>
        <Drawer.Body>Content</Drawer.Body>
      </Drawer>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(
      <Drawer isOpen={true}>
        <Drawer.Header title="Nav" />
        <Drawer.Body>Drawer Content</Drawer.Body>
      </Drawer>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Nav')).toBeInTheDocument();
    expect(screen.getByText('Drawer Content')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const handleClose = vi.fn();
    render(
      <Drawer isOpen={true} onClose={handleClose}>
        <Drawer.Header title="Test" onClose={handleClose} />
      </Drawer>,
    );

    fireEvent.click(screen.getByLabelText('Close drawer'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key pressed', () => {
    const handleClose = vi.fn();
    render(
      <Drawer isOpen={true} onClose={handleClose}>
        <Drawer.Body>Content</Drawer.Body>
      </Drawer>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when Escape key pressed if not open', () => {
    const handleClose = vi.fn();
    render(
      <Drawer isOpen={false} onClose={handleClose}>
        <Drawer.Body>Content</Drawer.Body>
      </Drawer>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('traps focus when tabbing forward and backward', () => {
    render(
      <div>
        <button type="button">Outside</button>
        <Drawer isOpen={true}>
          <Drawer.Body>Content</Drawer.Body>
          <Drawer.Footer>
            <button type="button">First</button>
            <button type="button">Last</button>
          </Drawer.Footer>
        </Drawer>
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

  it('pulls focus back into drawer when tab pressed from outside', () => {
    render(
      <div>
        <button type="button">Outside</button>
        <Drawer isOpen={true}>
          <Drawer.Footer>
            <button type="button">Inside</button>
          </Drawer.Footer>
        </Drawer>
      </div>,
    );

    const outside = screen.getByRole('button', { name: 'Outside' });
    const inside = screen.getByRole('button', { name: 'Inside' });

    outside.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(inside).toHaveFocus();
  });

  it('keeps focus trapped when drawer container is focused and tabbing forward', () => {
    render(
      <Drawer isOpen={true}>
        <Drawer.Footer>
          <button type="button">First</button>
          <button type="button">Last</button>
        </Drawer.Footer>
      </Drawer>,
    );

    const drawer = screen.getByRole('dialog');
    const first = screen.getByRole('button', { name: 'First' });

    drawer.focus();
    expect(drawer).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Tab' });
    expect(first).toHaveFocus();
  });

  it('restores focus to trigger when drawer closes', () => {
    function Demo() {
      const [open, setOpen] = useState(false);

      return (
        <div>
          <button type="button" onClick={() => setOpen(true)}>
            Open
          </button>
          <Drawer isOpen={open} onClose={() => setOpen(false)}>
            <Drawer.Footer>
              <button type="button">Inside</button>
            </Drawer.Footer>
          </Drawer>
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

  it('renders with right placement', () => {
    render(
      <Drawer isOpen={true} placement="right">
        <Drawer.Body>Right side</Drawer.Body>
      </Drawer>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Right side')).toBeInTheDocument();
  });

  it('renders with all four placements without errors', () => {
    const placements = ['left', 'right', 'top', 'bottom'] as const;

    for (const placement of placements) {
      const { unmount } = render(
        <Drawer isOpen={true} placement={placement}>
          <Drawer.Body>{placement}</Drawer.Body>
        </Drawer>,
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(placement)).toBeInTheDocument();
      unmount();
    }
  });

  it('renders compound sub-components (Header, Body, Footer)', () => {
    render(
      <Drawer isOpen={true}>
        <Drawer.Header title="Title" />
        <Drawer.Body>Body content</Drawer.Body>
        <Drawer.Footer>
          <button type="button">Action</button>
        </Drawer.Footer>
      </Drawer>,
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('has aria-modal attribute', () => {
    render(
      <Drawer isOpen={true}>
        <Drawer.Body>Content</Drawer.Body>
      </Drawer>,
    );

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('is labelled by header title', () => {
    render(
      <Drawer isOpen={true}>
        <Drawer.Header title="Drawer Title" />
        <Drawer.Body>Content</Drawer.Body>
      </Drawer>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Drawer Title' });
    const title = screen.getByText('Drawer Title');

    expect(dialog).toHaveAttribute('aria-labelledby', title.getAttribute('id'));
    expect(title).toHaveAttribute('id');
  });

  it('uses fallback accessible label when no title or aria labels are provided', () => {
    render(
      <Drawer isOpen={true}>
        <Drawer.Body>Content</Drawer.Body>
      </Drawer>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Drawer' });
    expect(dialog).toHaveAttribute('aria-label', 'Drawer');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('prefers explicit aria-label over fallback', () => {
    render(
      <Drawer isOpen={true} aria-label="Navigation panel">
        <Drawer.Body>Content</Drawer.Body>
      </Drawer>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Navigation panel' });
    expect(dialog).toHaveAttribute('aria-label', 'Navigation panel');
  });

  it('locks body scroll when open and restores on close', () => {
    function Demo() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open
          </button>
          <Drawer isOpen={open} onClose={() => setOpen(false)}>
            <Drawer.Body>Content</Drawer.Body>
          </Drawer>
        </>
      );
    }

    render(<Demo />);

    expect(document.body.style.overflow).not.toBe('hidden');

    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});
