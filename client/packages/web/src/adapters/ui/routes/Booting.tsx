import React from "react";
import { css, cx } from "emotion";
import { useQuery } from "@apollo/client";

import { HorizontalLoadingIndicator } from "../components";
import { useCompositeState } from "../hooks";
import { gen } from "../../../graphql";
import { colors } from "../../../utils";

interface IState {
  show: boolean;
  removed: boolean;
}

export const Booting: React.FC = () => {
  const [state, setState] = useCompositeState<IState>({
    show: false,
    removed: false,
  });
  const { data: localStateResult } = useQuery<
    { localState: gen.LocalState }
  >(gen.GetLocalStateDocument);

  const handleShow = React.useCallback(() => {
    setState({ removed: false });
    setTimeout(() => {
      setState({ show: true });
    }, 50);
  }, [setState]);

  const handleHide = React.useCallback(() => {
    setState({ show: false });
    setTimeout(() => {
      setState({ removed: true });
    }, 500);
  }, [setState]);

  const handleApplicationStateChange = React.useCallback((state: gen.ApplicationState) => {
    switch (state) {
      case gen.ApplicationState.Running:
        handleHide();
        break;
      case gen.ApplicationState.Booting:
        handleShow();
    }
  }, [handleHide, handleShow]);


  React.useEffect(() => {
    const state = localStateResult?.localState.applicationState;
    if (state) {
      handleApplicationStateChange(state);
    }
  }, [localStateResult?.localState.applicationState])


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
    background: ${colors.pallete.deepGreen};

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
    color: ${colors.pallete.white};
  `
};
