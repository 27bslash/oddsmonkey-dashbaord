import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { BData } from '../../../../../../types';
import CalculatorSection from './calculatorSection';
import { blue, green, red } from '@mui/material/colors';
import ProfitTable from './profitTable/profitTable';
import { weightedAverage } from '../matched/matchedCell';

export type MatchObj = {
  back: { stake: number; odds: number };
  lay: { stake: number; odds: number };
};

const BetCalculator = ({
  data,
  setShowBetCalc,
}: {
  data: BData;
  setShowBetCalc: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const testData = { matched: [10, 10], odds: [1.2, 2.3] };
  const [backTotal, setBackTotal] = useState(0);
  const [layTotal, setLayTotal] = useState(0);
  const { back_matched, exchange_matched } = data.bet_profit;

  const [layLiability, setLayLiability] = useState(0);
  const [backLiability, setBackLiability] = useState(0);
  const [missingBet, setMissingBet] = useState<{
    missingBackBet: number;
    missingLayBet: number;
  }>();
  const combineMatchedArrays = (type: string) => {
    const dataArr = type === 'lay' ? exchange_matched : back_matched;
    return dataArr
      .map((matchObj) =>
        matchObj.matched.map((stake, i) => ({
          stake: stake,
          odds: matchObj.odds[i],
        })),
      )
      .flat();
  };
  const initialiseValues = (type: 'lay' | 'back') => {
    const vals = combineMatchedArrays(type);
    const matchArr = vals.map((matchObj) => matchObj.stake);
    const oddsArr = vals.map((matchObj) => matchObj.odds);
    const avgOdds = weightedAverage(matchArr, oddsArr);
    const stake = vals.reduce((acc, curr) => acc + curr.stake, 0);
    return { stake, odds: avgOdds };
  };
  const [obj, setObj] = useState<MatchObj>();
  const [backOddsValue, setBackOddsValue] = useState<number>(0);
  const [layOddsValue, setLayOddsValue] = useState<number>(0);
  const [updatedTotals, setUpdatedTotals] = useState({});
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    const backVals = initialiseValues('back');
    const layVals = initialiseValues('lay');
    setObj({
      back: backVals,
      lay: layVals,
    });
    setLayOddsValue(
      exchange_matched[exchange_matched.length - 1].odds[
        exchange_matched[exchange_matched.length - 1].odds.length - 1
      ],
    );
    setBackOddsValue(
      back_matched[back_matched.length - 1].odds[
        back_matched[back_matched.length - 1].odds.length - 1
      ],
    );
  }, []);

  const updateValues = (stake: number, odds: number, type: 'back' | 'lay') => {
    if (!obj) return;
    console.log(obj, stake, odds, type);
    let newStakes = obj[type];
    newStakes = { stake, odds };
    setObj((prevValues) => ({
      ...prevValues!,
      [type]: newStakes,
    }));
  };
  const updateValue = (value: number, type: 'lay' | 'back') => {
    if (type === 'lay') {
      setLayOddsValue(value);
    } else {
      setBackOddsValue(value);
    }
  };
  useEffect(() => {
    // Recalculate the total whenever backStakes changes
    if (!obj || !backOddsValue || !layOddsValue) return;
    const bTotal = obj.back.stake * (obj.back.odds - 1);
    setBackTotal(bTotal);
    setBackLiability(obj.back.stake);
    const lTotal = obj.lay.stake * (obj.lay.odds - 1);
    const layWins = obj.lay.stake * (1 - data.bet_odds.commission);
    setLayTotal(layWins);
    setLayLiability(lTotal);
    // Lay Stake = Back odds x Back Stake / (Lay Odds - Commission)
    const totalLayStake = bTotal / (layOddsValue - data.bet_odds.commission);
    const missingLayLiability = totalLayStake * (layOddsValue - 1) - lTotal;
    const t = missingLayLiability / (layOddsValue - 1);
    // console.log(
    //   'missingLay:',
    //   missingLayLiability,
    //   'totallaystake:',
    //   totalLayStake,
    //   'partLay:',
    //   lTotal,
    // );
    // console.log('result:', t);
    setMissingBet(betCalculatorMaths());
  }, [obj, backOddsValue, layOddsValue, update]);

  const betCalculatorMaths = () => {
    // const { commission } = data.bet_odds;
    if (
      !back_matched[0]['matched'] ||
      !exchange_matched[0]['matched'] ||
      !obj ||
      !backOddsValue ||
      !layOddsValue
    ) {
      //   console.log(back_matched, exchange_matched);
      return;
    }
    try {
      const calcMissingBet = (
        totalStake: number,
        avgOdds: number,
        combinedPartStake: number,
        oppositeAvgOdds: number,
        type: 'lay' | undefined,
      ) => {
        const commission = data.bet_odds.commission;
        // bet_amount = (total_back_stake * 1.02 * back_odds -( matched_bet * 1.02)) / lay_odds
        // console.log(
        //   'total',
        //   totalStake,
        //   'average odds',
        //   avgOdds,
        //   'matched',
        //   combinedPartStake,
        //   'opp odds',
        //   oppositeAvgOdds,
        // );
        const combinedTotal = totalStake * avgOdds;
        if (commission && type === 'lay') {
          //   combinedPartStake = matchedBet / commission;
        }
        // console.log(
        //   combinedTotal,
        //   combinedPartStake,
        //   (combinedTotal - combinedPartStake) / oppositeAvgOdds,
        // );
        return (combinedTotal - combinedPartStake) / oppositeAvgOdds;
      };
      //     ((Back_Stake*Back_Odds)-(Part_Lay_stake*Lays_Odds/Lay_Commission))/Part_Lay_odds
      // ((18.71 x 4.7) - ( 10 x 5 / 1.02))/4.6

      const sumBackStake = obj.back.stake;
      const sumLayStake = obj.lay.stake;
      const layAvgOdds = obj.lay.odds;
      const backAvgOdds = obj.back.odds;
      // const backAvgOdds = weightedAvg(back_matched.odds, back_matched.staked);
      //   const totalLayStake =
      //     (sumBackStake * backOddsValue!) / (layOddsValue! - commission);
      //   const totalBackStake =
      //     (sumLayStake * (layOddsValue! - commission)) / backOddsValue!;

      // console.log(totalBackStake, totalLayStake);
      const missingBackBet = calcMissingBet(
        sumLayStake,
        layAvgOdds,
        obj.back.stake * obj.back.odds,
        backOddsValue,
        undefined,
      );
      //   console.log(1 - data.bet_odds.commission / 2);
      const missingLayBet = calcMissingBet(
        sumBackStake,
        backAvgOdds,
        obj.lay.stake * obj.lay.odds,
        layOddsValue,
        'lay',
      );
      // console.log(
      //   'totalbackstake',
      //   totalBackStake,
      //   sumLayStake,
      //   value.lay,
      //   totalLayStake,
      //   layAvgOdds,
      //   calcPartBet(value.lay),
      //   backAvgOdds,
      // );
      if (missingBackBet > 0 && update) {
        setBackTotal((prev) => {
          return prev + missingBackBet * (backOddsValue - 1);
        });
        setBackLiability((prev) => prev + missingBackBet);
      }
      if (missingLayBet > 0 && update) {
        setLayTotal((prev) => prev + missingLayBet);
        setLayLiability((prev) => prev + missingLayBet * (layOddsValue - 1));
      }
      return { missingBackBet, missingLayBet };
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };
  return (
    obj && (
      <Box
        className="bet-calculator"
        display={'flex'}
        flexDirection={'column'}
        width={'500px'}
        // sx={{ background: green['200'] }}
      >
        {/* <Button
          onClick={() => setShowBetCalc(false)}
          elevated={false}
          variant="text"
          sx={{ marginLeft: 'auto', background: 'none', boxShadow: 'none' }}
        >
          X
        </Button> */}
        <CalculatorSection
          matchArray={obj.back}
          total={backTotal}
          liability={backLiability}
          value={backOddsValue}
          type="back"
          updateValues={updateValues}
          updateValue={setBackOddsValue}
          setUpdate={setUpdate}
          missingBet={missingBet?.missingBackBet}
        ></CalculatorSection>
        <CalculatorSection
          matchArray={obj.lay}
          total={layTotal}
          liability={layLiability}
          value={layOddsValue}
          type="lay"
          updateValues={updateValues}
          updateValue={setLayOddsValue}
          setUpdate={setUpdate}
          missingBet={missingBet?.missingLayBet}
        ></CalculatorSection>
        <ProfitTable
          data={data}
          backLiability={backLiability}
          backTotal={backTotal}
          layLiability={layLiability}
          layTotal={layTotal}
        ></ProfitTable>
        {/* <Box className="profit-display">
          <Typography></Typography>
          <Typography>
            Back Profit:
            <span
              style={{
                color: backTotal < layLiability ? red['700'] : green['300'],
              }}
            >
              £{(backTotal - layLiability).toFixed(2)}
            </span>
          </Typography>
          <Typography>
            Lay Profit:
            <span
              style={{
                color: layTotal < backLiability ? red['700'] : green['300'],
              }}
            >
              £{(layTotal - backLiability).toFixed(2)}
            </span>
          </Typography>
        </Box> */}
      </Box>
    )
  );
};
export default BetCalculator;
