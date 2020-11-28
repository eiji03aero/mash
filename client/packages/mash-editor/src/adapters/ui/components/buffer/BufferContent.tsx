import React from "react";
import { css } from "emotion";
import * as mc from "mash-common";

import * as types from "../../../../types";

import { Row } from "./Row";

interface IProps {
  buffer: types.SBuffer;
}

export const BufferContent: React.FC<IProps> = ({
  buffer,
}) => {
  const lines = mc.text.splitByNewLine(buffer.content);
  const displayLines = lines.slice(buffer.scrollLine);

  return (
    <div className={Styles.container}>
      {displayLines.map((line, idx) => {
        return (
          <Row
            key={idx + line}
            text={line}
            cursored={idx === buffer.cursorLine}
          />
        )
      })}
    </div>
  );
};

const Styles = {
  container: css`
    width: 100%;
    height: 100%;
    overflow: hidden;
  `,
};
