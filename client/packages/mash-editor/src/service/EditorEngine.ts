import { IFileSystem } from "mash-filesystem";
import { Service } from "./Service";
import * as types from "../types";

export class EditorEngine implements types.IEditorEngine {
  service: types.IService;

  constructor (params: {
    filesystem: IFileSystem;
  }) {
    this.service = new Service({
      filesystem: params.filesystem,
    });
  }

  openBufferByNodeId (nodeId: string): void {
    this.service.openBufferByNodeId(nodeId);
  }

  requestAction (action: types.RequestAction.Kind): void {
    this.service.requestAction(action);
  }

  onRequestAction (handler: types.RequestActionHandler): void {
    this.service.onRequestAction(handler);
  }

  offRequestAction (handler: types.RequestActionHandler): void {
    this.service.offRequestAction(handler);
  }
}
