import React from "react";
import { css, cx } from "emotion";

import { HorizontalLoadingIndicator } from "../components";
import { useCompositeState } from "../hooks";
import { colors } from "../utils";

interface IProps {
  show: boolean;
}

interface IState {
  show: boolean;
  removed: boolean;
}

export const Booting: React.SFC<IProps> = ({
  show,
}) => {
  const [state, setState] = useCompositeState<IState>({
    show: false,
    removed: false,
  });

  const handleShow = () => {
    setState({ removed: false });
    setTimeout(() => {
      setState({ show: true });
    }, 50);
  };

  const handleHide = () => {
    setState({ show: false });
    setTimeout(() => {
      setState({ removed: true });
    }, 500);
  };

  React.useEffect(() => {
    setState;
  }, [show]);

  React.useEffect(() => {
    handleShow();
    setTimeout(() => {
      handleHide();
    }, 2000);
  }, [])


  const containerClassName = cx(Styles.container, {
    "fade-down": !state.show,
    "removed": state.removed,
  });

  return (
    <div className={containerClassName}>
      <div className={Styles.box}>
        <HorizontalLoadingIndicator />
        <p className={Styles.boxStatement}>
        Booting mash, hold on a second ...
        </p>
      </div>
    </div>
  );
};

const Styles = {
  container: css`
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: ${colors.deepGreen};

    opacity: 1;
    transform: translateY(0px);
    transition: opacity .5s ease-in-out, transform .5s ease-in-out;

    &.fade-down {
      opacity: 0;
      transform: translateY(24px);
    }

    &.removed {
      display: none;
    }
  `,
  box: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 400px;

    & > *:not(:last-child) {
      margin-bottom: 16px;
    }
  `,
  boxStatement: css`
    color: ${colors.white};
  `
};
