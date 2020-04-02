import React from "react";

import { AppContext } from "../context";

interface IProps {
  _?: any;
}

export const Term: React.SFC<IProps> = ({
}) => {
  const ctx = React.useContext(AppContext);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    ctx.service.initialize({
      terminalContainer: containerRef.current,
    });
  }, []);

  return (
    <div ref={containerRef}
      style={{width: "100%", height: "100%"}}
    />
  );
};
