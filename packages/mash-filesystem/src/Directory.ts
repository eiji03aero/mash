import {
  IDirectoryBasis,
  IDirectory,
  IFileSystemNode,
  Nodes
} from './types';
import { FileSystemNode } from "./FileSystemNode";

export class Directory extends FileSystemNode implements IDirectory {
  children: Nodes;
  private __root__: boolean;

  static isBasis (obj: any): obj is IDirectoryBasis {
    return 'children' in obj;
  }

  constructor (params: IDirectoryBasis) {
    super(params);
    this.children = [] as Nodes;
    this.__root__ = params.__root__ || false;

    if (params.children) {
      for (let child of params.children) {
        this.addChild(child);
      }
    }
  }

  update (args: IDirectoryBasis) {
    super.update(args);
  }

  addChild (node: IFileSystemNode) {
    node.setParentNode(this);
    this.children.push(node);
  }

  removeChild (node: IFileSystemNode) {
    this.children = this.children.filter(
      (c: IFileSystemNode) => c.cid !== node.cid
    );
  }

  containsByName (name: string) {
    return this.children
      .map((node: IFileSystemNode) => node.name)
      .includes(name);
  }

  findByName (name: string) {
    return this.children.find(
      (node: IFileSystemNode) => node.name === name
    );
  }

  isRoot () {
    return this.__root__;
  }
}
