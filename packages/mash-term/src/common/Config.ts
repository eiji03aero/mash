import { text } from 'mash-common';
import { IConfig } from '../Types';

export const defaultConfig: IConfig = {
  prompt: [] as text.row,
  cursorInitialPauseMs: 2000,
  cursorIntervalMs: 500,
  terminalBg: '#182F40',
  cursorBg: '#396FE2',
  textWhite: '#FFFFFF',
  fontFamily: 'Menlo',
  fontSize: 16,
  rowTopMargin: 4,
  rowBottomMargin: 4,
  rowLeftMargin: 8,
  rowRightMargin: 8
};

export const getConfig = (config: any): IConfig => {
  return Object.assign({}, defaultConfig, config);
};