export interface FileSystemNodeBasis {
    name: string;
    parentNode?: FileSystemNode;
}
export declare class FileSystemNode {
    cid: string;
    name: string;
    parentNode?: FileSystemNode;
    createdAt: string;
    updatedAt: string;
    constructor(params: FileSystemNodeBasis);
    readonly isDirectory: boolean;
    update(args: FileSystemNodeBasis): void;
    setParentNode(node: FileSystemNode): void;
}
//# sourceMappingURL=FileSystemNode.d.ts.map