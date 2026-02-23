import Tag from './Tag';

export default {
  title: '8bitUI/Components/Tag',
  component: Tag,
  argTypes: {
    label: { control: 'text' },
    variant: {
      control: { type: 'select' },
      options: ['solid', 'outline'],
    },
    color: {
      control: { type: 'select' },
      options: ['neutral', 'primary', 'secondary', 'success', 'warning', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export const Default = {
  args: {
    label: 'Tag',
    variant: 'solid',
    color: 'primary',
    size: 'md',
  },
};

export const AllColors = () => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <Tag label="Neutral" color="neutral" />
    <Tag label="Primary" color="primary" />
    <Tag label="Secondary" color="secondary" />
    <Tag label="Success" color="success" />
    <Tag label="Warning" color="warning" />
    <Tag label="Danger" color="danger" />
  </div>
);

export const Outlines = () => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <Tag label="Neutral" variant="outline" color="neutral" />
    <Tag label="Primary" variant="outline" color="primary" />
    <Tag label="Secondary" variant="outline" color="secondary" />
    <Tag label="Success" variant="outline" color="success" />
    <Tag label="Warning" variant="outline" color="warning" />
    <Tag label="Danger" variant="outline" color="danger" />
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
    <Tag label="Small" size="sm" />
    <Tag label="Medium" size="md" />
    <Tag label="Large" size="lg" />
  </div>
);

export const WithIcons = () => (
  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
    <Tag label="Songbird" color="success" icon="🐦" />
    <Tag label="Raptor" color="danger" icon="🦅" />
    <Tag label="Waterfowl" color="primary" icon="🦆" />
  </div>
);
