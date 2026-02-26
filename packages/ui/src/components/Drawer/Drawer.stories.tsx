import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Drawer from './Drawer';
import Button from '../Button';

const meta = {
  title: '8bitUI/Components/Drawer',
  component: Drawer,
  argTypes: {
    children: { control: false },
    placement: {
      control: { type: 'select' },
      options: ['left', 'right', 'top', 'bottom'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placement: 'left',
    size: 'md',
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
        <Drawer {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
  },
};

export const RightPlacement: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Right Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} placement="right" size="md">
          <Drawer.Header title="Details" onClose={() => setIsOpen(false)} />
          <Drawer.Body>
            <p>This drawer slides in from the right side.</p>
            <p>Great for detail panels, settings, or filters.</p>
          </Drawer.Body>
          <Drawer.Footer>
            <Button variant="link" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" color="primary" onClick={() => setIsOpen(false)}>
              Save
            </Button>
          </Drawer.Footer>
        </Drawer>
      </>
    );
  },
};

export const BottomSheet: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Bottom Sheet</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} placement="bottom">
          <Drawer.Header title="Options" onClose={() => setIsOpen(false)} />
          <Drawer.Body>
            <div style={{ display: 'grid', gap: 12 }}>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Share
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Copy Link
              </Button>
              <Button variant="outline" color="danger" onClick={() => setIsOpen(false)}>
                Delete
              </Button>
            </div>
          </Drawer.Body>
        </Drawer>
      </>
    );
  },
};

export const SidebarNav: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const sections = [
      { label: 'Getting Started', items: ['Installation', 'Quick Start', 'Theming'] },
      {
        label: 'Components',
        items: ['Button', 'Card', 'DataTable', 'Drawer', 'Input', 'Modal', 'Select', 'Table'],
      },
      { label: 'Hooks', items: ['useToast'] },
    ];

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>☰ Menu</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} placement="left" size="sm">
          <Drawer.Header title="Docs" onClose={() => setIsOpen(false)} />
          <Drawer.Body>
            <nav>
              {sections.map((section) => (
                <div key={section.label} style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontFamily: 'var(--8bit-font-header)',
                      fontSize: '0.56rem',
                      textTransform: 'uppercase',
                      marginBottom: 6,
                    }}
                  >
                    {section.label}
                  </div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 4 }}>
                    {section.items.map((item) => (
                      <li key={item}>
                        <a
                          href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                          style={{
                            display: 'block',
                            padding: '4px 6px',
                            textDecoration: 'none',
                            color: 'inherit',
                            border: '2px solid transparent',
                          }}
                          onClick={() => setIsOpen(false)}
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </Drawer.Body>
        </Drawer>
      </>
    );
  },
};
