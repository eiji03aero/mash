import { IDirectoryBasis, IDirectory, IFileBasis, IFile, IFileSystemNode, IFileSystemCommandResult, IFileSystem } from './types';
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
    resolveAbsolutePath(node: IFileSystemNode): string;
    createFile(args: {
        path: string;
        params: IFileBasis;
    }): IFileSystemCommandResult & {
        node?: IFile;
    };
    updateFile(args: {
        path: string;
        params: IFileBasis;
    }): IFileSystemCommandResult & {
        node?: IFile;
    };
    deleteFile(args: {
        path: string;
    }): IFileSystemCommandResult;
    createDirectory(args: {
        path: string;
        params: IDirectoryBasis;
    }): IFileSystemCommandResult & {
        node?: IDirectory;
    };
    updateDirectory(args: {
        path: string;
        params: IDirectoryBasis;
    }): IFileSystemCommandResult & {
        node?: IDirectory;
    };
    deleteDirectory(args: {
        path: string;
    }): IFileSystemCommandResult;
    private _splitLastFragmentFromPath;
    private _isRootDirectory;
    private _resolveNodeFromPath;
}
//# sourceMappingURL=FileSystem.d.ts.map