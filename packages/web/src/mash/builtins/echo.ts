import { ICommandPayload } from "mash";

import { IContext } from "../types";

export default ({
  args,
  environment,
}: ICommandPayload<IContext>) => {
  const str = args.slice(1).join(" ");
  environment.writeln(str);
};
