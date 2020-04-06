import { cid, date } from "mash-common";
import {
  IFileSystemNode,
  IFileSystemNodeBasis,
} from "./types";

export class FileSystemNode implements IFileSystemNode {
  public id: string;
  public name: string;
  public parentNodeId: string;
  public createdAt: string;
  public updatedAt: string;

  constructor (params: IFileSystemNodeBasis) {
    this.id = params.id || cid.generate();
    this.name = params.name;
    this.createdAt = params.createdAt || date.getCurrentTime();
    this.updatedAt = params.updatedAt || date.getCurrentTime();

    this.parentNodeId = params.parentNodeId || "";
  }
}
