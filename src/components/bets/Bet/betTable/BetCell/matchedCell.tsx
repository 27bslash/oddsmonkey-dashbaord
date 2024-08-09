import { Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';
import BetTableCell from './betCell';
import EditableCell from './editableTextCell';
import { useState, useEffect, SetStateAction } from 'react';
import { BData, BProfit } from '../../../../../../types';

type MatchedCellProps = {
  lay: boolean;
  data: BData;
};
function MatchedCell({ data, lay }: MatchedCellProps) {
  const [backWinProfit, setBackWinProfit] = useState(0);
  const [layWinProfit, setLayWinProfit] = useState(0);
  const [backLay, setBackLay] = useState<{
    [key: string]: { [key: number]: number };
  }>({
    back: {},
    lay: {},
  });

  const update_obj = (matchData: BProfit['back_matched'], key: string) => {
    const backLay: any = { back: {}, lay: {} };
    matchData.odds.forEach((odd, i) => {
      backLay[key][odd] = (backLay[key][odd] || 0) + matchData.matched[i];
    });
    if (!Object.keys(backLay[key]).length) {
      backLay[key] = { 0: 0 };
    }
    return backLay;
  };
  useEffect(() => {
    setBackLay((prevD) => {
      const layObj = update_obj(data.bet_profit.exchange_matched, 'lay');
      const backObj = update_obj(data.bet_profit.back_matched, 'back');
      return { lay: layObj['lay'], back: backObj['back'] };
    });
  }, [data]);
  //   console.log(data.bet_info.event_name, data.bet_profit.exchange_matched, d);

  //   back_wins = round(back_stake * (back_odds - 1), 2);
  //   lay_liability = round(lay_stake * (lay_odds - 1), 2);
  //   back_win_profit = round(back_wins - lay_liability, 2);
  //   lay_wins = round(lay_stake * (1 - commission), 2);
  //   lay_win_profit = round(lay_wins - back_stake, 2);
  useEffect(() => {
    let backWins = 0;
    let layLiability = 0;
    let backLiability = 0;
    let layWins = 0;
    Object.entries(backLay['back']).map((x) => {
      backWins += (+x[0] - 1) * x[1];
      backLiability += x[1];
    });
    Object.entries(backLay['lay']).map((x) => {
      layWins += +x[1] * (1 - data.bet_odds.commission);
      layLiability += (+x[0] - 1) * x[1];
    });

    setBackWinProfit(backWins - layLiability);
    setLayWinProfit(layWins - backLiability);
  }, [backLay]);
  return (
    <>
      <BetTableCell>
        {!lay
          ? Object.keys(backLay['back']).map((x, i) => {
              return (
                <EditableCell
                  data={data}
                  bet={backLay['back']}
                  lay={false}
                  type={'odds'}
                  profit={+x}
                />
              );
            })
          : Object.keys(backLay['lay']).map((x, i) => {
              return (
                <EditableCell
                  data={data}
                  bet={backLay['lay']}
                  lay={true}
                  profit={+x}
                  type={'odds'}
                />
              );
            })}
      </BetTableCell>
      <BetTableCell>
        {!lay ? (
          <>
            {Object.values(backLay['back']).map((x, i) => {
              return (
                <EditableCell
                  data={data}
                  bet={backLay['back']}
                  lay={false}
                  type={'stake'}
                  profit={x}
                />
              );
            })}
          </>
        ) : (
          <>
            {Object.values(backLay['lay']).map((x, i) => {
              return (
                <EditableCell
                  data={data}
                  bet={backLay['lay']}
                  lay={true}
                  profit={x}
                  type={'stake'}
                />
              );
            })}
          </>
        )}
      </BetTableCell>
      <BetTableCell>
        {!lay
          ? Object.values(backLay['back']).map((x, i) => {
              return (
                <Typography
                  color={backWinProfit >= 0 ? green['400'] : red['400']}
                  key={i}
                >
                  £{backWinProfit.toFixed(2)}
                  {/* {backWinProfit.toFixed(2)} */}
                </Typography>
              );
            })
          : Object.values(backLay['lay']).map((x, i) => {
              return (
                <Typography
                  color={layWinProfit >= 0 ? green['400'] : red['400']}
                  key={i}
                >
                  £{layWinProfit.toFixed(2)}
                </Typography>
              );
            })}
      </BetTableCell>
      <BetTableCell>
        £
        {(
          Math.min(
            data.bet_odds.total_back_liquidity,
            data.bet_odds.total_lay_liquidity,
          ) * 0.8
        ).toFixed(2)}
      </BetTableCell>
    </>
  );
}
export default MatchedCell;
