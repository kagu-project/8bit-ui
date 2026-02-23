'use client';

import { Menu } from '@kagu-project/8bit-ui';

export const MenuPreview = () => (
  <Menu>
    <Menu.Trigger ariaLabel="Open row actions">Actions</Menu.Trigger>
    <Menu.Content align="end">
      <Menu.Item>View</Menu.Item>
      <Menu.Item>Edit</Menu.Item>
      <Menu.Separator />
      <Menu.Item danger>Delete</Menu.Item>
    </Menu.Content>
  </Menu>
);
