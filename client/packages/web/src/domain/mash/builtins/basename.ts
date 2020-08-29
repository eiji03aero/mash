import { paths } from "mash-common";
import { CommandPayload } from "../types";

export default async ({
  args,
  environment,
}: CommandPayload): Promise<void> => {
  if (args.length < 2) {
    environment.error(1, "needs 1 argument. usage required here");
    return;
  }

  const basename = paths.basename(args[1]);
  environment.writeln(basename);
};
