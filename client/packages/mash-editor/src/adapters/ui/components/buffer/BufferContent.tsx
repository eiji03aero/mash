import React from "react";
import { css } from "emotion";

import * as types from "../../../../types";

import { Row } from "./Row";

interface IProps {
  buffer: types.SBuffer;
  rows: types.BufferRow[];
}

export const BufferContent: React.FC<IProps> = ({
  buffer,
  rows,
}) => {
  return (
    <div className={Styles.container}>
      {rows.map((row) => {
        return (
          <Row
            key={`${row.lineIndex}-${row.index}`}
            text={row.text}
            cursored={row.lineIndex === buffer.cursorLine}
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
