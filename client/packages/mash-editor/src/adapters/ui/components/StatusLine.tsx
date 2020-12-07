import React from "react";
import { css } from "emotion";
import * as mc from "mash-common";

import * as types from "../../../types";
import * as hooks from "../hooks";

interface IProps {
  buffer: types.SBufferKind;
  mode: types.BufferWindowMode;
  focused: boolean;
}

export const StatusLine: React.FC<IProps> = ({
  buffer,
  mode,
  focused,
}) => {
  const { service,  config } = hooks.useAppContext();


  const nodeInfo = service.getBufferDisplayInfo(buffer.id);

  const totalLine = service.getLineTextsOfBuffer(buffer.id).length;
  const curLine = buffer.cursorLine + 1;

  const linePercent = Math.floor(curLine / totalLine);
  const linePercentText =
    `${mc.text.repeat(" ", 3 - linePercent.toString.length)}${linePercent}%`;

  const digits = totalLine.toString().length;
  const cdigits = curLine.toString().length;
  const lineText =
    `${mc.text.repeat(" ", digits - cdigits)}${curLine}:${totalLine}`;

  const modeConfig = mode === "normal" ? ({
    modeText: "NORMAL",
    primaryBackground: config.color.StatusLineModeNormalBg,
    primaryFontColor: config.color.StatusLineModeNormalFg,
  }) : mode === "insert" ? ({
    modeText: "INSERT",
    primaryBackground: config.color.StatusLineModeInsertBg,
    primaryFontColor: config.color.StatusLineModeInsertFg,
  }) : ({
    modeText: "",
    primaryBackground: "",
    primaryFontColor: "",
  });

  const containerClassName = Styles.container({
    fontSize: config.fontSize,
    background: config.color.StatusLineBg,
  });

  const modeClassName = Styles.cell({
    background: modeConfig.primaryBackground,
    color: modeConfig.primaryFontColor,
  });

  const nodeNameClassName = Styles.cell({
    color: config.color.StatusLineNodeNameFg,
  });

  const directoryPathClassName = Styles.cell({
    color: config.color.StatusLineDirectoryPathFg,
  });

  const dirtyClassName = Styles.cell({
    color: config.color.StatusLineDirtySignFg,
  });

  const padClassName = Styles.cell({
    flexGrow: 1,
  });

  const linePercentClassName = Styles.cell({
    background: focused
      ? config.color.StatusLineSubBg
      : "transparent",
    color: config.color.StatusLineSubFg,
  });

  const lineInfoClassName = Styles.cell({
    background: focused
      ? modeConfig.primaryBackground
      : config.color.StatusLineSubBg,
    color: focused
      ? modeConfig.primaryFontColor
      : config.color.StatusLineSubFg,
  });

  return (
    <div className={containerClassName}>
      {focused && (
        <div className={modeClassName}>
          { modeConfig.modeText }
        </div>
      )}
      <div className={nodeNameClassName}>
        { nodeInfo.name }
      </div>
      <div className={directoryPathClassName}>
        { nodeInfo.directoryPath }
      </div>
      {buffer.dirty && (
        <div className={dirtyClassName}>
          +
        </div>
      )}
      <div className={padClassName}></div>
      <div className={linePercentClassName}>
        { linePercentText }
      </div>
      <div className={lineInfoClassName}>
        { lineText }
      </div>
    </div>
  );
};

const Styles = {
  container: (params: {
    fontSize: number;
    background: string;
  }) => css`
    display: flex;
    background: ${params.background};
    font-size: ${params.fontSize}px;
    line-height: 1;
  `,
  cell: (params: {
    background?: string;
    color?: string;
    flexGrow?: number;
  }) => css`
    padding: 2px 8px;
    background: ${params.background ?? "transparent"};
    color: ${params.color ?? "auto"};
    flex-grow: ${params.flexGrow ?? 0};
    flex-shrink: 0;
    white-space: pre;
  `,
};
