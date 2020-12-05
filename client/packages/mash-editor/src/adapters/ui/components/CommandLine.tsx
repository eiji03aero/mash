import React from "react";
import { css } from "emotion";
import * as mc from "mash-common";

import * as types from "../../../types";
import * as hooks from "../hooks";

import { Row } from "./buffer/Row";
import { Cursor } from "./Cursor";

interface IProps {
  buffer: types.SBuffer;
}

export const CommandLine: React.FC<IProps> = ({
  buffer,
}) => {
  const { config, service } = hooks.useAppContext();


  const rowHeight = service.getRowHeight();
  const lines = mc.text.splitByNewLine(buffer.content);

  const containerClassName = Styles.container({
    minHeight: config.commandLineRows * rowHeight,
  });

  const renderCursor = () => {
    const cursorLine = lines[buffer.cursorLine];
    const leftText = cursorLine.slice(0, buffer.cursorColumn);
    const cursorChar = cursorLine[buffer.cursorColumn] || " ";
    return (
      <Cursor
        width={service.getTextMetrics(cursorChar).width}
        height={rowHeight}
        top={buffer.cursorLine * rowHeight}
        left={config.rowPaddingLeft + service.getTextMetrics(leftText).width}
      />
    );
  };

  return (
    <div className={containerClassName}>
      {lines.map((l, i) => {
        return (
          <Row
            key={i}
            text={l}
          />
        );
      })}

      {service.state.focusTarget === "commandLine" && (
        renderCursor()
      )}
    </div>
  );
};

const Styles = {
  container: (params: {
    minHeight: number;
  }) => css`
    position: relative;
    width: 100%;
    min-height: ${params.minHeight}px;
  `,
};
