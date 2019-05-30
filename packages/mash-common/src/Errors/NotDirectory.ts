import { Base, BaseBasis } from "./Base";

interface NotDirectoryBasis extends BaseBasis {
  name: string;
}

export class NotDirectory extends Base {
  name: string;

  constructor (params: NotDirectoryBasis) {
    super();
    this.name = params.name;
  }

  message (): string {
    return `${this.name}: not a directory`;
  }
}
