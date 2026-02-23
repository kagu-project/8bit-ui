import type { Meta, StoryObj } from '@storybook/react-vite';
import Table from './Table';

const meta = {
  title: '8bitUI/Components/Table',
  component: Table,
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">Player</Table.HeaderCell>
          <Table.HeaderCell scope="col">Role</Table.HeaderCell>
          <Table.HeaderCell scope="col">Score</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Nova</Table.Cell>
          <Table.Cell>Engineer</Table.Cell>
          <Table.Cell>94</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Echo</Table.Cell>
          <Table.Cell>Designer</Table.Cell>
          <Table.Cell>88</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Vega</Table.Cell>
          <Table.Cell>Engineer</Table.Cell>
          <Table.Cell>98</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

export const WithFooter: Story = {
  render: () => (
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
        <Table.Row>
          <Table.Cell>Mana Chip</Table.Cell>
          <Table.Cell>1</Table.Cell>
          <Table.Cell>$7</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell colSpan={2}>Total</Table.Cell>
          <Table.Cell>$17</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table>
  ),
};
