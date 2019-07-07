import { FileSystemNodeBasis, FileSystemNode } from "./FileSystemNode";
export interface FileBasis extends FileSystemNodeBasis {
    content?: string;
}
export declare class File extends FileSystemNode {
    content: string;
    static isBasis(obj: any): obj is FileBasis;
    constructor(params: FileBasis);
    update(args: FileBasis): void;
}
//# sourceMappingURL=File.d.ts.map