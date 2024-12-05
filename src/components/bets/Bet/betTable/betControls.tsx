import { Button } from '@mui/material';
import { useState } from 'react';
import { BData } from '../../../../../types';
import { ObjectId } from 'mongodb';
import DebugImages from '../BetCell/betImages/debugImages';
import DeleteOverlay from '../BetCell/delete/deleteOverlay';
import BetCalculator from '../BetCell/missingBetCalculator/betCalculator';
import DeleteIcon from '@mui/icons-material/Delete';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';

type BetControlsProps = {
  bet: BData;
  deleteBet: (_id: ObjectId) => void;
};

const BetControls = ({ bet, deleteBet }: BetControlsProps) => {
  const [showBetCalc, setShowBetCalc] = useState(false);
  const [deleteOverlay, setDeleteOverlay] = useState(false);

  const isRecentBet = Date.now() / 1000 - bet.bet_info.bet_unix_time < 300;

  return (
    <>
      {isRecentBet && (
        <Button
          disabled
          variant="contained"
          sx={{
            background:
              'linear-gradient(200.96deg,#fedc2a -29.09%,#dd5789 51.77%,#7a2c9e 129.35%)',
            color: 'white !important',
            border: 'solid 1px black',
            marginLeft: '10px',
          }}
        >
          new bet
        </Button>
      )}
      <IconWrapper
        icon={
          <CalculateOutlinedIcon
            sx={{ padding: '5px' }}
            className="icon"
            color="success"
          />
        }
        overlayBool={showBetCalc}
        setOverlayBool={setShowBetCalc}
        overlayComponent={
          <BetCalculator setShowBetCalc={setShowBetCalc} data={bet} />
        }
      />
      <IconWrapper
        icon={
          <DeleteIcon sx={{ padding: '5px' }} className="icon" color="error" />
        }
        overlayBool={deleteOverlay}
        setOverlayBool={setDeleteOverlay}
        overlayComponent={
          <DeleteOverlay
            bet={bet}
            setOverlay={setDeleteOverlay} 
            deleteBet={deleteBet}
          />
        }
      />
      <DebugImages data={bet} />
    </>
  );
};

type IconWrapperProps = {
  icon: React.ReactNode;
  overlayBool: boolean;
  setOverlayBool: React.Dispatch<React.SetStateAction<boolean>>;
  overlayComponent: React.ReactNode;
};

const IconWrapper = ({
  icon,
  overlayBool,
  setOverlayBool,
  overlayComponent,
}: IconWrapperProps) => (
  <>
    <div onClick={() => setOverlayBool((prev) => !prev)}>{icon}</div>
    {overlayBool && (
      <div
        className="wrapper"
        onMouseDown={(e) =>
          e.target === e.currentTarget && setOverlayBool(false)
        }
        onKeyDown={(e) => e.key === 'Escape' && setOverlayBool(false)}
      >
        {overlayComponent}
      </div>
    )}
  </>
);

export default BetControls;
