import * as E from "fp-ts/lib/Either";
import * as mc from "mash-common";
import uuid from "uuid/v4";

import { Directory } from "./Directory";
import { File } from "./File";
import { NodeStore } from "./NodeStore";
import * as types from "./types";
import * as utils from "./utils";

export class FileSystem implements types.IFileSystem {
  private static _instance: types.IFileSystem;
  private _middlewares: types.Operation.Middlewares;

  static get instance (): types.IFileSystem {
    return this._instance;
  }

  static bootstrap (): types.IFileSystem {
    this._instance = new FileSystem();
    return this._instance;
  }

  static reboot (): types.IFileSystem {
    return this.bootstrap();
  }

  private _nodeStore: types.INodeStore;
  private _currentDirectoryId: string;

  private constructor () {
    const rootDirectory = new Directory({
      id: "root",
      name: "",
      parentNodeId: "root",
      createdAt: mc.date.getCurrentTime(),
      updatedAt: mc.date.getCurrentTime(),
    });

    this._nodeStore = new NodeStore();
    this._nodeStore.setRootDirectory(rootDirectory);
    this._currentDirectoryId = rootDirectory.id;
    this._middlewares = {
      "file:beforeCreate": [],
      "file:beforeUpdate": [],
      "file:beforeDelete": [],
      "directory:beforeCreate": [],
      "directory:beforeUpdate": [],
      "directory:beforeDelete": [],
    } as types.Operation.Middlewares;
  }

  get size (): number {
    return this._nodeStore.size;
  }

  get rootDirectory (): types.IDirectory {
    const r = this.resolveNodeFromPath("/");
    if (E.isLeft(r)) throw new Error("root directory is not properly set");
    return r.right as types.IDirectory;
  }

  get currentDirectory (): types.IDirectory {
    const r = this._expectDirectoryById(this._currentDirectoryId);
    if (E.isLeft(r)) throw new Error("current directory is not properly set");
    return r.right;
  }

  async createFile (p: types.Operation.CreateFileParams): types.PromisedEither<types.IFile> {
    for (const m of this._middlewares["file:beforeCreate"]) {
      const r = await m(p);
      if (E.isLeft(r)) {
        return r;
      }
    }

    const file = new File(p.params);
    const r = this._nodeStore.addNode({
      parentNodeId: p.parentNodeId,
      node: file,
    });
    if (E.isLeft(r)) {
      return r;
    }

    return E.right(file);
  }

  async updateFile (p: types.Operation.UpdateFileParams): types.PromisedEither<types.IFile> {
    for (const m of this._middlewares["file:beforeUpdate"]) {
      const r = await m(p);
      if (E.isLeft(r)) {
        return r;
      }
    }

    const r1 = this._nodeStore.getNode(p.id);
    if (E.isLeft(r1)) {
      return r1;
    }
    const file = r1.right;

    if (!utils.isFile(file)) {
      return E.left(new Error("not a file"));
    }

    file.update(p.params);
    return E.right(file);
  }


  async deleteFile (p: types.Operation.DeleteFileParams): types.PromisedEither<null> {
    for (const m of this._middlewares["file:beforeDelete"]) {
      const r = await m(p);
      if (E.isLeft(r)) {
        return r;
      }
    }

    return this._nodeStore.deleteNode(p.id);
  }

  async createDirectory (p: {
    parentNodeId: string;
    params: types.IDirectoryBasis;
  }): types.PromisedEither<types.IDirectory> {
    for (const m of this._middlewares["directory:beforeCreate"]) {
      const r = await m(p);
      if (E.isLeft(r)) {
        return r;
      }
    }

    const directory = new Directory(p.params);
    const r = this._nodeStore.addNode({
      parentNodeId: p.parentNodeId,
      node: directory,
    });
    if (E.isLeft(r)) return r;

    return E.right(directory);
  }

  async updateDirectory (p: types.Operation.UpdateDirectoryParams):
  types.PromisedEither<types.IDirectory> {
    for (const m of this._middlewares["directory:beforeUpdate"]) {
      const r = await m(p);
      if (E.isLeft(r)) {
        return r;
      }
    }

    const r1 = this._nodeStore.getNode(p.id);
    if (E.isLeft(r1)) {
      return r1;
    }
    const directory = r1.right;

    if (!utils.isDirectory(directory)) {
      return E.left(new Error("not a directory"));
    }

    directory.update(p.params);
    return E.right(directory);
  }

  async deleteDirectory (p: types.Operation.DeleteDirectoryParams): types.PromisedEither<null> {
    for (const m of this._middlewares["directory:beforeDelete"]) {
      const r = await m(p);
      if (E.isLeft(r)) {
        return r;
      }
    }

    return this._nodeStore.deleteNode(p.id);
  }

  async createNodeByPath (path: string): types.PromisedEither<types.IFileSystemNode> {
    const inspected = mc.paths.inspect(path);
    const r1 = this.resolveNodeFromPath(inspected.dirname);
    if (E.isLeft(r1)) {
      return r1;
    }
    const parentNode = r1.right;

    if (!utils.isDirectory(parentNode)) {
      return E.left(new Error("parentNode is not directory"));
    }

    if (path[path.length - 1] === "/") {
      return this.createDirectory({
        parentNodeId: parentNode.id,
        params: {
          name: inspected.basename,
        }
      });
    }
    else {
      return this.createFile({
        parentNodeId: parentNode.id,
        params: {
          name: inspected.basename,
        }
      });
    }
  }

