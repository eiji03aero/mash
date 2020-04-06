import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";

import { App } from "./App";

import {
  IService,
  CustomApolloClient,
} from "../../types";
import { AppContext } from "./context";

type RenderParams = {
  service: IService;
  apolloClient: CustomApolloClient;

  container: HTMLElement;
}

export const render = ({
  service,
  apolloClient,

  container,
}: RenderParams) => {
  const context = {
    service,
  };

  ReactDOM.render(
    <ApolloProvider client={apolloClient}>
      <AppContext.Provider value={context}>
        <App />
      </AppContext.Provider>
    </ApolloProvider>,
    container
  );
};
