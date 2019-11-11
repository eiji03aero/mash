import { text } from 'mash-common';

export type KeyboardEventHandler = (e: KeyboardEvent) => void;

export interface IConfig {
  prompt: text.row;
  terminalBg: string;
  textWhite: string;
  fontFamily: string;
  fontSize: number;
  rowTopMargin: number;
  rowLeftMargin: number;
  rowRightMargin: number;
}

export interface IRenderPayload {
  rows: text.rows;
  displayedRows: text.rows;
  rowPosition: number;
  rowHeight: number;
  numberOfDisplayedRows: number;
  config: IConfig;
}

export interface IBaseRenderLayer {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  render(params: IRenderPayload): void;
  resize(params: IRenderPayload): void;
  clear(): void;
}

export interface IRenderer {
  renderLayers: IBaseRenderLayer[];
  render(params: IRenderPayload): void;
  resize(params: IRenderPayload): void;
}

export interface ITerminal {
  container: HTMLElement;
  renderer: IRenderer;
  textarea: HTMLTextAreaElement;
  config: IConfig;
  rows: text.rows;
  rowPosition: number;
  focus(): void;
  blur(): void;
  prompt(): void;
  writeln(texts: text.row): void;
  scroll(numberToScroll: number): void;
  scrollToBottom(): void;
}
