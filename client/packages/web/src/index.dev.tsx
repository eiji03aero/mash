import { Service } from "./service";
import { Proxy } from "./adapters/proxy";
import { LocalStore } from "./adapters/localStore";

import { createApolloClient } from "./graphql";
import { render } from "./adapters/ui";

document.addEventListener("DOMContentLoaded", () => {
  const localStore = new LocalStore();

  const apolloClient = createApolloClient({
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
