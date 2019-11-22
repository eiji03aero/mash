import { IDirectoryBasis, IDirectory, IFileSystemNode, Nodes } from './types';
import { FileSystemNode } from "./FileSystemNode";
export declare class Directory extends FileSystemNode implements IDirectory {
    children: Nodes;
    private __root__;
    static isBasis(obj: any): obj is IDirectoryBasis;
    constructor(params: IDirectoryBasis);
    update(args: IDirectoryBasis): void;
    addChild(node: IFileSystemNode): void;
    removeChild(node: IFileSystemNode): void;
    containsByName(name: string): boolean;
    findByName(name: string): IFileSystemNode | undefined;
    isRoot(): boolean;
}
//# sourceMappingURL=Directory.d.ts.map