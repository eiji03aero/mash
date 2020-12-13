import React from "react";
import { css } from "emotion";
import { MashEditor } from "mash-editor";

import * as hooks from "../hooks";

export const Editor: React.FC = () => {
  const ctx = hooks.useAppContext();

  return (
    <div className={Styles.container}>
      <MashEditor
        engine={ctx.service.editorEngine}
      />
    </div>
  );
};

const Styles = {
  container: css`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  `,
};
