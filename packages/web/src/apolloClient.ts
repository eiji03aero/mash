import { ApolloClient } from "apollo-client";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { withClientState } from "apollo-link-state";

import { initialState, resolvers } from "./resolvers";

const cache = new InMemoryCache;

const stateLink = withClientState({
  cache,
  defaults: initialState,
  resolvers,
});

const httpLink = new HttpLink({
  uri: `http://${process.env.SERVER_HOST}/graphql`,
});

const link = ApolloLink.from([
  stateLink,
  httpLink,
]);

export const client = new ApolloClient<NormalizedCacheObject>({
  cache,
  link,
});

client.onResetStore(() => {
  stateLink.writeDefaults();
  // returning promise in favor of onResetStore's signature
  return Promise.resolve();
});
