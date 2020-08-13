import * as base from "./base";

export interface IService {
  isLoggedIn: boolean;
  initialize(params: {
    terminalContainer: HTMLElement;
  }): void;
  signup(params: {
    name: string;
    password: string;
  }): base.PromisedEither<null>;
  login(params: {
    name: string;
    password: string;
  }): base.PromisedEither<string>;
  logout(): base.PromisedEither<null>;
}
