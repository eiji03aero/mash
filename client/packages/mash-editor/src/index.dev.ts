import { render } from "./adapters/ui";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("app");
  if (!container) {
    throw new Error("container not found");
  }

  render({
    container,
  });
});
