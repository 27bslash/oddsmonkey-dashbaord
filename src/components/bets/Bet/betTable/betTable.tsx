import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { blue, green, grey, red } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import { BData, BProfit } from '../../../../../types';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

import BetTableHead from './BetHeader/betTableHead';
import BetTableRow from './betRow';

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
        <div className="flex" style={{ alignItems: 'center' }}>
          <Typography variant="h6" color="white">
            {bet.bet_info['event_name']}
          </Typography>
          {Date.now() / 1000 - bet.bet_info.bet_unix_time < 300 && (
            <Button
              disabled
              variant="contained"
              sx={{
                background:
                  'linear-gradient(200.96deg,#fedc2a -29.09%,#dd5789 51.77%,#7a2c9e 129.35% )',
                color: 'white !important',
                border: 'solid 1px black',
                marginLeft: '10px',
              }}
            >
              new bet
            </Button>
          )}
        </div>
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

export default Bet;
