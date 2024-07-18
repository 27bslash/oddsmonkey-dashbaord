import { Box, Button, TextField, Typography } from '@mui/material';
import { ChangeEvent, SetStateAction, useEffect, useState } from 'react';

type configObj = {
  SINGLE_BET_MAX: number;
  USE_MONEY: boolean;
  MIN_BALANCE: number;
  MAX_LIABILITY: number;
};
export function Config() {
  const [config, setConfig] = useState<configObj>();
  useEffect(() => {
    const handleDataFetched = (fetchedData: any) => {
      setConfig(fetchedData[0])
    };
    window.electron.ipcRenderer.onConfigFetched(handleDataFetched);
    return () => {
      window.electron.ipcRenderer.onConfigFetched(() => {});
    };
  }, []);
  return (
    <>
      {config && (
        <Box
          width={'30%'}
          padding={1}
          border={'solid 1px black'}
          borderRadius={'3px'}
          bgcolor={'grey'}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <NumberInput
              value={config.SINGLE_BET_MAX}
              label={'Single Bet Max'}
            />
            <NumberInput value={config.MAX_LIABILITY} label={'max liability'} />
            <NumberInput value={config.MIN_BALANCE} label={'min balance'} />
          </div>
          <Button>{!config.USE_MONEY ? 'Use Cash' : "Don't use Cash"}</Button>
          <Button>Start</Button>
          <Button>Update Config</Button>
        </Box>
      )}
    </>
  );
}

function NumberInput({ value, label }: { value: number; label: string }) {
  const placeholder = value;
  const [inputValue, setinputValue] = useState(String(placeholder));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setinputValue(e.target.value);
  };
  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
      }}
    >
      <span className="config-currency-sign">£</span>
      <input
        className="config-number-input"
        type="number"
        placeholder={String(placeholder)}
        value={inputValue}
        onChange={handleChange}
        min="1"
        max="1000"
      ></input>
      <label>
        <Typography padding={0.3} textTransform={'capitalize'}>
          {label}
        </Typography>
      </label>
    </div>
  );
}
