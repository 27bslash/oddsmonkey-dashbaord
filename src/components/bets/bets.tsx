import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { blue, green, grey } from '@mui/material/colors';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  BData,
  BetInfo,
  BetOdds,
  BetProfit,
  BetType,
  TestData,
} from '../../../types';
import Bet from './bet';
import { useAppContext } from '../../renderer/useAppContext';

type SortKeys = keyof BetInfo | keyof BetOdds | keyof BetProfit;
const flat = (obj: any, out: any) => {
  Object.keys(obj).forEach((key) => {
    if (key == '_id') return;
    if (typeof obj[key] == 'object' && key != 'matched') {
      out = flat(obj[key], out); //recursively call for nesteds
    } else if (key != 'matched') {
      out[key] = obj[key]; //direct assign for values
    }
  });
  return out;
};

type BetsProps = {
  allBets: BData[];
  updateAllBets: (bets: BData[]) => void;
};
function Bets() {
  const [filteredBets, setFilteredBets] = useState<BData[]>();
  //   const [k, setK] = useState<keyof BData>('bet_info');
  //   const [orderBy, setOrderBy] = useState<keyof BetType>('bet_unix_time');
  //   const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showAll, setShowAll] = useState(true);
  const [loading, setLoading] = useState(true); // Track loading state
  const {
    allBets,
    updateAllBets,
    orderBy,
    setOrderBy,
    sortDirection,
    setSortDirection,
    k,
    setK,
  } = useAppContext();
  useEffect(() => {
    setLoading(true);
    if (!allBets) return;
    const sorted = sortBets(allBets, k);
    if (!sorted) return;
    if (allBets[0].bet_info.event_name !== sorted[0].bet_info.event_name) {
      console.log(
        'updating bets',
        allBets[0].bet_info.event_name,
        sorted[0].bet_info.event_name,
      );
      updateAllBets(sorted);
    }
    setLoading(false);
  }, [orderBy, sortDirection, allBets]);
  const sortBets = (arr: BData[], key?: keyof BData) => {
    if (!key) key = k;

    const sorted = [...arr]!.sort((a: any, b: any) => {
      return sortDirection === 'asc'
        ? +a[key][orderBy] - +b[key][orderBy]
        : +b[key][orderBy] - +a[key][orderBy];
    });
    return sorted;
  };
  const handleRequestSort = (
    property: SortKeys,
    sortDirection: string,
    betKey: keyof BData,
  ) => {
    const isAsc = sortDirection === 'asc';
    const ern = isAsc ? 'desc' : 'asc';
    // console.log('hadnle sort', ern, property);
    setSortDirection(ern);
    setOrderBy(property);
    setK(betKey);
  };

  useEffect(() => {
    if (!allBets) return;
    filterBets();
  }, [showAll, allBets]);
  const filterBets = () => {
    // console.log('filter bets', showAll, allBets);
    const f = allBets!.filter((x) => {
      if (!showAll) {
        return x.bet_info.unix_time > new Date().getTime() / 1000;
      }
      return x;
    });
    setFilteredBets(f);
  };

  return (
    <Box
      padding={5}
      sx={{ backgroundColor: '#212121', overflowY: 'scroll', height: '400px' }}
    >
      {filteredBets && !loading && (
        <>
          <Box>
            <StatTable
              showAll={showAll}
              setShowAll={setShowAll}
              filteredBets={filteredBets}
            />
          </Box>
          {filteredBets.map((x, i) => {
            return <Bet key={i} updateSort={handleRequestSort} bet={x}></Bet>;
          })}
        </>
      )}
    </Box>
  );
}
type StatTableProps = {
  showAll: boolean;
  setShowAll: React.SetStateAction<any>;
  filteredBets: BData[];
};
function StatTable({ showAll, setShowAll, filteredBets }: StatTableProps) {
  const [totals, setTotals] = useState<string[]>([]);

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
    setTotals([totalProfit, totalLiability]);
  }, [allBets, filteredBets]);
  return (
    <Box display={'flex'}>
      <Button onClick={() => setShowAll((prev: boolean) => !prev)}>
        show all
      </Button>
      <>
        <Box
          sx={{
            marginLeft: 'auto',
          }}
        >
          <Table>
            <TableHeader showAll={showAll} />
            <StatTableBody totals={totals} balance={balance} />
          </Table>
        </Box>
      </>

      {/* <Box
        width="40%"
        sx={{
          marginLeft: 'auto',
        }}
      >
        <Table>
          <TableBody>
            <TableRow></TableRow>
            <TableRow></TableRow>
          </TableBody>
        </Table>
      </Box> */}
    </Box>
  );
}

export default Bets;

function TableHeader({ showAll }: { showAll: boolean }) {
  const s = showAll ? 'Total' : 'Current';
  return (
    <TableRow>
      <TableCell>
        <Typography color="white">Smarkets Balance</Typography>
      </TableCell>
      <TableCell>
        <Typography color="white">Betfair Balance</Typography>
      </TableCell>
      <TableCell>
        <Typography color="white">{`${s} profit`}</Typography>
      </TableCell>
      <TableCell>
        <Typography color="white">{`${s} liability`}</Typography>
      </TableCell>
    </TableRow>
  );
}
type StatTableBodyProps = {
  totals: string[];
  balance: { smarkets: number; betfair: number };
};
function StatTableBody({ totals, balance }: StatTableBodyProps) {
  return (
    <TableBody>
      <TableRow>
        <TableCell>
          <Typography color={'gold'}>£{balance.smarkets}</Typography>
        </TableCell>
        <TableCell>
          <Typography color={'gold'}>£{balance.betfair}</Typography>
        </TableCell>
        <TableCell>
          <Typography color={green['400']}>£{totals[0]}</Typography>
        </TableCell>
        <TableCell>
          <Typography color={blue['400']}>£{totals[1]}</Typography>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
