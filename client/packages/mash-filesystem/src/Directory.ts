import { FileSystemNode } from "./FileSystemNode";
import {
  IDirectory,
  IDirectoryBasis,
} from "./types";

export class Directory extends FileSystemNode implements IDirectory {
  private _children: Set<string>;

  constructor (params: IDirectoryBasis) {
    super(params);
    this._children = new Set<string>();
  }

  get children () {
    return Array.from(this._children);
  }

  addChild (id: string) {
    this._children.add(id);
  }

  removeChild (id: string) {
    this._children.delete(id);
  }
}
