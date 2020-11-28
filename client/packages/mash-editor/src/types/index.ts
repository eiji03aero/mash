import * as mfs from "mash-filesystem";

import * as dmn from "./domain";

export * from "./base";
export * from "./domain";

export type ApplicationState = {
  config: Config;
  windows: dmn.SBufferWindow[];
  buffers: dmn.SBufferKind[];
  currentWindowId: string;
};

export type AS = ApplicationState;

export type Config = {
  fontSize: number;
  rowPaddingTop: number;
  rowPaddingBottom: number;
  rowPaddingLeft: number;
  rowPaddingRight: number;
  color: {
    VertSplit: string;
    Directory: string;
    Text: string;
  },
};

export namespace RequestAction {
  export type Base = {
    type: string;
  };

  export type OpenBuffer = Base & {
    type: "openBuffer";
    nodeId: string;
  };

  export type Kind =
    | OpenBuffer;
}

export type RequestActionHandler = (action: RequestAction.Kind) => void;

export interface IService {
  handlerTextarea: HTMLTextAreaElement;
  focus(): void;
  blur(): void;
  buildInitialState(): AS;
  getChildNodes(id: string): mfs.IFileSystemNode[];
  openBuffer(s: AS, params: {
    nodeId: string;
  }): AS;
  handleKeyPress(s: AS, params: {
    key: string;
  }): AS;
  requestAction(action: RequestAction.Kind): void;
  onRequestAction(cb: RequestActionHandler): void;
  offRequestAction(cb: (...args: any[]) => void): void;
}

export interface IEditorEngine {
  service: IService;
  requestAction(action: RequestAction.Kind): void;
}
