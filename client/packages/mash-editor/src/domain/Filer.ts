import { cid } from "mash-common";

import * as types from "../types";

export class Filer implements types.IFiler {
  id: string;
  nodeId: string;

  constructor (params: {
    id?: string;
    nodeId: string;
  }) {
    this.id = params.id || cid.generate();
    this.nodeId = params.nodeId;
  }

  serialize (): types.SFiler {
    return {
      type: "Filer",
      id: this.id,
      nodeId: this.nodeId,
    };
  }
}
