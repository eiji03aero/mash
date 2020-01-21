import mongoose from "mongoose";

interface CIFile {
  id: string;
  name: string;
  content: string;
}

interface CIDirectory {
  id: string;
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

export interface ISystemProfile extends mongoose.Document {
  ownerId: string;
  rootDirectory: IDirectory;
}
