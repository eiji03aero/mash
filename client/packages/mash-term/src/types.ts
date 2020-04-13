import { Row } from "mash-common";

export type KeyboardEventHandler = (e: KeyboardEvent) => void;

export interface IConfig {
  prompt: string;
  cursorInitialPauseMs: number;
  cursorIntervalMs: number;
  terminalBg: string;
  cursorBg: string;
  textWhite: string;
  textBlue: string;
  textYellow: string;
  fontFamily: string;
  fontSize: number;
  rowTopMargin: number;
  rowBottomMargin: number;
  rowLeftMargin: number;
  rowRightMargin: number;
}

export interface IRectCoords {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IRenderPayload {
  rows: CachedRows;
  displayedRows: CachedRows;
  rowPosition: number;
  rowHeight: number;
  numberOfDisplayedRows: number;
  config: IConfig;
  textarea: HTMLTextAreaElement;
}

/* -------------------- service -------------------- */
export interface ICalculateService {
  measureText(text: string): TextMetrics;
}

/* -------------------- renderer -------------------- */
export interface IBaseRenderLayer {
  terminal: ITerminal;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  render(params: IRenderPayload): void;
  resize(params: IRenderPayload): void;
  clear(): void;
}

export interface ICursorRenderLayer extends IBaseRenderLayer {
  showCursor(): void;
  hideCursor(): void;
}

export interface IRenderer {
  renderLayers: IBaseRenderLayer[];
  render(params: IRenderPayload): void;
  resize(params: IRenderPayload): void;
  showCursor(): void;
  hideCursor(): void;
}

/* -------------------- main -------------------- */
export interface IWindowStat {
  width: number;
  height: number;
  availableWidth: number;
  availableHeight: number;
}

export interface IParsedRow {
  rowIndex: number;
  row: Row;
}

export type CachedRows = IParsedRow[];

export interface IInputHandler {
  onKeyDown: (cb: KeyboardEventHandler) => void;
  onKeyPress: (cb: KeyboardEventHandler) => void;
  onKeyUp: (cb: KeyboardEventHandler) => void;
  offKeyDown: (cb: KeyboardEventHandler) => void;
  offKeyPress: (cb: KeyboardEventHandler) => void;
  offKeyUp: (cb: KeyboardEventHandler) => void;
}

export interface IBuffer {
  rowPosition: number;
  rawRows: string[];
  rows: CachedRows;
  displayedRows: CachedRows;
  isOnBottom: boolean;
  bottomPosition: number;
  numberOfDisplayedRows: number;
  appendRow(str: string): void;
  updateRowByIndex(idx: number, str: string): void;
  updateRows(): void;
  scroll(numToScroll: number): void;
  scrollToBottom(): void;
}

export interface ITerminal {
  container: HTMLElement;
  textarea: HTMLTextAreaElement;
  config: IConfig;
  rowHeight: number;
  windowStat: IWindowStat;
  relativePromptRowPosition: number;
  onKeyDown: (cb: KeyboardEventHandler) => void;
  onKeyPress: (cb: KeyboardEventHandler) => void;
  onKeyUp: (cb: KeyboardEventHandler) => void;
  offKeyDown: (cb: KeyboardEventHandler) => void;
  offKeyPress: (cb: KeyboardEventHandler) => void;
  offKeyUp: (cb: KeyboardEventHandler) => void;
  measureText(str: string): TextMetrics;
  focus(): void;
  blur(): void;
  prompt(): void;
  clear(): void;
  showCursor(): void;
  hideCursor(): void;
  writeln(str: string): void;
  appendRow(str: string): void;
  updateRowByIndex(index: number, str: string): void;
  updateLastRow(str: string): void;
  scroll(numberToScroll: number): void;
  scrollToBottom(): void;
}
