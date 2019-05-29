import { ErrorBase, ErrorBaseBasis } from "./ErrorBase";

interface NoSuchFileOrDirectoryErrorBasis extends ErrorBaseBasis {
  path: string;
}

export class NoSuchFileOrDirectoryError extends ErrorBase {
  path: string;

  constructor (params: NoSuchFileOrDirectoryErrorBasis) {
    super();
    this.path = params.path;
  }

  message (): string {
    return `${this.path}: no such file or directory`;
  }
}
