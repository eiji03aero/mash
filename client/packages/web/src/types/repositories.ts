import * as base from "./base";
import { gen } from "../graphql";

export interface IAuthRepository {
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

export interface ILocalStateRepository {
  get(): base.PromisedEither<gen.LocalState>;
  update(params: Partial<gen.LocalState>): base.PromisedEither<null>;
}
