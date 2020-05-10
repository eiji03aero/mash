import { Service } from "./service";
import { Proxy } from "./adapters/proxy";
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

  const proxy = new Proxy({
    apolloClient,
  });

  const service = new Service({
    proxy,
  });

  const container = document.getElementById("app");
  if (!container) throw new Error("container not found with id app");

  render({
    service,
    apolloClient,
    container,
  });
});
