import { IDirectoryBasis, IDirectory, IFileBasis, IFile, IFileSystemCommandResult } from './types';
import { FileSystemNode } from "./FileSystemNode";
export declare class FileSystem {
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
    createNode<T extends IFile | IDirectory>(args: {
        path: string;
        params: IFileBasis | IDirectoryBasis;
    }): IFileSystemCommandResult & {
        node?: T;
    };
    updateNode<T extends IFile | IDirectory>(args: {
        path: string;
        params: IFileBasis | IDirectoryBasis;
    }): IFileSystemCommandResult & {
        node?: T;
    };
    deleteNode<T extends FileSystemNode>(args: {
        path: string;
    }): IFileSystemCommandResult & {
        node?: T;
    };
    private _splitLastFragmentFromPath;
    private _resolveNodeFromPath;
}
//# sourceMappingURL=FileSystem.d.ts.map