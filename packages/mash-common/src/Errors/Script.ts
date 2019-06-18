import { Base, BaseBasis } from "./Base";

interface ScriptBasis extends BaseBasis {
  fileName: string;
  errorMessage: string;
}

export class Script extends Base {
  fileName: string;
  errorMessage: string;

  constructor (params: ScriptBasis) {
    super();
    this.fileName = params.fileName;
    this.errorMessage = params.errorMessage;
  }

  message (): string {
    return `script error: ${this.fileName} - ${this.errorMessage}`;
  }
}
