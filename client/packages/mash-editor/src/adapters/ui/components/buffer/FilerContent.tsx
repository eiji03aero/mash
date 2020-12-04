import React from "react";
import { css } from "emotion";
import * as mfs from "mash-filesystem";

import * as types from "../../../../types";
import * as hooks from "../../hooks";

import { Row } from "./Row";

interface IProps {
  filer: types.SFiler;
}

export const FilerContent: React.FC<IProps> = ({
  filer,
}) => {
  const { engine: { service }, config } = hooks.useAppContext();


  const rows = service
    .getFilerRows(filer.id)
    .slice(filer.scrollLine, service.getMaxDisplayRowNumber());

  return (
    <div className={Styles.container}>
      {rows.map((r: types.FilerRow, idx: number) => {
        return (
          <Row
            key={r.node.id}
            text={r.text}
            style={{
              color: mfs.utils.isDirectory(r.node)
                ?  config.color.Directory
                : ""
            }}
            cursored={idx === filer.cursorLine}
          />
        );
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
