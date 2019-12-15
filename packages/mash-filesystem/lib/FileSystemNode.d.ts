import { IFileSystemNode, IFileSystemNodeBasis, IDirectory } from "./types";
export declare class FileSystemNode implements IFileSystemNode {
    cid: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    private _parentNode;
    constructor(params: IFileSystemNodeBasis);
    get parentNode(): IDirectory;
    set parentNode(dir: IDirectory);
    update(args: IFileSystemNodeBasis): void;
}
//# sourceMappingURL=FileSystemNode.d.ts.map