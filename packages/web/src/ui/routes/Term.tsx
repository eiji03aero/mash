import React from "react";

import { initialize } from "../../mash";

interface IProps {
  _?: any;
}

export const Term: React.SFC<IProps> = ({

}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (containerRef.current === null) return;

    initialize(containerRef.current);
  }, []);

  return (
    <div ref={containerRef}
      style={{width: "100%", height: "100%"}}
    />
  );
};
