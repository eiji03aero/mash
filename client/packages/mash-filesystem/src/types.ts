import { Either } from "mash-common";

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
  }): Either;
  deleteNode(id: string): Either;
  getNode(id: string): Either<IFileSystemNode>;
  getNodes(ids: string[]): Either<Nodes>;
  resolveAbsolutePath(id: string): Either<string>;
  resolveNodeFromPath(params: {
    path: string;
    currentDirectoryId: string;
  }): Either<IFileSystemNode>;
}

export interface IFileSystem {
  currentDirectory: IDirectory;
  rootDirectory: IDirectory;
  size: number;
  changeCurrentDirectory(id: string): Either;
  createFile(params: {
    parentNodeId: string;
    params: IFileBasis;
  }): Either<IFile>;
  deleteFile(id: string): Either;
  createDirectory(params: {
    parentNodeId: string;
    params: IDirectoryBasis;
  }): Either<IDirectory>;
  deleteDirectory(id: string): Either;
  resolveNodeFromPath(path: string): Either<IFileSystemNode>;
  resolveAbsolutePath(id: string): Either<string>;
  getNodes(ids: string[]): Either<Nodes>;
  installNodes(parentDirectoryId: string, nodes: any[]): void;
}

export interface ITargetNodePathStat {
  dirname: string;
  basename: string;
  parentDirectory: IDirectory;
  isBaseExists: boolean;
}
