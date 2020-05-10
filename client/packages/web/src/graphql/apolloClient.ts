import { ApolloClient } from "apollo-client";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { createLink } from "./link";

import { CustomApolloClient } from "../types";
import { initialState, resolvers } from "./resolvers";
import { ILocalStore } from "../types";

export const createApolloClient = (params: {
  httpURL: string;
  websocketURL: string;
  localStore: ILocalStore;
}) => {
  const cache = new InMemoryCache;

  const link = createLink({
    httpURL: params.httpURL,
    websocketURL: params.websocketURL,
    localStore: params.localStore,
  });

  const apolloClient: CustomApolloClient = new ApolloClient<NormalizedCacheObject>({
    cache,
    link,
    resolvers,
  });

  cache.writeData({ data: initialState });

  apolloClient.onResetStore(() => {
    cache.writeData({ data: initialState });
    // returning promise in favor of onResetStore's signature
    return Promise.resolve();
  });

  return apolloClient;
};
