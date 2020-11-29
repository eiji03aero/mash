import * as types from "../types";
import { BaseBuffer, BaseBufferCtorParams } from "./BaseBuffer";

export class Filer extends BaseBuffer implements types.IFiler {
  openedNodeIds: string[];

  constructor (params: BaseBufferCtorParams & {
    openedNodeIds?: string[];
  }) {
    super(params);
    this.openedNodeIds = params.openedNodeIds || [] as string[];
  }

  serialize (): types.SFiler {
    return {
      ...super.serialize(),
      type: "Filer",
      openedNodeIds: this.openedNodeIds,
    };
  }

  toggleOpenedNode (nodeId: string): void {
    this.openedNodeIds = this.openedNodeIds.includes(nodeId)
      ? this.openedNodeIds.filter((id) => id !== nodeId)
      : this.openedNodeIds.concat(nodeId);
  }

  isNodeOpened (nodeId: string): boolean {
    return this.openedNodeIds.includes(nodeId);
  }

  closeNode (nodeId: string): void {
    this.openedNodeIds = this.openedNodeIds.filter((id) => id !== nodeId);
  }
}
