import React from "react";
import { css, cx } from "emotion";
import * as mc from "mash-common";

import * as hooks from "../../hooks";

interface IProps {
  text: string;
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
}

export const Row: React.FC<IProps> = ({
  text,
  style,
}) => {
  const ctx = hooks.useAppContext();


  const containerClassName = cx(
    Styles.container({
      text: ctx.config.color.Text,
    }),
  );

  return (
    <div className={containerClassName} style={style}>
      {mc.text.parseColorString(text).map((v: mc.ITextObject, idx: number) => {
        return (
          <span
            key={v.text + idx}
            style={{color: v.color}}
          >
            {v.text}
          </span>
        );
      })}
    </div>
  );
};

const Styles = {
  container: (params: {
    text: string;
  }) => css`
    width: 100%;
    padding: 0 4px;
    color: ${params.text};
    white-space: pre;
    word-break: break-all;
  `,
};
