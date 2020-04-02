import { paths } from "mash-common";
import { ICommandPayload } from "mash";
import { IContext } from "../types";

export default ({
  args,
  environment,
}: ICommandPayload<IContext>) => {
  if (args.length < 2) {
    environment.error(1, "needs 1 argument. usage required here");
    return;
  }

  const basename = paths.basename(args[1]);
  environment.writeln(basename);
};
