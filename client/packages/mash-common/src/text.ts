import _ from "lodash";
import {
  Row,
  ITextObject,
  colorNameMap,
  colorCodeMap,
  ColorName,
  ColorCode,
} from "./types";

export const hideToken = "\\[";
export const colorSequenceToken = "\\e[";
export const colorSequenceCodeRegExp = /\\e\[(.+)m/;
export const stripHideCharacterRegExp = /\\\[.*\\\[/g;

export const hideCharacters = (str: string): string => {
  return hideToken + str + hideToken;
};

export const stripHideCharacters = (str: string): string => {
  return _.chain(str)
    .split(hideToken)
    .filter((_: string, idx: number) => {
      return idx % 2 === 0;
    })
    .join("")
    .value();
};

export const colorSequence = _.mapValues(colorNameMap, (c: string): string => {
  return hideCharacters(`${colorSequenceToken}${c}m`);
});

export const getColorFromCode = (code: ColorCode): ColorName => {
  const name = colorCodeMap[code];
  return name
    ? name as ColorName
    : "reset";
};

export const parseColorString = (str: string): Row => {
  const result = _.chain(str)
    // split the string with hideToken => [text, sequence, text, sequence ...]
    .split(hideToken)
    // deal with the first pair => [sequence, text, sequence, text ...]
    .thru((t: string[]) => {
      // if first element is empty, the string is starting with sequence, so pop the first
      // if not, make up sequence for the first
      return t[0] === ""
        ? t.slice(1)
        : [""].concat(t);
    })
    // chunk every two => [[sequence, text], [sequence, text] ...]
    .chunk(2)
    // turn the array into Row => Row
    .map<ITextObject>((t: string[]): ITextObject => {
      const sequence = t[0];
      const text = t[1] || "";
      const numMatch = sequence.match(colorSequenceCodeRegExp);
      const num = !!numMatch && typeof numMatch[1] === "string"
        ? numMatch[1]
        : colorNameMap.reset;
      const color = getColorFromCode(num);
      return { text, color };
    })
    .value();

  return result;
};

export const NewLineRegexp =  /(\r\n|\n)/g;

export const splitByNewLine = (text: string) => {
  return text.split(NewLineRegexp);
};
