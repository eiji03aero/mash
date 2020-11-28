import * as types from "../types";
import { BaseBuffer, BaseBufferCtorParams } from "./BaseBuffer";

export class Buffer extends BaseBuffer implements types.IBuffer {
  content: string;

  constructor (params: BaseBufferCtorParams & {
    content?: string;
  }) {
    super(params);
    this.content = params.content || "";
  }

  serialize (): types.SBuffer {
    return {
      ...super.serialize(),
      type: "Buffer",
      content: this.content,
    };
  }
}
