import React from "react";

import { IContext } from "../types";
import { AppContext } from "../context";

export const useAppContext = (): IContext => {
  return React.useContext(AppContext);
};
