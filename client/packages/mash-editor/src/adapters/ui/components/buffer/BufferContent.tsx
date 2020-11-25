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
  return (
    <div className={Styles.container}>
      {mc.text.splitByNewLine(buffer.content).map((line) => {
        return (
          <Row
            key={line}
            text={line}
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
