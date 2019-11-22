import { IFileSystemNodeBasis, IFileSystemNode } from './types';
export declare class FileSystemNode implements IFileSystemNode {
    cid: string;
    name: string;
    parentNode?: IFileSystemNode;
    createdAt: string;
    updatedAt: string;
    constructor(params: IFileSystemNodeBasis);
    get isDirectory(): boolean;
    update(args: IFileSystemNodeBasis): void;
    setParentNode(node: IFileSystemNode): void;
}
//# sourceMappingURL=FileSystemNode.d.ts.map