'use client';

import { useState } from 'react';
import { ViewToggle } from '@kagu-project/8bit-ui';

export const ViewTogglePreview = () => {
  type ViewToggleValue = 'grid' | 'list';
  const [view, setView] = useState<ViewToggleValue>('grid');

  return <ViewToggle view={view} onChange={setView} />;
};
