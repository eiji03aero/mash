import { Errors } from 'mash-common';
export interface IFileSystemNodeBasis {
    name?: string;
    parentNode?: IFileSystemNode;
}
export interface IFileSystemNode {
    cid: string;
    name: string;
    parentNode?: IFileSystemNode;
    createdAt: string;
    updatedAt: string;
    isDirectory: boolean;
    update(args: IFileSystemNodeBasis): void;
    setParentNode(node: IFileSystemNode): void;
}
export declare type Nodes = IFileSystemNode[];
export interface IDirectoryBasis extends IFileSystemNodeBasis {
    children?: Nodes;
    __root__?: boolean;
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
    changeCurrentDirectory(args: {
        path: string;
    }): IFileSystemCommandResult;
    resolveNodeFromPath(path: string): IFileSystemCommandResultNode;
    resolveAbsolutePath(node: IFileSystemNode): string;
    createFile(args: {
        path: string;
        params: IFileBasis;
    }): IFileSystemCommandResultNode;
    updateFile(args: {
        path: string;
        params: IFileBasis;
    }): IFileSystemCommandResultNode;
    deleteFile(args: {
        path: string;
    }): IFileSystemCommandResultNode;
    createDirectory(args: {
        path: string;
        params: IDirectoryBasis;
    }): IFileSystemCommandResultNode;
    updateDirectory(args: {
        path: string;
        params: IDirectoryBasis;
    }): IFileSystemCommandResultNode;
    deleteDirectory(args: {
        path: string;
    }): IFileSystemCommandResultNode;
}
export interface IFileSystemCommandResult {
    error?: Errors.Base;
}
export interface IFileSystemCommandResultNode extends IFileSystemCommandResult {
    node?: IFileSystemNode;
}
//# sourceMappingURL=types.d.ts.map