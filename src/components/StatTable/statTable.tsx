import { Box, Table } from '@mui/material';
import { useState, useEffect } from 'react';
import { BData, BProfit, Matched } from '../../../types';
import StatTableBody from './balanceTable/balanceTable';
import TableHeader from './balanceTable/BalanceTableHeader';
import FilterButtons from './FilterButtons';
import { useAppContext } from '../../renderer/useAppContext';
import { Config } from '../config/config';
import { weightedAverage } from '../bets/Bet/BetCell/matched/matchedCell';

type StatTableProps = {
  filter: 'active' | 'day' | 'week' | 'all time';
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
  const weighteda = () => {};
  const updateProfit = (matchData: Matched[], key: string) => {
    const backLay: any = { back: {}, lay: {} };
    for (let doc of matchData) {
      doc.odds.forEach((odd, i) => {
        backLay[key][odd] = (backLay[key][odd] || 0) + doc.matched[i];
      });
    }
    if (!Object.keys(backLay[key]).length) {
      backLay[key] = { 0: 0 };
    }
    return backLay;
  };
  useEffect(() => {
    if (!filteredBets) return;

    for (const bet of filteredBets) {
      let backWins = 0;
      let layLiability = 0;
      let backLiability = 0;
      let layWins = 0;
      if (bet.bet_profit.back_matched) {
        try {
          const backObj = updateProfit(bet.bet_profit.back_matched, 'back');
          const layObj = updateProfit(bet.bet_profit.exchange_matched, 'lay');
          const backLay: {
            [key: string]: { [key: number]: number };
          } = { lay: layObj['lay'], back: backObj['back'] };
          Object.entries(backLay['back']).map((x) => {
            backWins += (+x[0] - 1) * x[1];
            backLiability += x[1];
          });
          Object.entries(backLay['lay']).map((x) => {
            layWins += +x[1] * (1 - bet.bet_odds.commission);
            layLiability += (+x[0] - 1) * x[1];
          });
          bet.bet_profit.back_win_profit = backWins - layLiability;
          bet.bet_profit.lay_win_profit = layWins - backLiability;
        } catch (err) {
          //   console.log('err', bet.bet_profit, err);
        }
      }
    }
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
    // filter bets by event time + 90 minutes to account for game time
    const timeFilteredBets = filteredBets.filter(
      (x) => x.bet_info.unix_time > new Date().getTime() / 1000 - 5400,
    );

    const smarketsLoss = currentLoss(timeFilteredBets, 'smarkets');
    const betfairLoss = currentLoss(timeFilteredBets, 'betfair');
    const totalLiability =
      currentLoss(filteredBets, 'smarkets') +
      currentLoss(filteredBets, 'smarkets');
    //   const loss =
    //     curr.bet_info.exchange === 'betfair'
    //       ? curr.bet_profit.lay_liability
    //       : curr.bet_profit.back_liability;
    //   return sum + loss;
    setTotals({
      totalProfit: +totalProfit,
      smarketsLoss: +smarketsLoss.toFixed(2),
      betfairLoss: +betfairLoss.toFixed(2),
      totalLiability: +totalLiability.toFixed(2),
    });
  }, [allBets, filteredBets]);
  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      width={'100%'}
      height={'150px'}
      marginBottom={'50px'}
    >
      <FilterButtons filter={filter} setFilter={setFilter} />
      {totals && (
        <Table style={{ width: '600px' }}>
          <TableHeader filter={filter} />
          <StatTableBody totals={totals} balance={balance} />
        </Table>
      )}
      <Config></Config>
    </Box>
  );

  function currentLoss(
    timeFilteredBets: BData[],
    type: 'smarkets' | 'betfair',
  ) {
    return timeFilteredBets.reduce((totalLoss, bet) => {
      const isExchange = bet.bet_info.exchange === type;
      const matchedBets = isExchange
        ? bet.bet_profit.exchange_matched
        : bet.bet_profit.back_matched;

      const totalLiability = matchedBets.reduce((liabilitySum, matchedBet) => {
        if (matchedBet.matched) {
          // Sum up all matched values
          const matchedSum = matchedBet.matched.reduce(
            (sum, value) => sum + value,
            0,
          );
          return liabilitySum + matchedSum;
        }
        return (
          liabilitySum +
          (isExchange
            ? bet.bet_profit.lay_liability
            : bet.bet_profit.back_liability)
        );
      }, 0);
      const matchArr = bet.bet_profit.back_matched
        .map((matchObj) => matchObj.matched)
        .flat();
      const oddsArr = bet.bet_profit.back_matched
        .map((matchObj) => matchObj.odds)
        .flat();

      const avgOdds = weightedAverage(matchArr, oddsArr);
      let loss = totalLiability;
      if (avgOdds)
        loss = isExchange ? totalLiability * (avgOdds - 1) : totalLiability;
      return totalLoss + loss;
    }, 0);
  }
}
export default StatTable;
