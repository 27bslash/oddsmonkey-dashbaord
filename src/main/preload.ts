// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    fetchItems: (collection_name: string) =>
      ipcRenderer.invoke('fetch-items', collection_name),
    addItem: (item: any, collection_name: string) =>
      ipcRenderer.invoke('add-item', item, collection_name),
    updateItem: ({
      collectionName,
      query, 
      update,
    }: {
      collectionName: string;
      query: { [key: string]: any };
      update: { [key: string]: any };
    }) => ipcRenderer.invoke('update-document',{ collectionName, query, update}),
    onDataFetched: (callback: (data: any) => void) =>
      ipcRenderer.on('pending_bets-fetched', (_event, data) => {
        return callback(data);
      }),
    onBalanceFetched: (callback: (data: any) => void) =>
      ipcRenderer.on('balance-fetched', (_event, data) => {
        return callback(data);
      }),
    onConfigFetched: (callback: (data: any) => void) =>
      ipcRenderer.on('config-fetched', (_event, data) => {
        return callback(data);
      }),
    onHeartbeatFetched: (callback: (data: any) => void) =>
      ipcRenderer.on('heartbeat-fetched', (_event, data) => {
        return callback(data);
      }),
  },
};
contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
