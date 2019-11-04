import { text } from 'mash-common';
import { IConfig } from '../Types';

export const defaultConfig: IConfig = {
  prompt: [] as text.row,
  terminalBg: '#182F40',
  textWhite: '#FFFFFF',
  fontFamily: 'Menlo',
  fontSize: 16,
  rowTopMargin: 8,
  rowLeftMargin: 4,
  rowRightMargin: 4
};

export const getConfig = (config: any): IConfig => {
  return Object.assign({}, defaultConfig, config);
};
