import { Service } from "./service";
import * as repos from "./adapters/repositories";
import { LocalStore } from "./adapters/localStore";

import { createApolloClient } from "./graphql";
import { render } from "./adapters/ui";

document.addEventListener("DOMContentLoaded", () => {
  const localStore = new LocalStore();

  const apolloClient = createApolloClient({
    // enforce the value to be string by concatenating string
    httpURL: "" + process.env.GRAPHQL_SERVER_HTTP_URL,
    websocketURL: "" + process.env.GRAPHQL_SERVER_WS_URL,
    localStore,
  });

  const localStateRepository = new repos.LocalStateRepository({
    apolloClient,
  });
  const authRepository = new repos.AuthRepository({
    apolloClient,
  });

  const service = new Service({
    localStateRepository,
    authRepository,
  });

  const container = document.getElementById("app");
  if (!container) throw new Error("container not found with id app");

  render({
    service,
    apolloClient,
    container,
  });
});
