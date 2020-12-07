import * as E from "fp-ts/lib/Either";

export type PromisedEither<T> = Promise<E.Either<Error, T>>;

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
  children?: string[];
}

export interface IDirectory extends IFileSystemNode {
  children: string[];
  update(p: Partial<IDirectoryBasis>): void;
  addChild(id: string): void;
  removeChild(id: string): void;
}

export interface IFileBasis extends IFileSystemNodeBasis {
  content?: string;
}

export interface IFile extends IFileSystemNode {
  content: string;
  update(p: Partial<IFileBasis>): void;
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

export namespace Operation {
  export type CreateFileParams = {
    parentNodeId: string;
    params: IFileBasis;
  };
  export type CreateFileMiddlewareFunc = (p: CreateFileParams) => PromisedEither<null>;

  export type UpdateFileParams = {
    id: string;
    params: Partial<IFileBasis>;
  };
  export type UpdateFileMiddlewareFunc = (p: UpdateFileParams) => PromisedEither<null>;

  export type DeleteFileParams = {
    id: string;
  };
  export type DeleteFileMiddlewareFunc = (p: DeleteFileParams) => PromisedEither<null>;

  export type CreateDirectoryParams = {
    parentNodeId: string;
    params: IDirectoryBasis;
  };
  export type CreateDirectoryMiddlewareFunc = (p: CreateDirectoryParams) => PromisedEither<null>;

  export type UpdateDirectoryParams = {
    id: string;
    params: Partial<IDirectoryBasis>;
  };
  export type UpdateDirectoryMiddlewareFunc = (p: UpdateDirectoryParams) => PromisedEither<null>;

  export type DeleteDirectoryParams = {
    id: string;
  };
  export type DeleteDirectoryMiddlewareFunc = (p: DeleteDirectoryParams) => PromisedEither<null>;

  export type Middlewares = {
    "file:beforeCreate": Array<CreateFileMiddlewareFunc>;
    "file:beforeUpdate": Array<UpdateFileMiddlewareFunc>;
    "file:beforeDelete": Array<DeleteFileMiddlewareFunc>;
    "directory:beforeCreate": Array<CreateDirectoryMiddlewareFunc>;
    "directory:beforeUpdate": Array<UpdateDirectoryMiddlewareFunc>;
    "directory:beforeDelete": Array<DeleteDirectoryMiddlewareFunc>;
  };

  export type Names = keyof Middlewares;
  export type RegisterMiddlewareyPayload<T, C> = {
    type: T;
    callback: C;
  };
  export type RegisterMiddlewareyPayloadKind =
    | RegisterMiddlewareyPayload<"file:beforeCreate", CreateFileMiddlewareFunc>
    | RegisterMiddlewareyPayload<"file:beforeUpdate", UpdateFileMiddlewareFunc>
    | RegisterMiddlewareyPayload<"file:beforeDelete", DeleteFileMiddlewareFunc>
    | RegisterMiddlewareyPayload<"directory:beforeCreate", CreateDirectoryMiddlewareFunc>
    | RegisterMiddlewareyPayload<"directory:beforeUpdate", UpdateDirectoryMiddlewareFunc>
    | RegisterMiddlewareyPayload<"directory:beforeDelete", DeleteDirectoryMiddlewareFunc>;

  export type MiddlewareFuncs =
    | CreateFileMiddlewareFunc
    | UpdateFileMiddlewareFunc
    | DeleteFileMiddlewareFunc
    | CreateDirectoryMiddlewareFunc
    | UpdateDirectoryMiddlewareFunc
    | DeleteDirectoryMiddlewareFunc;
}

export interface IFileSystem {
  currentDirectory: IDirectory;
  rootDirectory: IDirectory;
  size: number;
  changeCurrentDirectory(id: string): E.Either<Error, null>;
  createFile: (p: Operation.CreateFileParams) => PromisedEither<IFile>;
  updateFile: (p: Operation.UpdateFileParams) => PromisedEither<IFile>;
  deleteFile(p: Operation.DeleteFileParams): PromisedEither<null>;
  createDirectory(p: Operation.CreateDirectoryParams): PromisedEither<IDirectory>;
  updateDirectory(p: Operation.UpdateDirectoryParams): PromisedEither<IDirectory>;
  deleteDirectory(p: Operation.DeleteDirectoryParams): PromisedEither<null>;
  createNodeByPath(path: string): PromisedEither<IFileSystemNode>;
  moveNodeByPath(p: {
    nodeId: string;
    path: string;
  }): PromisedEither<IFileSystemNode>;
  deleteNodeByPath(path: string): PromisedEither<null>;
  resolveNodeFromPath(path: string): E.Either<Error, IFileSystemNode>;
  resolveAbsolutePath(id: string): E.Either<Error, string>;
  getNode(id: string): E.Either<Error, IFileSystemNode>;
  getNodes(ids: string[]): E.Either<Error, Nodes>;
  installNodes(parentDirectoryId: string, nodes: any[]): void;
  addMiddleware(params: Operation.RegisterMiddlewareyPayloadKind): void;
}

export interface ITargetNodePathStat {
  dirname: string;
  basename: string;
  parentDirectory: IDirectory;
  isBaseExists: boolean;
}
