import { cid, date } from 'mash-common';

export interface FileSystemNodeBasis {
  name: string
  parentNode?: FileSystemNode
}

export class FileSystemNode {
  cid: string;
  name: string;
  parentNode?: FileSystemNode;
  createdAt: string;

  constructor (params: FileSystemNodeBasis) {
    this.cid = cid.generate();
    this.name = params.name;
    this.parentNode = params.parentNode;
    this.createdAt = date.getCurrentTime();
  }

  get isDirectory (): boolean {
    return this.constructor.name === 'Directory';
  }

  setParentNode (node: FileSystemNode) {
    this.parentNode = node;
  }
}
