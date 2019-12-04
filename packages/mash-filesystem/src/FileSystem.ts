import { Errors } from "mash-common";

import {
  IDirectoryBasis,
  IDirectory,
  IFileBasis,
  IFile,
  IFileSystemNode,
  IFileSystemCommandResult,
  IFileSystemCommandResultNode,
  IFileSystem,
  FileSystemCommandOption
} from './types';
import { FileSystemNode } from "./FileSystemNode";
import { Directory } from "./Directory";
import { File } from "./File";

import { initialFileNodes, homeDirectory } from "./assets/initialFileNodes";

export class FileSystem implements IFileSystem {
  public currentDirectory: IDirectory;
  public root: IDirectory;
  private static _instance: FileSystem;

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
    const { error, node } = this.resolveNodeFromPath(path);

    if (error) return { error };

    if (!node || !node.isDirectory) return { error: Errors.Factory.notDirectory(path) };

    this.currentDirectory = node as Directory;
    return {};
  }

  public resolveNodeFromPath (
    path: string
  ): IFileSystemCommandResultNode<IFileSystemNode> {
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

    for (let i = 0; i < fragments.length; i++) {
      const fragment = fragments[i];

      if (fragment === '..') {
        if (resolvedNode.parentNode instanceof FileSystemNode) {
          resolvedNode = resolvedNode.parentNode;
          continue;
        } else {
          return { error: Errors.Factory.noSuchFileOrDirectory(path) };
        }
      }
      else if (fragment === '.') {
        continue;
      }
      else if (fragment === '') {
        if (i === fragments.length - 1) {
          break;
        }
        return { error: Errors.Factory.noSuchFileOrDirectory(path) };
      }
      else {
        if (!resolvedNode.isDirectory) {
          return { error: Errors.Factory.notDirectory(fragment) };
        }
        if (!(<IDirectory>resolvedNode).containsByName(fragment)) {
          return { error: Errors.Factory.noSuchFileOrDirectory(path) };
        }

        resolvedNode = (<IDirectory>resolvedNode).findByName(fragment) as FileSystemNode;
        continue;
      }
    }

    return { node: resolvedNode };
  }

  public resolveAbsolutePath (node: IFileSystemNode) {
    let currentNode = node;
    const nodeNames = [node.name];

    while (!this._isRootDirectory(currentNode.parentNode as IFileSystemNode)) {
      currentNode = currentNode.parentNode as IFileSystemNode;
      nodeNames.unshift(currentNode.name);
    }

    return `/${nodeNames.join('/')}`;
  }

  public createFile (args : {
    path: string,
    params: IFileBasis
  }) : IFileSystemCommandResultNode<IFile> {
    const { path, params } = args;
    const { error, node: parentDirectory } = this.resolveNodeFromPath(path);

    if (error) return { error };

    if (!parentDirectory || !parentDirectory.isDirectory) return { error: Errors.Factory.noSuchFileOrDirectory(path) };

    const node = new File(params);
    (<IDirectory>parentDirectory).addChild(node);
    return { node };
  }

  public updateFile (args : {
    path: string,
    params: IFileBasis
  }) : IFileSystemCommandResultNode<IFile> {
    const { path, params } = args;
    const { parentPath, lastFragment } = this._splitLastFragmentFromPath(path);
    const { error, node: parentDirectory } = this.resolveNodeFromPath(parentPath);

    if (error) return { error };

    if (!parentDirectory || !parentDirectory.isDirectory) {
      return { error: Errors.Factory.noSuchFileOrDirectory(path) };
    }

    if (!(<IDirectory>parentDirectory).containsByName(lastFragment)) {
      return { error: Errors.Factory.noSuchFileOrDirectory(path) };
    }

    const node = (<IDirectory>parentDirectory).findByName(lastFragment) as IFile;
    node.update(params);
    return { node };
  }

  public deleteFile (args : {
    path: string,
  }) : IFileSystemCommandResult {
    const { path } = args;
    const { parentPath, lastFragment } = this._splitLastFragmentFromPath(path);
    const { error, node: parentDirectory } = this.resolveNodeFromPath(parentPath);

    if (error) return { error };

    if (!parentDirectory || !parentDirectory.isDirectory) {
      return { error: Errors.Factory.noSuchFileOrDirectory(path) };
    }

    if (!(<IDirectory>parentDirectory).containsByName(lastFragment)) {
      return { error: Errors.Factory.noSuchFileOrDirectory(path) };
    }

    const node = (<IDirectory>parentDirectory).findByName(lastFragment) as IFile;
    (<IDirectory>parentDirectory).removeChild(node);
    return { };
  }

  public createDirectory (args : {
    path: string,
    params: IDirectoryBasis
  }) : IFileSystemCommandResultNode<IDirectory> {
    const { path, params } = args;
    const { error, node: parentDirectory } = this.resolveNodeFromPath(path);

    if (error) return { error };

    if (!parentDirectory || !parentDirectory.isDirectory) return { error: Errors.Factory.noSuchFileOrDirectory(path) };

    const node = new Directory(params);
    (<IDirectory>parentDirectory).addChild(node);
    return { node };
  }

  public updateDirectory (args : {
    path: string,
    params: IDirectoryBasis
  }) : IFileSystemCommandResultNode<IDirectory> {
    const { path, params } = args;
    const { parentPath, lastFragment } = this._splitLastFragmentFromPath(path);
    const { error, node: parentDirectory } = this.resolveNodeFromPath(parentPath);

    if (error) return { error };

    if (!parentDirectory || !parentDirectory.isDirectory) {
      return { error: Errors.Factory.noSuchFileOrDirectory(path) };
    }

    if (!(<IDirectory>parentDirectory).containsByName(lastFragment)) {
      return { error: Errors.Factory.noSuchFileOrDirectory(path) };
    }

    const node = (<IDirectory>parentDirectory).findByName(lastFragment) as IDirectory;
    node.update(params);
    return { node };
  }

  public deleteDirectory (args : {
    path: string,
  }) : IFileSystemCommandResult {
    const { path } = args;
    const { parentPath, lastFragment } = this._splitLastFragmentFromPath(path);
    const { error, node: parentDirectory } = this.resolveNodeFromPath(parentPath);

    if (error) return { error };

    if (!parentDirectory || !parentDirectory.isDirectory) {
      return { error: Errors.Factory.noSuchFileOrDirectory(path) };
    }

    if (!(<IDirectory>parentDirectory).containsByName(lastFragment)) {
      return { error: Errors.Factory.noSuchFileOrDirectory(path) };
    }

    const node = (<IDirectory>parentDirectory).findByName(lastFragment) as IDirectory;
    (<IDirectory>parentDirectory).removeChild(node);
    return { };
  }

  public deleteNodeFromPath (
    path: string,
    option?: FileSystemCommandOption
  ): IFileSystemCommandResult {
    option = option || {} as FileSystemCommandOption;
    const { error, node } = this.resolveNodeFromPath(path);
    if (error) return { error };

    if (node!.isFile) {
      const { error } = this.deleteFile({ path });
      if (error) return { error };
    }
    else if (node!.isDirectory) {
      if (!option.recursive) {
        return { error: Errors.Factory.standard(`${node!.name}: is a directory`) };
      }
      const { error } = this.deleteDirectory({ path });
      if (error) return { error };
    }

    return { };
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

  private _isRootDirectory (node: FileSystemNode): boolean {
    return node === this.root;
  }
}
