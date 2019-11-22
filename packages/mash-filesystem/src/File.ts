import {
  IFileBasis,
  IFile,
} from './types';
import { FileSystemNode } from "./FileSystemNode";

export class File extends FileSystemNode implements IFile {
  content: string;

  static isBasis (obj: any): obj is IFileBasis {
    return 'content' in obj;
  }

  constructor (params: IFileBasis) {
    super(params);
    this.content = params.content || '';
  }

  update (args: IFileBasis) {
    super.update(args);
    args.content && (this.content = args.content);
  }
}
