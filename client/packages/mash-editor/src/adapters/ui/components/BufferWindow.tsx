import React from "react";
import { css, cx } from "emotion";

import * as types from "../../../types";
import * as hooks from "../hooks";

import { BufferContent } from "./buffer/BufferContent";
import { FilerContent } from "./buffer/FilerContent";
import { Ruler } from "./buffer/Ruler";
import { StatusLine } from "./StatusLine";

interface IProps {
  bufferWindow: types.SBufferWindow;
  buffer: types.SBufferKind;
  focused: boolean;
}

export const BufferWindow: React.FC<IProps> = ({
  bufferWindow,
  buffer,
  focused,
}) => {
  const { config, service } = hooks.useAppContext();


  const containerClassName = cx(
    Styles.container({
      vertColumn: config.color.VertSplit,
    }),
    Styles.width(bufferWindow.width),
  );

  const renderBuffer = (buffer: types.SBuffer) => {
    const rows = service.getDisplayRows({
      bufferWindowId: bufferWindow.id,
      bufferId: buffer.id,
    });
    const lines = service.getLineTextsOfBuffer(buffer.id);
    const ruler = (
      <Ruler
        rows={rows}
        cursoredIndex={buffer.cursorLine}
        column={String(lines.length).length}
      />
    )
    const content = (
      <BufferContent
        buffer={buffer}
        rows={rows}
      />
    );
    return {
      ruler,
      content,
    };
  };

  const renderFiler = (filer: types.SFiler) => {
    const content = (
      <FilerContent
        filer={filer}
      />
    );
    return {
      ruler: null,
      content,
    };
  };

  const { content, ruler } =
    buffer.type === "Buffer" ? renderBuffer(buffer) :
    buffer.type === "Filer" ? renderFiler(buffer) :
    { content: null, ruler: null };

  return (
    <div className={containerClassName}
      data-buffer-window-id={bufferWindow.id}
      data-component-name="BufferWindow"
    >
      <div className={Styles.contentArea}>
        {!!ruler && (
          <div className={Styles.ruler}>
            { ruler }
          </div>
        )}
        <div className={Styles.content} data-component-name="BufferWindow__content">
          { content }
        </div>
      </div>
      <StatusLine
        buffer={buffer}
        mode={bufferWindow.mode}
        focused={focused}
      />
    </div>
  );
};

const Styles = {
  container: (params: {
    vertColumn: string;
  }) => css`
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: hidden;

    &:not(:first-of-type) {
      border-left: 8px solid ${params.vertColumn};
    }
  `,
  contentArea: css`
    flex: 1;
    display: flex;
    width: 100%;
    min-height: 0;
  `,
  ruler: css`
    flex-shrink: 1;
  `,
  content: css`
    flex: 1;
    height: 100%;
  `,
  width: (width?: number) => css`
    ${typeof width === "number" ? `
      width: ${width}px;
    ` : `
      flex: 1;
    `}
  `,
};
