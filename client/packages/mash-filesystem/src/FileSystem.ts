import { Either, Monad, date } from "mash-common";
import uuid from "uuid/v4";

import { Directory } from "./Directory";
import { File } from "./File";
import { NodeStore } from "./NodeStore";
import {
  IDirectory,
  IDirectoryBasis,
  IFile,
  IFileBasis,
  IFileSystem,
  IFileSystemNode,
  Nodes,
  INodeStore,
} from "./types";
import * as utils from "./utils";

export class FileSystem implements IFileSystem {
  private static _instance: FileSystem;

  static get instance () {
    return this._instance;
  }

  static bootstrap () {
    this._instance = new FileSystem();
    return this._instance;
  }

  static reboot () {
    delete this._instance;
    return this.bootstrap();
  }

  private _nodeStore: INodeStore;
  private _currentDirectoryId: string;

  private constructor () {
    const rootDirectory = new Directory({
      id: "root",
      name: "",
      parentNodeId: "root",
      createdAt: date.getCurrentTime(),
      updatedAt: date.getCurrentTime(),
    });

    this._nodeStore = new NodeStore();
    this._nodeStore.setRootDirectory(rootDirectory);
    this._currentDirectoryId = rootDirectory.id;
  }

  get size () {
    return this._nodeStore.size;
  }

  get rootDirectory () {
    const r = this.resolveNodeFromPath("/");
    if (r.isError) throw new Error("root directory is not properly set");
    return r.value as IDirectory;
  }

  get currentDirectory () {
    const r = this._expectDirectoryById(this._currentDirectoryId);
    if (r.isError) throw new Error("current directory is not properly set");
    return r.value;
  }

  createFile ({
    parentNodeId,
    params,
  }: {
    parentNodeId: string;
    params: IFileBasis;
  }): Either<IFile> {
    const file = new File(params);
    const r = this._nodeStore.addNode({
      parentNodeId: parentNodeId,
      node: file,
    });
    if (r.isError) return r;

    return Monad.either.right(file);
  }

  deleteFile (id: string): Either {
    return this._nodeStore.deleteNode(id);
  }

  createDirectory ({
    parentNodeId,
    params,
  }: {
    parentNodeId: string;
    params: IDirectoryBasis;
  }): Either<IDirectory> {
    const directory = new Directory(params);
    const r = this._nodeStore.addNode({
      parentNodeId,
      node: directory,
    });
    if (Monad.either.isLeft(r)) return r;

    return Monad.either.right(directory);
  }

  deleteDirectory (id: string): Either {
    return this._nodeStore.deleteNode(id);
  }

  changeCurrentDirectory (id: string): Either {
    const r = this._expectDirectoryById(id);
    if (Monad.either.isLeft(r)) return r;

    this._currentDirectoryId = id
    return Monad.either.right(null);
  }

  resolveNodeFromPath (path: string): Either<IFileSystemNode> {
    return this._nodeStore.resolveNodeFromPath({
      path: path,
      currentDirectoryId: this._currentDirectoryId,
    });
  }

  resolveAbsolutePath (id: string): Either<string> {
    return this._nodeStore.resolveAbsolutePath(id);
  }

  getNodes (ids: string[]): Either<Nodes> {
    return this._nodeStore.getNodes(ids);
  }

  installNodes (parentNodeId: string, nodes: any[]) {
    const r = this._expectDirectoryById(parentNodeId);
    if (Monad.either.isLeft(r)) throw r.error;
    const parentNode = r.value;

    for (const n of nodes) {
      this._installNode(parentNode.id, n);
    }
  }

  private _expectDirectoryById (id: string): Either<IDirectory> {
    const r = this._nodeStore.getNode(id);
    if (Monad.either.isLeft(r)) return r;
    if (!utils.isDirectory(r.value)) {
      const error = new Error(`not a directory ${r.value.name}`);
      return Monad.either.left(error);
    }
    return Monad.either.right(r.value);
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
        createdAt: date.getCurrentTime(),
        updatedAt: date.getCurrentTime(),
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
        createdAt: date.getCurrentTime(),
        updatedAt: date.getCurrentTime(),
      },
    });
  }
}
