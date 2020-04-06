import { Base, IBaseBasis } from "./Base";

interface INoSuchFileOrDirectoryBasis extends IBaseBasis {
  path: string;
}

export class NoSuchFileOrDirectory extends Base {
  public path: string;

  constructor (params: INoSuchFileOrDirectoryBasis) {
    super();
    this.path = params.path;
  }

  public message (): string {
    return `${this.path}: no such file or directory`;
  }
}
