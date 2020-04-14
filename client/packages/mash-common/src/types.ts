import _ from "lodash";

export interface ITextObject {
  text: string;
  color?: string;
}

export type Row = ITextObject[];
export type Rows = Row[];

export const colorNameMap = {
  reset: "00",
  black: "0;30",
  red: "0;31",
  green: "0;32",
  yellow: "0;33",
  blue: "0;34",
  magenta: "0;35",
  cyan: "0;36",
  lightGray: "0;37",
  darkGray: "1;30",
  lightRed: "1;31",
  lightGreen: "1;32",
  lightYellow: "1;33",
  lightBlue: "1;34",
  lightMagenta: "1;35",
  lightCyan: "1;36",
  white: "1;37",
  bgBlack: "40",
  bgRed: "41",
  bgGreen: "42",
  bgYellow: "43",
  bgBlue: "44",
  bgMagenta: "45",
  bgCyan: "46",
  bgWhite: "47",
};
export const colorCodeMap = _.invert(colorNameMap);

export type ColorName = keyof typeof colorNameMap;
export type ColorCode = string;
