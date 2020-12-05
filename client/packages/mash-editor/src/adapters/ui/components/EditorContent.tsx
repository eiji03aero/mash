import React from "react";
import { css } from "emotion";

import * as types from "../../../types";
import * as hooks from "../hooks";

import { BufferWindow } from "./BufferWindow";
import { CommandLine } from "./CommandLine";

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
  const { service } = hooks.useAppContext();

  const commandLineBuffer =
    service.state.buffers.find((b) => b.id === service.state.commandLineBufferId);

  return (
    <div className={Styles.container}>
      <div className={Styles.content}>
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

      {!!commandLineBuffer && commandLineBuffer.type === "Buffer" && (
        <CommandLine
          buffer={commandLineBuffer}
        />
      )}
    </div>
  );
};

const Styles = {
  container: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  `,
  content: css`
    display: flex;
    width: 100%;
    flex: 1;
    min-height: 0;
  `,
};
