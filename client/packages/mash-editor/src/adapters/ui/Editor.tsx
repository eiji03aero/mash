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
  const [state, setState] = React.useState(engine.service.state);
  const refs = {
    container: React.useRef<HTMLDivElement>(null),
    handlerTextarea: React.useRef<HTMLTextAreaElement>(null),
  };


  const onRequestAction: types.RequestActionHandler = (action) => {
    switch (action.type) {
      case "setState":
        setState(action.state);
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

  const onKeyDown = (e: KeyboardEvent) => {
    engine.service.handleKeyDown(e);
  };

  const onKeyPress = (e: KeyboardEvent) => {
    engine.service.handleKeyPress(e);
  };


  React.useEffect(() => {
    engine.service.onRequestAction(onRequestAction);
    window.document.addEventListener("click", onClickDocument);
    refs.handlerTextarea.current?.addEventListener("keydown", onKeyDown);
    refs.handlerTextarea.current?.addEventListener("keypress", onKeyPress);

    return () => {
      engine.service.offRequestAction(onRequestAction);
      window.document.removeEventListener("click", onClickDocument);
      refs.handlerTextarea.current?.removeEventListener("keydown", onKeyDown);
      refs.handlerTextarea.current?.removeEventListener("keypress", onKeyPress);
    };
  }, [state, setState]);

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
