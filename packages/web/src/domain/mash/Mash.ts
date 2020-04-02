import { MashClient, Environment } from "mash";
import { Terminal } from "mash-term";
import { FileSystem } from "mash-filesystem";

import { IMash } from "../../types";
import { IContext } from "./types";
import { builtins } from "./builtins";
import { fixtureNodes } from "./fixtureNodes";

export class Mash implements IMash {
  constructor () {}

  initialize (container: HTMLElement) {
    const filesystem = FileSystem.bootstrap();
    filesystem.installNodes(filesystem.rootDirectory.id, fixtureNodes);

    const terminal = new Terminal(container, {
      prompt: "Eijis-MacBook-Pro ~ $ "
    });

    const environment = new Environment({
      onWriteln: terminal.writeln.bind(terminal),
    });

    const client = new MashClient<IContext>({
      environment,
      commandMap: builtins,
    });

    const context: IContext = {
      filesystem,
    };

    const msgs = [
      "Welcome to mash!",
      "We will be building this app together",
      "ganbarimasyou"
    ];
    const msgInterval = 200;

    for (let i = 0; i < msgs.length; i++) {
      const msg = msgs[i];
      setTimeout(() => {
        terminal.writeln(msg);
      }, i * msgInterval);
    }

    setTimeout(() => {
      terminal.prompt();
    }, msgs.length * msgInterval);

    terminal.onKeyPress((e: KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
          e.preventDefault();
          client.eval(terminal.textarea.value, context);
          terminal.prompt();
          break;
      }
    });
  }
}
