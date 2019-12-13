import _ from "lodash";
import * as Errors from "./Errors";
export interface IEitherLeft {
    isError: true;
    error: Errors.Base;
}
export interface IEitherRight<T = any> {
    isError: false;
    value: T;
}
export declare type Either<T = any> = IEitherLeft | IEitherRight<T>;
export interface ITextObject {
    text: string;
    color?: string;
}
export declare type Row = ITextObject[];
export declare type Rows = Row[];
export declare const colorNameMap: {
    reset: string;
    black: string;
    red: string;
    green: string;
    yellow: string;
    blue: string;
    magenta: string;
    cyan: string;
    lightGray: string;
    darkGray: string;
    lightRed: string;
    lightGreen: string;
    lightYellow: string;
    lightBlue: string;
    lightMagenta: string;
    lightCyan: string;
    white: string;
    bgBlack: string;
    bgRed: string;
    bgGreen: string;
    bgYellow: string;
    bgBlue: string;
    bgMagenta: string;
    bgCyan: string;
    bgWhite: string;
};
export declare const colorCodeMap: _.Dictionary<string>;
export declare type ColorName = keyof typeof colorNameMap;
export declare type ColorCode = string;
//# sourceMappingURL=types.d.ts.map