import { Button } from '@mui/material';
import { SetStateAction, useState } from 'react';
import DeleteOverlay from './deleteOverlay';
import { BData } from '../../../../../../types';
type DeleteProps = {
  setDeleteOverlay: React.Dispatch<SetStateAction<boolean>>;
  data: BData;
};
const Delete = ({ data, setDeleteOverlay }: DeleteProps) => {
  const [overlay, setOverlay] = useState(false);
  const handleClick = () => {
    console.log('delete');
    setDeleteOverlay((prev) => !prev);
  };
  return (
    <>
      {
        <DeleteOverlay
          data={data}
          setOverlay={setDeleteOverlay}
        ></DeleteOverlay>
      }
    </>
  );
};
export default Delete;
