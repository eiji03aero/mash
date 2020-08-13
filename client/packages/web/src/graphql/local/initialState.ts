import * as gen from "../gen";

type InitialState = {
  localState: gen.LocalState;
}

export const initialState: InitialState = {
  localState: {
    __typename: "LocalState",
    applicationState: gen.ApplicationState.Stopped
  }
};
