import { ErrorBase, ErrorBaseBasis } from "./Error";

interface NotDirectoryErrorBasis extends ErrorBaseBasis {
  name: string;
}

export class NotDirectoryError extends ErrorBase {
  name: string;

  constructor (params: NotDirectoryErrorBasis) {
    super();
    this.name = params.name;
  }

  message (): string {
    return `${this.name}: not a directory`;
  }
}
