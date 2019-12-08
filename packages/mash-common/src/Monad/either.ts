import * as Errors from "../Errors";
import { Either, IEitherLeft, IEitherRight } from "../types";

export const either = {
  left(err: Errors.Base): IEitherLeft {
    return { isError: true, error: err };
  },
  right<T = any>(value: T): IEitherRight<T> {
    return { isError: false, value };
  },
  isLeft(e: Either): e is IEitherLeft {
    return e.isError;
  },
  isRight<T = any>(e: Either): e is IEitherRight<T> {
    return !e.isError;
  },
};
