import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Layout from './Layout';
import { Header, Toolbar } from '../Header';
import BottomNav from '../BottomNav';
import Screen from '../Screen';
import { Heading, Text } from '../Typography';
import Button from '../Button';
import Grid from '../Grid';
import AssetCard from '../AssetCard';
import Input from '../Input';

interface CardItem {
  key: number;
  title: string;
  subtitle: string;
  src: string;
}

const smallButtonStyle = { padding: '4px 8px', fontSize: 12 };

const meta = {
  title: '8bitUI/Layout/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    header: { control: false },
    bottomNav: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StandardLayout: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState('home');

    const cards: CardItem[] = Array.from({ length: 12 }).map((_, i) => ({
      key: i,
      title: `Pixel Art ${i + 1}`,
      subtitle: 'Retro Item',
      src: `https://placehold.co/150x150/3B7270/white?text=Pixel+${i + 1}`,
    }));

    return (
      <Screen mode="fixed">
        <Layout
          {...args}
          header={
            <Header variant="primary">
              <Toolbar>
                <Button variant="link" color="secondary" style={smallButtonStyle}>
                  Menu
                </Button>
                <Heading level={3} style={{ flex: 1, textAlign: 'center' }}>
                  8-Bit Gallery
                </Heading>
                <Button variant="link" color="secondary" style={smallButtonStyle}>
                  Profile
                </Button>
              </Toolbar>
            </Header>
          }
          bottomNav={
            <BottomNav variant="standard">
              <BottomNav.Item
                label="Home"
                icon="🏠"
                active={activeTab === 'home'}
                onClick={() => setActiveTab('home')}
              />
              <BottomNav.Item
                label="Search"
                icon="🔍"
                active={activeTab === 'search'}
                onClick={() => setActiveTab('search')}
              />
              <BottomNav.Action icon="+" onClick={() => alert('Add Bird!')} />
              <BottomNav.Item
                label="Badges"
                icon="🏆"
                active={activeTab === 'badges'}
                onClick={() => setActiveTab('badges')}
              />
              <BottomNav.Item
                label="Profile"
                icon="👤"
                active={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
              />
            </BottomNav>
          }
        >
          <div style={{ padding: 16 }}>
            <Heading level={2} style={{ marginBottom: 16 }}>
              My Collection
            </Heading>
            <Grid>
              {cards.map((card) => (
                <AssetCard
                  key={card.key}
                  title={card.title}
                  subtitle={card.subtitle}
                  src={card.src}
                />
              ))}
            </Grid>
            <Text style={{ marginTop: 24, textAlign: 'center', opacity: 0.5 }}>End of list</Text>
          </div>
        </Layout>
      </Screen>
    );
  },
};

export const FloatingNav: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('home');

    return (
      <Screen mode="fixed">
        <Layout
          header={
            <Header variant="default">
              <Toolbar>
                <Heading level={4}>LOGO</Heading>
                <div style={{ flex: 1, margin: '0 16px' }}>
                  <Input placeholder="Search..." fullWidth />
                </div>
                <Button variant="link" style={smallButtonStyle}>
                  👤
                </Button>
              </Toolbar>

              <Toolbar dense style={{ borderTop: '2px solid #000' }}>
                <span style={{ marginRight: 16 }}>All</span>
                <span style={{ marginRight: 16, opacity: 0.5 }}>Characters</span>
                <span style={{ opacity: 0.5 }}>Items</span>
              </Toolbar>
            </Header>
          }
          bottomNav={
            <BottomNav variant="floating">
              <BottomNav.Item
                icon="🏠"
                active={activeTab === 'home'}
                onClick={() => setActiveTab('home')}
              />
              <BottomNav.Item
                icon="🔍"
                active={activeTab === 'search'}
                onClick={() => setActiveTab('search')}
              />
              <BottomNav.Action icon="+" onClick={() => alert('Add!')} />
              <BottomNav.Item
                icon="🏆"
                active={activeTab === 'badges'}
                onClick={() => setActiveTab('badges')}
              />
              <BottomNav.Item
                icon="👤"
                active={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
              />
            </BottomNav>
          }
        >
          <div style={{ height: '200vh', padding: 16 }}>
            <Text>Scroll down to see floating nav behavior...</Text>
          </div>
        </Layout>
      </Screen>
    );
  },
};
