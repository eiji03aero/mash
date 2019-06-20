import { FileSystemNodeBasis, FileSystemNode } from "./FileSystemNode";

type Nodes = FileSystemNode[];

export interface DirectoryBasis extends FileSystemNodeBasis {
  children?: Nodes;
  __root__?: boolean;
}

export class Directory extends FileSystemNode {
  children: Nodes;
  private __root__: boolean;

  static isBasis (obj: any): obj is DirectoryBasis {
    return 'children' in obj;
  }

  constructor (params: DirectoryBasis) {
    super(params);
    this.children = [] as Nodes;
    this.__root__ = params.__root__ || false;

    if (params.children) {
      for (let child of params.children) {
        this.addChild(child);
      }
    }
  }

  update (args: DirectoryBasis) {
    super.update(args);
  }

  addChild (node: FileSystemNode) {
    node.setParentNode(this);
    this.children.push(node);
  }

  removeChild (node: FileSystemNode) {
    this.children = this.children.filter(
      (c: FileSystemNode) => c.cid !== node.cid
    );
  }

  containsByName (name: string): boolean {
    return this.children
      .map((node: FileSystemNode) => node.name)
      .includes(name);
  }

  findByName (name: string): (FileSystemNode | undefined) {
    return this.children.find(
      (node: FileSystemNode) => node.name === name
    );
  }

  isRoot () {
    return this.__root__
  }
}
