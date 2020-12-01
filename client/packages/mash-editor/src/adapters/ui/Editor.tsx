import React from "react";
import { css } from "emotion";
import _ from "lodash";

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

    const windowDoms = document.querySelectorAll<HTMLElement>("[data-component-name='BufferWindow']");
    for (const key in windowDoms) {
      const dw = windowDoms[key];
      if (!dw.contains(target)) {
        continue;
      }

      const id = dw.getAttribute("data-buffer-window-id")!;
      engine.service.setState({
        currentWindowId: id,
      });
      break;
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    engine.service.handleKeyDown(e);
  };

  const onKeyPress = (e: KeyboardEvent) => {
    engine.service.handleKeyPress(e);
  };

  const onResize = () => {
    engine.service.setState(state);
  };


  React.useEffect(() => {
    const resizeHandler = _.debounce(onResize, 500);

    engine.service.onRequestAction(onRequestAction);
    window.addEventListener("resize", resizeHandler);
    window.document.addEventListener("click", onClickDocument);
    refs.handlerTextarea.current?.addEventListener("keydown", onKeyDown);
    refs.handlerTextarea.current?.addEventListener("keypress", onKeyPress);

    return () => {
      engine.service.offRequestAction(onRequestAction);
      window.document.removeEventListener("click", onClickDocument);
      window.removeEventListener("resize", resizeHandler);
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


  const containerClassName = Styles.container({
    font: state.config.font,
  });

  return (
    <div className={containerClassName} ref={refs.container}>
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
  container: (params: {
    font: string;
  }) => css`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    * {
      font-family: ${params.font};
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
