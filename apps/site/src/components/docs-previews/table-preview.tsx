'use client';

import { Table } from '@kagu-project/8bit-ui';

export const TablePreview = () => (
  <Table>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell scope="col">Item</Table.HeaderCell>
        <Table.HeaderCell scope="col">Qty</Table.HeaderCell>
        <Table.HeaderCell scope="col">Price</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.Cell>Pixel Potion</Table.Cell>
        <Table.Cell>2</Table.Cell>
        <Table.Cell>$10</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
);
