import React from "react";
import { css } from "emotion";

import * as types from "../../types";

import { EditorContent } from "./components/EditorContent";

interface IProps {
  engine: types.IEditorEngine;
}

export const Editor: React.FC<IProps> = ({
  engine,
}) => {
  const [state, setState] = React.useState(engine.service.buildInitialState());


  const onRequestAction: types.RequestActionHandler = (action) => {
    switch (action.type) {
      case "openBuffer":
        setState(engine.service.openBuffer(state, {
          nodeId: action.nodeId,
        }));
    }
  };


  React.useEffect(() => {
    engine.service.onRequestAction(onRequestAction);

    return () => {
      engine.service.offRequestAction(onRequestAction);
    };
  }, [state]);


  return (
    <div className={Styles.container}>
      <div className={Styles.content}>
        <EditorContent
          windows={state.windows}
          buffers={state.buffers}
        />
      </div>
    </div>
  );
};

const Styles = {
  container: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    * {
      box-sizing: border-box;
    }
  `,
  content: css`
    display: flex;
    width: 100%;
    flex: 1;
  `,
};
