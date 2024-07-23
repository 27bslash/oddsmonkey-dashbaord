import { ElectronHandler } from '../../../../python/oddsmonkey-d/src/main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
  }
}


export {};
