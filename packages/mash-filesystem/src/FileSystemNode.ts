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
  updatedAt: string;

  constructor (params: FileSystemNodeBasis) {
    this.cid = cid.generate();
    this.name = params.name;
    this.parentNode = params.parentNode;
    this.createdAt = date.getCurrentTime();
    this.updatedAt = date.getCurrentTime();
  }

  get isDirectory (): boolean {
    return this.constructor.name === 'Directory';
  }

  update (args: FileSystemNodeBasis) {
    args.name && (this.name = args.name);
    args.parentNode && (this.parentNode = args.parentNode);

    this.updatedAt = date.getCurrentTime();
  }

  setParentNode (node: FileSystemNode) {
    this.parentNode = node;
  }
}
