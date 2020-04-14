import { ApolloClient } from "apollo-client";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import * as E from "fp-ts/lib/Either";

export interface IMash {
  initialize(): void;
  read(promptStr: string): Promise<string>;
}

export interface IService {
  initialize(params: {
    terminalContainer: HTMLElement;
  }): void;
}

export type CustomApolloClient = ApolloClient<NormalizedCacheObject>;

export interface IProxy {
  signup(params: {
    name: string;
    password: string;
  }): Promise<E.Either<Error, null>>;
}
