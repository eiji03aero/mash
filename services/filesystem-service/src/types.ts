import mongoose from "mongoose";

interface CIFile {
  name: string;
  content: string;
}

interface CIDirectory {
  name: string;
  children: any[];
}

export interface IFile extends mongoose.Document {
  name: string;
  content: string;
  serialize(): CIFile;
}

export interface IDirectory extends mongoose.Document {
  name: string;
  files: IFile[];
  directories: this[];
  serialize(): CIDirectory;
}
