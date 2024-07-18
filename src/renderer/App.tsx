import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import Bets from '../components/bets/bets';
import { useEffect, useState } from 'react';
import { BData, BetType } from '../../types';
import AppContextProvider from './useAppContext';
import { Config } from '../components/config/config';

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}
type Balance = {
  smarkets: number;
  betfair: number;
};
function Hello() {
  const [allBets, setAllBets] = useState<BData[]>();
  const [k, setK] = useState<keyof BData>('bet_info');
  const [orderBy, setOrderBy] = useState<keyof BetType>('bet_unix_time');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [balance, setBalance] = useState({ smarkets: 0, betfair: 0 });

  const updateAllBets = (arr: BData[]) => {
    console.log(arr[0].bet_info.event_name);
    setAllBets([...arr]);
  };

  useEffect(() => {
    const handleDataFetched = (fetchedData: BData[]) => {
      //   const flattenedBets = fetchedData.map((bet) => flat(bet, {}));
      //   const sorted = sortBets(shuffled, k);
      //   console.log(k, orderBy, sortDirection, 'test');
      setAllBets(shuffleArray([...fetchedData]));

      //   const filteredData = fetchedData.filter((x) => {
      //     return x.bet_info.unix_time > new Date().getTime() / 1000;
      //   });
      //   setFilteredBets(filteredData);
    };
    window.electron.ipcRenderer.onDataFetched(handleDataFetched);
    const handleBalance = (d: Balance[]) => {
      setBalance({ smarkets: d[0].smarkets, betfair: d[0].betfair });
    };
    window.electron.ipcRenderer.onBalanceFetched(handleBalance);

    return () => {
      window.electron.ipcRenderer.onDataFetched(() => {});
    };
  }, []);
  const value = {
    allBets,
    k,
    orderBy,
    setK,
    setOrderBy,
    balance,
    sortDirection,
    setSortDirection,
    setAllBets,
    updateAllBets,
  };

  return (
    <AppContextProvider value={value}>
      <>
        {allBets && (
          <>
            <Config />
            <Bets />
          </>
        )}
      </>
    </AppContextProvider>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
