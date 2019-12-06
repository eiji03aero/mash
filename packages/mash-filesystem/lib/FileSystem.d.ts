import { Either } from "mash-common";
import { IDirectory, IFile, IFileSystemNode, IFileSystem } from './types';
export declare class FileSystem implements IFileSystem {
    currentDirectory: IDirectory;
    root: IDirectory;
    private static _instance;
    static bootstrap(): FileSystem;
    static get instance(): FileSystem;
    static reboot(): FileSystem;
    private constructor();
    changeCurrentDirectory(path: string): Either;
    resolveNodeFromPath(path: string): Either<IFileSystemNode>;
    resolveAbsolutePath(node: IFileSystemNode): string;
    createFile(path: string): Either<IFile>;
    deleteFile(path: string): Either;
    createDirectory(path: string): Either<IDirectory>;
    deleteDirectory(path: string): Either;
    updateNodeName(path: string, name: string): Either;
    private _isRootDirectory;
    private _expectValidTargetNodePath;
}
//# sourceMappingURL=FileSystem.d.ts.map