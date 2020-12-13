import React from "react";

import * as types from "../../types";
import * as ltypes from "./types";
import { AppContext } from "./context";

import { Editor } from "./Editor";

interface IProps {
  engine: types.IEditorEngine;
}

export const MashEditor: React.FC<IProps> = ({
  engine,
}) => {
  const ctx: ltypes.Context = React.useMemo(() => ({
    engine: engine,
    get service (): types.IService {
      return engine.service;
    },
    get config (): types.Config {
      return engine.service.state.config;
    },
  }), [engine]);

  return (
    <AppContext.Provider value={ctx}>
      <Editor
        engine={engine}
      />
    </AppContext.Provider>
  );
};
