import { ErrorFactory } from "mash-common";

import { Directory } from "./Directory";
import { FileBasis } from "./File";

import { initialFileNodes, homeDirectory } from "./assets/initialFileNodes";

export class FileSystem {
  private static _instance: FileSystem;
  currentDirectory: Directory;
  root: Directory;

  private constructor () {
    this.root = new Directory({
      name: 'root',
      children: initialFileNodes,
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

  createFile ({
    parentPath,
    fileParams,
  } : {
    parentPath: string,
    fileParams: FileBasis,
  }) {
    node.parentNode.removeChild(node);
    node.removeParentNode();
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

  private resolveNodeFromPath (path: string): FileSystemNode {
    const isAbsolutePath = path[0] === '/';
    let resolvedNode: FileSystemNode;
    let fragments: string[];
    let error: any;

    if (isAbsolutePath) {
      resolvedNode = this.root;
      fragments = path.substring(1).split('/');
    } else {
      resolvedNode = this.currentDirectory;
      fragments = path.split('/');
    }

    for (let fragment of fragments) {
      if (fragment === '..') {
        resolvedNode = resolvedNode.parentNode;
        continue;
      }
      else if (fragment === '.') {
        continue;
      }
      else if (fragment === '') {
        error = ErrorFactory.noSuchFileOrDirectory(path);
        break;
      }
      else {
        if (!resolvedNode.isDirectory) {
          error = ErrorFactory.notDirectory(fragment);
          break;
        }
        if (!resolvedNode.containsByName(fragment)) {
          error = ErrorFactory.noSuchFileOrDirectory(path);
          break;
        }

        resolvedNode = resolvedNode.findByName(fragment);
      }
    }

    return { node: resolvedNode, error: error };
  }
}
