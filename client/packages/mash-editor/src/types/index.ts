import * as mfs from "mash-filesystem";

import * as dmn from "./domain";

export * from "./base";
export * from "./domain";

export type UIState = {
  changingWindow: boolean;
};

export type ApplicationState = {
  ui: UIState;
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

  export type SetUIState = Base & {
    type: "setUIState";
    ui: Partial<UIState>;
  };

  export type Kind =
    | OpenBuffer
    | SetUIState;
}

export type RequestActionHandler = (action: RequestAction.Kind) => void;

export type ASHandlerResult = AS | undefined;

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
    ctrlKey: boolean;
  }): ASHandlerResult;
  requestAction(action: RequestAction.Kind): void;
  onRequestAction(cb: RequestActionHandler): void;
  offRequestAction(cb: (...args: any[]) => void): void;
}

export interface IEditorEngine {
  service: IService;
  requestAction(action: RequestAction.Kind): void;
}
