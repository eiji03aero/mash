import { date } from "mash-common";
import { Directory } from "../../src/Directory";
import { File } from "../../src/File";

let nodeCounter = 0;

export const hasFileBasis = (params: any = {}) => {
  return Object.assign({
    id: "file-id-" + nodeCounter++,
    name: "file" + nodeCounter++,
    content: "content",
    createdAt: date.getCurrentTime(),
    updatedAt: date.getCurrentTime(),
  }, params);
};

export const hasFile = (_params: any = {}) => {
  const params = hasFileBasis(_params);
  return new File(params);
};

export const hasDirectoryBasis = (params: any = {}) => {
  return Object.assign({
    id: "directory-id-" + nodeCounter++,
    name: "directory" + nodeCounter++,
    children: [],
    createdAt: date.getCurrentTime(),
    updatedAt: date.getCurrentTime(),
  }, params);
};

export const hasDirectory = (_params: any = {}) => {
  const params = hasFileBasis(_params)
  return new Directory(params);
};
