import { FileSystemNode } from "./FileSystemNode";
import { IFile, IFileBasis } from "./types";
export declare class File extends FileSystemNode implements IFile {
    static isBasis(obj: any): obj is IFileBasis;
    content: string;
    constructor(params: IFileBasis);
    update(args: IFileBasis): void;
}
//# sourceMappingURL=File.d.ts.map