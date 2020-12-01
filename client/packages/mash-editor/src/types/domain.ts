export interface IBaseEntity<T> {
  serialize(): T;
}

export type BufferRowEdge = "top" | "bottom";

export interface SBaseBuffer {
  type: string;
  id: string;
  nodeId: string;
  // ui
  scrollLine: number;
  bottomScrollLine: number;
  cursorLine: number;
  rowOverflow: boolean;
  rowEdge: BufferRowEdge;
}

export interface IBaseBuffer {
  id: string;
  nodeId: string;
  scrollLine: number;
  bottomScrollLine: number;
  cursorLine: number;
  rowOverflow: boolean;
  rowEdge: BufferRowEdge;
}

export interface SBuffer extends SBaseBuffer {
  type: "Buffer";
  content: string;
}

export interface IBuffer extends IBaseEntity<SBuffer>, IBaseBuffer {
  content: string;
}

export interface SFiler extends SBaseBuffer {
  type: "Filer";
  openedNodeIds: string[];
}

export interface IFiler extends IBaseEntity<SFiler>, IBaseBuffer {
  toggleOpenedNode(nodeId: string): void;
  isNodeOpened(nodeId: string): boolean;
  closeNode(nodeId: string): void;
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
  modifiable: boolean;
}

export interface IBufferWindow extends
  IBaseEntity<SBufferWindow>,
  SBufferWindow {
  openBuffer(sourceId: string): void;
  hasSourceId(sourceId: string): boolean;
}

export type BufferWindowStats = {
  lines: number;
  displayLines: number;
  maxDisplayLines: number;
  width: number;
  height: number;
};
