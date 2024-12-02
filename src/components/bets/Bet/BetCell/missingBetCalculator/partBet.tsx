import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import CalculatorTextField from './calculatorTextField';

const CalculatorGroup = ({
  stake,
  odds,
  bg,
  updateValues,
}: {
  bg: { [key: string | number]: string };
  odds: number;
  stake: number;
  updateValues: (stake: number, odds: number) => void;
}) => {
  const [oddsValue, setOddsValue] = useState(odds);
  const [stakeValue, setStakeValue] = useState(stake);
  useEffect(() => {
    updateValues(stakeValue, oddsValue);
  }, [stakeValue, oddsValue]);
  return (
    <Box display={'flex'} justifyContent={'space-between'}>
      <CalculatorTextField
        bg={bg['100']}
        value={stakeValue}
        setValue={setStakeValue}
        label="total matched"
      ></CalculatorTextField>
      <CalculatorTextField
        bg={bg['100']}
        value={oddsValue}
        setValue={setOddsValue}
        label="average odds"
      ></CalculatorTextField>
    </Box>
  );
};
export default CalculatorGroup;
