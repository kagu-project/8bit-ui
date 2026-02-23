import type { Meta, StoryObj } from '@storybook/react-vite';
import Card from './Card';
import Button from '../Button/Button';

const meta = {
  title: '8bitUI/Components/Card',
  component: Card,
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    children: { control: false },
    variant: {
      control: { type: 'select' },
      options: ['solid', 'outline'],
    },
    title: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <p>This is a simple card body. Perfect for content containers.</p>,
  },
};

export const WithHeader: Story = {
  args: {
    title: 'System Alert',
    children: <p>Major system failure imminent. Please evacuate data immediately.</p>,
  },
};

export const InventoryCard: Story = {
  args: {
    title: 'Inventory',
    children: (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{ width: 32, height: 32, background: '#ddd', border: '2px solid #000' }} />
        <div style={{ width: 32, height: 32, background: '#ddd', border: '2px solid #000' }} />
        <div style={{ width: 32, height: 32, background: '#ddd', border: '2px solid #000' }} />
      </div>
    ),
  },
};

export const LoginExample: Story = {
  render: () => (
    <div style={{ padding: '20px', maxWidth: '350px' }}>
      <Card title="User Login">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontFamily: 'monospace' }}>Username: [_____________]</div>
          <div style={{ fontFamily: 'monospace' }}>Password: [_____________]</div>
          <div
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}
          >
            <Button variant="link">Cancel</Button>
            <Button variant="solid">Login</Button>
          </div>
        </div>
      </Card>
    </div>
  ),
};
