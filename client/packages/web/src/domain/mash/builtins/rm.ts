import * as E from "fp-ts/lib/Either";
import { utils } from "mash";
import { utils as futils } from "mash-filesystem";

import { CommandPayload } from "../types";

export default async ({
  args: _args,
  environment,
  context: {
    filesystem
  }
}: CommandPayload): Promise<void> => {
  const { args, options } = utils.parseCommandArgs(_args, {
    r: false,
  });
  if (args.length < 1) {
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

  if (futils.isDirectory(node)) {
    if (!options.r) {
      environment.error(1, `${node.name}: is a directory`);
      return;
    }

    const r = await filesystem.deleteDirectory({id: node.id});
    if (E.isLeft(r)) {
      environment.error(1, r.left.message);
      return
    }
  } else if (futils.isFile(node)) {
    const r = await filesystem.deleteFile({id: node.id});
    if (E.isLeft(r)) {
      environment.error(1, r.left.message);
      return
    }
  }
};
