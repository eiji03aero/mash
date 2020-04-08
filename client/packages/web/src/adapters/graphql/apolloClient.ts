import { ApolloClient } from "apollo-client";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloLink, split, Operation } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { onError } from "apollo-link-error";
import { getMainDefinition } from "apollo-utilities";

import { CustomApolloClient } from "../../types";
import { initialState, resolvers } from "./resolvers";

const cache = new InMemoryCache;

const httpLink = new HttpLink({
  uri: `http://${process.env.GRAPHQL_SERVER_HOST}/graphql`,
});

const wsLink = new WebSocketLink({
  uri: `ws://${process.env.GRAPHQL_SERVER_HOST}/graphql`,
  options: {
    reconnect: true,
  },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log("[GraphQL error]:", { message, locations, path });
    });
  }
  if (networkError) {
    console.log("[Network error]: ", networkError);
  }
});

const link = ApolloLink.from([
  errorLink,
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

export const apolloClient: CustomApolloClient = new ApolloClient<NormalizedCacheObject>({
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
