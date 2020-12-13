import React from "react";
import { css } from "emotion";

import * as hooks from "./hooks";
import { colors } from "../../utils";
import { gen } from "../../graphql";

import {
  Booting,
  Term,
  Editor,
} from "./routes";

export const App: React.FC = () => {
  const ctx = hooks.useAppContext();
  const { data: localStateResult } = hooks.useLocalState();

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
      <div className={Styles.content}>
        <Term />
      </div>

      {localStateResult?.localState.editorState === gen.EditorState.Running && (
        <div className={Styles.modal}>
          <Editor />
        </div>
      )}

      <Booting />
    </div>
  );
};

const Styles = {
  container: css`
    position: relative;
    width: 100%;
    height: 100%;
  `,
  content: css`
    position: relative;
    z-index: 0;
    width: 100%;
    height: 100%;
  `,
  modal: css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: ${colors.pallete.deepGreen};
  `
};
