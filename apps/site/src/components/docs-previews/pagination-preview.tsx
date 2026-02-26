'use client';

import { useState } from 'react';
import { Pagination } from '@kagu-project/8bit-ui';

export const PaginationPreview = () => {
  const [page, setPage] = useState(3);

  return <Pagination currentPage={page} totalPages={20} onPageChange={setPage} />;
};
