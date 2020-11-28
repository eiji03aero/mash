import * as mfs from "mash-filesystem";
import * as mc from "mash-common";
import { EventEmitter } from "events";
import * as E from "fp-ts/es6/Either";

import * as types from "../types";
import * as dmn from "../domain";
import { defaultConfig } from "./config";

export class Service implements types.IService {
  handlerTextarea: HTMLTextAreaElement;
  private _filesystem: mfs.IFileSystem;
  private _emitter: EventEmitter;

  constructor (params: {
    filesystem: mfs.IFileSystem,
  }) {
    this.handlerTextarea = document.createElement("textarea");
    this._filesystem = params.filesystem;
    this._emitter = new EventEmitter();

    this._filesystem, this._emitter;
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
        width: 400,
      }).serialize(),
      new dmn.BufferWindow({
        currentSourceId: buffer.id
      }).serialize(),
    ] as types.SBufferWindow[];

    return {
      config: defaultConfig,
      windows,
      buffers,
      currentWindowId: windows[1].id,
    };
  }

  getChildNodes (id: string): mfs.IFileSystemNode[] {
    const r1 = this._filesystem.getNode(id);
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

  openBuffer (state: types.AS, params: {
    nodeId: string;
  }): types.ApplicationState {
    const r1 = this._filesystem.getNode(params.nodeId);
    if (E.isLeft(r1)) {
      throw r1.left;
    }
    const node = r1.right;

    const bufferWindow = this.getCurrentBufferWindow(state);
    const buffer = (
      this.findBufferByNodeId(state, {
        bufferWindow: bufferWindow,
        nodeId: params.nodeId,
      })
      || this.createBufferWithNode({ node: node })
    );

    bufferWindow.openBuffer(buffer.id);

    return this.mergeState(state, {
      windows: this.updateWindows(state.windows, bufferWindow),
      buffers: this.updateBuffers(state.buffers, buffer),
    });
  }

  handleKeyPress (state: types.AS, params: {
    key: string;
  }): types.AS {
    const { bufferWindow, buffer } = this.getCurrentBufferWindowSet(state);
    const stats = this.getWindowStats({
      config: state.config,
      bufferWindow,
      buffer,
    });

    bufferWindow.handleKey({
      key: params.key,
      buffer: buffer,
      stats: stats,
    });

    return this.mergeState(state, {
      windows: this.updateWindows(state.windows, bufferWindow),
      buffers: this.updateBuffers(state.buffers, buffer),
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

  private getCurrentBufferWindowSet (state: types.AS):
  { bufferWindow: types.IBufferWindow, buffer: types.IBufferKind } {
    const bufferWindow = this.getCurrentBufferWindow(state);
    const buffer = this.findBuffer(state, { id: bufferWindow.currentSourceId })!;
    return { bufferWindow, buffer };
  }

  private mergeState (state: types.ApplicationState, partial: Partial<types.ApplicationState>):
  types.ApplicationState {
    return {
      ...state,
      ...partial,
    };
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

  private findBufferByNodeId (state: types.AS, params: {
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

  private getWindowStats (params: {
    config: types.Config;
    bufferWindow: types.IBufferWindow;
    buffer: types.IBufferKind;
  }): types.BufferWindowStats {
    const dom = document.querySelector<HTMLElement>(`[data-buffer-window-id="${params.bufferWindow.id}"]`);
    if (!dom) {
      throw new Error("buffer window dom not found");
    }


    const cfg = params.config;
    // 2 is border width
    const rowHeight = cfg.fontSize + cfg.rowPaddingTop + cfg.rowPaddingBottom + 2;
    const windowHeight = dom.offsetHeight;

    return {
      lines: this.getLinesOfBuffer({ buffer: params.buffer }),
      displayLines: Math.floor(windowHeight / rowHeight)
    };
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
      return this.getChildNodes(buffer.nodeId).length;
    }
    else {
      throw new Error("unknown buffer type");
    }
  }

  private updateBuffers (buffers: types.SBufferKind[], buffer: types.IBufferKind):
  types.SBufferKind[] {
    return buffers.find((b) => b.id === buffer.id)
      ? buffers.map((b) => b.id === buffer.id ? buffer.serialize() : b)
      : buffers.concat(buffer.serialize());
  }

  private updateWindows (windows: types.SBufferWindow[], bufferWindow: types.IBufferWindow):
  types.SBufferWindow[] {
    return windows.find((w) => w.id === bufferWindow.id)
      ? windows.map((w) => w.id === bufferWindow.id ? bufferWindow.serialize() : w)
      : windows.concat(bufferWindow.serialize());
  }
}
