import * as mfs from "mash-filesystem";

import * as dmn from "./domain";

export * from "./base";
export * from "./domain";

export type ApplicationState = {
  config: Config;
  windows: dmn.SBufferWindow[];
  buffers: dmn.SBufferKind[];
  commandLineBufferId: string;
  currentWindowId: string;
  filerWindowId: string;
  focusTarget: "windows" | "commandLine";
  infoText: string;
};

export type AS = ApplicationState;

export type Config = {
  font: string;
  fontSize: number;
  rowPaddingTop: number;
  rowPaddingBottom: number;
  rowPaddingLeft: number;
  rowPaddingRight: number;
  cursorBlinkInitialPause: number;
  cursorBlinkDuration: number;
  commandLineRows: number;
  color: {
    ColorColumn: string;
    VertSplit: string;
    Directory: string;
    Text: string;
    CursorBg: string;
    StatusLineBg: string;
    StatusLineSubFg: string;
    StatusLineSubBg: string;
    StatusLineModeNormalFg: string;
    StatusLineModeNormalBg: string;
    StatusLineNodeNameFg: string;
    StatusLineDirectoryPathFg: string;
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

  export type Quit = Base & {
    type: "quit";
  };

  export type Kind =
    | SetState
    | Quit;
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
  lineIndex: number;
  text: string;
  node: mfs.IFileSystemNode;
  nest: number;
};

export type BufferDisplayInfo = {
  name: string;
  directoryPath: string;
};

export type CursorInfo = {
  line: number;
  column: number;
  charWidth: number;
  offsetLeft: number;
  char: string;
};

export interface IBufferScroller {
  scroll(delta: number): void;
  scrollTo(line: number): void;
  slideCursor(delta: number): void;
  slideCursorToNextWordBegin(): void;
  slideCursorToNextWordEnd(): void;
  slideCursorToPreviousWordBegin(): void;
}

export interface ICommandExecutor {
  execute(cmd: string): void;
}

export type SetStateOption = {
  update?: boolean;
};

export interface IService {
  state: AS;
  handlerTextarea: HTMLTextAreaElement;
  filesystem: mfs.IFileSystem;
  focus(): void;
  blur(): void;
  buildInitialState(): AS;
  setState(s: Partial<AS>, opt?: SetStateOption): void;
  openBuffer(bufferId: string): void;
  openBufferByNodeId(nodeId: string): void;
  executeExCommand(cmd: string): void;
  setInfoText(text: string): void;
  setCommandLineContent(text: string): void;
  toggleFiler(): void;
  // error
  error(err: string | Error): Error;
  // handler
  handleKeyDown(event: KeyboardEvent): void;
  handleKeyPress(event: KeyboardEvent): void;
  handleTextareaChange(event: Event): void;
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
  getRowAvailableWidth(bufferWindowId: string): number;
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
  getLineTextsOfBuffer (bufferId: string): string[];
  getBufferDisplayInfo(bufferId: string): BufferDisplayInfo;
  getTextMetrics(text: string): TextMetrics;
  getCursorInfo(params: {
    bufferWindowId: string;
    bufferId: string;
  }): CursorInfo;
  getCommandLineBuffer(): dmn.IBuffer;
  getNode(nodeId: string): mfs.IFileSystemNode;
  getNodeByPath(path: string): mfs.IFileSystemNode;
  getAbsolutePath(nodeId: string): string;
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
  ensureBufferCursorLine(b: dmn.IBufferKind, offset: number): void;
  updateTextarea (params: {
    value: string;
  }): void;
}

export interface IEditorEngine {
  service: IService;
  openBufferByNodeId(nodeId: string): void;
  requestAction(action: RequestAction.Kind): void;
  onRequestAction(handler: RequestActionHandler): void;
  offRequestAction(handler: RequestActionHandler): void;
}
