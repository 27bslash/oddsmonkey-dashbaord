import { Box, Table } from '@mui/material';
import { useState, useEffect } from 'react';
import { BData } from '../../../types';
import StatTableBody from './balanceTable/balanceTable';
import TableHeader from './balanceTable/BalanceTableHeader';
import FilterButtons from './FilterButtons';
import { useAppContext } from '../../renderer/useAppContext';

type StatTableProps = {
  filter: string;
  setFilter: React.SetStateAction<any>;
  filteredBets: BData[];
  totalBets: BData[];
};
export type TotalProps = {
  totalProfit: number;
  smarketsLoss: number;
  betfairLoss: number;
  totalLiability: number;
};

function StatTable({
  filter,
  setFilter,
  filteredBets,
  totalBets,
}: StatTableProps) {
  const [totals, setTotals] = useState<TotalProps>();

  const { allBets, balance } = useAppContext();
  useEffect(() => {
    if (!filteredBets) return;
    const totalProfit = filteredBets
      .reduce(
        (sum, current) =>
          sum +
          (current.bet_profit.back_win_profit +
            current.bet_profit.lay_win_profit) /
            2,
        0,
      )
      .toFixed(2);

    const totalLiability = filteredBets
      .reduce(
        (sum, curr: BData) =>
          sum + curr.bet_profit.lay_liability + curr.bet_profit.back_liability,
        0,
      )
      .toFixed(2);
    const smarketsLoss = totalBets
      .filter((x) => x.bet_info.unix_time > new Date().getTime() / 1000 - 5400)
      .reduce((sum, curr) => {
        const loss =
          curr.bet_info.exchange === 'smarkets'
            ? curr.bet_profit.lay_liability
            : curr.bet_profit.back_liability;
        return sum + loss;
      }, 0);
    const betfairLoss = totalBets
      .filter((x) => x.bet_info.unix_time > new Date().getTime() / 1000 - 5400)
      .reduce((sum, curr) => {
        const loss =
          curr.bet_info.exchange === 'betfair'
            ? curr.bet_profit.lay_liability
            : curr.bet_profit.back_liability;
        return sum + loss;
      }, 0);
    // console.log(smarketsLoss, betfairLoss);
    setTotals({
      totalProfit: +totalProfit,
      smarketsLoss: +smarketsLoss.toFixed(2),
      betfairLoss: +betfairLoss.toFixed(2),
      totalLiability: +totalLiability,
    });
  }, [allBets, filteredBets]);
  return (
    <Box display={'flex'}>
      <>
        <FilterButtons filter={filter} setFilter={setFilter} />
        <Box
          sx={{
            marginLeft: 'auto',
          }}
        >
          {totals && (
            <Table>
              <TableHeader filter={filter} />
              <StatTableBody totals={totals} balance={balance} />
            </Table>
          )}
        </Box>
      </>
    </Box>
  );
}
export default StatTable;
