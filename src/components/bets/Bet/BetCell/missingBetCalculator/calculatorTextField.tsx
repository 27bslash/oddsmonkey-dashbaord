import { TextField } from '@mui/material';
type CalculatorTextFieldProps = {
  bg: string;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  label: string;
};
const CalculatorTextField = ({
  bg,
  value,
  setValue,
  label,
}: CalculatorTextFieldProps) => {
  return (
    <TextField
      onChange={(e) => {
        const inputValue = +(+e.target.value).toFixed(2);

        setValue(inputValue);
      }}
      value={value}
      inputMode="numeric"
      type="number"
      sx={{ background: bg, width: '49%', marginBottom: '10px' }}
      label={label}
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
    // <TextField
    //   onChange={(e) => {
    //     const inputValue = e.target.value;
    //     // Allow empty string for clearing the field
    //     setValue(inputValue === '' ? '' : +inputValue);
    //   }}
    //   value={value === 0 ? '' : value} // Show an empty string instead of 0 when field is cleared
    //   inputMode="numeric"
    //   type="number"
    //   sx={{ background: bg['100'] }}
    //   label={label}
    //   inputProps={{ step: 0.1 }}
    // />
  );
};
export default CalculatorTextField;
