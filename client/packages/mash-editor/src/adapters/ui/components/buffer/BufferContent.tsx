import React from "react";
import { css } from "emotion";

import * as types from "../../../../types";
import * as hooks from "../../hooks";

import { Row } from "./Row";

interface IProps {
  bufferWindowId: string;
  buffer: types.SBuffer;
}

export const BufferContent: React.FC<IProps> = ({
  bufferWindowId,
  buffer,
}) => {
  const { engine: { service } } = hooks.useAppContext();

  const rows = service.getDisplayRows({
    bufferWindowId,
    bufferId: buffer.id,
  });

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
