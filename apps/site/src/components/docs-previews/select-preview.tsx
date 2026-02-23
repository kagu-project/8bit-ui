'use client';

import { useState } from 'react';
import { Select } from '8bit-ui';

const OPTIONS = [
  { value: 'Engineer', label: 'Engineer' },
  { value: 'Designer', label: 'Designer' },
  { value: 'QA', label: 'QA' },
];

export const SelectPreview = () => {
  const [role, setRole] = useState<string | number>('Engineer');

  return <Select value={role} onChange={setRole} options={OPTIONS} />;
};
