import React from "react";
import { css } from "emotion";

import * as types from "../../../types";

import { BufferWindow } from "./BufferWindow";

interface IProps {
  windows: types.SBufferWindow[];
  buffers: types.SBufferKind[];
  currentWindowId: string;
}

export const EditorContent: React.FC<IProps> = ({
  windows,
  buffers,
  currentWindowId,
}) => {
  return (
    <div className={Styles.container}>
      {windows.map((bw: types.SBufferWindow) => {
        const buffer = buffers.find((b: types.SBufferKind) => b.id === bw.currentSourceId);
        if (!buffer) {
          console.error("buffer not found.", bw);
          return null;
        }

        return (
          <BufferWindow
            key={bw.id}
            bufferWindow={bw}
            buffer={buffer}
            focused={currentWindowId === bw.id}
          />
        );
      })}
    </div>
  );
};

const Styles = {
  container: css`
    display: flex;
    width: 100%;
    height: 100%;
  `,
};
