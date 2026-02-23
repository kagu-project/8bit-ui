import type { Meta, StoryObj } from '@storybook/react-vite';
import FAB from './FAB';
import { EditIcon, PlusIcon } from '../../storybook/icons';

const meta = {
  title: '8bitUI/Components/FAB',
  component: FAB,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: false,
    },
    shape: {
      control: 'select',
      options: ['square', 'round'],
    },
    type: {
      control: 'select',
      options: ['solid', 'outline'],
    },
  },
} satisfies Meta<typeof FAB>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SquareSolid: Story = {
  args: {
    children: <PlusIcon />,
    variant: 'primary',
    type: 'solid',
    shape: 'square',
  },
};

export const SquareOutline: Story = {
  args: {
    children: <PlusIcon />,
    variant: 'primary',
    type: 'outline',
    shape: 'square',
  },
};

export const RoundSolid: Story = {
  args: {
    children: <EditIcon />,
    variant: 'secondary',
    type: 'solid',
    shape: 'round',
  },
};

export const FloatingPattern: Story = {
  args: {
    children: <PlusIcon />,
    variant: 'primary',
    type: 'solid',
    shape: 'round',
  },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: 'min(100%, 480px)',
        height: '220px',
        border: '1px dashed #666',
        padding: '16px',
      }}
    >
      <p style={{ margin: 0, fontSize: 12 }}>Position FAB in layout via parent/container styles.</p>
      <FAB {...args} style={{ position: 'absolute', right: 16, bottom: 16 }} />
    </div>
  ),
};
