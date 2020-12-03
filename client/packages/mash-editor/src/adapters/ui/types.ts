import * as types from "../../types";

export interface Context {
  engine: types.IEditorEngine;
  service: types.IService;
  config: types.Config;
}
