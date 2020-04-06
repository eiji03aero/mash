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
}
