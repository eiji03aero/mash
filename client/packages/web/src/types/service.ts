import * as me from "mash-editor";
import * as base from "./base";

export interface IService {
  editorEngine: me.IEditorEngine;
  isLoggedIn: boolean;
  initialize(params: {
    terminalContainer: HTMLElement;
  }): void;
  // -------------------- auth --------------------
  signup(params: {
    name: string;
    password: string;
  }): base.PromisedEither<null>;
  login(params: {
    name: string;
    password: string;
  }): base.PromisedEither<string>;
  logout(): base.PromisedEither<null>;
  // -------------------- term --------------------
  focusTerminal(): void;
  blurTerminal(): void;
  // -------------------- editor --------------------
  openEditor(): base.PromisedEither<null>;
  closeEditor(): base.PromisedEither<null>;
}
