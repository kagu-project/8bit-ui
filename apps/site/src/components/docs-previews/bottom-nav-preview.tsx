'use client';

import { BottomNav } from '8bit-ui';

export const BottomNavPreview = () => (
  <BottomNav variant="floating">
    <BottomNav.Item label="Home" active />
    <BottomNav.Item label="Files" />
    <BottomNav.Item label="Settings" />
  </BottomNav>
);

export const BottomNavFixedPatternPreview = () => (
  <div className="previewViewport">
    <p className="previewViewportText">Viewport content</p>
    <div className="previewBottomDock">
      <BottomNav variant="standard">
        <BottomNav.Item label="Home" active />
        <BottomNav.Item label="Files" />
        <BottomNav.Action icon="+" aria-label="Create new" />
      </BottomNav>
    </div>
  </div>
);
