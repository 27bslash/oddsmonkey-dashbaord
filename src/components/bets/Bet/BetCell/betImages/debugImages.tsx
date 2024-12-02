import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { BData } from '../../../../../../types';

import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import DebugImage from './debugImage';
type DebugImagesProps = {
  data: BData;
};
const DebugImages = ({ data }: DebugImagesProps) => {
  const [open, setOpen] = useState(false);
  const [dates, setDates] = useState<{ [key: string]: number[] }>({
    back: [],
    lay: [],
  });
  //   const handleClick = () => {
  //     console.log('clik');
  //     const basePath =
  //       'D:\\projects\\python\\odds_monkey_bot\\dist\\logs\\screenshots';
  //     const preSubmitPath = `${basePath}\\pre_submit`;
  //     const submitted = `${basePath}\\submitted`;
  //     const matched = `${basePath}\\matched`;
  //     const obj: any = {};
  //     const GetBetScreenshots = async () => {
  //       const mapped = await Promise.all(
  //         ['smarkets', 'betfair']
  //           .map(async (x) => {
  //             const preSubmittedImages =
  //               await window.electron.ipcRenderer.getAllImages(
  //                 `${preSubmitPath}\\${x}`,
  //               );
  //             const SubmittedImages =
  //               await window.electron.ipcRenderer.getAllImages(
  //                 `${submitted}\\${x}`,
  //               );
  //             const matchedImages =
  //               await window.electron.ipcRenderer.getAllImages(
  //                 `${matched}\\${x}`,
  //               );
  //             obj[x] = { preSubmittedImages, SubmittedImages, matchedImages };
  //             return {
  //               [x]: { preSubmittedImages, SubmittedImages, matchedImages },
  //             };
  //           })
  //           .flat(),
  //       );
  //       console.log(mapped);
  //       mapped.filter((x) =>
  //         x.smarkets.matchedImages.filter((s: string) => {
  //           return s;
  //         }),
  //       );
  //     };
  //     GetBetScreenshots();
  //   };

  useEffect(() => {
    const backDates: number[] = [];
    const layDates: number[] = [];
    data.bet_profit.back_matched.forEach((matchObj) => {
      const targetDate = matchObj.bet_matched_time
        ? matchObj.bet_matched_time
        : data.bet_info.bet_unix_time;
      backDates.push(targetDate);
    });
    data.bet_profit.exchange_matched.forEach((matchObj) => {
      const targetDate = matchObj.bet_matched_time
        ? matchObj.bet_matched_time
        : data.bet_info.bet_unix_time;

      layDates.push(targetDate);
    });
    setDates({ back: backDates, lay: layDates });
  }, []);
  return (
    <>
      <Button onClick={() => setOpen((prev) => !prev)} variant="contained">
        Show Images
      </Button>
      {open && (
        <>
          {dates.back.map((date, i) => (
            <DebugImage
              key={`back-${date}-${i}`} // Always add a `key` when mapping over arrays
              targetDate={date}
              betName={data.bet_info.bet}
              site={data.bet_info.bookmaker}
            />
          ))}
          {dates.lay.map((date, i) => (
            <DebugImage
              key={`lay-${date}-${i}`} // Unique `key` for each item
              targetDate={date}
              betName={data.bet_info.bet}
              site={data.bet_info.exchange}
            />
          ))}
        </>
      )}
    </>
  );
};

export default DebugImages;
