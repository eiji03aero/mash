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
    engine.service.handleTextareaChange(e);
  };

  const onKeyUp = (e: KeyboardEvent) => {
    engine.service.handleTextareaChange(e);
  };

  const onChange = (e: Event) => {
    engine.service.handleTextareaChange(e);
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
    refs.handlerTextarea.current?.addEventListener("keyup", onKeyUp);
    refs.handlerTextarea.current?.addEventListener("change", onChange);

    engine.requestAction({
      type: "mounted",
    });

    return () => {
      engine.service.offRequestAction(onRequestAction);
      window.document.removeEventListener("click", onClickDocument);
      window.removeEventListener("resize", resizeHandler);
      refs.handlerTextarea.current?.removeEventListener("keydown", onKeyDown);
      refs.handlerTextarea.current?.removeEventListener("keypress", onKeyPress);
      refs.handlerTextarea.current?.removeEventListener("keyup", onKeyUp);
      refs.handlerTextarea.current?.removeEventListener("change", onChange);
    };
  }, [state, setState]);

  React.useEffect(() => {
    const hta = refs.handlerTextarea.current;
    if (!hta) {
      return;
    }

    engine.service.handlerTextarea = hta;
    engine.service.focus();
    engine.service.setState(engine.service.state);
  }, []);


  const containerClassName = Styles.container({
    font: state.config.font,
    background: state.config.background,
  });

  return (
    <div className={containerClassName} ref={refs.container}>
      <EditorContent
        currentWindowId={state.currentWindowId}
        windows={state.windows}
        buffers={state.buffers}
      />

      <div className={Styles.hidden}>
        <textarea
          ref={refs.handlerTextarea}
          className={Styles.hidden}
        />
      </div>
    </div>
  );
};

const Styles = {
  container: (params: {
    font: string;
    background: string;
  }) => css`
    position: relative;
    width: 100%;
    height: 100%;
    background: ${params.background};
    z-index: 0;

    * {
      font-family: ${params.font};
      box-sizing: border-box;
    }
  `,
  hidden: css`
    position: absolute;
    top: -10px;
    left: -10px;
    width: 0;
    height: 0;
    pointer-events: none;
    z-index: -1;
  `,
};
