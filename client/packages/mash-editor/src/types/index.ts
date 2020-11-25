import * as mfs from "mash-filesystem";

import * as dmn from "./domain";

export * from "./base";
export * from "./domain";

export type ApplicationState = {
  windows: dmn.SBufferWindow[];
  buffers: dmn.SBufferKind[];
  currentWindowId: string;
};

export type Config = {
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
  buildInitialState(): ApplicationState;
  getChildNodes(id: string): mfs.IFileSystemNode[];
  openBuffer(s: ApplicationState, params: {
    nodeId: string;
  }): ApplicationState;
  requestAction(action: RequestAction.Kind): void;
  onRequestAction(cb: RequestActionHandler): void;
  offRequestAction(cb: (...args: any[]) => void): void;
}

export interface IEditorEngine {
  service: IService;
  requestAction(action: RequestAction.Kind): void;
}
