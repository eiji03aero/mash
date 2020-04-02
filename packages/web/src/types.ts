import { ApolloClient } from "apollo-client";
import { NormalizedCacheObject } from "apollo-cache-inmemory";

export interface IMash {
  initialize(container: HTMLElement): void;
}

export interface IService {
  initialize(params: {
    terminalContainer: HTMLElement;
  }): void;
}

export type CustomApolloClient = ApolloClient<NormalizedCacheObject>;
