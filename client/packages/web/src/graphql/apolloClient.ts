import { ApolloClient, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { createLink } from "./link";

import { CustomApolloClient } from "../types";
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
  });

  return apolloClient;
};
