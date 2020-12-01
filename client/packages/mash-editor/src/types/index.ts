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
  font: string;
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

export interface ITextMeasurer {
  configure(config: Config): void;
  measure(text: string): TextMetrics;
}

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
  handleKeyDown(event: KeyboardEvent): void;
  handleKeyPress(event: KeyboardEvent): void;
}

export type BufferWindowSet = {
  bufferWindow: dmn.IBufferWindow;
  buffer: dmn.IBufferKind;
};

export type WindowDimension = {
  width: number;
  height: number;
};

export type BufferRow = {
  lineIndex: number;
  displayIndex: number;
  index: number;
  text: string;
};

export type FilerRow = {
  node: mfs.IFileSystemNode;
  nest: number;
};

export interface IBufferScroller {
  scroll(delta: number): void;
  scrollTo(line: number): void;
}

export type SetStateOption = {
  update?: boolean;
};

export interface IService {
  state: AS;
  handlerTextarea: HTMLTextAreaElement;
  focus(): void;
  blur(): void;
  buildInitialState(): AS;
  setState(s: Partial<AS>, opt?: SetStateOption): void;
  openBuffer(nodeId: string): void;
  handleKeyDown(event: KeyboardEvent): void;
  handleKeyPress(event: KeyboardEvent): void;
  // emitter related
  requestAction(action: RequestAction.Kind): void;
  onRequestAction(cb: RequestActionHandler): void;
  offRequestAction(cb: (...args: any[]) => void): void;
  // format methods
  splitTextWithLimit(text: string, limit: number): string[];
  formatDisplayRows (params: {
    rows: BufferRow[];
    bufferId: string;
    bufferWindowId: string;
  }): BufferRow[];
  formatDisplayRowsFromBottom (params: {
    rows: BufferRow[];
    bottomScrollLine: number;
    maxDisplayLines: number;
  }): BufferRow[];
  // retrieval methods
  getChildNodes(nodeId: string): mfs.IFileSystemNode[];
  getFilerRows(filerId: string): FilerRow[];
  getCurrentBufferWindowSet(): BufferWindowSet;
  getWindowStats(params: {
    bufferWindowId: string;
    bufferId: string;
  }): dmn.BufferWindowStats;
  getWindowSize(bufferWindowId: string): WindowDimension;
  getRowHeight(): number;
  getAllDisplayRows(params: {
    bufferWindowId: string;
    bufferId: string;
  }): BufferRow[];
  getDisplayRows(params: {
    bufferWindowId: string;
    bufferId: string;
  }): BufferRow[];
  getMaxDisplayLines (bufferWindowId: string): number;
  getMaxDisplayRowNumber(): number;
  // query methods
  findBuffer(id: string): dmn.IBufferKind | undefined;
  findBufferWindow(id: string): dmn.IBufferWindow | undefined;
  findBufferByNodeId(params: {
    bufferWindowId: string;
    nodeId: string;
  }): dmn.IBufferKind | undefined;
  // update methods
  updateBuffer(b: dmn.IBufferKind, opt?: SetStateOption): void;
  updateWindow(w: dmn.IBufferWindow): void;
}

export interface IEditorEngine {
  service: IService;
  openBuffer(nodeId: string): void;
  requestAction(action: RequestAction.Kind): void;
}
