import React from "react";
import { css } from "emotion";
import * as mfs from "mash-filesystem";

import * as types from "../../../../types";
import * as hooks from "../../hooks";

import { Row } from "./Row";

interface IProps {
  filer: types.SFiler;
}

type NodeGroups = {
  files: mfs.IFile[];
  directories: mfs.IDirectory[];
};

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


  const nodes = service.getChildNodes(filer.nodeId);
  const { files, directories } = nodes.reduce((accum: NodeGroups, cur: mfs.IFileSystemNode) => {
    if (mfs.utils.isFile(cur)) {
      accum.files.push(cur);
    }
    else if (mfs.utils.isDirectory(cur)) {
      accum.directories.push(cur);
    }

    return accum;
  }, {files: [], directories: []} as NodeGroups)

  let rowDatas = [] as RowData[];
  rowDatas = rowDatas.concat(directories.map((d: mfs.IDirectory) => {
    return {
      id: d.id,
      text: `${arrowChar.right} ${d.name}`,
      style: { color: config.color.Directory },
    };
  }))
  rowDatas = rowDatas.concat(files.map((f: mfs.IFile) => {
    return {
      id: f.id,
      text: `  ${f.name}`,
      style: {},
    };
  }));

  return (
    <div className={Styles.container}>
      {rowDatas.map((rd: RowData) => {
        return (
          <Row
            key={rd.id}
            text={rd.text}
            style={rd.style}
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
