import { FileSystemNode } from "./FileSystemNode";
import {
  IDirectory,
  IDirectoryBasis,
} from "./types";

export class Directory extends FileSystemNode implements IDirectory {
  private _children: Set<string>;

  constructor (params: IDirectoryBasis) {
    super(params);
    const children = params.children ?? [] as string[];
    this._children = new Set<string>(children);
  }

  get children (): string[] {
    return Array.from(this._children);
  }

  addChild (id: string): void {
    this._children.add(id);
  }

  removeChild (id: string): void {
    this._children.delete(id);
  }

  update (params: Partial<IDirectoryBasis>): void {
    if (params.name) this.name = params.name;
    if (params.children) this._children = new Set<string>(params.children);
  }
}
