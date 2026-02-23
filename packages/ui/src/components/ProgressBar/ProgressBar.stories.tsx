import type { Meta, StoryObj } from '@storybook/react-vite';
import ProgressBar from './ProgressBar';

const meta = {
  title: '8bitUI/Components/ProgressBar',
  component: ProgressBar,
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    color: {
      control: { type: 'select' },
      options: ['primary', 'danger', 'secondary', 'success', 'warning', '#A020F0'],
    },
    variant: {
      control: { type: 'select' },
      options: ['solid', 'striped'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    animated: { control: 'boolean' },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
    label: 'Loading...',
  },
};

export const Danger: Story = {
  args: {
    value: 75,
    color: 'danger',
    label: 'Critical',
    showValue: true,
    max: 100,
  },
};

export const Secondary: Story = {
  args: {
    value: 30,
    color: 'secondary',
    label: 'Secondary',
    showValue: true,
    max: 50,
  },
};

export const Success: Story = {
  args: {
    value: 90,
    color: 'success',
    label: 'Complete',
    size: 'sm',
    variant: 'striped',
  },
};

export const CustomColor: Story = {
  args: {
    value: 60,
    color: '#A020F0',
    label: 'Custom Hex',
    variant: 'striped',
  },
};

export const Loading: Story = {
  args: {
    value: 100,
    color: 'warning',
    label: 'Connecting...',
    animated: true,
  },
};
