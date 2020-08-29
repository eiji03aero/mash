import React from "react";
import ReactDOM from "react-dom";

export const render = (params: {
  container: HTMLElement;
}): void => {
  ReactDOM.render(
    <h1>
      domo
    </h1>,
    params.container
  );
};
