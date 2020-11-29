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

export interface IInputHandler {
  handleKey(s: AS, params: {
    key: string;
    ctrlKey: boolean;
  }): ASHandlerResult;
}

export type BufferWindowSet = {
  bufferWindow: dmn.IBufferWindow;
  buffer: dmn.IBufferKind;
};

export type FilerRow = {
  node: mfs.IFileSystemNode;
  nest: number;
};

export interface IService {
  handlerTextarea: HTMLTextAreaElement;
  focus(): void;
  blur(): void;
  buildInitialState(): AS;
  getChildNodes(nodeId: string): mfs.IFileSystemNode[];
  getFilerRows(f: dmn.SFiler): FilerRow[];
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
  getCurrentBufferWindowSet(s: AS): BufferWindowSet;
  getWindowStats(params: {
    config: Config;
    bufferWindow: dmn.IBufferWindow;
    buffer: dmn.IBufferKind;
  }): dmn.BufferWindowStats;
  getRowHeight(params: {
    config: Config;
  }): number;
  getMaxDisplayRowNumber(params: {
    config: Config;
  }): number;
  findBufferByNodeId(state: AS, params: {
    bufferWindow: dmn.IBufferWindow;
    nodeId: string;
  }): dmn.IBufferKind | undefined;
  mergeState(s: AS, ps: Partial<AS>): AS;
  updateBuffers(bs: dmn.SBufferKind[], b: dmn.IBufferKind): dmn.SBufferKind[];
  updateWindows(ws: dmn.SBufferWindow[], w: dmn.IBufferWindow): dmn.SBufferWindow[];
}

export interface IEditorEngine {
  service: IService;
  requestAction(action: RequestAction.Kind): void;
}
