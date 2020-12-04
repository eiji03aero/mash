import React from "react";
import { css } from "emotion";

import * as hooks from "../hooks";

interface IProps {
  width: number;
  height: number;
  left: number;
  top: number;
}

export const Cursor: React.FC<IProps> = ({
  width,
  height,
  left,
  top,
}) => {
  const cursorRef = React.useRef<HTMLDivElement>(null);
  const idsRef = React.useRef({
    initialPause: 0,
    interval: 0,
  });
  const { config } = hooks.useAppContext();

  const cancelTimers = () => {
    window.clearTimeout(idsRef.current.initialPause);
    window.clearTimeout(idsRef.current.interval);
  };

  const toggleCursor = (cmd?: "show" | "hide") => {
    if (!cursorRef.current) {
      return;
    }
    const method =
      cmd === "show" ? "add" :
      cmd === "hide" ? "remove" :
      "toggle";
    cursorRef.current.classList[method](Styles.show);
  }

  const startBlinking = () => {
    if (!cursorRef.current) {
      return;
    }

    cancelTimers();
    toggleCursor("show");
    idsRef.current.initialPause = window.setTimeout(() => {
      idsRef.current.interval = window.setInterval(() => {
        toggleCursor();
      }, config.cursorBlinkDuration);
    }, config.cursorBlinkInitialPause);
  };


  React.useEffect(() => {
    startBlinking();
  }, [left, top]);


  const containerClassName = Styles.container({
    width: width,
    height: height,
    left: left,
    top: top,
    background: config.color.CursorBg,
  });

  return (
    <div className={containerClassName}
      ref={cursorRef}
    />
  );
};

const Styles = {
  container: (params: {
    width: number;
    height: number;
    left: number;
    top: number;
    background: string;
  }) => css`
    position: absolute;
    width: ${params.width}px;
    height: ${params.height}px;
    left: ${params.left}px;
    top: ${params.top}px;
    background: ${params.background};
    z-index: -1;
    visibility: hidden;
  `,
  show: css`
    visibility: visible !important;
  `,
};
