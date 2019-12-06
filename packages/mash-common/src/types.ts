import * as Errors from './Errors';

export type EitherLeft = {
  isError: true,
  error: Errors.Base
}

export type EitherRight<T = any> = {
  isError: false,
  value: T
}

export type Either<T = any> = EitherLeft | EitherRight<T>;
