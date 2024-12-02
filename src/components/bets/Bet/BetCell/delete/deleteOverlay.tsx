import { TextField } from '@mui/material';
import { SetStateAction, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { BData } from '../../../../../../types';
type DeleteOverlayProps = {
  data: BData;
  setOverlay: React.Dispatch<SetStateAction<boolean>>;
};
const DeleteOverlay = ({ data, setOverlay }: DeleteOverlayProps) => {
  const handleChange = () => {};
  const [value, setValue] = useState<string | number>(0);
  const handleDelete = () => {
    console.log(value);
    window.electron.ipcRenderer.deleteEntry(data._id, +value);
    setOverlay(false);
  };
  const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleDelete();
    }
  };
  return (
    <div
      style={{
        zIndex: 99,
        width: '400px',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'sticky',
        top: '260px',
        padding: '10px',
        backgroundColor: '#ff8c00',
        border: 'solid 3px black',
        borderRadius: '5px',
      }}
    >
      <TextField
        onChange={(e) => {
          const inputValue = e.target.value;
          if (/^-?\d*\.?\d*$/.test(inputValue)) {
            setValue(inputValue);
          }
        }}
        onBlur={() => {
          setValue((prev) => (prev === '' || prev === '-' ? 0 : +prev));
        }}
        onKeyDown={handleKeypress}
        value={value}
        inputMode="numeric"
        type="number"
        sx={{ background: 'white', marginBottom: '10px' }}
        label={'profit'}
        inputProps={{ step: 0.01 }}
        InputLabelProps={{
          style: {
            color: 'black',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            textTransform: 'capitalize',
          },
        }}
      ></TextField>
      <DeleteForeverIcon
        className="icon"
        onClick={() => handleDelete()}
      ></DeleteForeverIcon>
    </div>
  );
};
export default DeleteOverlay;
/* DO MA */
