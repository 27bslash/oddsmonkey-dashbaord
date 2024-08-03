import { TableRow, TableCell, Typography } from '@mui/material';
import TimeAgo from 'javascript-time-ago';
import { Link } from 'react-router-dom';
import { BData } from '../../../../../types';
import smarkets from '../../../../icons/smarkets.png';
import betfair from '../../../../icons/betfair.png';
import { blue, green, grey } from '@mui/material/colors';
import BetTableCell from './BetCell/betCell';
import MatchedCell from './BetCell/matchedCell';

type BetTableBodyProps = {
  data: BData;
  lay: boolean;
};
function BetTableRow({ data, lay }: BetTableBodyProps) {
  const stake_img =
    data.bet_info['exchange'] !== 'betfair' ? betfair : smarkets;
  const lay_img = stake_img !== smarkets ? smarkets : betfair;
  const stake = data.bet_profit[!lay ? 'back_stake' : 'lay_stake'];
  const timeAgo = new TimeAgo('en-US');
  const currentTime = Date.now();
  const eventTimeDelta = currentTime - data.bet_info.unix_time * 1000;
  const betTimeDelta = currentTime - data.bet_info.bet_unix_time * 1000;


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
        <Typography>£{stake ? stake.toFixed(2) : '0'}</Typography>
        {lay && (
          <Typography fontSize={13} color={grey['500']}>
            £{data.bet_profit['lay_liability']}
          </Typography>
        )}
      </BetTableCell>
      {data.bet_profit['back_matched'] &&
      data.bet_profit['exchange_matched'] &&
      data.bet_profit['exchange_matched']['odds'] &&
      data.bet_profit['back_matched']['odds'] ? (
        <MatchedCell lay={lay} data={data} />
      ) : (
        <>
          <BetTableCell>{data.bet_odds.back_odds}</BetTableCell>
          <BetTableCell>{stake}</BetTableCell>
          <BetTableCell color={green['400']}>
            {!lay
              ? data.bet_profit['back_win_profit']
              : data.bet_profit['lay_win_profit']}
          </BetTableCell>
        </>
      )}
    </TableRow>
  );
}
export default BetTableRow;
