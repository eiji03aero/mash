import mongoose from "mongoose";
import { Response } from "express";

interface CIFile {
  name: string;
  content: string;
}

interface CIDirectory {
  name: string;
  children: any[];
}

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  rememberToken: string;
  homeDirectory: IDirectory;
  comparePassword(pass: string): Promise<boolean>;
  files(): IFile[];
  directories(): IDirectory[];
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

export interface IGraphqlContext {
  req: Request;
  res: Response;
  currentUser: IUser | null;
  datasources: IDatasources;
}

export interface IDatasources {
  userAPI: IUserAPI;
  fileSystemAPI: IFileSystemAPI;
}

export interface IUserAPI {
  signup(params: {name: string; email: string; password: string}): Promise<IUser>;
  login(params: {email: string; password: string; res: Response}): Promise<IUser | Error>;
  logout(params: {email: string; res: Response}): Promise<IUser | Error>;
}

export interface IFileSystemAPI {
  hoge: string;
}
