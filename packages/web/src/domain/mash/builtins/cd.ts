import { Monad } from "mash-common";
import { ICommandPayload } from "mash";

import { IContext } from "../types";

export default ({
  args,
  environment,
  context: {
    filesystem
  }
}: ICommandPayload<IContext>) => {
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

  const r2 = filesystem.changeCurrentDirectory(node.id);
  if (Monad.either.isLeft(r2)) {
    environment.error(1, r2.error.message());
  }
};