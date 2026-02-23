import Button from './Button';

export default {
  title: '8bitUI/Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['solid', 'outline', 'link'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger', 'neutral'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export const All = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
      alignItems: 'center',
    }}
  >
    <h3 style={{ gridColumn: 'span 4', textAlign: 'center' }}>All Button Variants</h3>

    {/* Headers */}
    <div style={{ textAlign: 'center', opacity: 0.5 }}>Solid</div>
    <div style={{ textAlign: 'center', opacity: 0.5 }}>Outline</div>
    <div style={{ textAlign: 'center', opacity: 0.5 }}>Link</div>
    <div style={{ textAlign: 'center', opacity: 0.5 }}>Disabled</div>

    {/* Primary */}
    <Button variant="solid" color="primary">
      Solid
    </Button>
    <Button variant="outline" color="primary">
      Outline
    </Button>
    <Button variant="link" color="primary">
      Link
    </Button>
    <Button variant="solid" color="primary" disabled>
      Disabled
    </Button>

    {/* Secondary */}
    <Button variant="solid" color="secondary">
      Solid
    </Button>
    <Button variant="outline" color="secondary">
      Outline
    </Button>
    <Button variant="link" color="secondary">
      Link
    </Button>
    <Button variant="solid" color="secondary" disabled>
      Disabled
    </Button>

    {/* Danger */}
    <Button variant="solid" color="danger">
      Solid
    </Button>
    <Button variant="outline" color="danger">
      Outline
    </Button>
    <Button variant="link" color="danger">
      Link
    </Button>
    <Button variant="solid" color="danger" disabled>
      Disabled
    </Button>

    {/* Neutral */}
    <Button variant="solid" color="neutral">
      Solid
    </Button>
    <Button variant="outline" color="neutral">
      Outline
    </Button>
    <Button variant="link" color="neutral">
      Link
    </Button>
    <Button variant="solid" color="neutral" disabled>
      Disabled
    </Button>
  </div>
);
