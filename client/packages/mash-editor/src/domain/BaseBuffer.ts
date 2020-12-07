import * as mc from "mash-common";

import * as types from "../types";

export type BaseBufferCtorParams = {
  id?: string;
  nodeId: string;
  name?: string;
  dirty?: boolean;
  scrollLine?: number;
  bottomScrollLine?: number;
  cursorLine?: number;
  cursorColumn?: number;
  rowOverflow?: boolean;
  rowEdge?: types.BufferRowEdge;
};

export class BaseBuffer implements types.IBaseBuffer {
  id: string;
  nodeId: string;
  name?: string;
  dirty: boolean;
  scrollLine: number;
  bottomScrollLine: number;
  cursorLine: number;
  cursorColumn: number;
  rowOverflow: boolean;
  rowEdge: types.BufferRowEdge;

  constructor (params: BaseBufferCtorParams) {
    this.id = params.id ?? mc.cid.generate();
    this.nodeId = params.nodeId;
    this.name = params.name;
    this.dirty = params.dirty ?? false;
    this.scrollLine = params.scrollLine ?? 0;
    this.bottomScrollLine = params.bottomScrollLine ?? 0;
    this.cursorLine = params.cursorLine ?? 0;
    this.cursorColumn = params.cursorColumn ?? 0;
    this.rowOverflow = params.rowOverflow ?? false;
    this.rowEdge = params.rowEdge ?? "top";
  }

  serialize (): types.SBaseBuffer {
    return {
      type: "",
      id: this.id,
      nodeId: this.nodeId,
      name: this.name,
      dirty: this.dirty,
      scrollLine: this.scrollLine,
      bottomScrollLine: this.bottomScrollLine,
      cursorLine: this.cursorLine,
      cursorColumn: this.cursorColumn,
      rowOverflow: this.rowOverflow,
      rowEdge: this.rowEdge,
    };
  }
}
