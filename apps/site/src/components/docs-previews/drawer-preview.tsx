'use client';

import { useState } from 'react';
import { Button, Drawer } from '@kagu-project/8bit-ui';

export const DrawerPreview = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        Open Drawer
      </Button>

      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} placement="left" size="md">
        <Drawer.Header title="Navigation" onClose={() => setIsOpen(false)} />
        <Drawer.Body>
          <nav style={{ display: 'grid', gap: 8 }}>
            <a href="#getting-started">Getting Started</a>
            <a href="#components">Components</a>
            <a href="#theming">Theming</a>
            <a href="#api">API Reference</a>
          </nav>
        </Drawer.Body>
      </Drawer>
    </>
  );
};
