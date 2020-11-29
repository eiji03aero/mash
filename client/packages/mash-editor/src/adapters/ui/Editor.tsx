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
  const refs = {
    container: React.useRef<HTMLDivElement>(null),
    handlerTextarea: React.useRef<HTMLTextAreaElement>(null),
  };


  const updateState = (result: types.ASHandlerResult): void => {
    if (!result) {
      return;
    }
    setState(result);
  }

  const onRequestAction: types.RequestActionHandler = (action) => {
    switch (action.type) {
      case "openBuffer":
        updateState(engine.service.openBuffer(state, {
          nodeId: action.nodeId,
        }));
        break;
      case "setUIState":
        updateState({
          ...state,
          ui: {
            ...state.ui,
            ...action.ui,
          }
        });
        break;
    }
  };

  const onClickDocument = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const container = refs.container.current;
    if (!container) {
      return;
    }

    if (container.contains(target)) {
      engine.service.focus();
    }
    else {
      engine.service.blur();
    }
  };

  const onKey = (e: KeyboardEvent) => {
    updateState(engine.service.handleKeyPress(state, {
      key: e.key,
      ctrlKey: e.ctrlKey,
    }));
  };


  React.useEffect(() => {
    engine.service.onRequestAction(onRequestAction);
    window.document.addEventListener("click", onClickDocument);
    refs.handlerTextarea.current?.addEventListener("keypress", onKey);

    return () => {
      engine.service.offRequestAction(onRequestAction);
      window.document.removeEventListener("click", onClickDocument);
      refs.handlerTextarea.current?.removeEventListener("keypress", onKey);
    };
  }, [state]);

  React.useEffect(() => {
    const hta = refs.handlerTextarea.current;
    if (!hta) {
      return;
    }

    engine.service.handlerTextarea = hta;
    engine.service.focus();
  }, []);


  return (
    <div className={Styles.container} ref={refs.container}>
      <div className={Styles.content}>
        <EditorContent
          windows={state.windows}
          buffers={state.buffers}
        />
      </div>

      <div className={Styles.hidden}>
        <textarea className={Styles.hidden} ref={refs.handlerTextarea} />
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
    max-height: 100%;
    flex: 1;
  `,
  hidden: css`
    width: 0;
    height: 0;
    position: absolute;
    pointer-events: none;
    z-index: -1;
  `,
};
