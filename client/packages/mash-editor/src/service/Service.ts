import * as mfs from "mash-filesystem";
import * as mc from "mash-common";
import { EventEmitter } from "events";
import * as E from "fp-ts/es6/Either";

import * as types from "../types";
import * as dmn from "../domain";
import { InputHandler } from "./InputHandler";
import { TextMeasurer } from "./TextMeasurerer";
import { defaultConfig } from "./config";

export class Service implements types.IService {
  state: types.AS;
  handlerTextarea: HTMLTextAreaElement;
  private _filesystem: mfs.IFileSystem;
  private _emitter: EventEmitter;
  private _inputHandler: types.IInputHandler;
  private _textMeasurer: types.ITextMeasurer;

  constructor (params: {
    filesystem: mfs.IFileSystem,
  }) {
    this.handlerTextarea = document.createElement("textarea");
    this._filesystem = params.filesystem;
    this._emitter = new EventEmitter();
    this._inputHandler = new InputHandler({
      service: this,
    });
    this._textMeasurer = new TextMeasurer();

    this.state = this.buildInitialState();
    this._textMeasurer.configure(this.state.config);
  }

  focus (): void {
    this.handlerTextarea.focus();
  }

  blur (): void {
    this.handlerTextarea.blur();
  }

  buildInitialState (): types.AS {
    const filer = new dmn.Filer({ nodeId: this._filesystem.currentDirectory.id });
    const buffer = new dmn.Buffer({ nodeId: "" });
    const buffers = [
      filer.serialize(),
      buffer.serialize(),
    ] as types.SBufferKind[];

    const windows = [
      new dmn.BufferWindow({
        currentSourceId: filer.id,
        width: 360,
        modifiable: false,
      }).serialize(),
      new dmn.BufferWindow({
        currentSourceId: buffer.id,
        ruler: true,
      }).serialize(),
    ] as types.SBufferWindow[];

    return {
      config: defaultConfig,
      windows,
      buffers,
      currentWindowId: windows[1].id,
    };
  }

  setState (s: Partial<types.AS>, opt?: types.SetStateOption): void {
    const option: types.SetStateOption = {
      update: true,
      ...opt,
    };

    this.state = {
      ...this.state,
      ...s,
    };

    if (option.update) {
      this.requestAction({
        type: "setState",
        state: this.state,
      });
    }
  }

  openBuffer (nodeId: string): void {
    const r1 = this._filesystem.getNode(nodeId);
    if (E.isLeft(r1)) {
      throw r1.left;
    }
    const node = r1.right;

    const bufferWindow = this.getModifiableBufferWindow();

    const buffer = (
      this.findBufferByNodeId({
        bufferWindowId: bufferWindow.id,
        nodeId: nodeId,
      })
      || this.createBufferWithNode({ node: node })
    );

    bufferWindow.openBuffer(buffer.id);

    this.setState({
      currentWindowId: bufferWindow.id,
    });
    this.updateBuffer(buffer);
    this.updateWindow(bufferWindow);
  }

  handleKeyDown (event: KeyboardEvent): void {
    return this._inputHandler.handleKeyDown(event);
  }

  handleKeyPress (event: KeyboardEvent): void {
    return this._inputHandler.handleKeyPress(event);
  }

  requestAction (action: types.RequestAction.Kind): void {
    this._emitter.emit("requestAction", action);
  }

  onRequestAction (cb: types.RequestActionHandler): void {
    this._emitter.on("requestAction", cb);
  }

  offRequestAction (cb: types.RequestActionHandler): void {
    this._emitter.off("requestAction", cb);
  }

  splitTextWithLimit (text: string, limit: number): string[] {
    const strings = [""];
    let tmpWidth = 0;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      tmpWidth += this._textMeasurer.measure(c).width;

      if (tmpWidth <= limit) {
        strings[strings.length - 1] += c;
      }
      else {
        tmpWidth = 0;
        strings.push(c);
      }
    }

