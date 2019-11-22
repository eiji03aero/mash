import { IFileBasis, IFile } from './types';
import { FileSystemNode } from "./FileSystemNode";
export declare class File extends FileSystemNode implements IFile {
    content: string;
    static isBasis(obj: any): obj is IFileBasis;
    constructor(params: IFileBasis);
    update(args: IFileBasis): void;
}
//# sourceMappingURL=File.d.ts.map