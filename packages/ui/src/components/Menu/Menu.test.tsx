import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Menu from './Menu';

interface BuildMenuItemProps {
  firstOnSelect?: () => void;
  secondDisabled?: boolean;
  secondOnSelect?: () => void;
  thirdOnSelect?: () => void;
}

const buildMenu = (itemProps: BuildMenuItemProps = {}) => (
  <Menu>
    <Menu.Trigger ariaLabel="Open menu">Menu</Menu.Trigger>
    <Menu.Content>
      <Menu.Item onSelect={itemProps.firstOnSelect}>First</Menu.Item>
      <Menu.Item disabled={itemProps.secondDisabled} onSelect={itemProps.secondOnSelect}>
        Second
      </Menu.Item>
      <Menu.Item onSelect={itemProps.thirdOnSelect}>Third</Menu.Item>
    </Menu.Content>
  </Menu>
);

const createRect = (partial = {}) => ({
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  toJSON: () => ({}),
  top: 0,
  width: 0,
  x: 0,
  y: 0,
  ...partial,
});

describe('Menu', () => {
  it('renders trigger and keeps content hidden by default', () => {
    render(buildMenu());
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens on trigger click and closes on outside click', async () => {
    render(buildMenu());
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(await screen.findByRole('menu')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('opens with keyboard and supports arrow navigation', async () => {
    render(buildMenu({ secondDisabled: true }));
    const trigger = screen.getByRole('button', { name: 'Open menu' });
    trigger.focus();

    fireEvent.keyDown(trigger, { key: 'Enter' });

    const menu = await screen.findByRole('menu');
    const items = screen.getAllByRole('menuitem');

    await waitFor(() => expect(items[0]).toHaveFocus());

    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(items[2]).toHaveFocus();

    fireEvent.keyDown(menu, { key: 'Home' });
    expect(items[0]).toHaveFocus();

    fireEvent.keyDown(menu, { key: 'End' });
    expect(items[2]).toHaveFocus();
  });

  it('closes on Escape and returns focus to trigger', async () => {
    render(buildMenu());
    const trigger = screen.getByRole('button', { name: 'Open menu' });

    fireEvent.click(trigger);
    expect(await screen.findByRole('menu')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('does not call onSelect for disabled item', async () => {
    const onSelect = vi.fn();
    render(buildMenu({ secondDisabled: true, secondOnSelect: onSelect }));

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    const items = await screen.findAllByRole('menuitem');
    fireEvent.click(items[1]);

    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('calls onSelect for enabled item and closes by default', async () => {
    const onSelect = vi.fn();
    render(buildMenu({ firstOnSelect: onSelect }));

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    const items = await screen.findAllByRole('menuitem');
    fireEvent.click(items[0]);

    expect(onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('uses menuitemradio semantics when selected state is provided', async () => {
    render(
      <Menu defaultOpen={true}>
        <Menu.Trigger ariaLabel="Theme trigger">Theme</Menu.Trigger>
        <Menu.Content>
          <Menu.Item selected={true}>Light</Menu.Item>
          <Menu.Item selected={false}>Dark</Menu.Item>
        </Menu.Content>
      </Menu>,
    );

    const selected = await screen.findByRole('menuitemradio', { name: 'Light' });
    const unselected = screen.getByRole('menuitemradio', { name: 'Dark' });

    expect(selected).toHaveAttribute('aria-checked', 'true');
    expect(unselected).toHaveAttribute('aria-checked', 'false');
  });

  it('supports controlled open state via open/onOpenChange', async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Menu open={false} onOpenChange={onOpenChange}>
        <Menu.Trigger ariaLabel="Controlled trigger">Menu</Menu.Trigger>
        <Menu.Content>
          <Menu.Item>Item</Menu.Item>
        </Menu.Content>
      </Menu>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Controlled trigger' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    rerender(
      <Menu open={true} onOpenChange={onOpenChange}>
        <Menu.Trigger ariaLabel="Controlled trigger">Menu</Menu.Trigger>
        <Menu.Content>
          <Menu.Item>Item</Menu.Item>
        </Menu.Content>
      </Menu>,
    );

    expect(await screen.findByRole('menu')).toBeInTheDocument();
  });

  it('computes position and flips side when viewport space is insufficient', async () => {
    render(
      <Menu defaultOpen={true}>
        <Menu.Trigger ariaLabel="Position trigger">Menu</Menu.Trigger>
        <Menu.Content side="bottom" collisionPadding={8}>
          <Menu.Item>One</Menu.Item>
          <Menu.Item>Two</Menu.Item>
        </Menu.Content>
      </Menu>,
    );

    const trigger = screen.getByRole('button', { name: 'Position trigger' });
    const menu = await screen.findByRole('menu');

    vi.spyOn(trigger, 'getBoundingClientRect').mockImplementation(() =>
      createRect({
        bottom: 620,
        height: 32,
        left: 140,
        right: 180,
        top: 588,
        width: 40,
      }),
    );

    vi.spyOn(menu, 'getBoundingClientRect').mockImplementation(() =>
      createRect({
        height: 240,
        width: 180,
      }),
    );

    fireEvent(window, new Event('resize'));

    await waitFor(() => expect(menu).toHaveAttribute('data-side', 'top'));
  });
});
