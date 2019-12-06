import { Errors, Either, paths, Monad } from "mash-common";

import {
  IDirectory,
  IFile,
  IFileSystemNode,
  IFileSystem,
  TargetNodePathStat,
} from './types';
import { FileSystemNode } from "./FileSystemNode";
import { Directory } from "./Directory";
import { File } from "./File";
import * as utils from './utils';

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

  public changeCurrentDirectory (path: string): Either {
    const result = this.resolveNodeFromPath(path);

    if (result.isError) return result;

    if (!(utils.isDirectory(result.value))) {
      return Monad.either.left(Errors.Factory.notDirectory(result.value.name));
    }

    this.currentDirectory = result.value;
    return Monad.either.right(null);
  }

  public resolveNodeFromPath (path: string): Either<IFileSystemNode> {
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
          return Monad.either.left(Errors.Factory.noSuchFileOrDirectory(path));
        }
      }
      else if (fragment === '.') {
        continue;
      }
      else if (fragment === '') {
        if (i === fragments.length - 1) {
          break;
        }
        return Monad.either.left(Errors.Factory.noSuchFileOrDirectory(path));
      }
      else {
        if (!(utils.isDirectory(resolvedNode))) {
          return Monad.either.left(Errors.Factory.notDirectory(fragment));
        }
        if (!(<IDirectory>resolvedNode).containsByName(fragment)) {
          return Monad.either.left(Errors.Factory.noSuchFileOrDirectory(path));
        }

        resolvedNode = (<IDirectory>resolvedNode).findByName(fragment) as FileSystemNode;
        continue;
      }
    }

    return Monad.either.right<IFileSystemNode>(resolvedNode);
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

  public createFile (path: string): Either<IFile> {
    const result = this._expectValidTargetNodePath(path);

    if (result.isError) return result;

    const { basename, parentDirectory } = result.value;

    const node = new File({ name: basename });
    parentDirectory.addChild(node);
    return Monad.either.right<IFile>(node);
  }

  public deleteFile (path: string): Either {
    const result = this._expectValidTargetNodePath(path);

    if (result.isError) return result;
    if (!result.value.isBaseExists) {
      return Monad.either.left(Errors.Factory.noSuchFileOrDirectory(path));
    }

    const { parentDirectory, basename } = result.value;

    const node = parentDirectory.findByName(basename) as IFile;
    parentDirectory.removeChild(node);
    return Monad.either.right(null);
  }

  public createDirectory (path: string): Either<IDirectory> {
    const result = this._expectValidTargetNodePath(path);

    if (result.isError) return result;

    const { basename, parentDirectory } = result.value;

    const node = new Directory({ name: basename });
    parentDirectory.addChild(node);
    return Monad.either.right<IDirectory>(node);
  }

  public deleteDirectory (path: string): Either {
    const result = this._expectValidTargetNodePath(path);

    if (result.isError) return result;
    if (!result.value.isBaseExists) {
      return Monad.either.left(Errors.Factory.noSuchFileOrDirectory(path));
    }

    const { basename, parentDirectory } = result.value;

    const node = parentDirectory.findByName(basename) as IDirectory;
    parentDirectory.removeChild(node);
    return Monad.either.right(null);
  }

  public updateNodeName (path: string, name: string): Either {
    const result = this.resolveNodeFromPath(path);

    if (result.isError) return result;

    result.value.name = name;
    return Monad.either.right(null);
  }

  private _isRootDirectory (node: FileSystemNode): boolean {
    return node === this.root;
  }

  private _expectValidTargetNodePath (path: string): Either<TargetNodePathStat> {
    const { dirname, basename } = paths.inspect(path);
    const result = this.resolveNodeFromPath(dirname);

    if (
      result.isError
      || (!result.value || !(utils.isDirectory(result.value)))
    ) {
      return Monad.either.left(Errors.Factory.noSuchFileOrDirectory(path));
    }

    const parentDirectory = result.value;

    return Monad.either.right({
      dirname,
      basename,
      parentDirectory,
      isBaseExists: parentDirectory.containsByName(basename)
    });
  }
}
