import { ApolloClient } from "apollo-client";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { Either } from "mash-common";

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
  }): Promise<Either>;
}
