import { TableCell, TableSortLabel } from '@mui/material';
import { useState } from 'react';

export const OrderableCell = (props: any) => {
  const [sortDirection, setSortDirection] = useState(props.sortDirection);
  return (
    <TableCell size="small">
      <TableSortLabel
        direction={props.orderBy === props.sort ? props.order : 'asc'}
        onClick={() => {
          const sortStr = sortDirection === 'asc' ? 'desc' : 'asc';
          props.onRequestSort(props.sort, sortStr, props.k);
          return setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        }}
      >
        {props.children}
      </TableSortLabel>
    </TableCell>
  );
};
