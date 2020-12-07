import * as mfs from "mash-filesystem";
import * as mc from "mash-common";
import { EventEmitter } from "events";
import * as E from "fp-ts/es6/Either";

import * as types from "../types";
import * as dmn from "../domain";
import * as asts from "../assets";
import { InputHandler } from "./InputHandler";
import { TextMeasurer } from "./TextMeasurerer";
import { CommandExecutor } from "./CommandExecutor";
import { BufferScroller } from "./BufferScroller";
import { defaultConfig } from "./config";

export class Service implements types.IService {
  state: types.AS;
  handlerTextarea: HTMLTextAreaElement;
  filesystem: mfs.IFileSystem;
  private _emitter: EventEmitter;
  private _inputHandler: types.IInputHandler;
  private _textMeasurer: types.ITextMeasurer;
  private _commandExecutor: types.ICommandExecutor;

  constructor (params: {
    filesystem: mfs.IFileSystem,
  }) {
    this.handlerTextarea = document.createElement("textarea");
    this.filesystem = params.filesystem;
    this._emitter = new EventEmitter();
    this._inputHandler = new InputHandler({
      service: this,
    });
    this._textMeasurer = new TextMeasurer();
    this._commandExecutor = new CommandExecutor({
      service: this,
    });

    this.state = this.buildInitialState();
    this._textMeasurer.configure(this.state.config);

    this.error = this.error.bind(this);
  }

  focus (): void {
    this.handlerTextarea.focus();
  }

  blur (): void {
    this.handlerTextarea.blur();
  }

  isFocused (): boolean {
    return window.document.activeElement === this.handlerTextarea;
  }

  buildInitialState (): types.AS {
    const filer = new dmn.Filer({ nodeId: this.filesystem.currentDirectory.id });
    const buffer = new dmn.Buffer({ nodeId: "" });
    const commandLineBuffer = new dmn.Buffer({ nodeId: "" });
    const buffers = [
      filer.serialize(),
      buffer.serialize(),
      asts.prebfs.help.serialize(),
      commandLineBuffer.serialize(),
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
      filerWindowId: windows[0].id,
      commandLineBufferId: commandLineBuffer.id,
      focusTarget: "windows",
      infoText: "",
    };
  }

  setState (s: Partial<types.AS>, opt?: types.SetStateOption): void {
    const option: types.SetStateOption = {
      dispatch: true,
      ...opt,
    };

    this.state = {
      ...this.state,
      ...s,
    };

    if (option.dispatch) {
      this.requestAction({
        type: "setState",
        state: this.state,
      });
    }
  }

  openBuffer (bufferId: string): void {
    const bufferWindow = this.getModifiableBufferWindow();
    const buffer = this.findBuffer(bufferId);
    if (!buffer) {
      throw this.errorBufferNotFound(bufferId);
    }

    bufferWindow.openBuffer(buffer.id);

    this.setState({
      currentWindowId: bufferWindow.id,
    });
    this.updateBuffer(buffer);
    this.updateWindow(bufferWindow);
  }

  openBufferByNodeId (nodeId: string): void {
    const r1 = this.filesystem.getNode(nodeId);
    if (E.isLeft(r1)) {
      throw this.error(r1.left);
    }
    const node = r1.right;

    const bufferWindow = this.getModifiableBufferWindow();

    let buffer = this.findBufferByNodeId({
      bufferWindowId: bufferWindow.id,
      nodeId: nodeId,
    });
    if (!buffer) {
      buffer = this.createBufferWithNode({ node });
      this.updateBuffer(buffer, { dispatch: false });
    }

    this.openBuffer(buffer.id);
  }

  executeExCommand (cmd: string): void {
    this._commandExecutor.execute(cmd);
  }

  setInfoText (text: string): void {
    this.setState({ infoText: text });
  }

  setCommandLineContent (text: string): void {
    const buffer = this.getCommandLineBuffer();
    buffer.content = text;
    this.updateBuffer(buffer);
  }

  toggleFiler (): void {
    const bufferWindow = this.findBufferWindow(this.state.filerWindowId);
    if (!bufferWindow) {
      throw this.errorBufferWindowNotFound(this.state.filerWindowId);
    }
    bufferWindow.hide = !bufferWindow.hide;
    this.updateWindow(bufferWindow);
  }

