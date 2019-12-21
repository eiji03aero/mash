import { Terminal } from "../../src/Terminal";

export const hasTerminal = () => {
  const containerDOM = document.createElement("div");
  containerDOM.setAttribute(
    "style",
    "width: 600px; height: 400px;"
  );

  const terminal = new Terminal(containerDOM);

  return { terminal };
};
