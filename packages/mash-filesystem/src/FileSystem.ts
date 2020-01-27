import { Either, Errors, Monad, date } from "mash-common";

import { Directory } from "./Directory";
import { File } from "./File";
// import { FileSystemNode } from "./FileSystemNode";
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

  get currentDirectory () {
    const r = this._expectDirectory(this._currentDirectoryId);
    if (r.isError) throw Errors.Factory.standard("current directory is not properly set");
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
    const r = this._expectDirectory(id);
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

  private _expectDirectory (id: string): Either<IDirectory> {
    const r = this._nodeStore.getNode(id);
    if (Monad.either.isLeft(r)) return r;
    if (!utils.isDirectory(r.value)) {
      const error = Errors.Factory.notDirectory(r.value.name);
      return Monad.either.left(error);
    }
    return Monad.either.right(r.value);
  }
}
