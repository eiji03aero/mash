import { FileSystemNode } from "./FileSystemNode";
import {
  IFile,
  IFileBasis,
} from "./types";

export class File extends FileSystemNode implements IFile {
  public static isBasis(obj: any): obj is IFileBasis {
    return "content" in obj;
  }

  public content: string;

  constructor(params: IFileBasis) {
    super(params);
    this.content = params.content || "";
  }

  public update(args: IFileBasis) {
    super.update(args);
    if (this.content) this.content = args.content as string;
  }
}
