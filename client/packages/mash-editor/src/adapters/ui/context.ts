import React from "react";

import * as types from "../../types";
import { Context } from "./types";

export const defaultConfig = {
  color: {
    VertSplit: "#222",
    Directory: "#4894F5",
    Text: "#fff",
  },
};

export const AppContext = React.createContext<Context>({
  engine: {} as types.IEditorEngine,
  config: defaultConfig,
});
