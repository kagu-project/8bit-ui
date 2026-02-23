import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Menu from './Menu';
import Grid from '../Grid';
import AssetCard from '../AssetCard';
import { DownloadIcon, EditIcon, TrashIcon } from '../../storybook/icons';

const meta = {
  title: '8bitUI/Components/Menu',
  component: Menu,
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Menu>
        <Menu.Trigger ariaLabel="Open actions">...</Menu.Trigger>
        <Menu.Content>
          <Menu.Item onSelect={() => alert('Open')}>Open</Menu.Item>
          <Menu.Item onSelect={() => alert('Rename')}>Rename</Menu.Item>
          <Menu.Item onSelect={() => alert('Duplicate')}>Duplicate</Menu.Item>
        </Menu.Content>
      </Menu>
    </div>
  ),
};

export const WithIconsAndDanger: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Menu>
        <Menu.Trigger ariaLabel="Open asset menu">...</Menu.Trigger>
        <Menu.Content>
          <Menu.Item leftSlot={<EditIcon />} onSelect={() => alert('Edit')}>
            Edit
          </Menu.Item>
          <Menu.Item leftSlot={<DownloadIcon />} onSelect={() => alert('Download')}>
            Download
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item leftSlot={<TrashIcon />} danger onSelect={() => alert('Delete')}>
            Delete
          </Menu.Item>
        </Menu.Content>
      </Menu>
    </div>
  ),
};

export const DisabledItems: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Menu>
        <Menu.Trigger ariaLabel="Open disabled example">...</Menu.Trigger>
        <Menu.Content>
          <Menu.Item onSelect={() => alert('Open')}>Open</Menu.Item>
          <Menu.Item disabled>Share (Unavailable)</Menu.Item>
          <Menu.Item disabled>Move to Folder (Locked)</Menu.Item>
        </Menu.Content>
      </Menu>
    </div>
  ),
};

export const LongListWithFlip: Story = {
  render: () => (
    <div style={{ height: 280, padding: 24, display: 'flex', alignItems: 'flex-end' }}>
      <Menu>
        <Menu.Trigger ariaLabel="Open long menu">Open Menu</Menu.Trigger>
        <Menu.Content side="bottom" align="start">
          {Array.from({ length: 12 }).map((_, idx) => (
            <Menu.Item key={idx} onSelect={() => alert(`Action ${idx + 1}`)}>
              Action {idx + 1}
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu>
    </div>
  ),
};

const MenuCardDemo = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const cards = [
    {
      id: 1,
      title: 'Asset_001.png',
      subtitle: '102 KB',
      src: 'https://placehold.co/400x300/111/fff?text=IMG_1',
    },
    {
      id: 2,
      title: 'Asset_002.png',
      subtitle: '89 KB',
      src: 'https://placehold.co/400x300/933/fff?text=IMG_2',
    },
    {
      id: 3,
      title: 'Asset_003.png',
      subtitle: '120 KB',
      src: 'https://placehold.co/400x300/3B7270/fff?text=IMG_3',
    },
  ];

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <Grid columns="auto">
      {cards.map((card) => (
        <AssetCard
          key={card.id}
          title={card.title}
          subtitle={card.subtitle}
          src={card.src}
          selected={selectedIds.includes(card.id)}
          onSelect={() => toggleSelect(card.id)}
          actions={
            <Menu>
              <Menu.Trigger ariaLabel={`Open actions for ${card.title}`}>...</Menu.Trigger>
              <Menu.Content align="end">
                <Menu.Item onSelect={() => alert(`Open ${card.title}`)}>Open</Menu.Item>
                <Menu.Item onSelect={() => alert(`Rename ${card.title}`)}>Rename</Menu.Item>
                <Menu.Item onSelect={() => alert(`Download ${card.title}`)}>Download</Menu.Item>
                <Menu.Separator />
                <Menu.Item danger onSelect={() => alert(`Delete ${card.title}`)}>
                  Delete
                </Menu.Item>
              </Menu.Content>
            </Menu>
          }
        />
      ))}
    </Grid>
  );
};

export const AssetCardIntegration: Story = {
  render: () => (
    <div style={{ padding: 24, maxWidth: 960 }}>
      <MenuCardDemo />
    </div>
  ),
};
