import React from "react";
import { css, cx } from "emotion";
import * as mc from "mash-common";

import * as hooks from "../../hooks";

interface IProps {
  text: string;
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
  cursored?: boolean;
}

export const Row: React.FC<IProps> = ({
  text,
  style,
  cursored = false,
}) => {
  const ctx = hooks.useAppContext();


  const containerClassName = cx(
    Styles.container({
      text: ctx.config.color.Text,
      fontSize: ctx.config.fontSize,
      pt: ctx.config.rowPaddingTop,
      pb: ctx.config.rowPaddingBottom,
      pl: ctx.config.rowPaddingLeft,
      pr: ctx.config.rowPaddingRight,
    }),
    cursored && Styles.cursored({
      color: ctx.config.color.Text,
    }),
  );

  return (
    <div className={containerClassName} style={style} data-component="Row">
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
      {text.length === 0 && (
        <span >&nbsp;</span>
      )}
    </div>
  );
};

const Styles = {
  container: (params: {
    text: string;
    fontSize: number;
    pt: number;
    pb: number;
    pl: number;
    pr: number;
  }) => css`
    width: 100%;
    padding: 0 4px;
    color: ${params.text};
    white-space: pre;
    word-break: break-all;
    line-height: 1;
    font-size: ${params.fontSize}px;
    padding: ${params.pt}px ${params.pr}px ${params.pb}px ${params.pl}px;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
  `,
  cursored: (params: {
    color: string;
  }) => css`
    border-bottom-color: ${params.color};
  `
};
