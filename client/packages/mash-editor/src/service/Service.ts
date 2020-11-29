import * as mfs from "mash-filesystem";
import * as mc from "mash-common";
import { EventEmitter } from "events";
import * as E from "fp-ts/es6/Either";

import * as types from "../types";
import * as dmn from "../domain";
import { InputHandler } from "./InputHandler";
import { defaultConfig } from "./config";

export class Service implements types.IService {
  state: types.AS;
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

    this.state = this.buildInitialState();
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

  setState (s: Partial<types.AS>): void {
    this.state = {
      ...this.state,
      ...s,
      ui: {
        ...this.state.ui,
        ...s.ui,
      },
    };
    this.requestAction({
      type: "setState",
      state: this.state,
    });
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
      windows: this.updateWindows(bufferWindow),
      buffers: this.updateBuffers(buffer),
    });
  }

  handleKeyPress (params: {
    key: string;
    ctrlKey: boolean;
  }): void {
    return this._inputHandler.handleKey({
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

    return recur(filer.nodeId, 0);
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

    const dom = document.querySelector<HTMLElement>(`[data-buffer-window-id="${bufferWindow.id}"]`);
    if (!dom) {
      throw new Error("buffer window dom not found");
    }

    const rowHeight = this.getRowHeight();
    const windowHeight = dom.offsetHeight;

    return {
      lines: this.getLinesOfBuffer(buffer.id),
      displayLines: Math.floor(windowHeight / rowHeight)
    };
  }

  getRowHeight (): number {
    const c = this.state.config;
    // 2 is border width
    return c.rowPaddingTop + c.fontSize + c.rowPaddingBottom + 2;
  }

  getMaxDisplayRowNumber (): number {
    return Math.floor(window.innerHeight / this.getRowHeight());
  }

  private getLinesOfBuffer (bufferId: string): number {
    const buffer = this.findBuffer(bufferId);
    if (!buffer) {
      throw new Error("buffer not found");
    }

    if (dmn.utils.isBuffer(buffer)) {
      return mc.text.splitByNewLine(buffer.serialize().content).length;
    }
    else if (dmn.utils.isFiler(buffer)) {
      // FIXME: make it compatible with recursive calculation for opened directories
      return this.getFilerRows(buffer.id).length;
    }
    else {
      throw new Error("unknown buffer type");
    }
  }

  updateBuffers (buffer: types.IBufferKind): types.SBufferKind[] {
    return this.state.buffers.find((b) => b.id === buffer.id)
      ? this.state.buffers.map((b) => b.id === buffer.id ? buffer.serialize() : b)
      : this.state.buffers.concat(buffer.serialize());
  }

  updateWindows (bufferWindow: types.IBufferWindow): types.SBufferWindow[] {
    return this.state.windows.find((w) => w.id === bufferWindow.id)
      ? this.state.windows.map((w) => w.id === bufferWindow.id ? bufferWindow.serialize() : w)
      : this.state.windows.concat(bufferWindow.serialize());
  }
}
