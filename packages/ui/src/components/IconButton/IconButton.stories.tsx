import IconButton from './IconButton';
import { HamburgerMenuIcon, CloseIcon } from '../../storybook/icons';

export default {
  title: '8bitUI/Components/IconButton',
  component: IconButton,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['ghost', 'outline', 'default'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger', 'neutral'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
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
      justifyItems: 'center',
    }}
  >
    <h3 style={{ gridColumn: 'span 4', textAlign: 'center' }}>All IconButton Variants</h3>

    {/* Headers */}
    <div style={{ textAlign: 'center', opacity: 0.5 }}>Ghost</div>
    <div style={{ textAlign: 'center', opacity: 0.5 }}>Outline</div>
    <div style={{ textAlign: 'center', opacity: 0.5 }}>Default</div>
    <div style={{ textAlign: 'center', opacity: 0.5 }}>Disabled</div>

    {/* Primary */}
    <IconButton variant="ghost" color="primary" aria-label="Menu">
      <HamburgerMenuIcon />
    </IconButton>
    <IconButton variant="outline" color="primary" aria-label="Menu">
      <HamburgerMenuIcon />
    </IconButton>
    <IconButton variant="default" color="primary" aria-label="Menu">
      <HamburgerMenuIcon />
    </IconButton>
    <IconButton variant="ghost" color="primary" aria-label="Menu" disabled>
      <HamburgerMenuIcon />
    </IconButton>

    {/* Neutral */}
    <IconButton variant="ghost" color="neutral" aria-label="Close">
      <CloseIcon />
    </IconButton>
    <IconButton variant="outline" color="neutral" aria-label="Close">
      <CloseIcon />
    </IconButton>
    <IconButton variant="default" color="neutral" aria-label="Close">
      <CloseIcon />
    </IconButton>
    <IconButton variant="ghost" color="neutral" aria-label="Close" disabled>
      <CloseIcon />
    </IconButton>

    <h3 style={{ gridColumn: 'span 4', textAlign: 'center', marginTop: '12px' }}>Sizes</h3>

    <div style={{ textAlign: 'center', opacity: 0.5 }}>Small</div>
    <div style={{ textAlign: 'center', opacity: 0.5 }}>Medium</div>
    <div style={{ textAlign: 'center', opacity: 0.5 }}>Large</div>
    <div />

    <IconButton size="sm" aria-label="Settings">
      <HamburgerMenuIcon />
    </IconButton>
    <IconButton size="md" aria-label="Settings">
      <HamburgerMenuIcon />
    </IconButton>
    <IconButton size="lg" aria-label="Settings">
      <HamburgerMenuIcon />
    </IconButton>
  </div>
);

export const Ghost = () => (
  <IconButton variant="ghost" aria-label="Menu">
    <HamburgerMenuIcon />
  </IconButton>
);

export const Outline = () => (
  <IconButton variant="outline" aria-label="Menu">
    <HamburgerMenuIcon />
  </IconButton>
);

export const Default = () => (
  <IconButton variant="default" color="primary" aria-label="Menu">
    <HamburgerMenuIcon />
  </IconButton>
);

export const Disabled = () => (
  <IconButton variant="ghost" aria-label="Menu" disabled>
    <HamburgerMenuIcon />
  </IconButton>
);
