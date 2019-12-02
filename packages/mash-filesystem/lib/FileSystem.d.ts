import { IDirectoryBasis, IDirectory, IFileBasis, IFileSystemNode, IFileSystemCommandResult, IFileSystemCommandResultNode, IFileSystem } from './types';
export declare class FileSystem implements IFileSystem {
    currentDirectory: IDirectory;
    root: IDirectory;
    private static _instance;
    static bootstrap(): FileSystem;
    static get instance(): FileSystem;
    static reboot(): FileSystem;
    private constructor();
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
    }): IFileSystemCommandResult;
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
    }): IFileSystemCommandResult;
    private _splitLastFragmentFromPath;
    private _isRootDirectory;
}
//# sourceMappingURL=FileSystem.d.ts.map