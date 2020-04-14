import { utils } from "mash";
import { utils as futils } from "mash-filesystem";
import { Monad } from "mash-common";

import { CommandPayload } from "../types";

export default async ({
  args: _args,
  environment,
  context: {
    filesystem
  }
}: CommandPayload) => {
  const { args, options } = utils.parseCommandArgs(_args, {
    r: false,
  });
  if (args.length < 1) {
    environment.error(1, "needs 1 argument. usage required here");
    return;
  }

  const path = args[1];
  let r = filesystem.resolveNodeFromPath(path);
  if (Monad.either.isLeft(r)) {
    environment.error(1, r.error.message);
    return;
  }
  const node = r.value;

  if (futils.isDirectory(node)) {
    if (!options.r) {
      environment.error(1, `${node.name}: is a directory`);
      return;
    }
    r = filesystem.deleteDirectory(node.id);
  } else if (futils.isFile(node)) {
    r = filesystem.deleteFile(node.id);
  }

  if (Monad.either.isLeft(r)) {
    environment.error(1, r.error.message);
  }
};
