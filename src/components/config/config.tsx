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
  const [running, setRunning] = useState(false);
  const [query, setQuery] = useState({});
  const [update, setUpdate] = useState({});
  const [status, setStatus] = useState('');

  const handleUpdate = async (
    updateType: 'updateRunningState' | 'updateConfig',
  ) => {
    try {
      let updateObj = {
        collectionName: 'config',
        query: {},
        update: { $set: update },
      };
      if (updateType === 'updateRunningState') {
        updateObj = {
          collectionName: 'config',
          query: {},
          update: { $set: { FORCE_STOP: running } },
        };
        setRunning(!running);
      }
      const modifiedCount =
        await window.electron.ipcRenderer.updateItem(updateObj);

      setStatus(`Modified ${modifiedCount} documents.`);
      console.log(query, update, status);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };
  useEffect(() => {
    const handleConfigFetched = (fetchedData: any) => {
      setConfig(fetchedData[0]);
    };
    const handleHeartbeat = (fetchedData: any) => {
      const last_active =
        new Date().getTime() / 1000 - fetchedData[0].last_active < 15;
      setRunning(last_active);
      console.log(fetchedData[0].last_active, last_active);
    };
    window.electron.ipcRenderer.onConfigFetched(handleConfigFetched);
    window.electron.ipcRenderer.onHeartbeatFetched(handleHeartbeat);

    return () => {
      window.electron.ipcRenderer.onConfigFetched(() => {});
      window.electron.ipcRenderer.onHeartbeatFetched(() => {});
    };
  }, []);
  return (
    <>
      {config && (
        <Box
          padding={2}
          //   border={'solid 1px black'}
          //   borderRadius={'3px'}
          bgcolor={'inherit'}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <NumberInput
              value={config.SINGLE_BET_MAX}
              label={'Single Bet Max'}
              setUpdate={setUpdate}
            />
            <NumberInput
              value={config.MAX_LIABILITY}
              label={'max liability'}
              setUpdate={setUpdate}
            />
            <NumberInput
              value={config.MIN_BALANCE}
              label={'min balance'}
              setUpdate={setUpdate}
            />
          </div>
          {/* <Button
            variant="contained"
            style={{ marginRight: '10px', marginBottom: '10px' }}
          >
            {!config.USE_MONEY ? 'Use Cash' : "Don't use Cash"}
          </Button> */}
          {/* <br></br> */}
          <div style={{ display: 'flex' }}>
            <Button
              onClick={() => handleUpdate('updateConfig')}
              variant="contained"
              style={{
                marginRight: '10px',
                marginBottom: '10px',
                textWrap: 'nowrap',
              }}
            >
              Update Config
            </Button>
            <Button
              onClick={() => handleUpdate('updateRunningState')}
              variant="contained"
              style={{ marginRight: '10px', marginBottom: '10px' }}
              color={!running ? 'success' : 'error'}
            >
              {running ? 'Stop' : 'Start'}
            </Button>
          </div>
        </Box>
      )}
    </>
  );
}

function NumberInput({
  value,
  label,
  setUpdate,
}: {
  value: number;
  label: string;
  setUpdate: React.Dispatch<React.SetStateAction<any>>;
}) {
  const placeholder = value;
  const [inputValue, setinputValue] = useState(String(placeholder));
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setinputValue(e.target.value);
    const labelText = e.target.nextSibling?.textContent
      ?.toUpperCase()
      .replace(/\s/g, '_');
    if (!labelText) {
      return;
    }
    setUpdate((prev: any) => ({ ...prev, [labelText]: +e.target.value }));
  };
  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        marginLeft: '10px',
        // fontSize: '20px',
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
        style={{ fontSize: '20px', padding: '5px' }}
        step={5}
      ></input>
      <label>
        <Typography padding={0.3} textTransform={'capitalize'}>
          {label}
        </Typography>
      </label>
    </div>
  );
}
