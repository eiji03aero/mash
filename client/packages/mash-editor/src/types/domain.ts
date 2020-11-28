export interface IBaseEntity<T> {
  serialize(): T;
}

export interface SBaseBuffer {
  type: string;
  id: string;
  nodeId: string;
  // ui
  scrollLine: number;
  cursorLine: number;
}

export interface IBaseBuffer {
  id: string;
  nodeId: string;
  scroll(n: number, stats: BufferWindowStats): void;
}

export interface SBuffer extends SBaseBuffer {
  type: "Buffer";
  content: string;
}

export interface IBuffer extends IBaseEntity<SBuffer>, IBaseBuffer {
  _?: any;
}

export interface SFiler extends SBaseBuffer {
  type: "Filer";
}

export interface IFiler extends IBaseEntity<SFiler>, IBaseBuffer {
  _?: any;
}

export type SBufferKind =
  | SBuffer
  | SFiler;

export type IBufferKind =
  | IBuffer
  | IFiler;

// -------------------- BufferWindow --------------------
export type BufferWindowMode =
  | "normal";

export interface SBufferWindow {
  id: string;
  sourceIds: string[];
  currentSourceId: string;
  mode: BufferWindowMode;
  width?: number;
}

export interface IBufferWindow extends
  IBaseEntity<SBufferWindow>,
  SBufferWindow {
  openBuffer(sourceId: string): void;
  hasSourceId(sourceId: string): boolean;
  handleKey(params: {
    key: string;
    buffer: IBufferKind;
    stats: BufferWindowStats;
  }): void;
}

export type BufferWindowStats = {
  lines: number;
  displayLines: number;
};