  startInsertMode (params: {
    bufferId: string;
    bufferWindowId: string;
  }): void {
    const buffer = this.findBuffer(params.bufferId);
    if (!buffer) {
      throw this.errorBufferNotFound(params.bufferId);
    }
    if (!dmn.utils.isBuffer(buffer)) {
      throw this.errorNotBuffer(buffer.id);
    }
    const bufferWindow = this.findBufferWindow(params.bufferWindowId);
    if (!bufferWindow) {
      throw this.errorBufferWindowNotFound(params.bufferWindowId);
    }

    const lines = this.getLineTextsOfBuffer(params.bufferId);
    let position = 0;
    for (let i = 0; i < buffer.cursorLine; i++) {
      position += lines[i].length + 1;
    }
    position += buffer.cursorColumn;

    this.updateTextarea({
      value: buffer.content,
      position: position,
    });

    bufferWindow.mode = "insert";
    this.updateWindow(bufferWindow);
  }

  error (err: string | Error): Error {
    const error = err instanceof Error
      ? err
      : new Error(err);
    this.setInfoText(error.message);
    return error;
  }
  errorNotFiler (filerId: string): Error {
    return this.error(`could not find filer with id: ${filerId}`);
  }
  errorNotBuffer (bufferId: string): Error {
    return this.error(`not a filer with id: ${bufferId}`);
  }
  errorNotDirectory (nodeId: string): Error {
    const path = this.filesystem.getNode(nodeId);
    return this.error(`not directory: ${path}`);
  }
  errorBufferWindowNotFound (bufferWindowId: string): Error {
    return this.error(`could not find buffer window with id: ${bufferWindowId}`);
  }
  errorBufferNotFound (bufferId: string): Error {
    return this.error(`could not find buffer with id: ${bufferId}`);
  }
  errorModifiableWindowNotFound (): Error {
    return this.error("could not find any buffer window which is modifiable");
  }
  errorUnknownFileSystemNode (nodeId: string): Error {
    return this.error(`unknown filesystem node type with id: ${nodeId}`);
  }

  handleKeyDown (event: KeyboardEvent): void {
    return this._inputHandler.handleKeyDown(event);
  }

  handleKeyPress (event: KeyboardEvent): void {
    return this._inputHandler.handleKeyPress(event);
  }

  handleTextareaChange (event: Event): void {
    event;

    if (this.state.focusTarget === "commandLine") {
      const buffer = this.getCommandLineBuffer();
      buffer.content = this.handlerTextarea.value;
      buffer.cursorColumn = this.handlerTextarea.selectionStart;
      this.updateBuffer(buffer);
    }
    else {
      const { buffer, bufferWindow } = this.getCurrentBufferWindowSet();
      if (bufferWindow.mode === "insert") {
        if (!dmn.utils.isBuffer(buffer)) {
          throw this.errorNotBuffer(buffer.id);
        }

        const textareaPosition = this.handlerTextarea.selectionStart;
        const content = this.handlerTextarea.value;
        const lines = mc.text.splitByNewLine(content);
        let cursorLine = 0;
        let cursorColumn = 0;
        let position = 0;
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const prevPosition = position;
          position += line.length;
          const linePosition = position;
          position += content.slice(position, position + 2) === "\r\n"
            ? 2
            : 1;
          if (textareaPosition <= linePosition) {
            cursorLine = i;
            cursorColumn = textareaPosition - prevPosition;
            break;
          }
        }

        buffer.content = content;
        this.updateBuffer(buffer, {dispatch: false});

        const scroller = new BufferScroller({
          service: this,
          buffer,
          bufferWindow,
        });

        scroller.scrollTo(cursorLine);
        buffer.cursorColumn = cursorColumn;

        this.updateBuffer(buffer);
      }
    }
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
      throw this.error("buffer not found");
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
    const r1 = this.filesystem.getNode(nodeId);
    if (E.isLeft(r1)) {
      throw this.error(r1.left);
    }
    const node = r1.right;

    if (!mfs.utils.isDirectory(node)) {
      throw this.errorNotDirectory(node.id);
    }

    const r2 = this.filesystem.getNodes(node.children);
    if (E.isLeft(r2)) {
      throw this.error(r2.left);
    }
    const nodes = r2.right;

