import { cid } from "mash-common";

import * as types from "../types";

export class BufferWindow implements types.IBufferWindow {
  id: string;
  sourceIds: string[];
  currentSourceId: string;
  mode: types.BufferWindowMode;
  width?: number;

  constructor (params: {
    id?: string;
    sourceIds?: string[];
    currentSourceId: string;
    mode?: types.BufferWindowMode;
    width?: number;
  }) {
    this.id = params.id || cid.generate();
    this.sourceIds = params.sourceIds || [params.currentSourceId];
    this.currentSourceId = params.currentSourceId;
    this.mode = params.mode || "normal";
    this.width = params.width;
  }

  serialize (): types.SBufferWindow {
    return {
      id: this.id,
      sourceIds: this.sourceIds,
      currentSourceId: this.currentSourceId,
      mode: this.mode,
      width: this.width,
    };
  }

  hasSourceId (id: string): boolean {
    return this.sourceIds.includes(id);
  }

  openBuffer (sourceId: string): void {
    this.currentSourceId = sourceId;

    if (!this.sourceIds.includes(sourceId)) {
      this.sourceIds = this.sourceIds.concat(sourceId);
    }
  }
}
