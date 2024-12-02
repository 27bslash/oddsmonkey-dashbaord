import { Box, TextField } from '@mui/material';
import { blue, green, red } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import { MatchObj } from './betCalculator';
import CalculatorGroup from './partBet';
import CalculatorTextField from './calculatorTextField';
type CalculatorSectionProps = {
  matchArray: MatchObj['back'];
  total: number;
  liability: number;
  value: number;
  type: 'back' | 'lay';
  updateValues: (stake: number, odds: number, type: 'back' | 'lay') => void;
  updateValue: React.Dispatch<React.SetStateAction<number>>;
  setUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
  missingBet?: number;
};
const CalculatorSection = ({
  matchArray,
  total,
  liability,
  type,
  value,
  missingBet,
  updateValues,
  updateValue,
  setUpdate,
}: CalculatorSectionProps) => {
  const baseColor = type === 'lay' ? blue : green;
  return (
    <>
      <Box
        id={`${type}-container`}
        className="calculator-section"
        sx={{
          background: baseColor['200'],
          //   borderLeft: 'solid 3px black',
          //   borderRight: 'solid 3px black',
        }}
        padding={2}
        color={'black'}
      >
        {/* <Typography
          fontWeight={'bold'}
          textTransform={'capitalize'}
          justifyContent={'center'}
          textAlign={'center'}
          variant='h5'
        >
          {type}
        </Typography> */}
        {/* {matchArray.map((item, i) => { */}
        {/* return ( */}
        <CalculatorGroup
          //   key={i}
          odds={matchArray.odds}
          stake={matchArray.stake}
          bg={baseColor}
          updateValues={(stake, odds) => updateValues(stake, odds, type)}
        />
        <CalculatorTextField
          bg={baseColor['100']}
          value={value}
          setValue={updateValue}
          label="current odds"
        ></CalculatorTextField>
        {/* <Typography fontWeight={'bold'} textTransform={'capitalize'}>
          {type} wins: {(+total || 0).toFixed(2)}
        </Typography>
        <Typography fontWeight={'bold'} textTransform={'capitalize'}>
          {type} liability: {(+liability || 0).toFixed(2)}
        </Typography> */}
      </Box>
      {missingBet && missingBet > 0 && (
        <Typography
          className="missing-bet-text"
          fontWeight={'bold'}
          textTransform={'capitalize'}
          padding={2}
          sx={{
            backgroundColor: baseColor['900'],
          }}
        >
          missing {type} bet:
          <span
            onClick={() => setUpdate!((prev) => !prev)}
            style={{
              marginLeft: '4px',
              color: red['700'],
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            £{+missingBet.toFixed(2) <= 0 ? 0 : missingBet.toFixed(2)}
            <br></br>
            {liability} {total}
          </span>
        </Typography>
      )}
    </>
  );
};
export default CalculatorSection;
