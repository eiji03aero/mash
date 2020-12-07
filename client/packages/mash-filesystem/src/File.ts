import { FileSystemNode } from "./FileSystemNode";
import {
  IFile,
  IFileBasis,
} from "./types";

export class File extends FileSystemNode implements IFile {
  public content: string;

  constructor (params: IFileBasis) {
    super(params);
    this.content = params.content || "";
  }

  update (params: Partial<IFileBasis>) {
    if (params.name) this.name = params.name;
    if (params.content) this.content = params.content;
  }
}
