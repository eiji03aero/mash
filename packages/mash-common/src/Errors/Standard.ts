import { Base, BaseBasis } from "./Base";

interface StandardBasis extends BaseBasis {
  msg: string;
}

export class Standard extends Base {
  msg: string;

  constructor (params: StandardBasis) {
    super();
    this.msg = params.msg;
  }

  message () {
    return this.msg;
  }
}
