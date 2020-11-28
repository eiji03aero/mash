import * as types from "../types";
import { BaseBuffer, BaseBufferCtorParams } from "./BaseBuffer";

export class Filer extends BaseBuffer implements types.IFiler {
  constructor (params: BaseBufferCtorParams) {
    super(params);
  }

  serialize (): types.SFiler {
    return {
      ...super.serialize(),
      type: "Filer",
    };
  }
}
