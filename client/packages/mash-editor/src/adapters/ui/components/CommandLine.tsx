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
  const infoLines = mc.text.splitByNewLine(service.state.infoText);
  const bufferLines = mc.text.splitByNewLine(buffer.content);

  const containerClassName = Styles.container({
    minHeight: config.commandLineRows * rowHeight,
  });

  const renderCursor = () => {
    const cursorLine = bufferLines[buffer.cursorLine];
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
      <div className={Styles.info}>
        {service.state.infoText.length > 0 && infoLines.map((l, i) => {
          return (
            <Row
              key={i + l}
              text={l}
            />
          );
        })}
      </div>

      <div className={Styles.commandLine}>
        {bufferLines.map((l, i) => {
          return (
            <Row
              key={i + l}
              text={l}
            />
          );
        })}

        {service.state.focusTarget === "commandLine" && (
          renderCursor()
        )}
      </div>
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
  info: css`
    position: relative;
  `,
  commandLine: css`
    position: relative;
  `,
};
