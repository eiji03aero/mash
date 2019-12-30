import { cid, date, Errors } from "mash-common";
import {
  IFileSystemNode,
  IFileSystemNodeBasis,
  IDirectory,
} from "./types";

export class FileSystemNode implements IFileSystemNode {
  public cid: string;
  public name: string;
  public createdAt: string;
  public updatedAt: string;
  private _parentNode: IDirectory | null;

  constructor (params: IFileSystemNodeBasis) {
    this.cid = cid.generate();
    this.name = params.name || "";
    this.createdAt = date.getCurrentTime();
    this.updatedAt = date.getCurrentTime();
    this._parentNode = null;
  }

  public get parentNode () {
    if (!this._parentNode) {
      throw Errors.Factory.standard(`parentNode does not exist for ${this.name}`);
    }
    return this._parentNode;
  }

  public set parentNode (dir: IDirectory) {
    this._parentNode = dir;
  }

  public update (args: IFileSystemNodeBasis) {
    if (args.name) this.name = args.name;

    this.updatedAt = date.getCurrentTime();
  }
}
