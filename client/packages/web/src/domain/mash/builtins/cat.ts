import * as E from "fp-ts/lib/Either";
import { utils } from "mash-filesystem";

import { CommandPayload } from "../types";

export default async ({
  args,
  environment,
  context: {
    filesystem
  }
}: CommandPayload): Promise<void> => {
  if (args.length < 2) {
    environment.error(1, "needs 1 argument. usage required here");
    return;
  }

  const path = args[1];
  const r = filesystem.resolveNodeFromPath(path);
  if (E.isLeft(r)) {
    environment.error(1, r.left.message);
    return;
  }
  const node = r.right;

  if (utils.isDirectory(node)) {
    environment.error(1, `${node.name}: is a directory`);
    return;
  } else if (utils.isFile(node)) {
    environment.writeln(node.content);
  }
};
