import { Terminal } from "../../src/Terminal";
import { ITerminal } from "../../src/types";

export const hasTerminal = (): {terminal: ITerminal} => {
  const containerDOM = document.createElement("div");
  containerDOM.setAttribute(
    "style",
    "width: 600px; height: 400px;"
  );

  const terminal = new Terminal(containerDOM);

  return { terminal };
};
