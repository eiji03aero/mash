import React from "react";
import { css } from "emotion";

import { AppContext } from "./context";

import {
  Booting,
  Term,
} from "./routes";

export const App: React.FC = () => {
  const ctx = React.useContext(AppContext);

  React.useEffect(() => {
    const terminalContainer = document.getElementById("terminal-container");
    if (!terminalContainer) {
      console.error("element with id terminal-container not found");
      return;
    }

    ctx.service.initialize({
      terminalContainer: terminalContainer,
    });
  }, []);

  return (
    <div className={Styles.container}>
      <Term />
      <Booting />
    </div>
  );
};

const Styles = {
  container: css`
    width: 100%;
    height: 100%;
    & > *:nth-child(1) {
      position: relative;
      z-index: 0;
    }
    & > *:nth-child(2) {
      z-index: 1;
    }
  `,
};
