import { Monad, paths } from "mash-common";

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
  if (Monad.either.isLeft(r)) {
    environment.error(1, r.error.message());
    return;
  }
  const parentNode = r.value;

  const r2 = filesystem.createFile({
    parentNodeId: parentNode.id,
    params: {
      name: basename,
    },
  });
  if (Monad.either.isLeft(r2)) {
    environment.error(1, r2.error.message());
    return;
  }
};
