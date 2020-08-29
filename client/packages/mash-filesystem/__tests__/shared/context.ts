import { date } from "mash-common";
import { Directory } from "../../src/Directory";
import { File } from "../../src/File";
import {
  IFile,
  IFileBasis,
  IDirectory,
  IDirectoryBasis,
} from "../../src/types";

let nodeCounter = 0;

export const hasFileBasis = (params: Partial<IFileBasis> = {}): IFileBasis => {
  return Object.assign({
    id: "file-id-" + nodeCounter++,
    name: "file" + nodeCounter++,
    content: "content",
    createdAt: date.getCurrentTime(),
    updatedAt: date.getCurrentTime(),
  }, params);
};

export const hasFile = (_params: Partial<IFileBasis> = {}): IFile => {
  const params = hasFileBasis(_params);
  return new File(params);
};

export const hasDirectoryBasis = (params: Partial<IDirectoryBasis> = {}): IDirectoryBasis => {
  return Object.assign({
    id: "directory-id-" + nodeCounter++,
    name: "directory" + nodeCounter++,
    children: [],
    createdAt: date.getCurrentTime(),
    updatedAt: date.getCurrentTime(),
  }, params);
};

export const hasDirectory = (_params: Partial<IDirectoryBasis> = {}): IDirectory => {
  const params = hasFileBasis(_params)
  return new Directory(params);
};
