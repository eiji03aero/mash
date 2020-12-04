import React from "react";
import { css, cx } from "emotion";

import * as types from "../../../types";
import * as hooks from "../hooks";

import { BufferContent } from "./buffer/BufferContent";
import { FilerContent } from "./buffer/FilerContent";
import { Ruler } from "./buffer/Ruler";
import { Cursor } from "./Cursor";
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

  const rowHeight = service.getRowHeight();
  const cursorInfo = service.getCursorInfo({
    bufferWindowId: bufferWindow.id,
    bufferId: buffer.id,
  });

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
    );

    const content = (
      <BufferContent
        buffer={buffer}
        rows={rows}
      />
    );

    const cursorLineIdx =
      rows.findIndex((r) => r.lineIndex === buffer.cursorLine && r.index === cursorInfo.line);
    const cursor = (
      <Cursor
        top={cursorLineIdx * rowHeight}
        left={cursorInfo.offsetLeft}
        width={cursorInfo.charWidth}
        height={rowHeight}
      />
    );

    return {
      ruler,
      content,
      cursor,
    };
  };

  const renderFiler = (filer: types.SFiler) => {
    const content = (
      <FilerContent
        filer={filer}
      />
    );

    const cursor = (
      <Cursor
        top={(filer.cursorLine - filer.scrollLine) * rowHeight}
        left={cursorInfo.offsetLeft}
        width={cursorInfo.charWidth}
        height={rowHeight}
      />
    );

    return {
      ruler: null,
      content,
      cursor,
    };
  };

  const { content, ruler, cursor } =
    buffer.type === "Buffer" ? renderBuffer(buffer) :
    buffer.type === "Filer" ? renderFiler(buffer) :
    { content: null, ruler: null, cursor: null };

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
          { focused && cursor }
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
    position: relative;
    flex: 1;
    min-width: 0;
    height: 100%;
    z-index: 0;
  `,
  width: (width?: number) => css`
    ${typeof width === "number" ? `
      width: ${width}px;
    ` : `
      flex: 1;
    `}
  `,
};
