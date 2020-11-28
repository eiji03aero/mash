import * as mc from "mash-common";

import * as types from "../types";

export type BaseBufferCtorParams = {
  id?: string;
  nodeId: string;
  scrollLine?: number;
  cursorLine?: number;
};

export class BaseBuffer implements types.IBaseBuffer {
  id: string;
  nodeId: string;
  scrollLine: number;
  cursorLine: number;

  constructor (params: BaseBufferCtorParams) {
    this.id = params.id || mc.cid.generate();
    this.nodeId = params.nodeId;
    this.scrollLine = params.scrollLine || 0;
    this.cursorLine = params.cursorLine || 0;
  }

  serialize (): types.SBaseBuffer {
    return {
      type: "",
      id: this.id,
      nodeId: this.nodeId,
      scrollLine: this.scrollLine,
      cursorLine: this.cursorLine,
    };
  }

  scroll (n: number, stats: types.BufferWindowStats): void {
    const nextCursorLine = this.cursorLine + n;
    const maxDisplayIdx = stats.displayLines - 1;
    this.cursorLine = mc.math.ensureInRange(nextCursorLine, 0, maxDisplayIdx);
    if (nextCursorLine < 0 || nextCursorLine > maxDisplayIdx) {
      const delta = nextCursorLine < 0
        ? nextCursorLine
        : nextCursorLine - maxDisplayIdx;
      const bottomPosition = Math.max(stats.lines - stats.displayLines, 0);
      this.scrollLine = mc.math.ensureInRange(this.scrollLine + delta, 0, bottomPosition);
    }
  }
}
