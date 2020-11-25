import React from "react";

import * as ltypes from "../types";
import { AppContext } from "../context";

export const useAppContext = (): ltypes.Context => {
  const ctx = React.useContext<ltypes.Context>(AppContext);
  return ctx;
};
