import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Grid from '../Grid/Grid';
import AssetCard from '../AssetCard/AssetCard';
import ViewToggle from '../ViewToggle/ViewToggle';
import type { ViewToggleValue } from '../ViewToggle/ViewToggle';
import Pagination from '../Pagination/Pagination';
import Button from '../Button/Button';
import Menu from '../Menu';

interface MockItem {
  id: number;
  name: string;
  size: string;
  url: string;
}

const generateItems = (count: number): MockItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Asset_00${i + 1}.png`,
    size: `${Math.floor(Math.random() * 500) + 10} KB`,
    url: `https://placehold.co/400x300/000000/FFF?text=IMG_${i + 1}`,
  }));

const smallButtonStyle = { padding: '4px 8px', fontSize: 12 };

const meta = {
  title: '8bitUI/Components/Grid',
  component: Grid,
  subcomponents: { AssetCard, ViewToggle, Pagination, Menu },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullCollectionExample: Story = {
  render: () => {
    const [view, setView] = useState<ViewToggleValue>('grid');
    const [page, setPage] = useState(1);
    const [items] = useState<MockItem[]>(generateItems(12));
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleSelect = (id: number) => {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
      );
    };

    const handleDelete = () => {
      alert(`Deleting ${selectedIds.length} items`);
      setSelectedIds([]);
    };

    const handleUpload = (files: File[]) => {
      alert(`Uploaded ${files.length} files`);
    };

    return (
      <div style={{ maxWidth: 800 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            borderBottom: '2px solid #eee',
            paddingBottom: 16,
          }}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {selectedIds.length > 0 ? (
              <>
                <Button
                  variant="solid"
                  color="danger"
                  onClick={handleDelete}
                  style={smallButtonStyle}
                >
                  delete selected ({selectedIds.length})
                </Button>
                <Button variant="link" onClick={() => setSelectedIds([])} style={smallButtonStyle}>
                  cancel
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => alert('Open File Picker')}
                style={smallButtonStyle}
              >
                + add image
              </Button>
            )}
          </div>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ fontFamily: 'monospace', color: '#888' }}>Page {page}</span>
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>

        <Grid columns={view === 'list' ? 1 : 'auto'} style={{ minHeight: 400 }}>
          {items.map((item) => (
            <AssetCard
              key={item.id}
              layout={view === 'list' ? 'horizontal' : 'vertical'}
              src={item.url}
              title={item.name}
              subtitle={item.size}
              selected={selectedIds.includes(item.id)}
              onSelect={() => handleSelect(item.id)}
              onDrop={handleUpload}
              actions={
                <Button variant="link" style={{ padding: '0 4px', fontSize: 12 }}>
                  ...
                </Button>
              }
            />
          ))}
        </Grid>

        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
          <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
        </div>
      </div>
    );
  },
};

export const EmptyState: Story = {
  render: () => <Grid emptyState={<div>No items found in this query.</div>}>{/* empty */}</Grid>,
};

export const AssetCardActionMenu: Story = {
  render: () => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [items] = useState<MockItem[]>(generateItems(6));

    const handleSelect = (id: number) => {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
      );
    };

    return (
      <div style={{ maxWidth: 800 }}>
        <Grid columns="auto">
          {items.map((item) => (
            <AssetCard
              key={item.id}
              src={item.url}
              title={item.name}
              subtitle={item.size}
              selected={selectedIds.includes(item.id)}
              onSelect={() => handleSelect(item.id)}
              actions={
                <Menu>
                  <Menu.Trigger ariaLabel={`Open actions for ${item.name}`}>...</Menu.Trigger>
                  <Menu.Content align="end" side="bottom">
                    <Menu.Item onSelect={() => alert(`Open ${item.name}`)}>Open</Menu.Item>
                    <Menu.Item onSelect={() => alert(`Rename ${item.name}`)}>Rename</Menu.Item>
                    <Menu.Item onSelect={() => alert(`Download ${item.name}`)}>Download</Menu.Item>
                    <Menu.Separator />
                    <Menu.Item danger onSelect={() => alert(`Delete ${item.name}`)}>
                      Delete
                    </Menu.Item>
                  </Menu.Content>
                </Menu>
              }
            />
          ))}
        </Grid>
      </div>
    );
  },
};
