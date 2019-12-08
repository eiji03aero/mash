import * as Errors from "./Errors";

export interface IEitherLeft {
  isError: true;
  error: Errors.Base;
}

export interface IEitherRight<T = any> {
  isError: false;
  value: T;
}

export type Either<T = any> = IEitherLeft | IEitherRight<T>;
