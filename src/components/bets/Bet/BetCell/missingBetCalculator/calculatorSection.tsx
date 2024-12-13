import { Box, TextField } from '@mui/material';
import { blue, green, red } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import { MatchObj } from './betCalculator';
import CalculatorGroup from './partBet';
import CalculatorTextField from './calculatorTextField';
import { MouseEvent } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileCopyIcon from '@mui/icons-material/FileCopy';
type CalculatorSectionProps = {
  matchArray: MatchObj['back'];
  total: number;
  liability: number;
  value: number;
  type: 'back' | 'lay';
  link: string;
  updateValues: (stake: number, odds: number, type: 'back' | 'lay') => void;
  updateValue: React.Dispatch<React.SetStateAction<number>>;
  setUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
  update?: boolean;
  missingBet?: number;
};
const CalculatorSection = ({
  matchArray,
  total,
  liability,
  type,
  link,
  value,
  missingBet,
  updateValues,
  updateValue,
  update,
  setUpdate,
}: CalculatorSectionProps) => {
  const baseColor = type === 'lay' ? blue : green;
  const openLink = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!update) window.open(link, '_blank');
    const target = e.target as HTMLElement;
    console.log(e, target.textContent);
    if (!target.textContent) {
      return;
    }
    const betValue = target.textContent.replace('£', '');
    navigator.clipboard.writeText(betValue);
  };
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

      </Box>
      {missingBet && missingBet > 0.01 && (
        <>
          <NestedText
            bgColor={baseColor['900']}
            color={red['700']}
            firstStr={`missing ${type} bet:`}
            secondStr={
              <>
                <span>
                  £{+missingBet.toFixed(2) <= 0 ? 0 : missingBet.toFixed(2)}
                </span>
                <FileCopyIcon
                  className="icon"
                  sx={{ marginLeft: '5px', color: 'white', fontSize: '0.8rem' }}
                />
              </>
            }
            clickHandle={(
              e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
            ) => {
              openLink(e);
              return setUpdate!((prev) => !prev);
            }}
          />
          {update && (
            <>
              <NestedText
                bgColor={baseColor['900']}
                color={red['700']}
                firstStr="Liability:"
                secondStr={`-£${liability.toFixed(2)}`}
              />
              <NestedText
                bgColor={baseColor['900']}
                color={green['300']}
                firstStr="Total:"
                secondStr={`+£${total.toFixed(2)}`}
              />
            </>
          )}
        </>
      )}
    </>
  );
};
type NestedTextProps = {
  firstStr: string;
  secondStr: string | React.ReactElement;
  bgColor: string;
  color: string;
  clickHandle?: any;
};
const NestedText = ({
  firstStr,
  secondStr,
  bgColor,
  color,
  clickHandle,
}: NestedTextProps) => {
  return (
    <Typography
      className="missing-bet-text"
      fontWeight={'bold'}
      textTransform={'capitalize'}
      padding={0.5}
      paddingLeft={2}
      sx={{
        backgroundColor: bgColor,
      }}
    >
      {firstStr}
      <span
        onClick={clickHandle}
        style={{
          marginLeft: '4px',
          color: color,
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {secondStr}
      </span>
    </Typography>
  );
};
export default CalculatorSection;
