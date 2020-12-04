import * as mc from "mash-common";

import * as types from "../types";

const chars = {
  blank: [" ", ""],
  separator: [" ", ",", "/", "\n", ""],
};

export class BufferScroller implements types.IBufferScroller {
  service: types.IService;
  buffer: types.IBufferKind;
  bufferWindow: types.IBufferWindow;
  lines: string[];
  stats: types.BufferWindowStats;

  constructor (params: {
    service: types.IService;
    buffer: types.IBufferKind;
    bufferWindow: types.IBufferWindow;
  }) {
    this.service = params.service;
    this.buffer = params.buffer;
    this.bufferWindow = params.bufferWindow;

    this.lines = this.service.getLineTextsOfBuffer(this.buffer.id);
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

  slideCursor (delta: number): void {
    const line = this.lines[this.buffer.cursorLine];
    const nextColumn = this.buffer.cursorColumn + delta;

    if (nextColumn < 0) {
      if (this.buffer.cursorLine === 0) {
        return;
      }
      this.scroll(-1);
      const line = this.lines[this.buffer.cursorLine];
      this.buffer.cursorColumn = Math.max(line.length - 1, 0);
    }
    else if (nextColumn >= line.length) {
      if (this.buffer.cursorLine === this.lines.length - 1) {
        return;
      }
      this.scroll(1);
      this.buffer.cursorColumn = 0;
    }
    else {
      this.buffer.cursorColumn = nextColumn;
    }
  }

  slideCursorToNextWordBegin (): void {
    if (this.isSepratorChar(this.getCursorChar())) {
      while (
        !this.isCursorOnEdgeOfFile()
        && this.isSepratorChar(this.getCursorChar())
      ) {
        this.slideCursor(1);
      }
      return;
    }

    this.slideCursor(1);
    while (
      !this.isCursorOnEdgeOfFile()
      && !this.isSepratorChar(this.getCursorChar())
    ) {
      this.slideCursor(1);
      if (this.isCursorOnEdgeOfLine()) {
        this.slideCursor(1);
        break;
      }
    }
    while (
      !this.isCursorOnEdgeOfFile()
      && this.isBlankChar(this.getCursorChar())
    ) {
      this.slideCursor(1);
    }
  }

  slideCursorToPreviousWordBegin (): void {
    if (
      !this.isCursorOnBeginOfLine()
      && !this.isSepratorChar(this.getCursorChar())
      && this.isSepratorChar(this.getCursorPreviousChar())
    ) {
      this.slideCursor(-1);
    }

    if (
      !this.isCursorOnBeginOfLine()
      && this.isSepratorChar(this.getCursorChar())
    ) {
      while (
        !this.isCursorOnBeginOfLine()
        && this.isSepratorChar(this.getCursorChar())
      ) {
        this.slideCursor(-1);
      }
    }

    if (this.isCursorOnBeginOfLine()) {
      while (
        this.isCursorOnBeginOfLine()
      ) {
        if (this.isCursorOnEdgeOfFile()) {
          return;
        }
        this.slideCursor(-1);
      }
    }

    while (
      !this.isCursorOnEdgeOfFile()
      && !this.isCursorOnBeginOfLine()
      && !this.isSepratorChar(this.getCursorPreviousChar())
    ) {
      this.slideCursor(-1);
      console.log(this.getCursorChar());
    }
  }

  slideCursorToNextWordEnd (): void {
    if (
      !this.isCursorOnEndOfLine()
      && !this.isSepratorChar(this.getCursorChar())
      && this.isSepratorChar(this.getCursorNextChar())
    ) {
      this.slideCursor(1);
    }

    if (this.isCursorOnEndOfLine()) {
      while (
        !this.isCursorOnEdgeOfFile()
        && this.isCursorOnEndOfLine()
      ) {
        this.slideCursor(1);
      }
    }

    if (this.isSepratorChar(this.getCursorChar())) {
      while (
        !this.isCursorOnEdgeOfFile()
        && this.isSepratorChar(this.getCursorChar())
      ) {
        this.slideCursor(1);
      }
    }

    while (
      !this.isCursorOnEdgeOfFile()
      && !this.isCursorOnEndOfLine()
      && !this.isSepratorChar(this.getCursorNextChar())
    ) {
      this.slideCursor(1);
    }
  }

  private getCursorChar () {
    const char = this.lines[this.buffer.cursorLine][this.buffer.cursorColumn];
    return char || "";
  }

  private getCursorPreviousChar () {
    if (this.buffer.cursorLine === 0 && this.buffer.cursorColumn === 0) {
      return "";
    }

    const cursorColumn = this.buffer.cursorColumn - 1;
    if (cursorColumn < 0) {
      const line = this.lines[this.buffer.cursorLine - 1];
      return line[line.length - 1];
    }
    else {
      const line = this.lines[this.buffer.cursorLine];
      return line[cursorColumn];
    }
  }

  private getCursorNextChar () {
    if (
      this.buffer.cursorLine === this.lines.length - 1
      && this.buffer.cursorColumn === this.lines[this.lines.length - 1].length - 1
    ) {
      return "";
    }

    const nextCursorColumn = this.buffer.cursorColumn + 1;
    const line = this.lines[this.buffer.cursorLine];
    if (nextCursorColumn >= line.length) {
      const nextLine = this.lines[this.buffer.cursorLine + 1];
      return nextLine[0] || "";
    }
    else {
      return line[nextCursorColumn];
    }
  }

  private isCursorOnEdgeOfFile () {
    const isOnTopEnd =
      this.buffer.cursorLine === 0 && this.buffer.cursorColumn === 0;
    const isOnBottom =
      this.buffer.cursorLine === this.lines.length - 1 &&
      this.buffer.cursorColumn >= this.lines[this.lines.length - 1].length;
    return isOnTopEnd || isOnBottom;
  }

  private isCursorOnBeginOfLine () {
    return this.buffer.cursorColumn <= 0;
  }

  private isCursorOnEndOfLine () {
    return this.buffer.cursorColumn >= this.lines[this.buffer.cursorLine].length - 1;
  }

  private isCursorOnEdgeOfLine () {
    return this.isCursorOnBeginOfLine() || this.isCursorOnEndOfLine();
  }

  private isBlankChar (c: string): boolean {
    return chars.blank.includes(c);
  }

  private isSepratorChar (c: string): boolean {
    return chars.separator.includes(c);
  }
}
