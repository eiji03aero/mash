import React from "react";
import { css, keyframes } from "emotion";

import { colors } from "../../../utils";

export const HorizontalLoadingIndicator: React.SFC = () => {
  return (
    <div className={Styles.container}>
      <div className={Styles.pingPong}></div>
    </div>
  );
};

const doubleBullet = keyframes`
  0% {
    right: 100%;
    width: 0;
  }
  35% {
    right: 0;
    width: 60%;
  }
  55% {
    right: 0;
    width: 0;
  }
  60% {
    right: 100%;
    width: 0;
  }
  75% {
    right: 0;
    width: 60%;
  }
  90% {
    right: 0;
    width: 0;
  }
  100% {
    right: 0;
    width: 0;
  }
`;

const Styles = {
  container: css`
    position: relative;
    width: 100%;
    height: 10px;
    background-color: ${colors.pallete.black};
  `,
  pingPong: css`
    position: absolute;
    height: 100%;
    background-color: ${colors.pallete.blue};
    animation: ${doubleBullet} 3s linear infinite;
  `
};
