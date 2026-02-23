import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Table from './Table';

describe('Table', () => {
  it('renders semantic table structure', () => {
    render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Player</Table.HeaderCell>
            <Table.HeaderCell scope="col">Score</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Nova</Table.Cell>
            <Table.Cell>94</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Player' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Nova' })).toBeInTheDocument();
  });

  it('forwards table props through tableProps', () => {
    render(
      <Table tableProps={{ 'aria-busy': true, 'aria-label': 'Stats Table' }}>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Row</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );

    expect(screen.getByRole('table', { name: 'Stats Table' })).toHaveAttribute('aria-busy', 'true');
  });
});
