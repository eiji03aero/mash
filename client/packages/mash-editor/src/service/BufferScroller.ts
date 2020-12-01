import * as mc from "mash-common";

import * as types from "../types";

export class BufferScroller implements types.IBufferScroller {
  service: types.IService;
  buffer: types.IBufferKind;
  bufferWindow: types.IBufferWindow;
  stats: types.BufferWindowStats;

  constructor (params: {
    service: types.IService;
    buffer: types.IBufferKind;
    bufferWindow: types.IBufferWindow;
  }) {
    this.service = params.service;
    this.buffer = params.buffer;
    this.bufferWindow = params.bufferWindow;

    this.stats = this.service.getWindowStats({
      bufferId: params.buffer.id,
      bufferWindowId: params.bufferWindow.id,
    });
  }

  scroll (delta: number): void {
    const nextCursorLine = this.buffer.cursorLine + delta;
    this.buffer.cursorLine = mc.math.ensureInRange(nextCursorLine, 0, this.stats.lines - 1)

    if (nextCursorLine <= this.buffer.scrollLine) {
      this.buffer.rowEdge = "top";
      this.buffer.scrollLine = this.buffer.cursorLine;
    }
    else if (nextCursorLine >= this.buffer.scrollLine + this.stats.displayLines - 1) {
      this.buffer.rowEdge = "bottom";
      this.buffer.bottomScrollLine = this.buffer.cursorLine;
      this.service.updateBuffer(this.buffer, {update: false});

      const rows = this.service.getAllDisplayRows({
        bufferWindowId: this.bufferWindow.id,
        bufferId: this.buffer.id,
      });
      const displayRows = this.service.formatDisplayRowsFromBottom({
        rows: rows,
        bottomScrollLine: this.buffer.bottomScrollLine,
        maxDisplayLines: this.stats.maxDisplayLines,
      });

      this.buffer.scrollLine = displayRows[0].lineIndex;
    }
    else {
      // do nothing for just moving cursor within buffer
    }
  }

  scrollTo (line: number): void {
    if (line < this.buffer.scrollLine) {
      this.scroll(line - this.buffer.scrollLine);
    }
    else if (line > (this.buffer.scrollLine + this.stats.displayLines)) {
      this.scroll(line - this.buffer.scrollLine + this.stats.displayLines);
    }
    else {
      this.scroll(line - this.buffer.cursorLine);
    }
  }
}
