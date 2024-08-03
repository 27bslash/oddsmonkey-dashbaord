import { Box, Typography } from '@mui/material';
import { useState, useEffect, KeyboardEvent, SetStateAction } from 'react';
import { BData } from '../../../../../../types';
type EditableCellProps = {
  data: BData;
  bet: { [key: number]: number };
  profit: number;
  lay: boolean;
  type: string;
};
function EditableCell({ data, bet, profit, lay, type }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');
  profit = profit || 0;
  const handleClick = () => {
    setIsEditing(!isEditing);
  };
  const handleChange = (e: { target: { value: string } }) => {
    setValue(e.target.value);
  };
  useEffect(() => {
    if (!isEditing) {
      setValue(profit.toFixed(2));
    }
  }, [isEditing, profit]);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('enter', value);
      const updateQuery = `bet_profit.${lay ? 'exchange_matched' : 'back_matched'}.${type === 'odds' ? 'odds' : 'matched'}`;
      window.electron.ipcRenderer.updateItem({
        collectionName: 'pending_bets',
        query: { 'bet_info.bet_unix_time': data.bet_info.bet_unix_time },
        update: { $set: { [updateQuery]: [+value] } },
      });
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };
  const calcColor = () => {
    const sum = Object.values(bet).reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    const stake = data.bet_profit[!lay ? 'back_stake' : 'lay_stake'];
    return sum.toFixed(2) == stake.toFixed(2) ? 'white' : 'red';
  };
  const color = calcColor();
  //   console.log(data.bet_info.event_name, bet, color);
  return (
    <>
      <Box
        sx={
          {
            //   color: profit >= 0 ? green['400'] : red['400'],
          }
        } 
      >
        {!isEditing ? (
          <Typography
            color={type === 'stake' ? color : 'white'}
            onClick={handleClick}
          >
            {type === 'stake' && <span>£</span>}
            {value}
          </Typography>
        ) : (
          <>
            {type === 'stake' && <span>£</span>}
            <input
              className="editable-text-input"
              type="number"
              onKeyDown={(e) => handleKeyDown(e)}
              value={value}
              onChange={handleChange}
              autoFocus
            />
          </>
        )}
      </Box>
    </>
  );
}
export default EditableCell;
