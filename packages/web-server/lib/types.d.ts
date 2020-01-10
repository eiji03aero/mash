import mongoose from "mongoose";
export interface IFile extends mongoose.Document {
    name: string;
    content: string;
}
export interface IDirectory extends mongoose.Document {
    name: string;
    files: IFile[];
    directories: this[];
}
//# sourceMappingURL=types.d.ts.map