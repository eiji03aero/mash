import React from "react";

import * as types from "../../types";
import { defaultConfig } from "../../service";
import { Context } from "./types";

export const AppContext = React.createContext<Context>({
  engine: {} as types.IEditorEngine,
  service: {} as types.IService,
  config: defaultConfig,
});
