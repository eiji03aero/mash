import * as mfs from "mash-filesystem";
import { EventEmitter } from "events";
import * as E from "fp-ts/es6/Either";

import * as types from "../types";
import * as dmn from "../domain";

export class Service implements types.IService {
  private _filesystem: mfs.IFileSystem;
  private _emitter: EventEmitter;

  constructor (params: {
    filesystem: mfs.IFileSystem,
  }) {
    this._filesystem = params.filesystem;
    this._emitter = new EventEmitter();

    this._filesystem, this._emitter;
  }

  buildInitialState (): types.ApplicationState {
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

  openBuffer (state: types.ApplicationState, params: {
    nodeId: string;
  }): types.ApplicationState {
    const r1 = this._filesystem.getNode(params.nodeId);
    if (E.isLeft(r1)) {
      throw r1.left;
    }
    const node = r1.right;

    const sbufferWindow = state.windows.find((bw) => bw.id === state.currentWindowId)!;
    const bufferWindow = new dmn.BufferWindow(sbufferWindow);
    const sbuffer = (
      this.findBufferByNodeId(state, {
        bufferWindow: sbufferWindow,
        nodeId: params.nodeId,
      })
      || this.createBuffer({ node: node }).serialize()
    );

    bufferWindow.openBuffer(sbuffer.id);

    const windows = state.windows.map((bw) => {
      return bw.id === bufferWindow.id
        ? bufferWindow.serialize()
        : bw;
    });
    const buffers = state.buffers.find((b) => b.id === sbuffer.id)
      ? state.buffers.map((b) => b.id === sbuffer.id ? sbuffer : b)
      : state.buffers.concat(sbuffer);

    return this.mergeState(state, {
      windows,
      buffers,
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

  private mergeState (state: types.ApplicationState, partial: Partial<types.ApplicationState>):
  types.ApplicationState {
    return {
      ...state,
      ...partial,
    };
  }

  private findBufferByNodeId (state: types.ApplicationState, params: {
    bufferWindow: types.SBufferWindow;
    nodeId: string;
  }): types.SBufferKind | undefined {
    const bufferWindow = new dmn.BufferWindow(params.bufferWindow);
    return state.buffers
      .find((b) => bufferWindow.hasSourceId(b.id) && b.nodeId === params.nodeId);
  }

  private createBuffer (params: {
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
}
