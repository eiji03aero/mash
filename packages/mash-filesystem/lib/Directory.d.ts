import { FileSystemNodeBasis, FileSystemNode } from "./FileSystemNode";
declare type Nodes = FileSystemNode[];
export interface DirectoryBasis extends FileSystemNodeBasis {
    children?: Nodes;
    __root__?: boolean;
}
export declare class Directory extends FileSystemNode {
    children: Nodes;
    private __root__;
    static isBasis(obj: any): obj is DirectoryBasis;
    constructor(params: DirectoryBasis);
    update(args: DirectoryBasis): void;
    addChild(node: FileSystemNode): void;
    removeChild(node: FileSystemNode): void;
    containsByName(name: string): boolean;
    findByName(name: string): (FileSystemNode | undefined);
    isRoot(): boolean;
}
export {};
//# sourceMappingURL=Directory.d.ts.map