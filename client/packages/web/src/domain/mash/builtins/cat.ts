import { utils } from "mash-filesystem";
import { Monad } from "mash-common";

import { CommandPayload } from "../types";

export default async ({
  args,
  environment,
  context: {
    filesystem
  }
}: CommandPayload) => {
  if (args.length < 2) {
    environment.error(1, "needs 1 argument. usage required here");
    return;
  }

  const path = args[1];
  const r = filesystem.resolveNodeFromPath(path);
  if (Monad.either.isLeft(r)) {
    environment.error(1, r.error.message());
    return;
  }
  const node = r.value;

  if (utils.isDirectory(node)) {
    environment.error(1, `${node.name}: is a directory`);
    return;
  } else if (utils.isFile(node)) {
    environment.writeln(node.content);
  }
};
