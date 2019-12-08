import { FileSystemNode } from "./FileSystemNode";
import {
  IDirectory,
  IDirectoryBasis,
  IFileSystemNode,
  Nodes,
} from "./types";

export class Directory extends FileSystemNode implements IDirectory {

  public static isBasis(obj: any): obj is IDirectoryBasis {
    return "children" in obj;
  }
  public children: Nodes;
  private _root: boolean;

  constructor(params: IDirectoryBasis) {
    super(params);
    this.children = [] as Nodes;
    this._root = params.root || false;

    if (params.children) {
      for (const child of params.children) {
        this.addChild(child);
      }
    }
  }

  public update(args: IDirectoryBasis) {
    super.update(args);
  }

  public addChild(node: IFileSystemNode) {
    node.setParentNode(this);
    this.children.push(node);
  }

  public removeChild(node: IFileSystemNode) {
    this.children = this.children.filter(
      (c: IFileSystemNode) => c.cid !== node.cid,
    );
  }

  public containsByName(name: string) {
    return this.children
      .map((node: IFileSystemNode) => node.name)
      .includes(name);
  }

  public findByName(name: string) {
    return this.children.find(
      (node: IFileSystemNode) => node.name === name,
    );
  }

  public isRoot() {
    return this._root;
  }
}
