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

  export type SetState = Base & {
    type: "setState";
    state: AS;
  };

  export type Kind =
    | SetState;
}

export type RequestActionHandler = (action: RequestAction.Kind) => void;

export interface IInputHandler {
  handleKey(params: {
    key: string;
    ctrlKey: boolean;
  }): void;
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
  state: AS;
  handlerTextarea: HTMLTextAreaElement;
  focus(): void;
  blur(): void;
  buildInitialState(): AS;
  setState(s: Partial<AS>): void;
  openBuffer(nodeId: string): void;
  handleKeyPress(params: {
    key: string;
    ctrlKey: boolean;
  }): void;
  // emitter related
  requestAction(action: RequestAction.Kind): void;
  onRequestAction(cb: RequestActionHandler): void;
  offRequestAction(cb: (...args: any[]) => void): void;
  // retrieval methods
  getChildNodes(nodeId: string): mfs.IFileSystemNode[];
  getFilerRows(filerId: string): FilerRow[];
  getCurrentBufferWindowSet(): BufferWindowSet;
  getWindowStats(params: {
    bufferWindowId: string;
    bufferId: string;
  }): dmn.BufferWindowStats;
  getRowHeight(): number;
  getMaxDisplayRowNumber(): number;
  // query methods
  findBuffer(id: string): dmn.IBufferKind | undefined;
  findBufferWindow(id: string): dmn.IBufferWindow | undefined;
  findBufferByNodeId(params: {
    bufferWindowId: string;
    nodeId: string;
  }): dmn.IBufferKind | undefined;
  // update methods
  updateBuffers(b: dmn.IBufferKind): dmn.SBufferKind[];
  updateWindows(w: dmn.IBufferWindow): dmn.SBufferWindow[];
}

export interface IEditorEngine {
  service: IService;
  openBuffer(nodeId: string): void;
  requestAction(action: RequestAction.Kind): void;
}
