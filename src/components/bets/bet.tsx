import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { blue, green, grey } from '@mui/material/colors';
import { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BData, BetType, TestData } from '../../../types';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import icon from '../../../assets/icon.svg';
import smarkets from '../../icons/smarkets.png';
import betfair from '../../icons/betfair.png';

TimeAgo.addDefaultLocale(en);

function Bet({ bet, updateSort }: { bet: BData; updateSort: any }) {
  //   const test_data: TestData = {
  //     bet_info: {
  //       bet: 'Brondby',
  //       event_name: 'Silkeborg v Brondby',
  //       event_time: 'Mon20 May 15:00',
  //       bet_time: '2024/05/20',
  //       bet_unix_time: 1716206367.132172,
  //       unix_time: 1716213600.0,
  //       market_type: 'Match Odds',
  //       rating: '101.08',
  //       bookmaker: 'smarkets',
  //       exchange: 'betfair',
  //       bookie_link: 'http://smarkets.com/event/43849661',
  //       exchange_link:
  //         'https://www.betfair.com/exchange/plus/football/market/1.229006349',
  //     },
  //     bet_odds: {
  //       back_odds: 1.64,
  //       lay_odds: 1.61,
  //       max_bet: 70.0,
  //       back_liquidity: 686.0,
  //       exchange_liquidity: 122.0,
  //     },
  //     bet_profit: {
  //       stake_value: 1.45,
  //       lay_amount: 1.5,
  //       lay_win: 2.42,
  //       lay_liability: 0.92,
  //       lay_win_profit: 0.02,
  //       back_win: 2.38,
  //       back_liability: 1.45,
  //       back_win_profit: 0.01,
  //     },
  //   };
  return (
    <Box>
      <Box>
        <Typography variant="h6" color="white">
          {bet.bet_info['event_name']}
        </Typography>
        <Typography color={grey['400']} variant="caption">
          {bet.bet_info['market_type']}
        </Typography>
      </Box>
      <Typography>{bet.bet_info['bet']}</Typography>
      <Table>
        <BetTableHead updateSort={updateSort} />
        <TableBody>
          <BetTableRow data={bet} lay={false}></BetTableRow>
          <BetTableRow data={bet} lay={true}></BetTableRow>
        </TableBody>
      </Table>
    </Box>
  );
}
type BetTableBodyProps = {
  data: BData;
  lay: boolean;
};
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
function BetTableRow({ data, lay }: BetTableBodyProps) {
  const stake_img =
    data.bet_info['exchange'] !== 'betfair' ? betfair : smarkets;
  const lay_img = stake_img !== smarkets ? smarkets : betfair;

  const stake = data.bet_profit[!lay ? 'back_stake' : 'lay_stake'];
  const timeAgo = new TimeAgo('en-US');
  const currentTime = Date.now();
  const eventTimeDelta = currentTime - data.bet_info.unix_time * 1000;
  const betTimeDelta = currentTime - data.bet_info.bet_unix_time * 1000;
  //   useEffect(() => {
  //     const handleLinkClick = (event: any) => {
  //       if (event.target.tagName !== 'A') return;
  //       event.preventDefault();
  //       console.log(event.target.parent.href);
  //       window.electron.shell.openExternal(event.target.parent.href);
  //       return;
  //       if (
  //         event.target.tagName === 'A' &&
  //         event.target.href.startsWith('http')
  //       ) {
  //         window.electron.ipcRenderer.openLink(event.target.href);
  //       }
  //     };

  //     document.addEventListener('click', handleLinkClick);

  //     return () => {
  //       document.removeEventListener('click', handleLinkClick);
  //     };
  //   }, []);

  return (
    <TableRow>
      <BetTableCell>{timeAgo.format(Date.now() - eventTimeDelta)}</BetTableCell>
      <BetTableCell>{timeAgo.format(Date.now() - betTimeDelta)}</BetTableCell>

      <TableCell>
        <Link
          to={data.bet_info[!lay ? 'bookie_link' : 'exchange_link']}
          target="_blank"
        >
          <img src={!lay ? stake_img : lay_img} height={30}></img>
        </Link>
      </TableCell>
      {lay ? (
        <BetTableCell color={blue['400']}>SELL</BetTableCell>
      ) : (
        <BetTableCell color={green['400']}>BUY</BetTableCell>
      )}
      <BetTableCell>
        £{stake ? stake.toFixed(2) : '0'}
        {lay && (
          <Typography fontSize={13} color={grey['500']}>
            £{data.bet_profit['lay_liability']}
          </Typography>
        )}
      </BetTableCell>
      {data.bet_profit['back_matched'] &&
      data.bet_profit['exchange_matched'] &&
      data.bet_profit['exchange_matched']['odds'] ? (
        <>
          <BetTableCell>
            {!lay
              ? data.bet_profit['back_matched']['odds']
              : data.bet_profit['exchange_matched']['odds']}
          </BetTableCell>

          <BetTableCell>
            £
            {!lay
              ? data.bet_profit['back_matched']['matched']
              : data.bet_profit['exchange_matched']['matched']}
          </BetTableCell>
        </>
      ) : (
        <>
          <BetTableCell>{0}</BetTableCell>
          <BetTableCell>{stake}</BetTableCell>
        </>
      )}
      <BetTableCell color={green['400']}>
        {!lay
          ? data.bet_profit['back_win_profit']
          : data.bet_profit['lay_win_profit']}
      </BetTableCell>
    </TableRow>
  );
}
type BetTableCellProps = {
  color?: string;
  children: ReactNode;
};
function BetTableCell({ color, children }: BetTableCellProps) {
  if (!color) color = 'white';
  return (
    <TableCell>
      <Typography color={color}>{children}</Typography>
    </TableCell>
  );
}
export default Bet;
