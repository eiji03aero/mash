import { cid } from "mash-common";

import * as types from "../types";

export class Buffer implements types.IBuffer {
  id: string;
  nodeId: string;
  content: string;

  constructor (params: {
    id?: string;
    nodeId: string;
    content?: string;
  }) {
    this.id = params.id || cid.generate();
    this.nodeId = params.nodeId;
    this.content = params.content || "";
  }

  serialize (): types.SBuffer {
    return {
      type: "Buffer",
      id: this.id,
      nodeId: this.nodeId,
      content: this.content,
    };
  }
}
