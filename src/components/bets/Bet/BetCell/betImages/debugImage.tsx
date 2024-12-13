import { useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
type ImageProps = {
  targetDate: number;
  betName: string;
  site: 'smarkets' | 'betfair' | 'betconnect';
};
const DebugImage = ({ targetDate, betName, site }: ImageProps) => {
  const betMonth = new Date(targetDate * 1000).toLocaleDateString('en-uk', {
    month: 'short',
  });
  const basePath =
    'D:\\projects\\python\\odds_monkey_bot\\dist\\logs\\screenshots';
  const targetImage = `${site}\\${betMonth}\\${betName}_${targetDate}.png`;
  return ['pre_submit', 'matched'].map((s) => {
    const path = `${basePath}\\${s}\\${targetImage}`.replace(/\\/g, '/');
    return <IndividualImage path={path}></IndividualImage>;
  });
};
const IndividualImage = ({ path }: { path: string }) => {
  const [showImage, setShowImage] = useState(true);

  return showImage ? (
    <Zoom zoomMargin={4}>
      <img
        src={`media:///${path}`}
        width={900}
        style={{ width: '100%', height: 'auto' }}
        onError={() => setShowImage(false)}
        // onMouseOver={(e) => (e.target.style.transform = 'scale(2.5)')}
        // onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
      />
    </Zoom>
  ) : (
    <></>
  );
};
export default DebugImage;
