import Screen from './Screen';
import Card from '../Card/Card';
import Button from '../Button/Button';
import Input from '../Input/Input';

// Local pixel art forest
const DEMO_WALLPAPER = '/pixel_forest_bg.png';
// Or a generated pixel art placeholder if you prefer

export default {
  title: '8bitUI/Layout/Screen',
  component: Screen,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    mode: { control: 'radio', options: ['inline', 'fixed'] },
    scanlines: { control: 'boolean' },
    vignette: { control: 'boolean' },
    grid: { control: 'boolean' },
    backgroundImage: { control: 'text' },
  },
};

const Content = () => (
  <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', color: '#fff' }}>
    <Card title="System Ready">
      <p style={{ marginBottom: '1rem' }}>Welcome to 8bit-ui system.</p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Input placeholder="Enter Command..." />
        <Button>Execute</Button>
      </div>
    </Card>

    <div
      style={{ marginTop: '2rem', display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}
    >
      <Card title="Memory">64KB OK</Card>
      <Card title="Status">ONLINE</Card>
    </div>
  </div>
);

export const DefaultScanner = () => (
  <Screen mode="fixed">
    <Content />
  </Screen>
);

export const ScanlinesOnly = () => (
  <Screen mode="fixed" scanlines={true} vignette={false} grid={false}>
    <div style={{ padding: '2rem', color: '#fff' }}>
      <Card title="Scanlines Only">Just the horizontal lines.</Card>
    </div>
  </Screen>
);

export const VignetteOnly = () => (
  <Screen mode="fixed" scanlines={false} vignette={true} grid={false}>
    <div style={{ padding: '2rem', color: '#fff' }}>
      <Card title="Vignette Only">Dark corners only.</Card>
    </div>
  </Screen>
);

export const CRT_Mode = () => (
  <Screen mode="fixed" scanlines={true} vignette={true} grid={true}>
    <div style={{ padding: '2rem', color: '#fff' }}>
      <Card title="CRT Monitor">Scanlines and Vignette enabled.</Card>
      <div style={{ marginTop: '20px' }}>
        <Input placeholder="System Check..." />
      </div>
    </div>
  </Screen>
);

export const WithWallpaper = () => (
  <Screen mode="fixed" backgroundImage={DEMO_WALLPAPER} grid={false}>
    <Content />
  </Screen>
);
