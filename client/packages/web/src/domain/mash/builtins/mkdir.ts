import * as E from "fp-ts/lib/Either";
import { paths } from "mash-common";

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
  const { dirname, basename } = paths.inspect(path);

  const r = filesystem.resolveNodeFromPath(dirname);
  if (E.isLeft(r)) {
    environment.error(1, r.left.message);
    return;
  }
  const parentNode = r.right;

  const r2 = filesystem.createDirectory({
    parentNodeId: parentNode.id,
    params: {
      name: basename,
    },
  });
  if (E.isLeft(r2)) {
    environment.error(1, r2.left.message);
  }
};
