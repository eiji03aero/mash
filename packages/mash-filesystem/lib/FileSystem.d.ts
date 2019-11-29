import { IDirectoryBasis, IDirectory, IFileBasis, IFile, IFileSystemCommandResult, IFileSystem } from './types';
export declare class FileSystem implements IFileSystem {
    private static _instance;
    currentDirectory: IDirectory;
    root: IDirectory;
    static bootstrap(): FileSystem;
    static get instance(): FileSystem;
    static reboot(): FileSystem;
    private constructor();
    changeCurrentDirectory(args: {
        path: string;
    }): IFileSystemCommandResult;
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
    private _resolveNodeFromPath;
}
//# sourceMappingURL=FileSystem.d.ts.map