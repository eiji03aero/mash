import { cid, date } from 'mash-common';
import {
  IFileSystemNodeBasis,
  IFileSystemNode,
} from './types';

export class FileSystemNode implements IFileSystemNode {
  cid: string;
  name: string;
  parentNode?: IFileSystemNode;
  createdAt: string;
  updatedAt: string;

  constructor (params: IFileSystemNodeBasis) {
    this.cid = cid.generate();
    this.name = params.name || '';
    this.parentNode = params.parentNode;
    this.createdAt = date.getCurrentTime();
    this.updatedAt = date.getCurrentTime();
  }

  update (args: IFileSystemNodeBasis) {
    args.name && (this.name = args.name);
    args.parentNode && (this.parentNode = args.parentNode);

    this.updatedAt = date.getCurrentTime();
  }

  setParentNode (node: IFileSystemNode) {
    this.parentNode = node;
  }
}
