import { Base, IBaseBasis } from "./Base";

interface IScriptBasis extends IBaseBasis {
  fileName: string;
  errorMessage: string;
}

export class Script extends Base {
  public fileName: string;
  public errorMessage: string;

  constructor(params: IScriptBasis) {
    super();
    this.fileName = params.fileName;
    this.errorMessage = params.errorMessage;
  }

  public message(): string {
    return `script error: ${this.fileName} - ${this.errorMessage}`;
  }
}
