import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Modal from './Modal';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';

const meta = {
  title: '8bitUI/Components/Modal',
  component: Modal,
  argTypes: {
    children: { control: false },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Header title="Mission Control" onClose={() => setIsOpen(false)} />
          <Modal.Body>
            <p>Prepare for launch sequence?</p>
            <p>All systems checking in green.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="link" onClick={() => setIsOpen(false)}>
              Abort
            </Button>
            <Button variant="solid" color="primary" onClick={() => setIsOpen(false)}>
              Launch
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

export const SmallAlert: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button color="danger" onClick={() => setIsOpen(true)}>
          Delete Save
        </Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="sm">
          <Modal.Header title="WARNING" onClose={() => setIsOpen(false)} />
          <Modal.Body>
            <p>Are you sure you want to delete your save file?</p>
            <p>
              <strong>This action cannot be undone.</strong>
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="link" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" color="danger" onClick={() => setIsOpen(false)}>
              DELETE
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

export const FormInside: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Edit Profile
        </Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md">
          <Modal.Header title="Player Profile" onClose={() => setIsOpen(false)} />
          <Modal.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8 }}>Username</label>
                <Input placeholder="RetroGamer99" fullWidth />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8 }}>Class</label>
                <Select options={['Warrior', 'Mage', 'Rogue']} fullWidth />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="link" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button variant="solid" color="secondary" onClick={() => setIsOpen(false)}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

export const MobileFooterLayout: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Mobile Layout</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="sm">
          <Modal.Header title="Confirm Action" onClose={() => setIsOpen(false)} />
          <Modal.Body>
            <p>On narrow screens, footer actions should stack and fill available width.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="link" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" color="primary" onClick={() => setIsOpen(false)}>
              Continue
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};
