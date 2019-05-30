import { Base, BaseBasis } from "./Base";

interface NoSuchFileOrDirectoryBasis extends BaseBasis {
  path: string;
}

export class NoSuchFileOrDirectory extends Base {
  path: string;

  constructor (params: NoSuchFileOrDirectoryBasis) {
    super();
    this.path = params.path;
  }

  message (): string {
    return `${this.path}: no such file or directory`;
  }
}
