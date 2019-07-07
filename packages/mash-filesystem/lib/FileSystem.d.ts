import { Errors } from "mash-common";
import { FileSystemNode } from "./FileSystemNode";
import { Directory, DirectoryBasis } from "./Directory";
import { File, FileBasis } from "./File";
export interface FileSystemCommandResult {
    error?: Errors.Base;
}
export declare class FileSystem {
    private static _instance;
    currentDirectory: Directory;
    root: Directory;
    private constructor();
    static bootstrap(): FileSystem;
    static readonly instance: FileSystem;
    static reboot(): FileSystem;
    changeCurrentDirectory(args: {
        path: string;
    }): FileSystemCommandResult;
    createNode<T extends File | Directory>(args: {
        path: string;
        params: FileBasis | DirectoryBasis;
    }): FileSystemCommandResult & {
        node?: T;
    };
    updateNode<T extends FileSystemNode>(args: {
        path: string;
        params: FileBasis | DirectoryBasis;
    }): FileSystemCommandResult & {
        node?: T;
    };
    deleteNode<T extends FileSystemNode>(args: {
        path: string;
    }): FileSystemCommandResult & {
        node?: T;
    };
    private splitLastFragmentFromPath;
    private resolveNodeFromPath;
}
//# sourceMappingURL=FileSystem.d.ts.map