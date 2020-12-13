import React from "react";
import ReactDOM from "react-dom";

import * as types from "../../types";

import { MashEditor } from "./MashEditor";

export const render = (params: {
  container: HTMLElement;
  engine: types.IEditorEngine;
}): void => {
  ReactDOM.render(
    <MashEditor
      engine={params.engine}
    />,
    params.container
  );
};
