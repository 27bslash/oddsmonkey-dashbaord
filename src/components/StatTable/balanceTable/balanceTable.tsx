import {
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Tooltip,
} from '@mui/material';
import { blue, green, red } from '@mui/material/colors';
import { TotalProps } from '../statTable';

type StatTableBodyProps = {
  totals: TotalProps;
  balance: { smarkets: number; betfair: number };
};
function StatTableBody({ totals, balance }: StatTableBodyProps) {
  return (
    <TableBody>
      <TableRow>
        <TableCell>
          <Typography color={'gold'} style={{ display: 'grid' }}>
            £{(balance.smarkets + totals.smarketsLoss).toFixed(2)}
            <span style={{ color: red['600'] }}>-£{totals.smarketsLoss}</span>
          </Typography>
        </TableCell>
        <TableCell>
          <Typography color={'gold'} style={{ display: 'grid' }}>
            £{(balance.betfair + totals.betfairLoss).toFixed(2)}
            <span style={{ color: red['600'] }}>-£{totals.betfairLoss}</span>
          </Typography>
        </TableCell>
        <TableCell>
          <Typography color={green['400']}>£{totals.totalProfit}</Typography>
        </TableCell>
        <TableCell>
          <Tooltip
            title={
              <>
                <Typography>Smarkets: £{totals.smarketsLoss}</Typography>
                <Typography>Betfair: £{totals.betfairLoss}</Typography>
              </>
            }
          >
            <Typography id="total-liability" color={blue['400']}>
              £{totals.totalLiability}
            </Typography>
          </Tooltip>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
export default StatTableBody;
