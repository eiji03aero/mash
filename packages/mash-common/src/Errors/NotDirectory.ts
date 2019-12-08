import { Base, IBaseBasis } from "./Base";

interface INotDirectoryBasis extends IBaseBasis {
  name: string;
}

export class NotDirectory extends Base {
  public name: string;

  constructor(params: INotDirectoryBasis) {
    super();
    this.name = params.name;
  }

  public message(): string {
    return `${this.name}: not a directory`;
  }
}
