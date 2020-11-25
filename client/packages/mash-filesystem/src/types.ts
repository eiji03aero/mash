import * as E from "fp-ts/lib/Either";

export interface IFileSystemNodeBasis {
  id?: string;
  name: string;
  parentNodeId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IFileSystemNode {
  id: string;
  name: string;
  parentNodeId: string;
  createdAt: string;
  updatedAt: string;
}

export type Nodes = IFileSystemNode[];

export interface IDirectoryBasis extends IFileSystemNodeBasis {
  _?: any;
}

export interface IDirectory extends IFileSystemNode {
  children: string[];
  addChild(id: string): void;
  removeChild(id: string): void;
}

export interface IFileBasis extends IFileSystemNodeBasis {
  content?: string;
}

export interface IFile extends IFileSystemNode {
  content: string;
}

export type NodeMap = Map<string, IFileSystemNode>;

export interface INodeStore {
  size: number;
  setRootDirectory(dir: IDirectory): void;
  addNode(params: {
    parentNodeId: string;
    node: IFileSystemNode;
  }): E.Either<Error, null>;
  deleteNode(id: string): E.Either<Error, null>;
  getNode(id: string): E.Either<Error, IFileSystemNode>;
  getNodes(ids: string[]): E.Either<Error, Nodes>;
  resolveAbsolutePath(id: string): E.Either<Error, string>;
  resolveNodeFromPath(params: {
    path: string;
    currentDirectoryId: string;
  }): E.Either<Error, IFileSystemNode>;
}

export interface IFileSystem {
  currentDirectory: IDirectory;
  rootDirectory: IDirectory;
  size: number;
  changeCurrentDirectory(id: string): E.Either<Error, null>;
  createFile(params: {
    parentNodeId: string;
    params: IFileBasis;
  }): E.Either<Error, IFile>;
  deleteFile(id: string): E.Either<Error, null>;
  createDirectory(params: {
    parentNodeId: string;
    params: IDirectoryBasis;
  }): E.Either<Error, IDirectory>;
  deleteDirectory(id: string): E.Either<Error, null>;
  resolveNodeFromPath(path: string): E.Either<Error, IFileSystemNode>;
  resolveAbsolutePath(id: string): E.Either<Error, string>;
  getNode(id: string): E.Either<Error, IFileSystemNode>;
  getNodes(ids: string[]): E.Either<Error, Nodes>;
  installNodes(parentDirectoryId: string, nodes: any[]): void;
}

export interface ITargetNodePathStat {
  dirname: string;
  basename: string;
  parentDirectory: IDirectory;
  isBaseExists: boolean;
}
