import { cid, date } from "mash-common";
import {
  IFileSystemNode,
  IFileSystemNodeBasis,
} from "./types";

export class FileSystemNode implements IFileSystemNode {
  public cid: string;
  public name: string;
  public parentNode?: IFileSystemNode;
  public createdAt: string;
  public updatedAt: string;

  constructor(params: IFileSystemNodeBasis) {
    this.cid = cid.generate();
    this.name = params.name || "";
    this.parentNode = params.parentNode;
    this.createdAt = date.getCurrentTime();
    this.updatedAt = date.getCurrentTime();
  }

  public update(args: IFileSystemNodeBasis) {
    if (args.name) this.name = args.name;
    if (args.parentNode) this.parentNode = args.parentNode;

    this.updatedAt = date.getCurrentTime();
  }

  public setParentNode(node: IFileSystemNode) {
    this.parentNode = node;
  }
}
