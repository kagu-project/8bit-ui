'use client';

import { BottomNav, Header, Layout, Toolbar } from '@kagu-project/8bit-ui';

export const LayoutPreview = () => (
  <Layout
    header={
      <Header variant="primary">
        <Toolbar>Dashboard</Toolbar>
      </Header>
    }
    bottomNav={
      <BottomNav>
        <BottomNav.Item label="Home" active />
        <BottomNav.Item label="Library" />
      </BottomNav>
    }
  >
    <main style={{ padding: '8px 0' }}>Page content</main>
  </Layout>
);
