import { FileSystemNode } from "./FileSystemNode";
import { IDirectory, IDirectoryBasis, IFileSystemNode, Nodes } from "./types";
export declare class Directory extends FileSystemNode implements IDirectory {
    static isBasis(obj: any): obj is IDirectoryBasis;
    children: Nodes;
    private _root;
    constructor(params: IDirectoryBasis);
    update(args: IDirectoryBasis): void;
    addChild(node: IFileSystemNode): void;
    removeChild(node: IFileSystemNode): void;
    containsByName(name: string): boolean;
    findByName(name: string): IFileSystemNode | undefined;
    isRoot(): boolean;
}
//# sourceMappingURL=Directory.d.ts.map