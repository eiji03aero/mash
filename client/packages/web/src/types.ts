import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import * as E from "fp-ts/lib/Either";

// -------------------- primitives --------------------
export type PromisedEither<T> = Promise<E.Either<Error, T>>;

export type CustomApolloClient = ApolloClient<NormalizedCacheObject>;

// -------------------- domain --------------------
export interface IMash {
  initialize(): void;
  read(promptStr: string): Promise<string>;
}

// -------------------- service --------------------
export interface IService {
  isLoggedIn: boolean;
  initialize(params: {
    terminalContainer: HTMLElement;
  }): void;
  signup(params: {
    name: string;
    password: string;
  }): PromisedEither<null>;
  login(params: {
    name: string;
    password: string;
  }): PromisedEither<string>;
  logout(): PromisedEither<null>;
}

// -------------------- proxy --------------------
export interface IProxy
  {
  signup(params: {
    name: string;
    password: string;
  }): PromisedEither<null>;
  login(params: {
    name: string;
    password: string;
  }): PromisedEither<string>;
  logout(): PromisedEither<null>;
}

export interface ILocalStore {
  getToken(): E.Either<null, string>;
  saveToken(token: string): void;
  clearToken(): void;
}
