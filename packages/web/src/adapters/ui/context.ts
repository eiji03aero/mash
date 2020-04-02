import React from "react";

import { IContext } from "./types";
import { stubService } from "../../service"

export const AppContext = React.createContext<IContext>({
  service: stubService,
});
