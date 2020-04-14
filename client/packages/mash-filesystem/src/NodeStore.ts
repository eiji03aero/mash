import {
  Monad,
  Either,
} from "mash-common";
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

  get size () {
    return this._nodes.size;
  }

  setRootDirectory (directory: IDirectory) {
    this._rootDirectoryId = directory.id;
    this._nodes.set(directory.id, directory);
  }

  addNode ({
    parentNodeId,
    node,
  }: {
    parentNodeId: string;
    node: IFileSystemNode;
  }): Either {
    const r = this.getNode(parentNodeId);
    if (Monad.either.isLeft(r)) return r;
    if (!utils.isDirectory(r.value)) {
      const error = new Error("parent is not a directory");
      return Monad.either.left(error);
    }
    const parentNode = r.value;

    const r2 = this.getNodes(parentNode.children);
    if (Monad.either.isLeft(r2)) return r2;

    const sameNameExists = r2.value
      .map((c: IFileSystemNode) => c.name)
      .includes(node.name);
    if (sameNameExists) {
      const error = new Error(`node name already exists: ${node.name}`);
      return Monad.either.left(error);
    }

    parentNode.addChild(node.id);
    node.parentNodeId = parentNodeId;
    this._nodes.set(node.id, node);

    return Monad.either.right(null);
  }

  deleteNode (id: string) {
    const result = this.getNode(id);
    if (Monad.either.isLeft(result)) return result;

    const result2 = this.getNode(result.value.parentNodeId);
    if (Monad.either.isLeft(result2)) return result2;

    const node = result.value;
    const parentNode = result2.value;

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

    return Monad.either.right(null);
  }

  getNode (id: string): Either<IFileSystemNode> {
    const node = this._nodes.get(id);

    if (!node) return Monad.either.left(new Error(`no such node with id: ${id}`));

    return Monad.either.right(node);
  }

  getNodes (ids: string[]): Either<Nodes> {
    const nodes: Nodes = [];

    for (const id of ids) {
      const result = this.getNode(id);

      if (Monad.either.isRight(result)) {
        nodes.push(result.value);
      }
    }

    return Monad.either.right(nodes);
  }

  resolveAbsolutePath (id: string): Either<string> {
    const result = this.getNode(id);
    if (Monad.either.isLeft(result)) return result;

    let currentNode = result.value;
    const nodeNames = [currentNode.name];

    while (!this._isRootDirectoryId(currentNode.parentNodeId)) {
      const result = this.getNode(currentNode.parentNodeId);
      if (Monad.either.isLeft(result)) return result;

      currentNode = result.value;
      nodeNames.unshift(currentNode.name);
    }

    const path = `/${nodeNames.join("/")}`;
    return Monad.either.right(path);
  }

  resolveNodeFromPath ({
    path,
    currentDirectoryId
  }: {
    path: string;
    currentDirectoryId: string;
  }): Either<IFileSystemNode> {
    const { isAbsolutePath, fragments } = utils.parsePath(path);
    let resolvedNode: IFileSystemNode;

    if (isAbsolutePath) {
      const result = this.getNode(this._rootDirectoryId);
      if (Monad.either.isLeft(result)) return result;
      resolvedNode = result.value;
    }
    else {
      const result = this.getNode(currentDirectoryId);
      if (Monad.either.isLeft(result)) return result;
      resolvedNode = result.value;
    }

    for (let i = 0; i < fragments.length; i++) {
      const fragment = fragments[i];

      if (fragment === "..") {
        if (this._isRootDirectoryId(resolvedNode.id)) {
          const error = new Error(`no such file or directory: ${path}`);
          return Monad.either.left(error);
        }

        const result = this.getNode(resolvedNode.parentNodeId);
        if (Monad.either.isLeft(result)) return result;
        resolvedNode = result.value;
        continue;
      }
      else if (fragment === ".") {
        continue;
      }
      else if (fragment === "") {
        if (i !== fragments.length - 1) {
          const error = new Error(`no such file or directory: ${path}`);
          return Monad.either.left(error);
        }
        break;
      }
      else {
        if (!(utils.isDirectory(resolvedNode))) {
          const error = new Error(`not a directory: ${path}`);
          return Monad.either.left(error);
        }

        const result = this._getChildByName({
          id: resolvedNode.id,
          name: fragment,
        });
        if (Monad.either.isLeft(result)) return result;
        resolvedNode = result.value;
        continue;
      }
    }

    return Monad.either.right(resolvedNode);
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
  }): Either<IFileSystemNode> {
    const result = this.getNode(id);
    if (Monad.either.isLeft(result)) return result;
    if (!utils.isDirectory(result.value)) return result;
    const directory = result.value;

    const result2 = this.getNodes(directory.children);
    if (Monad.either.isLeft(result2)) return result2;
    const child = result2.value.find((c: IFileSystemNode) => c.name === name);

    if (!child) {
      const error = new Error(`no such file or directory: ${name}`);
      return Monad.either.left(error);
    }

    return Monad.either.right(child);
  }
}
