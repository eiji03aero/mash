import { ApolloLink, split, Operation } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { onError } from "apollo-link-error";
import { setContext } from  "apollo-link-context";
import { getMainDefinition } from "apollo-utilities";
import * as E from "fp-ts/lib/Either";

import { ILocalStore } from "../types";

export const createLink = (params: {
  httpURL: string;
  websocketURL: string;
  localStore: ILocalStore;
}): ApolloLink => {
  const httpLink = new HttpLink({
    uri: params.httpURL,
  });

  const wsLink = new WebSocketLink({
    uri: params.websocketURL,
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
      console.log("[Network error]:", networkError);
    }
  });

  const authLink = setContext((_, { headers }) => {
    const opts = {
      headers: Object.assign({}, headers)
    };

    const r1 = params.localStore.getToken();
    if (E.isRight(r1)) {
      opts.headers.Authentication = `Bearer ${r1.right}`;
    }

    return opts;
  });

  const link = ApolloLink.from([
    errorLink,
    authLink,
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
    ),
  ]);

  return link;
};