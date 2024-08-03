import { TableHead, TableRow, Typography, TableCell } from '@mui/material';
import { grey } from '@mui/material/colors';
import { OrderableCell } from './OrderableCell';

function BetTableHead({ updateSort }: any) {
  return (
    <TableHead>
      <TableRow>
        <OrderableCell
          onRequestSort={updateSort}
          sort="unix_time"
          sortDirection="asc"
          k="bet_info"
        >
          <Typography fontSize={'11.5px'} color={grey['500']}>
            EVENT TIME
          </Typography>
        </OrderableCell>
        <OrderableCell
          onRequestSort={updateSort}
          sort="bet_unix_time"
          sortDirection="asc"
          k="bet_info"
        >
          <Typography fontSize={'11.5px'} color={grey['500']}>
            BET PLACED TIME
          </Typography>
        </OrderableCell>
        <TableCell>
          <Typography fontSize={'11.5px'} color={grey['500']}></Typography>
        </TableCell>
        <TableCell>
          <Typography fontSize={'11.5px'} color={grey['500']}>
            SIDE
          </Typography>
        </TableCell>
        <OrderableCell
          onRequestSort={updateSort}
          sort="lay_liability"
          sortDirection="asc"
          k="bet_profit"
        >
          <Typography fontSize={'11.5px'} color={grey['500']}>
            STAKE
          </Typography>
        </OrderableCell>
        <OrderableCell
          onRequestSort={updateSort}
          sort="back_odds"
          sortDirection="asc"
          k="bet_odds"
        >
          <Typography fontSize={'11.5px'} color={grey['500']}>
            PRICE
          </Typography>
        </OrderableCell>
        <TableCell>
          <Typography fontSize={'11.5px'} color={grey['500']}>
            MATCHED
          </Typography>
        </TableCell>
        <OrderableCell
          onRequestSort={updateSort}
          sort="back_win_profit"
          sortDirection="asc"
          k="bet_profit"
        >
          <Typography fontSize={'11.5px'} color={grey['500']}>
            PROFIT
          </Typography>
        </OrderableCell>
      </TableRow>
    </TableHead>
  );
}
export default BetTableHead;
