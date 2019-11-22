import { ErrorFactory, Errors } from "mash-common";

import {
  IDirectoryBasis,
  IDirectory,
  IFileBasis,
  IFile,
  IFileSystemCommandResult,
  IFileSystem
} from './types';
import { FileSystemNode } from "./FileSystemNode";
import { Directory } from "./Directory";
import { File } from "./File";

import { initialFileNodes, homeDirectory } from "./assets/initialFileNodes";

export class FileSystem implements IFileSystem {
  private static _instance: FileSystem;
  currentDirectory: IDirectory;
  root: IDirectory;

  static bootstrap () {
    this._instance = new FileSystem();
    return this._instance;
  }

  static get instance () {
    return this._instance;
  }

  static reboot () {
    delete this._instance;
    this.bootstrap();
    return this._instance
  }

  private constructor () {
    this.root = new Directory({
      name: 'root',
      children: initialFileNodes,
      __root__: true
    });
    this.currentDirectory = homeDirectory;
  }

  public changeCurrentDirectory (args: {
    path: string
  }) : IFileSystemCommandResult {
    const { path } = args;
    const { error, node } = this._resolveNodeFromPath(path);

    if (error) return { error };

    if (!node || !node.isDirectory) return { error: ErrorFactory.notDirectory(path) };

    this.currentDirectory = node as Directory;
    return {};
  }

  public createFile (args : {
    path: string,
    params: IFileBasis
  }) : IFileSystemCommandResult & {
    node?: T
  } {
    const { path, params } = args;
    const { error, node: parentDirectory } = this._resolveNodeFromPath(path);

    if (error) return { error };

    if (!parentDirectory || !parentDirectory.isDirectory) return { error: ErrorFactory.noSuchFileOrDirectory(path) };

    const node = new File(params);
    (<IDirectory>parentDirectory).addChild(node);
    return { node };
  }

  public updateNode<T extends IFile | IDirectory> (args : {
    path: string,
    params: IFileBasis | IDirectoryBasis
  }) : IFileSystemCommandResult & {
    node?: T
  } {
    const { path, params } = args;
    const { parentPath, lastFragment } = this._splitLastFragmentFromPath(path);
    const { error, node: parentDirectory } = this._resolveNodeFromPath(parentPath);

    if (error) return { error };

    if (!parentDirectory || !parentDirectory.isDirectory) {
      return { error: ErrorFactory.noSuchFileOrDirectory(path) };
    }

    if (!(<Directory>parentDirectory).containsByName(lastFragment)) {
      return { error: ErrorFactory.noSuchFileOrDirectory(path) };
    }

    const node = (<Directory>parentDirectory).findByName(lastFragment) as T;
    node.update(params);
    return { node };
  }

  public deleteNode<T extends FileSystemNode> (args : {
    path: string,
  }) : IFileSystemCommandResult & {
    node?: T
  } {
    const { path } = args;
    const { parentPath, lastFragment } = this._splitLastFragmentFromPath(path);
    const { error, node: parentDirectory } = this._resolveNodeFromPath(parentPath);

    if (error) return { error };

    if (!parentDirectory || !parentDirectory.isDirectory) {
      return { error: ErrorFactory.noSuchFileOrDirectory(path) };
    }

    if (!(<Directory>parentDirectory).containsByName(lastFragment)) {
      return { error: ErrorFactory.noSuchFileOrDirectory(path) };
    }

    const node = (<Directory>parentDirectory).findByName(lastFragment) as T;
    (<Directory>parentDirectory).removeChild(node);
    return { node };
  }

  private _splitLastFragmentFromPath (
    path: string
  ): ({
    parentPath: string,
    lastFragment: string
  }) {
    const lastIndex = path[path.length - 1] === '/'
      ? path.lastIndexOf('/', path.length - 2)
      : path.lastIndexOf('/');

    return {
      parentPath: lastIndex === -1
        ? '.'
        : path.slice(0, lastIndex),
      lastFragment: path.slice(lastIndex + 1),
    };
  }

  // private isRoot (node: FileSystemNode): boolean {
  //   return node === this.root;
  // }

  private _resolveNodeFromPath (
    path: string
  ): ({
    error?: Errors.Base,
    node?: FileSystemNode
  }) {
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
