import { IDirectoryBasis, IDirectory, IFileBasis, IFile, IFileSystemNode, IFileSystemCommandResult, IFileSystemCommandResultNode, IFileSystem, FileSystemCommandOption } from './types';
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
    resolveNodeFromPath(path: string): IFileSystemCommandResultNode<IFileSystemNode>;
    resolveAbsolutePath(node: IFileSystemNode): string;
    createFile(args: {
        path: string;
        params: IFileBasis;
    }): IFileSystemCommandResultNode<IFile>;
    updateFile(args: {
        path: string;
        params: IFileBasis;
    }): IFileSystemCommandResultNode<IFile>;
    deleteFile(args: {
        path: string;
    }): IFileSystemCommandResult;
    createDirectory(args: {
        path: string;
        params: IDirectoryBasis;
    }): IFileSystemCommandResultNode<IDirectory>;
    updateDirectory(args: {
        path: string;
        params: IDirectoryBasis;
    }): IFileSystemCommandResultNode<IDirectory>;
    deleteDirectory(args: {
        path: string;
    }): IFileSystemCommandResult;
    deleteNodeFromPath(path: string, option?: FileSystemCommandOption): IFileSystemCommandResult;
    private _splitLastFragmentFromPath;
    private _isRootDirectory;
}
//# sourceMappingURL=FileSystem.d.ts.map