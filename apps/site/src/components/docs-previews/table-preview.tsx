'use client';

import { Table } from '@kagu-project/8bit-ui';

export const TablePreview = () => (
  <Table>
    <thead>
      <tr>
        <th scope="col">Item</th>
        <th scope="col">Qty</th>
        <th scope="col">Price</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Pixel Potion</td>
        <td>2</td>
        <td>$10</td>
      </tr>
    </tbody>
  </Table>
);
