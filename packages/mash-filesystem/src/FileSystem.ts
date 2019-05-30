import { ErrorFactory, Errors } from "mash-common";

import { FileSystemNode } from "./FileSystemNode";
import { Directory } from "./Directory";
import { FileBasis } from "./File";

import { initialFileNodes, homeDirectory } from "./assets/initialFileNodes";

export interface FileSystemCommandResult {
  error?: Errors.Base
}

export class FileSystem {
  private static _instance: FileSystem;
  currentDirectory: Directory;
  root: Directory;

  private constructor () {
    this.root = new Directory({
      name: 'root',
      children: initialFileNodes,
      __root__: true
    });
    this.currentDirectory = homeDirectory;
  }

  static bootstrap () {
    this._instance = new FileSystem();
    return this;
  }

  static get instance () {
    return this._instance;
  }

  // private isRoot (node: FileSystemNode): boolean {
  //   return node === this.root;
  // }

  createFile (params : { path: string, params: FileBasis }) : FileSystemCommandResult {
    console.log(params.path, params.params, this.resolveNodeFromPath(params.path));
    return {}
  }

  // createDirectory (node: FileSystemNode, parentNode: D) {
  //   parent.addC
  //   node.parent.removeChild(node);
  //   node.removeParent();
  // }

  // deleteNode (node: FileSystemNode) {
  //   node.parent.removeChild(node);
  //   node.removeParent();
  // }

  private resolveNodeFromPath (path: string): ({ error?: Errors.Base, node?: FileSystemNode }) {
    const isAbsolutePath = path[0] === '/';
    let resolvedNode: FileSystemNode;
    let fragments: string[];

    if (isAbsolutePath) {
      resolvedNode = this.root;
      fragments = path.substring(1).split('/');
    } else {
      resolvedNode = this.currentDirectory;
      fragments = path.split('/');
    }

    for (let fragment of fragments) {
      if (fragment === '..') {
        if (resolvedNode.parentNode instanceof FileSystemNode) {
          resolvedNode = resolvedNode.parentNode;
          continue;
        } else {
          return { error: ErrorFactory.noSuchFileOrDirectory(path) };
        }
      }
      else if (fragment === '.') {
        continue;
      }
      else if (fragment === '') {
        return { error: ErrorFactory.noSuchFileOrDirectory(path) };
      }
      else {
        if (!resolvedNode.isDirectory) {
          return { error: ErrorFactory.notDirectory(fragment) };
        }
        if (!(<Directory>resolvedNode).containsByName(fragment)) {
          return { error: ErrorFactory.noSuchFileOrDirectory(path) };
        }

        resolvedNode = (<Directory>resolvedNode).findByName(fragment) as FileSystemNode;
        continue;
      }
    }

    return { node: resolvedNode };
  }
}
