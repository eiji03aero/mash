import { text } from 'mash-common';

export interface Config {
  prompt: text.TextObject[];
}

export const defaultConfig: Config = {
  prompt: [] as text.TextObject[],
};

export const getConfig = (config: Config): Config => {
  return Object.assign({}, defaultConfig, config);
};
