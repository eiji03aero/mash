export interface IBaseEntity<T> {
  serialize(): T;
}

export interface IBaseBuffer {
  id: string;
  nodeId: string;
}

export interface SBuffer {
  type: "Buffer";
  id: string;
  nodeId: string;
  content: string;
}

export interface IBuffer extends IBaseEntity<SBuffer>, IBaseBuffer {
  _?: any;
}

export interface SFiler {
  type: "Filer";
  id: string;
  nodeId: string;
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

export interface IBufferWindow extends IBaseEntity<SBufferWindow> {
  openBuffer(sourceId: string): void;
  hasSourceId(sourceId: string): boolean;
}
