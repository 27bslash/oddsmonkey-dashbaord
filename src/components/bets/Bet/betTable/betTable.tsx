import {
  bottomNavigationActionClasses,
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { blue, green, grey, red } from '@mui/material/colors';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BData } from '../../../../../types';
import BetProvider from '../../betContext';
import BetTableHead from './BetHeader/betTableHead';
import BetTableRow from './betRow';
import DebugImages from '../BetCell/betImages/debugImages';
import BetCalculator from '../BetCell/missingBetCalculator/betCalculator';
import Delete from '../BetCell/delete/delete';
import DeleteIcon from '@mui/icons-material/Delete';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
TimeAgo.addDefaultLocale(en);

function Bet({ bet, updateSort }: { bet: BData; updateSort: any }) {
  const [showBetCalc, setShowBetCalc] = useState(false);
  const [show, setShow] = useState(false);
  const [deleteOverlay, setDeleteOverlay] = useState(false);

  const [betData, setBetData] = useState<BData>(bet);
  useEffect(() => {
    if (betData !== bet) {
      setBetData(bet);
    }
  }, [bet]);
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
  //   if (bet._id !== betData._id) {
  //     return (
  //       <Box sx={{ display: 'flex' }}>
  //         <CircularProgress />
  //       </Box>
  //     );
  //   }

  let value;
  if (betData) value = { betData, updateSort, setBetData };
  return (
    value && (
      <BetProvider value={value}>
        <Box>
          <Box>
            <div className="flex" style={{ alignItems: 'center' }}>
              <Typography variant="h6" color="white">
                {betData.bet_info['event_name']}
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
              <CalculateOutlinedIcon
                className="icon"
                sx={{ padding: '5px' }}
                onClick={() => setShowBetCalc((prev) => !prev)}
                color="success"
              />

              {showBetCalc && (
                <div
                  className="wrapper"
                  onMouseDown={(e) => {
                    if (e.target === e.currentTarget) {
                      return setShowBetCalc(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    console.log(e.key);
                    if (e.key === 'Escape') return setShowBetCalc(false);
                  }}
                >
                  <BetCalculator
                    setShowBetCalc={setShowBetCalc}
                    data={bet}
                  ></BetCalculator>
                </div>
              )}
              <DeleteIcon
                className="icon"
                sx={{ padding: '5px' }}
                onClick={() => setDeleteOverlay((prev) => !prev)}
                color="error"
              />

              {deleteOverlay && (
                <div
                  className="wrapper"
                  onMouseDown={(e) => {
                    if (e.target === e.currentTarget) {
                      return setDeleteOverlay(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    console.log(e.key);
                    if (e.key === 'Escape') return setDeleteOverlay(false);
                  }}
                >
                  <Delete
                    data={bet}
                    setDeleteOverlay={setDeleteOverlay}
                  ></Delete>
                </div>
              )}
              <DebugImages data={bet}></DebugImages>
            </div>
            <Typography color={grey['400']} variant="caption">
              {bet.bet_info['market_type']}
            </Typography>
          </Box>

          <Typography>{bet.bet_info['bet']}</Typography>
          <Table sx={{ position: 'relative' }}>
            <BetTableHead updateSort={updateSort} />
            <TableBody>
              {bet.bet_profit['back_matched'].map((x, i) => {
                // console.log(i, x);
                if (i === 0 || show) {
                  return (
                    <>
                      <BetTableRow
                        data={bet}
                        index={i}
                        lay={false}
                        show={show}
                      />
                      <BetTableRow
                        data={bet}
                        index={i}
                        lay={true}
                        show={show}
                      />
                    </>
                  );
                }
              })}
              {/* {bet.bet_profit['exchange_matched'].map((x, i) => {
            if (i === 0 || show) {
              return (
                <>
                </>
              );
            }
          })} */}
            </TableBody>
            {bet.bet_profit['back_matched'].length > 1 && (
              <Button
                variant="contained"
                disableElevation
                sx={{
                  position: 'absolute',
                  top: '50%',
                  zIndex: 9,
                  right: '0',
                  opacity: '1',
                  backgroundColor: '#212121',
                }}
                onClick={() => setShow((prev) => !prev)}
              >
                <Typography>
                  {bet.bet_profit['back_matched'].length - 1} V
                </Typography>
              </Button>
            )}
          </Table>
        </Box>
      </BetProvider>
    )
  );
}

export default Bet;
