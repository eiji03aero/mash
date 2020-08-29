import { Directory } from "./Directory";
import { File } from "./File";
import {
  IDirectory,
  IFile,
  IFileSystemNode,
} from "./types";

export const isDirectory = (node: IFileSystemNode): node is IDirectory => {
  return node instanceof Directory;
};

export const isFile = (node: IFileSystemNode): node is IFile => {
  return node instanceof File;
};

export const parsePath = (path: string): {isAbsolutePath: boolean, fragments: string[]} => {
  const isAbsolutePath = path[0] === "/";
  const fragments = isAbsolutePath
    ? path.substring(1).split("/")
    : path.split("/");
  return {
    isAbsolutePath,
    fragments,
  };
};
