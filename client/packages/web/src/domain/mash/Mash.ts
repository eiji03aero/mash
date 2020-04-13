import { MashClient, Environment, IMashClient, IEnvironment } from "mash";
import { Terminal, ITerminal } from "mash-term";
import { FileSystem, IFileSystem } from "mash-filesystem";

import { IMash, IProxy } from "../../types";
import { IContext } from "./types";
import { builtins } from "./builtins";
import { fixtureNodes } from "./fixtureNodes";

export class Mash implements IMash {
  private _filesystem: IFileSystem;
  private _terminal: ITerminal;
  private _environment: IEnvironment;
  private _client: IMashClient<IContext>;
  private _proxy: IProxy;

  constructor (params: {
    proxy: IProxy;
    terminalContainer: HTMLElement;
  }) {
    const filesystem = FileSystem.bootstrap();
    const terminal = new Terminal(params.terminalContainer, {
      prompt: "Eijis-MacBook-Pro ~ $ "
    });

    const environment = new Environment({
      onWriteln: terminal.writeln.bind(terminal),
    });

    const client = new MashClient<IContext>({
      environment,
      commandMap: builtins,
    });

    this._filesystem = filesystem;
    this._terminal = terminal;
    this._environment = environment;
    this._client = client;
    this._proxy = params.proxy;

    // Bind methods
    this.read = this.read.bind(this);
    this._onKeyPressHandler = this._onKeyPressHandler.bind(this);

    this._filesystem
    this._terminal
    this._environment
    this._client
  }

  get context (): IContext {
    return {
      filesystem: this._filesystem,
      terminal: this._terminal,
      proxy: this._proxy,
      read: this.read,
    };
  }

  initialize () {
    this._filesystem.installNodes(this._filesystem.rootDirectory.id, fixtureNodes);

    const msgs = [
      "Welcome to mash!",
      "We will be building this app together",
      "ganbarimasyou"
    ];
    const msgInterval = 200;

    for (let i = 0; i < msgs.length; i++) {
      const msg = msgs[i];
      setTimeout(() => {
        this._terminal.writeln(msg);
      }, i * msgInterval);
    }

    setTimeout(() => {
      this._terminal.prompt();
    }, msgs.length * msgInterval);

    this._attachKeyboardHandlers();
  }

  async read (promptString: string) {
    const currentPrompt = this._terminal.config.prompt;
    this._terminal.config.prompt = promptString;
    this._detachKeyboardHandlers();
    this._terminal.prompt();

    const value = await new Promise<string>((res) => {
      const handler = (e: KeyboardEvent) => {
        const value = (e.target as HTMLInputElement).value;
        switch (e.key) {
          case "Enter":
            this._terminal.offKeyPress(handler);

            e.preventDefault();
            res(value);
        }
      };

      this._terminal.onKeyPress(handler);
    });

    this._terminal.config.prompt = currentPrompt;
    this._attachKeyboardHandlers();

    return value;
  }

  private _attachKeyboardHandlers () {
    this._terminal.onKeyPress(this._onKeyPressHandler);
  }

  private _detachKeyboardHandlers () {
    this._terminal.offKeyPress(this._onKeyPressHandler);
  }

  private async _onKeyPressHandler (e: KeyboardEvent) {
    const value = (e.target as HTMLInputElement).value;
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        await this._client.eval(value, this.context);
        this._terminal.prompt();
        break;
    }
  }
}
