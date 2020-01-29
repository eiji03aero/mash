import { ApolloClient } from "apollo-client";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloLink, split, Operation } from "apollo-link";
import { withClientState } from "apollo-link-state";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

import { initialState, resolvers } from "./resolvers";

const cache = new InMemoryCache;

const stateLink = withClientState({
  cache,
  defaults: initialState,
  resolvers,
});

const httpLink = new HttpLink({
  uri: `http://${process.env.GRAPHQL_SERVER_HOST}/graphql`,
});

const wsLink = new WebSocketLink({
  uri: `ws://${process.env.GRAPHQL_SERVER_HOST}/graphql_ws`,
  options: {
    reconnect: true,
  },
});

const link = ApolloLink.from([
  stateLink,
  split(
    ({ query }: Operation) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition"
        && definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink,
  )
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
