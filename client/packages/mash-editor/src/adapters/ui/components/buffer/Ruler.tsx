import React from "react";
import { css } from "emotion";
import * as mc from "mash-common";

import * as types from "../../../../types";
import * as hooks from "../../hooks";
import { Row } from "./Row";

interface IProps {
  rows: types.BufferRow[];
  cursoredIndex: number;
  column: number;
}

export const Ruler: React.FC<IProps> = ({
  rows,
  cursoredIndex,
  column,
}) => {
  const { config } = hooks.useAppContext();

  return (
    <div className={Styles.container}>
      {rows.map((r, i) => {
        const text = r.index === 0
          ? mc.text.padStart(r.lineIndex + 1, " ", column) + " "
          : mc.text.repeat(" ", column);
        return (
          <Row
            key={`${i}-t`}
            text={text}
            cursored={r.lineIndex === cursoredIndex}
            style={{ color: config.color.ColorColumn }}
          />
        )
      })}
    </div>
  );
};

const Styles = {
  container: css`
    height: 100%;
    overflow: hidden;
  `,
};
