import { FileSystemNodeBasis, FileSystemNode } from "./FileSystemNode";

export interface FileBasis extends FileSystemNodeBasis {
  content?: string;
}

export class File extends FileSystemNode {
  content: string;

  static isBasis (obj: any): obj is FileBasis {
    return 'content' in obj;
  }

  constructor (params: FileBasis) {
    super(params);
    this.content = params.content || '';
  }

  update (args: FileBasis) {
    super.update(args);
    args.content && (this.content = args.content);
  }
}
