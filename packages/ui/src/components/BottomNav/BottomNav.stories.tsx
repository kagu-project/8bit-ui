import type { Meta, StoryObj } from '@storybook/react-vite';
import BottomNav from './BottomNav';
import { PlusIcon } from '../../storybook/icons';

const demoFrameStyle = {
  width: 360,
  border: '2px dashed #666',
  background: '#fff',
  padding: 12,
} as const;

const meta = {
  title: '8bitUI/Components/BottomNav',
  component: BottomNav,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  render: () => (
    <div style={demoFrameStyle}>
      <BottomNav variant="standard" aria-label="Primary navigation">
        <BottomNav.Item icon="🏠" label="Home" active />
        <BottomNav.Item icon="📁" label="Files" />
        <BottomNav.Item icon="⚙" label="Settings" />
      </BottomNav>
    </div>
  ),
};

export const FloatingVisual: Story = {
  render: () => (
    <div style={demoFrameStyle}>
      <BottomNav variant="floating" aria-label="Primary navigation">
        <BottomNav.Item icon="🏠" label="Home" active />
        <BottomNav.Item icon="🔎" label="Search" />
        <BottomNav.Item icon="👤" label="Profile" />
      </BottomNav>
    </div>
  ),
};

export const WithActionButton: Story = {
  render: () => (
    <div style={demoFrameStyle}>
      <BottomNav variant="standard" aria-label="Primary navigation">
        <BottomNav.Item icon="🏠" label="Home" active />
        <BottomNav.Item icon="🔎" label="Search" />
        <BottomNav.Action icon={<PlusIcon />} aria-label="Create new" />
        <BottomNav.Item icon="🏆" label="Badges" />
        <BottomNav.Item icon="👤" label="Profile" />
      </BottomNav>
    </div>
  ),
};

export const FixedPositionPattern: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div style={{ minHeight: '60vh', padding: 16 }}>
      <p style={{ margin: 0 }}>
        BottomNav is layout-agnostic. Use a wrapper to fix it to the viewport.
      </p>
      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 1100 }}>
        <BottomNav variant="standard" aria-label="Primary navigation">
          <BottomNav.Item icon="🏠" label="Home" active />
          <BottomNav.Item icon="📁" label="Files" />
          <BottomNav.Action icon={<PlusIcon />} aria-label="Create new" />
          <BottomNav.Item icon="🔔" label="Alerts" />
          <BottomNav.Item icon="👤" label="Profile" />
        </BottomNav>
      </div>
    </div>
  ),
};