    return nodes;
  }

  getFilerRows (filerId: string): types.FilerRow[] {
    const filer = this.findBuffer(filerId);
    if (!filer || !dmn.utils.isFiler(filer)) {
      throw this.errorNotFiler(filerId);
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
          indent = mc.text.repeat(" ", Math.max(nest * 2 + 1, 2));
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
      throw this.errorBufferWindowNotFound(this.state.currentWindowId);
    }
    return new dmn.BufferWindow(bufferWindow);
  }

  private getModifiableBufferWindow (): types.IBufferWindow {
    const bufferWindow = this.state.windows.find((w) => w.modifiable);
    if (!bufferWindow) {
      throw this.errorModifiableWindowNotFound();
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
    else {
      return new dmn.Filer(buffer);
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
      throw this.errorUnknownFileSystemNode(params.node.id);
    }
  }

  getWindowStats (params: {
    bufferWindowId: string;
    bufferId: string;
  }): types.BufferWindowStats {
    const bufferWindow = this.findBufferWindow(params.bufferWindowId);
    if (!bufferWindow) {
      throw this.errorBufferWindowNotFound(params.bufferWindowId);
    }
    const buffer = this.findBuffer(params.bufferId);
    if (!buffer) {
      throw this.errorBufferNotFound(params.bufferId);
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
      throw this.errorBufferWindowNotFound(bufferWindowId);
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
      throw this.errorBufferNotFound("buffer not found");
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
      throw this.errorBufferNotFound("buffer not found");
    }

    if (dmn.utils.isBuffer(buffer)) {
      return mc.text.splitByNewLine(buffer.content);
    }
    else  {
      return this.getFilerRows(buffer.id).map((r) => r.text);
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

    const r1 = this.filesystem.getNode(buffer.nodeId);
    if (E.isLeft(r1)) {
      return {
        ...defaultInfo,
        name: buffer.name ?? defaultInfo.name,
      };
    }
    const node = r1.right;

    const r2 = this.filesystem.resolveAbsolutePath(buffer.nodeId);
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

  getCursorInfo (params: {
    bufferWindowId: string;
    bufferId: string;
  }): types.CursorInfo {
    const buffer = this.findBuffer(params.bufferId);
    if (!buffer) {
      throw this.errorBufferNotFound(params.bufferId);
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

  getCommandLineBuffer (): types.IBuffer {
    const buffer = this.findBuffer(this.state.commandLineBufferId);
    if (!buffer || !dmn.utils.isBuffer(buffer)) {
      throw this.error("command line buffer not found");
    }
    return buffer;
  }

  getNode (nodeId: string): mfs.IFileSystemNode {
    const r1 = this.filesystem.getNode(nodeId);
    if (E.isLeft(r1)) {
      throw this.error(r1.left);
    }
    return r1.right;
  }

  getNodeByPath (path: string): mfs.IFileSystemNode {
    const r1 = this.filesystem.resolveNodeFromPath(path);
    if (E.isLeft(r1)) {
      throw this.error(r1.left);
    }
    return r1.right;
  }

  getAbsolutePath (nodeId: string): string {
    const r1 = this.filesystem.resolveAbsolutePath(nodeId);
    if (E.isLeft(r1)) {
      throw this.error(r1.left);
    }
    return r1.right;
  }

  updateBuffer (buffer: types.IBufferKind, opt?: types.SetStateOption): void {
    this.setState({
      buffers: this.state.buffers.find((b) => b.id === buffer.id)
        ? this.state.buffers.map((b) => b.id === buffer.id ? buffer.serialize() : b)
        : this.state.buffers.concat(buffer.serialize())
    }, opt);
  }

  updateWindow (bufferWindow: types.IBufferWindow, opt?: types.SetStateOption): void {
    this.setState({
      windows: this.state.windows.find((w) => w.id === bufferWindow.id)
        ? this.state.windows.map((w) => w.id === bufferWindow.id ? bufferWindow.serialize() : w)
        : this.state.windows.concat(bufferWindow.serialize())
    }, opt);
  }

  ensureBufferCursorLine (buffer: types.IBufferKind, ofs?: number): void {
    const offset = ofs ?? 0;
    const lines = this.getLineTextsOfBuffer(buffer.id);
    if (buffer.cursorLine < 0) {
      buffer.cursorLine = 0;
    }
    else if (buffer.cursorLine >= (lines.length - 1 + offset)) {
      buffer.cursorLine = lines.length - 1 + offset;
    }
  }

  updateTextarea (params: {
    value?: string;
    position: number;
  }): void {
    if (typeof params.value === "string") this.handlerTextarea.value = params.value;
    if (typeof params.position === "number") {
      this.handlerTextarea.selectionStart = params.position;
      this.handlerTextarea.selectionEnd = params.position;
    }
    this.handlerTextarea.dispatchEvent(new Event("change"));
  }
}
