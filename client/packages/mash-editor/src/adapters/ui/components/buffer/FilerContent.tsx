import React from "react";
import { css } from "emotion";
import * as mfs from "mash-filesystem";
import * as mc from "mash-common";

import * as types from "../../../../types";
import * as hooks from "../../hooks";

import { Row } from "./Row";

interface IProps {
  filer: types.SFiler;
}

type RowData = {
  id: string;
  text: string;
  style: React.StyleHTMLAttributes<HTMLDivElement>;
};

const arrowChar = {
  right: "▸",
  down: "▾",
};

export const FilerContent: React.FC<IProps> = ({
  filer,
}) => {
  const { engine: { service }, config } = hooks.useAppContext();


  const rowDatas = service
    .getFilerRows(filer.id)
    .slice(filer.scrollLine, service.getMaxDisplayRowNumber())
    .map((row) => {
      const id = row.node.id;
      const indent = mc.text.repeat("  ", row.nest);

      if (mfs.utils.isDirectory(row.node)) {
        const caret = filer.openedNodeIds.includes(row.node.id)
          ? arrowChar.down
          : arrowChar.right;
        return {
          id,
          text: `${indent}${caret} ${row.node.name}`,
          style: { color: config.color.Directory },
        };
      }
      else if (mfs.utils.isFile(row.node)) {
        return {
          id,
          text: `${indent}${row.node.name}`,
          style: {},
        }
      }
      else {
        return {
          id,
          text: `${indent} unknown`,
          style: {},
        };
      }
    });

  return (
    <div className={Styles.container}>
      {rowDatas.map((rd: RowData, idx: number) => {
        return (
          <Row
            key={rd.id}
            text={rd.text}
            style={rd.style}
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
