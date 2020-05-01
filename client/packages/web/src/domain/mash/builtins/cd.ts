import * as E from "fp-ts/es6/Either";

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
  if (E.isLeft(r)) {
    environment.error(1, r.left.message);
    return;
  }
  const node = r.right;

  const r2 = filesystem.changeCurrentDirectory(node.id);
  if (E.isLeft(r2)) {
    environment.error(1, r2.left.message);
  }
};
