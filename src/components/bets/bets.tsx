import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { blue, green, grey, red } from '@mui/material/colors';
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
  updateAllBets: (bets: BData[]) => boolean;
};
function Bets() {
  const [filteredBets, setFilteredBets] = useState<BData[]>();
  const [sortedData, setSortedData] = useState<BData[]>();
  //   const [k, setK] = useState<keyof BData>('bet_info');
  //   const [orderBy, setOrderBy] = useState<keyof BetType>('bet_unix_time');
  //   const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<'active' | 'day' | 'week' | 'all time'>(
    'active',
  );

  const [loading, setLoading] = useState(true); // Track loading state
  const {
    allBets,
    setAllBets,
    orderBy,
    setOrderBy,
    sortDirection,
    setSortDirection,
    k,
    setK,
  } = useAppContext();
  useEffect(() => {
    setLoading(true); // Trigger loading state immediately

    if (!allBets) {
      setLoading(false); // Stop loading if no bets are available
      return;
    }

    const sorted = sortBets(allBets, k);
    if (!sorted) {
      setLoading(false); // Stop loading if sorting failed
      return;
    }

    if (allBets[0].bet_info.event_name !== sorted[0].bet_info.event_name) {
      console.log(
        'updating bets',
        allBets[0].bet_info.event_name,
        sorted[0].bet_info.event_name,
      );
      setSortedData([...sorted]);
    }

    setLoading(false); // Stop loading after sorting and any updates
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
    if (!sortedData) return;
    filterBets();
  }, [filter, sortedData]);
  const filterBets = () => {
    // console.log('filter bets', showAll, allBets);
    const f = sortedData!.filter((x) => {
      if (filter === 'active') {
        return x.bet_info.unix_time > new Date().getTime() / 1000;
      } else if (filter === 'day') {
        return x.bet_info.unix_time > new Date().getTime() / 1000 - 86400;
      } else if (filter === 'week') {
        return x.bet_info.unix_time > new Date().getTime() / 1000 - 604800;
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
      {filteredBets && (
        <>
          <Box>
            <StatTable
              filter={filter}
              setFilter={setFilter}
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
  filter: string;
  setFilter: React.SetStateAction<any>;
  filteredBets: BData[];
};
function StatTable({ filter, setFilter, filteredBets }: StatTableProps) {
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
      <Button
        variant="contained"
        sx={{ backgroundColor: filter === 'active' ? 'blue' : 'transparent' }}
        onClick={() => setFilter('active')}
      >
        active
      </Button>
      <Button
        variant="contained"
        sx={{ backgroundColor: filter === 'day' ? 'blue' : 'transparent' }}
        onClick={() => setFilter('day')}
      >
        Day
      </Button>
      <Button
        variant="contained"
        sx={{ backgroundColor: filter === 'week' ? 'blue' : 'transparent' }}
        onClick={() => setFilter('week')}
      >
        Week
      </Button>
      <Button
        variant="contained"
        sx={{ backgroundColor: filter === 'all time' ? 'blue' : 'transparent' }}
        onClick={() => setFilter('all time')}
      >
        All Time
      </Button>
      <>
        <Box
          sx={{
            marginLeft: 'auto',
          }}
        >
          <Table>
            <TableHeader filter={filter} />
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

function TableHeader({ filter }: { filter: string }) {
  let s = filter === 'all time' ? 'Total' : 'Current';
  if (filter === 'week') {
    s = 'weekly';
  } else if (filter === 'day') {
    s = 'daily';
  }
  return (
    <TableRow>
      <TableCell>
        <Typography color="white">Smarkets Balance</Typography>
      </TableCell>
      <TableCell>
        <Typography color="white">Betfair Balance</Typography>
      </TableCell>
      <TableCell>
        <Typography
          textTransform={'capitalize'}
          color="white"
        >{`${s} profit`}</Typography>
      </TableCell>
      <TableCell>
        <Typography
          textTransform={'capitalize'}
          color="white"
        >{`${s} liability`}</Typography>
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
