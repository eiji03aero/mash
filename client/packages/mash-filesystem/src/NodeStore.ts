import * as E from "fp-ts/lib/Either";

import {
  IFileSystemNode,
  IDirectory,
  INodeStore,
  NodeMap,
  Nodes,
} from "./types";
import * as utils from "./utils";

export class NodeStore implements INodeStore {
  private _rootDirectoryId: string;
  private _nodes: NodeMap;

  constructor () {
    this._rootDirectoryId = "root";
    this._nodes = new Map<string, IFileSystemNode>() as NodeMap;

    this._rootDirectoryId;
  }

  get size (): number {
    return this._nodes.size;
  }

  setRootDirectory (directory: IDirectory): void {
    this._rootDirectoryId = directory.id;
    this._nodes.set(directory.id, directory);
  }

  addNode (params: {
    parentNodeId: string;
    node: IFileSystemNode;
  }): E.Either<Error, null> {
    const r = this.getNode(params.parentNodeId);
    if (E.isLeft(r)) return r;
    if (!utils.isDirectory(r.right)) {
      const error = new Error("parent is not a directory");
      return E.left(error);
    }
    const parentNode = r.right;

    const r2 = this.getNodes(parentNode.children);
    if (E.isLeft(r2)) return r2;

    const sameNameExists = r2.right
      .map((c: IFileSystemNode) => c.name)
      .includes(params.node.name);
    if (sameNameExists) {
      const error = new Error(`node name already exists: ${params.node.name}`);
      return E.left(error);
    }

    parentNode.addChild(params.node.id);
    params.node.parentNodeId = params.parentNodeId;
    this._nodes.set(params.node.id, params.node);

    return E.right(null);
  }

  deleteNode (id: string): E.Either<Error, null> {
    const r1 = this.getNode(id);
    if (E.isLeft(r1)) return r1;

    const r2 = this.getNode(r1.right.parentNodeId);
    if (E.isLeft(r2)) return r2;

    const node = r1.right;
    const parentNode = r2.right;

    if (utils.isFile(node)) {
      this._nodes.delete(id);
    }
    else if (utils.isDirectory(node)) {
      for (const i of node.children) {
        this.deleteNode(i);
      }
      this._nodes.delete(id);
    }

    if (utils.isDirectory(parentNode)) {
      parentNode.removeChild(node.id);
    }

    return E.right(null);
  }

  getNode (id: string): E.Either<Error, IFileSystemNode> {
    const node = this._nodes.get(id);

    if (!node) return E.left(new Error(`no such node with id: ${id}`));

    return E.right(node);
  }

  getNodes (ids: string[]): E.Either<Error, Nodes> {
    const nodes: Nodes = [];

    for (const id of ids) {
      const r1 = this.getNode(id);

      if (E.isRight(r1)) {
        nodes.push(r1.right);
      }
    }

    return E.right(nodes);
  }

  resolveAbsolutePath (id: string): E.Either<Error, string> {
    const r1 = this.getNode(id);
    if (E.isLeft(r1)) return r1;

    let currentNode = r1.right;
    const nodeNames = [currentNode.name];

    while (!this._isRootDirectoryId(currentNode.parentNodeId)) {
      const r = this.getNode(currentNode.parentNodeId);
      if (E.isLeft(r)) return r;

      currentNode = r.right;
      nodeNames.unshift(currentNode.name);
    }

    const path = `/${nodeNames.join("/")}`;
    return E.right(path);
  }

  resolveNodeFromPath (params: {
    path: string;
    currentDirectoryId: string;
  }): E.Either<Error, IFileSystemNode> {
    const { isAbsolutePath, fragments } = utils.parsePath(params.path);
    let resolvedNode: IFileSystemNode;

    if (isAbsolutePath) {
      const r = this.getNode(this._rootDirectoryId);
      if (E.isLeft(r)) return r;
      resolvedNode = r.right;
    }
    else {
      const r = this.getNode(params.currentDirectoryId);
      if (E.isLeft(r)) return r;
      resolvedNode = r.right;
    }

    for (let i = 0; i < fragments.length; i++) {
      const fragment = fragments[i];

      if (fragment === "..") {
        if (this._isRootDirectoryId(resolvedNode.id)) {
          const error = new Error(`no such file or directory: ${params.path}`);
          return E.left(error);
        }

        const r = this.getNode(resolvedNode.parentNodeId);
        if (E.isLeft(r)) return r;
        resolvedNode = r.right;
        continue;
      }
      else if (fragment === ".") {
        continue;
      }
      else if (fragment === "") {
        if (i !== fragments.length - 1) {
          const error = new Error(`no such file or directory: ${params.path}`);
          return E.left(error);
        }
        break;
      }
      else {
        if (!(utils.isDirectory(resolvedNode))) {
          const error = new Error(`not a directory: ${params.path}`);
          return E.left(error);
        }

        const r = this._getChildByName({
          id: resolvedNode.id,
          name: fragment,
        });
        if (E.isLeft(r)) return r;
        resolvedNode = r.right;
        continue;
      }
    }

    return E.right(resolvedNode);
  }

  private _isRootDirectoryId (id: string) {
    return id === this._rootDirectoryId;
  }

  private _getChildByName ({
    id,
    name,
  }: {
    id: string;
    name: string;
  }): E.Either<Error, IFileSystemNode> {
    const r1 = this.getNode(id);
    if (E.isLeft(r1)) return r1;
    if (!utils.isDirectory(r1.right)) return r1;
    const directory = r1.right;

    const r2 = this.getNodes(directory.children);
    if (E.isLeft(r2)) return r2;
    const child = r2.right.find((c: IFileSystemNode) => c.name === name);

    if (!child) {
      const error = new Error(`no such file or directory: ${name}`);
      return E.left(error);
    }

    return E.right(child);
  }
}
