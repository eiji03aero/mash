import { Mash } from "./domain/mash";
import { Service } from "./service";

import { apolloClient } from "./adapters/graphql";
import { render } from "./adapters/ui";

document.addEventListener("DOMContentLoaded", () => {
  const mash = new Mash();
  const service = new Service(mash);

  const container = document.getElementById("app");
  if (!container) throw new Error("container not found with id app");

  render({
    service,
    apolloClient,
    container,
  });
});
