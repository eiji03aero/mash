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

type NodeGroup = {files: IFile[], directories: IDirectory[]};

export const groupNodes = (nodes: IFileSystemNode[]): NodeGroup => {
  return nodes.reduce((accum, cur): NodeGroup => {
    if (isFile(cur)) {
      accum.files.push(cur);
    }
    else if (isDirectory(cur)) {
      accum.directories.push(cur);
    }
    return accum;
  }, {files: [], directories: []} as NodeGroup)
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
