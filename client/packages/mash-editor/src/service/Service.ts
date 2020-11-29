import * as mfs from "mash-filesystem";
import * as mc from "mash-common";
import { EventEmitter } from "events";
import * as E from "fp-ts/es6/Either";

import * as types from "../types";
import * as dmn from "../domain";
import { InputHandler } from "./InputHandler";
import { defaultConfig } from "./config";

export class Service implements types.IService {
  handlerTextarea: HTMLTextAreaElement;
  private _filesystem: mfs.IFileSystem;
  private _emitter: EventEmitter;
  private _inputHandler: types.IInputHandler;

  constructor (params: {
    filesystem: mfs.IFileSystem,
  }) {
    this.handlerTextarea = document.createElement("textarea");
    this._filesystem = params.filesystem;
    this._emitter = new EventEmitter();
    this._inputHandler = new InputHandler({
      service: this,
    });
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
        currentSourceId: buffer.id
      }).serialize(),
    ] as types.SBufferWindow[];

    return {
      ui: {
        changingWindow: false,
      },
      config: defaultConfig,
      windows,
      buffers,
      currentWindowId: windows[1].id,
    };
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

  getFilerRows (f: types.SFiler): types.FilerRow[] {
    const filer = new dmn.Filer(f);

    const recur = (nodeId: string, nest: number): types.FilerRow[] =>  {
      const nodes = this.getChildNodes(nodeId);
      const {files, directories} = mfs.utils.groupNodes(nodes);
      directories.sort((a, b) => mc.text.compareMagnitude(a.name, b.name));
      files.sort((a, b) => mc.text.compareMagnitude(a.name, b.name));

      return [...directories, ...files].reduce((accum, cur) => {
        accum.push({
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

    return recur(f.nodeId, 0);
  }

  openBuffer (state: types.AS, params: {
    nodeId: string;
  }): types.ApplicationState {
    const r1 = this._filesystem.getNode(params.nodeId);
    if (E.isLeft(r1)) {
      throw r1.left;
    }
    const node = r1.right;

    const bufferWindow = this.getModifiableBufferWindow(state);

    const buffer = (
      this.findBufferByNodeId(state, {
        bufferWindow: bufferWindow,
        nodeId: params.nodeId,
      })
      || this.createBufferWithNode({ node: node })
    );

    bufferWindow.openBuffer(buffer.id);

    return this.mergeState(state, {
      currentWindowId: bufferWindow.id,
      windows: this.updateWindows(state.windows, bufferWindow),
      buffers: this.updateBuffers(state.buffers, buffer),
    });
  }

  handleKeyPress (state: types.AS, params: {
    key: string;
    ctrlKey: boolean;
  }): types.ASHandlerResult {
    return this._inputHandler.handleKey(state, {
      key: params.key,
      ctrlKey: params.ctrlKey,
    });
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

  private getCurrentBufferWindow (s: types.AS): types.IBufferWindow {
    const bufferWindow = s.windows.find((w) => w.id === s.currentWindowId);
    if (!bufferWindow) {
      throw new Error("current buffer window not found");
    }
    return new dmn.BufferWindow(bufferWindow);
  }

  private getModifiableBufferWindow (s: types.AS): types.IBufferWindow {
    const bufferWindow = s.windows.find((w) => w.modifiable);
    if (!bufferWindow) {
      throw new Error("no modifiable window found");
    }
    return new dmn.BufferWindow(bufferWindow);
  }

  getCurrentBufferWindowSet (state: types.AS): types.BufferWindowSet {
    const bufferWindow = this.getCurrentBufferWindow(state);
    const buffer = this.findBuffer(state, { id: bufferWindow.currentSourceId })!;
    return { bufferWindow, buffer };
  }

  private findBuffer (state: types.AS, params: {
    id: string;
  }): types.IBufferKind | undefined {
    const sbuffer = state.buffers.find((b) => b.id === params.id);
    if (!sbuffer) {
      return;
    }
    return this.createBufferKind({ buffer: sbuffer });
  }

  findBufferByNodeId (state: types.AS, params: {
    bufferWindow: types.IBufferWindow;
    nodeId: string;
  }): types.IBufferKind | undefined {
    const buffer = state.buffers
      .find((b) => params.bufferWindow.hasSourceId(b.id) && b.nodeId === params.nodeId);
    if (!buffer) {
      return;
    }
    return this.createBufferKind({ buffer });
  }

  private createBufferKind (params: {
    buffer: types.SBufferKind;
  }): types.IBufferKind {
    if (params.buffer.type === "Buffer") {
      return new dmn.Buffer(params.buffer);
    }
    else if (params.buffer.type === "Filer") {
      return new dmn.Filer(params.buffer);
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
    config: types.Config;
    bufferWindow: types.IBufferWindow;
    buffer: types.IBufferKind;
  }): types.BufferWindowStats {
    const dom = document.querySelector<HTMLElement>(`[data-buffer-window-id="${params.bufferWindow.id}"]`);
    if (!dom) {
      throw new Error("buffer window dom not found");
    }

    const rowHeight = this.getRowHeight({ config: params.config });
    const windowHeight = dom.offsetHeight;

    return {
      lines: this.getLinesOfBuffer({ buffer: params.buffer }),
      displayLines: Math.floor(windowHeight / rowHeight)
    };
  }

  getRowHeight (params: {
    config: types.Config;
  }): number {
    const c = params.config;
    // 2 is border width
    return c.rowPaddingTop + c.fontSize + c.rowPaddingBottom + 2;
  }

  getMaxDisplayRowNumber (params: {
    config: types.Config;
  }): number {
    return Math.floor(window.innerHeight / this.getRowHeight(params));
  }

  private getLinesOfBuffer (params: {
    buffer: types.IBufferKind;
  }): number {
    const buffer = params.buffer.serialize();
    if (buffer.type === "Buffer") {
      return mc.text.splitByNewLine(buffer.content).length;
    }
    else if (buffer.type === "Filer") {
      // FIXME: make it compatible with recursive calculation for opened directories
      return this.getFilerRows(buffer).length;
    }
    else {
      throw new Error("unknown buffer type");
    }
  }

  mergeState (state: types.ApplicationState, partial: Partial<types.ApplicationState>):
  types.ApplicationState {
    return {
      ...state,
      ...partial,
      ui: {
        ...state.ui,
        ...partial.ui,
      }
    };
  }

  updateBuffers (buffers: types.SBufferKind[], buffer: types.IBufferKind):
  types.SBufferKind[] {
    return buffers.find((b) => b.id === buffer.id)
      ? buffers.map((b) => b.id === buffer.id ? buffer.serialize() : b)
      : buffers.concat(buffer.serialize());
  }

  updateWindows (windows: types.SBufferWindow[], bufferWindow: types.IBufferWindow):
  types.SBufferWindow[] {
    return windows.find((w) => w.id === bufferWindow.id)
      ? windows.map((w) => w.id === bufferWindow.id ? bufferWindow.serialize() : w)
      : windows.concat(bufferWindow.serialize());
  }
}
