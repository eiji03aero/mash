import { Either, EitherLeft, EitherRight } from '../types';
import *  as Errors from '../Errors';

export const either = {
  left (err: Errors.Base): EitherLeft {
    return { isError: true, error: err };
  },
  right<T = any> (value: T): EitherRight<T> {
    return { isError: false, value: value };
  },
  isLeft (e: Either): e is EitherLeft {
    return e.isError;
  },
  isRight<T = any> (e: Either): e is EitherRight<T> {
    return !e.isError;
  }
};