  async moveNodeByPath (params: {
    nodeId: string;
    path: string;
  }): types.PromisedEither<types.IFileSystemNode> {
    const inspected = mc.paths.inspect(params.path);

    const r1 = this._expectDirectoryByPath(inspected.dirname);
    if (E.isLeft(r1)) {
      return r1;
    }
    const nextParentNode = r1.right;

    const r2 = this.getNode(params.nodeId);
    if (E.isLeft(r2)) {
      return r2;
    }
    const node = r2.right;

    const r3 = this._expectDirectoryById(node.parentNodeId);
    if (E.isLeft(r3)) {
      return r3;
    }
    const parentNode = r3.right;

    const r4 = await this.updateDirectory({
      id: parentNode.id,
      params: {
        children: parentNode.children.filter((c) => c !== node.id)
      }
    });
    if (E.isLeft(r4)) {
      return r4;
    }
    const r5 = await this.updateFile({
      id: node.id,
      params: {
        parentNodeId: nextParentNode.id,
        name: inspected.basename,
      }
    });
    if (E.isLeft(r5)) {
      return r5;
    }
    const r6 = await this.updateDirectory({
      id: nextParentNode.id,
      params: {
        children: nextParentNode.children.concat(node.id)
      }
    })
    if (E.isLeft(r6)) {
      return r6;
    }

    const r7 = this.getNode(params.nodeId);
    if (E.isLeft(r7)) {
      return r7;
    }

    return E.right(r7.right);
  }

  async deleteNodeByPath (path: string): types.PromisedEither<null> {
    const r1 = this.resolveNodeFromPath(path);
    if (E.isLeft(r1)) {
      return r1;
    }
    const node = r1.right;

    if (utils.isDirectory(node)) {
      return this.deleteDirectory({
        id: node.id,
      });
    }
    else {
      return this.deleteFile({
        id: node.id,
      });
    }
  }

  changeCurrentDirectory (id: string): E.Either<Error, null> {
    const r = this._expectDirectoryById(id);
    if (E.isLeft(r)) return r;

    this._currentDirectoryId = id
    return E.right(null);
  }

  resolveNodeFromPath (path: string): E.Either<Error, types.IFileSystemNode> {
    return this._nodeStore.resolveNodeFromPath({
      path: path,
      currentDirectoryId: this._currentDirectoryId,
    });
  }

  resolveAbsolutePath (id: string): E.Either<Error, string> {
    return this._nodeStore.resolveAbsolutePath(id);
  }

  getNode (id: string): E.Either<Error, types.IFileSystemNode> {
    return this._nodeStore.getNode(id);
  }

  getNodes (ids: string[]): E.Either<Error, types.Nodes> {
    return this._nodeStore.getNodes(ids);
  }

  installNodes (parentNodeId: string, nodes: any[]): void {
    const r = this._expectDirectoryById(parentNodeId);
    if (E.isLeft(r)) throw r.left;
    const parentNode = r.right;

    for (const n of nodes) {
      this._installNode(parentNode.id, n);
    }
  }

  addMiddleware (params: types.Operation.RegisterMiddlewareyPayloadKind): void {
    switch (params.type) {
      case "file:beforeCreate":
        this._middlewares[params.type].push(params.callback);
        break;
      case "file:beforeDelete":
        this._middlewares[params.type].push(params.callback);
        break;
      case "directory:beforeCreate":
        this._middlewares[params.type].push(params.callback);
        break;
      case "directory:beforeDelete":
        this._middlewares[params.type].push(params.callback);
        break;
    }
  }

  private _expectDirectoryById (id: string): E.Either<Error, types.IDirectory> {
    const r = this._nodeStore.getNode(id);
    if (E.isLeft(r)) return r;
    if (!utils.isDirectory(r.right)) {
      const error = new Error(`not a directory ${r.right.name}`);
      return E.left(error);
    }
    return E.right(r.right);
  }

  private _expectDirectoryByPath (path: string): E.Either<Error, types.IDirectory> {
    const r = this.resolveNodeFromPath(path);
    if (E.isLeft(r)) {
      return r;
    }
    return this._expectDirectoryById(r.right.id);
  }

  private _installNode (parentNodeId: string, params: any) {
    const ownId = uuid();

    if (params.children) {
      this._installDirectory(parentNodeId, { ...params, id: ownId });
      for (const c of params.children) {
        this._installNode(ownId, c);
      }
    }
    else if (params.content) {
      this._installFile(parentNodeId, { ...params, id: ownId });
    }
  }

  private _installDirectory (parentNodeId: string, params: any) {
    this.createDirectory({
      parentNodeId,
      params: {
        id: params.id,
        name: params.name,
        parentNodeId,
        createdAt: mc.date.getCurrentTime(),
        updatedAt: mc.date.getCurrentTime(),
      },
    });
  }

  private _installFile (parentNodeId: string, params: any) {
    this.createFile({
      parentNodeId,
      params: {
        id: params.id,
        name: params.name,
        content: params.content,
        parentNodeId,
        createdAt: mc.date.getCurrentTime(),
        updatedAt: mc.date.getCurrentTime(),
      },
    });
  }
}
