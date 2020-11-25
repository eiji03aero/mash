import React from "react";
import { css, cx } from "emotion";

import * as types from "../../../types";
import * as hooks from "../hooks";

import { BufferContent } from "./buffer/BufferContent";
import { FilerContent } from "./buffer/FilerContent";

interface IProps {
  bufferWindow: types.SBufferWindow;
  buffer: types.SBufferKind;
}

export const BufferWindow: React.FC<IProps> = ({
  bufferWindow,
  buffer,
}) => {
  const ctx = hooks.useAppContext();


  const containerClassName = cx(
    Styles.container({
      vertColumn: ctx.config.color.VertSplit,
    }),
    Styles.width(bufferWindow.width),
  );

  return (
    <div className={containerClassName}>
      {buffer.type === "Buffer" ? (
        <BufferContent
          buffer={buffer}
        />
      ) : buffer.type === "Filer" ? (
        <FilerContent
          filer={buffer}
        />
      ) : null}
    </div>
  );
};

const Styles = {
  container: (params: {
    vertColumn: string;
  }) => css`
    height: 100%;
    overflow-y: scroll;

    &:not(:first-of-type) {
      border-left: 8px solid ${params.vertColumn};
    }
  `,
  width: (width?: number) => css`
    ${typeof width === "number" ? `
      width: ${width}px;
    ` : `
      flex: 1;
    `}
  `,
};
