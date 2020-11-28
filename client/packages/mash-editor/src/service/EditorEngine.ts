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

  requestAction (action: types.RequestAction.Kind): void {
    this.service.requestAction(action);
  }
}
