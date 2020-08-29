import React from "react";
import * as _ from "lodash";

type SetParams<T> = Partial<T>;
type StateSetter<T> = (p: SetParams<T>) => void;
type HooksValue<T> = [T, StateSetter<T>];

export const useCompositeState = <T>(initialState: T): HooksValue<T> => {
  const [state, _setState] = React.useState<T>(initialState);
  const setState = (nextState: SetParams<T>) => {
    _setState(_.merge<T, T, Partial<T>>({} as T, state, nextState));
  };
  return [state, setState];
};