    return strings;
  }

  formatDisplayRows (params: {
    rows: types.BufferRow[];
    bufferId: string;
    bufferWindowId: string;
  }): types. BufferRow[] {
    const buffer = this.findBuffer(params.bufferId);
    if (!buffer) {
      throw new Error("buffer not found");
    }

    const maxDisplayLines = this.getMaxDisplayLines(params.bufferWindowId);
    let bufferRows: types.BufferRow[];

    if (buffer.rowEdge === "top") {
      const idx = params.rows.findIndex((r) => r.lineIndex === buffer.scrollLine);
      bufferRows = params.rows.slice(idx, idx + maxDisplayLines);
    }
    else {
      bufferRows = this.formatDisplayRowsFromBottom({
        rows: params.rows,
        bottomScrollLine: buffer.bottomScrollLine,
        maxDisplayLines: maxDisplayLines,
      });
    }

    return bufferRows;
  }

  formatDisplayRowsFromBottom (params: {
    rows: types.BufferRow[];
    bottomScrollLine: number;
    maxDisplayLines: number;
  }): types.BufferRow[] {
    const idx = params.rows.findIndex((r) => r.lineIndex === params.bottomScrollLine);
    const bottomRow = params.rows[idx];
    let lastIdx = idx;
    for (let i = idx + 1; i < params.rows.length; i++) {
      const row = params.rows[i];
      if (row.lineIndex !== bottomRow.lineIndex) {
        break;
      }
      lastIdx += 1;
    }
    const startIdx = Math.max(lastIdx - params.maxDisplayLines + 1, 0);
    const rows = params.rows.slice(startIdx, lastIdx + 1);
    return rows;
  }

  getChildNodes (nodeId: string): mfs.IFileSystemNode[] {
    const r1 = this._filesystem.getNode(nodeId);
    if (E.isLeft(r1)) {
      throw r1.left;
    }
    const node = r1.right;

    if (!mfs.utils.isDirectory(node)) {
      throw new Error("not a directory");
    }

    const r2 = this._filesystem.getNodes(node.children);
    if (E.isLeft(r2)) {
      throw r2.left;
    }
    const nodes = r2.right;

    return nodes;
  }

  getFilerRows (filerId: string): types.FilerRow[] {
    const filer = this.findBuffer(filerId);
    if (!filer || !dmn.utils.isFiler(filer)) {
      throw new Error("not a filer");
    }

    const recur = (nodeId: string, nest: number): types.FilerRow[] =>  {
      const nodes = this.getChildNodes(nodeId);
      const {files, directories} = mfs.utils.groupNodes(nodes);
      directories.sort((a, b) => mc.text.compareMagnitude(a.name, b.name));
      files.sort((a, b) => mc.text.compareMagnitude(a.name, b.name));

      return [...directories, ...files].reduce((accum, cur) => {
        let name = cur.name;
        let indent = mc.text.repeat("  ", nest);
        if (mfs.utils.isFile(cur)) {
          indent = mc.text.repeat(" ", Math.max(nest * 2 - 1, 2));
        }
        else if (mfs.utils.isDirectory(cur)) {
          const caret = filer.isNodeOpened(cur.id) ? "▾" : "▸";
          name = `${caret} ${cur.name}`;
        }
        else {
          name = "[unknown file]";
        }
        accum.push({
          lineIndex: 0,
          text: `${indent}${name}`,
          node: cur,
          nest: nest,
        });

        if (mfs.utils.isDirectory(cur) && filer.isNodeOpened(cur.id)) {
          const nodes = recur(cur.id, nest + 1);
          accum.push(...nodes);
        }

        return accum;
      }, [] as types.FilerRow[]);
    };

    const rows = recur(filer.nodeId, 0);
    return rows.map((r, idx) => ({
      ...r,
      lineIndex: idx,
    }));
  }

  private getCurrentBufferWindow (): types.IBufferWindow {
    const bufferWindow = this.state.windows.find((w) => w.id === this.state.currentWindowId);
    if (!bufferWindow) {
      throw new Error("current buffer window not found");
    }
    return new dmn.BufferWindow(bufferWindow);
  }

  private getModifiableBufferWindow (): types.IBufferWindow {
    const bufferWindow = this.state.windows.find((w) => w.modifiable);
    if (!bufferWindow) {
      throw new Error("no modifiable window found");
    }
    return new dmn.BufferWindow(bufferWindow);
  }

  getCurrentBufferWindowSet (): types.BufferWindowSet {
    const bufferWindow = this.getCurrentBufferWindow();
    const buffer = this.findBuffer(bufferWindow.currentSourceId)!;
    return { bufferWindow, buffer };
  }

  findBuffer (id: string): types.IBufferKind | undefined {
    const sbuffer = this.state.buffers.find((b) => b.id === id);
    if (!sbuffer) {
      return;
    }
    return this.createBufferKind(sbuffer);
  }

  findBufferWindow (id: string): types.IBufferWindow | undefined {
    const swindow = this.state.windows.find((w) => w.id === id);
    if (!swindow) {
      return;
    }
    return new dmn.BufferWindow(swindow);
  }

  findBufferByNodeId (params: {
    bufferWindowId: string;
    nodeId: string;
  }): types.IBufferKind | undefined {
    const bufferWindow = this.findBufferWindow(params.bufferWindowId);
    if (!bufferWindow) {
      return;
    }

    const buffer = this.state.buffers
      .find((b) => bufferWindow.hasSourceId(b.id) && b.nodeId === params.nodeId);
    if (!buffer) {
      return;
    }
    return this.createBufferKind(buffer);
  }

  private createBufferKind (buffer: types.SBufferKind): types.IBufferKind {
    if (buffer.type === "Buffer") {
      return new dmn.Buffer(buffer);
    }
    else if (buffer.type === "Filer") {
      return new dmn.Filer(buffer);
    }
    else {
      throw new Error("unknown buffer");
    }
  }

  private createBufferWithNode (params: {
    node: mfs.IFileSystemNode;
  }): types.IBufferKind {
    if (mfs.utils.isFile(params.node)) {
      return new dmn.Buffer({
        nodeId: params.node.id,
        content: params.node.content,
      });
    }
    else if (mfs.utils.isDirectory(params.node)) {
      return new dmn.Filer({
        nodeId: params.node.id,
      });
    }
    else {
      throw new Error("not a proper filesystemnode: " + params.node.id);
    }
  }

  getWindowStats (params: {
    bufferWindowId: string;
    bufferId: string;
  }): types.BufferWindowStats {
    const bufferWindow = this.findBufferWindow(params.bufferWindowId);
    const buffer = this.findBuffer(params.bufferId);
    if (!bufferWindow || !buffer) {
      throw new Error("bufferWindow or buffer not found");
    }

    const wd = this.getWindowSize(params.bufferWindowId);
    const lineTexts = this.getLineTextsOfBuffer(buffer.id);
    const maxDisplayLines = this.getMaxDisplayLines(bufferWindow.id);
    let displayLines = maxDisplayLines;
    if (!buffer.rowOverflow) {
      const allDisplayRows = this.getAllDisplayRows(params);
      const rows = this.formatDisplayRows({
        rows: allDisplayRows,
        bufferId: params.bufferId,
        bufferWindowId: params.bufferWindowId,
      });
      displayLines = rows[rows.length - 1].displayIndex + 1;
    }

    return {
      lines: lineTexts.length,
      displayLines,
      maxDisplayLines,
      width: wd.width,
      height: wd.height,
    };
  }

  getWindowSize (bufferWindowId: string): types.WindowDimension {
    const bufferWindow = this.findBufferWindow(bufferWindowId);
    if (!bufferWindow) {
      throw new Error("buffer window not found");
    }
    const dom = document.querySelector<HTMLElement>(`[data-buffer-window-id="${bufferWindow.id}"] [data-component-name="BufferWindow__content"]`);
    if (!dom) {
      return {
        width: 0,
        height: 0,
      };
    }

    return {
      width: dom.offsetWidth,
      height: dom.offsetHeight,
    };
  }

  getRowHeight (): number {
    const c = this.state.config;
    // 2 is border width
    return c.rowPaddingTop + c.fontSize + c.rowPaddingBottom + 2;
  }

  getRowAvailableWidth (bufferWindowId: string): number {
    const { width } = this.getWindowSize(bufferWindowId);
    return width - this.state.config.rowPaddingLeft - this.state.config.rowPaddingRight;
  }

  getAllDisplayRows (params: {
    bufferWindowId: string;
    bufferId: string;
  }): types.BufferRow[] {
    const buffer = this.findBuffer(params.bufferId);
    if (!buffer) {
      throw new Error("buffer not found");
    }
    const maxDisplayLines = this.getMaxDisplayLines(params.bufferWindowId);
    const lineTexts = this.getLineTextsOfBuffer(params.bufferId);
    let displayLineTexts = lineTexts
      .map((t, idx) => ({idx, text: t}));
    if (buffer.rowEdge === "top") {
      displayLineTexts = displayLineTexts.slice(
        buffer.scrollLine,
        buffer.scrollLine + maxDisplayLines
      );
    }
    else {
      const startIdx = Math.max(buffer.bottomScrollLine - maxDisplayLines + 1, 0);
      displayLineTexts = displayLineTexts.slice(
        startIdx,
        buffer.bottomScrollLine + 1
      );
    }

    const availableWidth = this.getRowAvailableWidth(params.bufferWindowId);
    console.log(availableWidth);
    const bufferRows = displayLineTexts.reduce((accum, cur, idx) => {
      const texts = this.splitTextWithLimit(cur.text, availableWidth);
      for (let i = 0; i < texts.length; i++) {
        accum.push({
          index: i,
          displayIndex: idx,
          lineIndex: cur.idx,
          text: texts[i],
        });
      }
      return accum;
    }, [] as types.BufferRow[]);

    return bufferRows;
  }

  private _getDisplayRows (params: {
    bufferWindowId: string;
    bufferId: string;
  }): types.BufferRow[] {
    const allBufferRows = this.getAllDisplayRows(params);
    const bufferRows = this.formatDisplayRows({
      rows: allBufferRows,
      bufferId: params.bufferId,
      bufferWindowId: params.bufferWindowId,
    });

    return bufferRows;
  }

  getDisplayRows (params: {
    bufferWindowId: string;
    bufferId: string;
  }): types.BufferRow[] {
    try {
      return this._getDisplayRows(params);
    } catch (e) {
      return [] as types.BufferRow[];
    }
  }

  getMaxDisplayLines (bufferWindowId: string): number {
    const wd = this.getWindowSize(bufferWindowId);
    return Math.floor(wd.height / this.getRowHeight());
  }

  // FIXME: remove this method
  getMaxDisplayRowNumber (): number {
    return Math.floor(window.innerHeight / this.getRowHeight());
  }

  getLineTextsOfBuffer (bufferId: string): string[] {
    const buffer = this.findBuffer(bufferId);
    if (!buffer) {
      throw new Error("buffer not found");
    }

    if (dmn.utils.isBuffer(buffer)) {
      return mc.text.splitByNewLine(buffer.content);
    }
    else if (dmn.utils.isFiler(buffer)) {
      return this.getFilerRows(buffer.id).map((r) => r.text);
    }
    else {
      throw new Error("unknown buffer type");
    }
  }

  getBufferDisplayInfo (bufferId: string): types.BufferDisplayInfo {
    const defaultInfo = {
      name: "[NO NAME]",
      directoryPath: "",
    };

    const buffer = this.findBuffer(bufferId);
    if (!buffer) {
      return defaultInfo;
    }

    const r1 = this._filesystem.getNode(buffer.nodeId);
    if (E.isLeft(r1)) {
      return defaultInfo;
    }
    const node = r1.right;

    const r2 = this._filesystem.resolveAbsolutePath(buffer.nodeId);
    if (E.isLeft(r2)) {
      return defaultInfo;
    }
    const path = r2.right;

    if (dmn.utils.isFiler(buffer)) {
      return {
        name: "Filer",
        directoryPath: path,
      };
    }
    else {
      return {
        name: node.name,
        directoryPath: mc.paths.dirname(path),
      };
    }
  }

  getTextMetrics (text: string): TextMetrics {
    return this._textMeasurer.measure(text);
  }

  updateBuffer (buffer: types.IBufferKind, opt?: types.SetStateOption): void {
    this.setState({
      buffers: this.state.buffers.find((b) => b.id === buffer.id)
        ? this.state.buffers.map((b) => b.id === buffer.id ? buffer.serialize() : b)
        : this.state.buffers.concat(buffer.serialize())
    }, opt);
  }

  getCursorInfo (params: {
    bufferWindowId: string;
    bufferId: string;
  }): types.CursorInfo {
    const buffer = this.findBuffer(params.bufferId);
    if (!buffer) {
      throw new Error("buffer window or buffer not found");
    }

    const lines = this.getLineTextsOfBuffer(params.bufferId);
    const line = lines[buffer.cursorLine];
    const availableWidth = this.getRowAvailableWidth(params.bufferWindowId);
    const splitLines = this.splitTextWithLimit(line, availableWidth);

    let lineIdx = 0;
    let columnIdx = 0;
    let charCount = 0;
    let prevCharCount = 0;
    let offsetLeft = this.state.config.rowPaddingLeft;
    for (let i = 0; i < splitLines.length; i++) {
      const sl = splitLines[i];
      prevCharCount = charCount;
      charCount += sl.length;

      if (buffer.cursorColumn > charCount - 1) {
        if (i === splitLines.length - 1) {
          columnIdx = buffer.cursorColumn - prevCharCount;
          break;
        }
        lineIdx += 1;
        continue;
      }

      columnIdx = buffer.cursorColumn - prevCharCount;
      break;
    }

    const leftText = line.slice(prevCharCount, columnIdx);
    offsetLeft += this._textMeasurer.measure(leftText).width;
    const char = line[buffer.cursorColumn] || " ";
    const charWidth = this._textMeasurer.measure(char).width;

    return {
      line: lineIdx,
      column: columnIdx,
      charWidth: charWidth,
      offsetLeft: offsetLeft,
      char: char,
    };
  }

  updateWindow (bufferWindow: types.IBufferWindow): void {
    this.setState({
      windows: this.state.windows.find((w) => w.id === bufferWindow.id)
        ? this.state.windows.map((w) => w.id === bufferWindow.id ? bufferWindow.serialize() : w)
        : this.state.windows.concat(bufferWindow.serialize())
    });
  }
}
