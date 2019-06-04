import { FileSystemNodeBasis, FileSystemNode } from "./FileSystemNode";

export interface FileBasis extends FileSystemNodeBasis {
  content?: string;
}

export class File extends FileSystemNode {
  content: string;

  constructor (params: FileBasis) {
    super(params);
    this.content = params.content || '';
  }

  setContent (content: string) {
    this.content = content;
  }

  update (args: FileBasis) {
    super.update(args);
    args.content && (this.content = args.content);
  }
}
