import {
  IFileSystemNode,
  IDirectory,
  IFile,
} from './types';
import { Directory } from './Directory';
import { File } from './File';

export const isDirectory = (node: IFileSystemNode): node is IDirectory => {
  return node instanceof Directory;
};

export const isFile = (node: IFileSystemNode): node is IFile => {
  return node instanceof File;
};
