import { Base, IBaseBasis } from "./Base";

interface IStandardBasis extends IBaseBasis {
  msg: string;
}

export class Standard extends Base {
  public msg: string;

  constructor(params: IStandardBasis) {
    super();
    this.msg = params.msg;
  }

  public message() {
    return this.msg;
  }
}
