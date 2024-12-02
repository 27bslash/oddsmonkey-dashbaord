import { Box, TableFooter, TablePagination, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import { BData, BetInfo, BetOdds, BetProfit } from '../../../types';
import { useAppContext } from '../../renderer/useAppContext';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';
import StatTable from '../StatTable/statTable';
import { Config } from './../config/config';
import Bet from './Bet/betTable/betTable';

export type SortKeys = keyof BetInfo | keyof BetOdds | keyof BetProfit;

function Bets() {
  const [filteredBets, setFilteredBets] = useState<BData[]>();
  const [sortedData, setSortedData] = useState<BData[]>();
  const [filter, setFilter] = useState<'active' | 'day' | 'week' | 'all time'>(
    'active',
  );
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(count);
    if (page * 10 > count) {
      // console.log(page)
      setPage(0);
    }
  }, [count]);
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };
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

    // if (allBets[0].bet_info.event_name !== sorted[0].bet_info.event_name) {
    setSortedData([...sorted]);

    setLoading(false); // Stop loading after sorting and any updates
  }, [orderBy, sortDirection, allBets, page]);

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
    console.log('hadnle sort', ern, property);
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
        return x.bet_info.unix_time > new Date().getTime() / 1000 - 5400;
      } else if (filter === 'day') {
        return x.bet_info.bet_unix_time > new Date().getTime() / 1000 - 86400;
      } else if (filter === 'week') {
        return x.bet_info.bet_unix_time > new Date().getTime() / 1000 - 604800;
      }
      return x;
    });
    setFilteredBets(f);
    setCount(f.length);
  };
  return (
    <Box
      // padding={5}
      sx={{ backgroundColor: '#212121', height: 'fit-content', width: '93vw' }}
    >
      {filteredBets && (
        <>
          <Box
            sx={{
              position: 'sticky',
              display: 'flex',
              top: '0px',
              zIndex: 99,
              background: '#212121',
            }}
          >
            <StatTable
              filter={filter}
              setFilter={setFilter}
              filteredBets={filteredBets}
              totalBets={allBets!}
            />
          </Box>
          {filteredBets.slice(page * 10, page * 10 + 10).map((bet, i) => {
            return <Bet key={i} updateSort={handleRequestSort} bet={bet}></Bet>;
          })}
          <TableFooter>
            <TableRow>
              <TablePagination
                sx={{ color: 'white' }}
                rowsPerPageOptions={[10]}
                colSpan={3}
                count={count}
                rowsPerPage={10}
                page={page}
                onPageChange={handleChangePage}
                ActionsComponent={TablePaginationActions}
                showFirstButton
                showLastButton
              />
            </TableRow>
          </TableFooter>
        </>
      )}
    </Box>
  );
}

export default Bets;
