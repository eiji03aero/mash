import * as E from "fp-ts/lib/Either";
import { date } from "mash-common";
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

  static get instance (): IFileSystem {
    return this._instance;
  }

  static bootstrap (): IFileSystem {
    this._instance = new FileSystem();
    return this._instance;
  }

  static reboot (): IFileSystem {
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

  get size (): number {
    return this._nodeStore.size;
  }

  get rootDirectory (): IDirectory {
    const r = this.resolveNodeFromPath("/");
    if (E.isLeft(r)) throw new Error("root directory is not properly set");
    return r.right as IDirectory;
  }

  get currentDirectory (): IDirectory {
    const r = this._expectDirectoryById(this._currentDirectoryId);
    if (E.isLeft(r)) throw new Error("current directory is not properly set");
    return r.right;
  }

  createFile ({
    parentNodeId,
    params,
  }: {
    parentNodeId: string;
    params: IFileBasis;
  }): E.Either<Error, IFile> {
    const file = new File(params);
    const r = this._nodeStore.addNode({
      parentNodeId: parentNodeId,
      node: file,
    });
    if (E.isLeft(r)) return r;

    return E.right(file);
  }

  deleteFile (id: string): E.Either<Error, null> {
    return this._nodeStore.deleteNode(id);
  }

  createDirectory ({
    parentNodeId,
    params,
  }: {
    parentNodeId: string;
    params: IDirectoryBasis;
  }): E.Either<Error, IDirectory> {
    const directory = new Directory(params);
    const r = this._nodeStore.addNode({
      parentNodeId,
      node: directory,
    });
    if (E.isLeft(r)) return r;

    return E.right(directory);
  }

  deleteDirectory (id: string): E.Either<Error, null> {
    return this._nodeStore.deleteNode(id);
  }

  changeCurrentDirectory (id: string): E.Either<Error, null> {
    const r = this._expectDirectoryById(id);
    if (E.isLeft(r)) return r;

    this._currentDirectoryId = id
    return E.right(null);
  }

  resolveNodeFromPath (path: string): E.Either<Error, IFileSystemNode> {
    return this._nodeStore.resolveNodeFromPath({
      path: path,
      currentDirectoryId: this._currentDirectoryId,
    });
  }

  resolveAbsolutePath (id: string): E.Either<Error, string> {
    return this._nodeStore.resolveAbsolutePath(id);
  }

  getNode (id: string): E.Either<Error, IFileSystemNode> {
    return this._nodeStore.getNode(id);
  }

  getNodes (ids: string[]): E.Either<Error, Nodes> {
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

  private _expectDirectoryById (id: string): E.Either<Error, IDirectory> {
    const r = this._nodeStore.getNode(id);
    if (E.isLeft(r)) return r;
    if (!utils.isDirectory(r.right)) {
      const error = new Error(`not a directory ${r.right.name}`);
      return E.left(error);
    }
    return E.right(r.right);
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
