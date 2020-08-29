import { ApolloClient, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { createLink } from "./link";
import * as gen from "./gen";
import { initialState } from "./local";

import { ILocalStore, CustomApolloClient } from "../types";

export const createApolloClient = (params: {
  httpURL: string;
  websocketURL: string;
  localStore: ILocalStore;
}): CustomApolloClient => {
  const cache = new InMemoryCache;

  const link = createLink({
    httpURL: params.httpURL,
    websocketURL: params.websocketURL,
    localStore: params.localStore,
  });

  const apolloClient: CustomApolloClient = new ApolloClient<NormalizedCacheObject>({
    cache,
    link,
  });

  const writeInitialState = () => {
    apolloClient.writeQuery({
      query: gen.GetLocalStateDocument,
      data: initialState,
    });
  };

  writeInitialState();

  apolloClient.onResetStore(() => {
    writeInitialState();
    return Promise.resolve();
  });

  return apolloClient;
};
