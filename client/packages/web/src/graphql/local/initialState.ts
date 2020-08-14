import * as gen from "../gen";

type InitialState = {
  localState: gen.LocalState;
}

export const initialState: InitialState = {
  localState: {
    __typename: "LocalState",
    username: "guest",
    applicationState: gen.ApplicationState.Stopped
  }
};

export const mergeLocalState = (
  ls: gen.LocalState,
  lsPartial: Partial<gen.LocalState>
): gen.LocalState => {
  const base = {
    __typename: "LocalState",
  };
  return Object.assign(base, ls, lsPartial);
};
