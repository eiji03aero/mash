import React from "react";
import ReactDOM from "react-dom";

import * as types from "../../types";
import * as ltypes from "./types";
import { AppContext } from "./context";

import { Editor } from "./Editor";

export const render = (params: {
  container: HTMLElement;
  engine: types.IEditorEngine;
}): void => {
  const ctx: ltypes.Context  = {
    engine: params.engine,
    get service (): types.IService {
      return params.engine.service;
    },
    get config (): types.Config {
      return params.engine.service.state.config;
    },
  };

  ReactDOM.render(
    <AppContext.Provider value={ctx}>
      <Editor
        engine={params.engine}
      />
    </AppContext.Provider>,
    params.container
  );
};
