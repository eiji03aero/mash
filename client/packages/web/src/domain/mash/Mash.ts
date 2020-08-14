import * as E from "fp-ts/es6/Either";
import { MashClient, Environment, IMashClient, IEnvironment } from "mash";
import { Terminal, ITerminal } from "mash-term";
import { FileSystem, IFileSystem } from "mash-filesystem";
import { text } from "mash-common";

import { IMash, IService, ILocalStateRepository } from "../../types";
import { IContext } from "./types";
import { builtins } from "./builtins";
import { fixtureNodes } from "./fixtureNodes";
import { colors } from "../../utils";

export class Mash implements IMash {
  private _filesystem: IFileSystem;
  private _terminal: ITerminal;
  private _environment: IEnvironment;
  private _client: IMashClient<IContext>;
  private _service: IService;
  private _localStateRepository: ILocalStateRepository;

  constructor (params: {
    terminalContainer: HTMLElement;
    service: IService;
    localStateRepository: ILocalStateRepository;
  }) {
    const filesystem = FileSystem.bootstrap();
    const terminal = new Terminal(params.terminalContainer, {
      cursorInitialPauseMs: 1000,
      cursorIntervalMs: 500,
      terminalBg: colors.pallete.deepGreen,
      cursorBg: colors.pallete.blue,
      textWhite: colors.pallete.white,
      textBlue: colors.pallete.blue,
      textYellow: colors.pallete.yellow,
      fontFamily: "Menlo",
      fontSize: 16,
      rowTopMargin: 4,
      rowBottomMargin: 4,
      rowLeftMargin: 8,
      rowRightMargin: 8,
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
    this._service = params.service;
    this._localStateRepository = params.localStateRepository;

    // Bind methods
    this.read = this.read.bind(this);
    this._onKeyPressHandler = this._onKeyPressHandler.bind(this);
    this._onKeyHandler = this._onKeyHandler.bind(this);

    this._updatePromptString();
    this._environment;
  }

  get context (): IContext {
    return {
      filesystem: this._filesystem,
      terminal: this._terminal,
      service: this._service,
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
      const pressHandler = (e: KeyboardEvent) => {
        const value = (e.target as HTMLInputElement).value;
        switch (e.key) {
          case "Enter":
            this._terminal.offKeyPress(pressHandler);
            this._terminal.offKey(this._onKeyHandler);

            e.preventDefault();
            res(value);
        }
      };

      this._terminal.onKeyPress(pressHandler);
      this._terminal.onKey(this._onKeyHandler);
    });

    this._attachKeyboardHandlers();
    this._terminal.config.prompt = currentPrompt;

    return value;
  }

  private async _updatePromptString () {
    const username = await this._getUsername();
    const currentPath = await this._getCurrentDirectoryPath();

    const promptString = [
      text.colorSequence.white + username,
      text.colorSequence.blue + currentPath,
      text.colorSequence.white + "$ ",
    ].join(" ");
    this._terminal.config.prompt = promptString;
  }

  private async _executeClient (value: string) {
    await this._client.eval(value, this.context);
    await this._updatePromptString();
  }

  private _attachKeyboardHandlers () {
    this._terminal.onKeyPress(this._onKeyPressHandler);
    this._terminal.onKey(this._onKeyHandler);
  }

  private _detachKeyboardHandlers () {
    this._terminal.offKeyPress(this._onKeyPressHandler);
    this._terminal.offKey(this._onKeyHandler);
  }

  private async _onKeyPressHandler (e: KeyboardEvent) {
    const value = (e.target as HTMLInputElement).value;
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        await this._executeClient(value);
        this._terminal.prompt();
        break;
    }
  }

  private _onKeyHandler (e: KeyboardEvent) {
    // Do nothing if it's enter, in order to avoid bugs
    // like read method's prompt gets overwritten
    if (e.keyCode === 13) {
      return;
    }

    const value = (e.target as HTMLInputElement).value;
    const prompt = this._terminal.config.prompt;
    const lastIndex = this._terminal.rows.length - 1;

    this._terminal.updateRowByIndex(lastIndex, prompt + value);
    this._terminal.showCursor();
  }

  private async _getUsername () {
    const r1 = await this._localStateRepository.get();
    if (E.isLeft(r1)) {
      throw r1.left;
    }

    return r1.right.username;
  }

  private async _getCurrentDirectoryPath () {
    const r1 = this._filesystem.resolveAbsolutePath(this._filesystem.currentDirectory.id);
    if (E.isLeft(r1)) {
      throw r1.left;
    }

    return r1.right;
  }
}
