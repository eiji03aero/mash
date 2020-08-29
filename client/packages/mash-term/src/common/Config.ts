import { IConfig } from "../types";

export const defaultConfig: IConfig = {
  prompt: "",
  cursorInitialPauseMs: 1000,
  cursorIntervalMs: 500,
  terminalBg: "#182F40",
  cursorBg: "#396FE2",
  textWhite: "#FFFFFF",
  textBlue: "#396FE2",
  textYellow: "#FAED70",
  fontFamily: "Menlo",
  fontSize: 16,
  rowTopMargin: 4,
  rowBottomMargin: 4,
  rowLeftMargin: 8,
  rowRightMargin: 8,
};

export const getConfig = (config: Partial<IConfig>): IConfig => {
  return Object.assign({}, defaultConfig, config);
};
