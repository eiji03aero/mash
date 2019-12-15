import { Either, Errors } from "mash-common";
export interface IFileSystemNodeBasis {
    name?: string;
}
export interface IFileSystemNode {
    cid: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    update(args: IFileSystemNodeBasis): void;
    parentNode: IDirectory;
}
export declare type Nodes = IFileSystemNode[];
export interface IDirectoryBasis extends IFileSystemNodeBasis {
    children?: Nodes;
    root?: boolean;
}
export interface IDirectory extends IFileSystemNode {
    children: Nodes;
    update(args: IDirectoryBasis): void;
    addChild(node: IFileSystemNode): void;
    removeChild(node: IFileSystemNode): void;
    containsByName(name: string): boolean;
    findByName(name: string): (IFileSystemNode | undefined);
    isRoot(): boolean;
}
export interface IFileBasis extends IFileSystemNodeBasis {
    content?: string;
}
export interface IFile extends IFileSystemNode {
    content: string;
}
export interface IFileSystem {
    currentDirectory: IDirectory;
    changeCurrentDirectory(path: string): Either;
    resolveNodeFromPath(path: string): Either<IFileSystemNode>;
    resolveAbsolutePath(node: IFileSystemNode): string;
    createFile(path: string): Either<IFile>;
    deleteFile(path: string): Either;
    createDirectory(path: string): Either<IDirectory>;
    deleteDirectory(path: string): Either;
    updateNodeName(path: string, name: string): Either;
}
export interface IFileSystemCommandResult {
    error?: Errors.Base;
}
export interface IFileSystemCommandResultNode<T extends IFileSystemNode> extends IFileSystemCommandResult {
    node?: T;
}
export interface ITargetNodePathStat {
    dirname: string;
    basename: string;
    parentDirectory: IDirectory;
    isBaseExists: boolean;
}
//# sourceMappingURL=types.d.ts.map