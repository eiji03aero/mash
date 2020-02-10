import { Monad } from "mash-common";
import { ICommandPayload } from "mash";

import { IContext } from "../types";

export default ({
  environment,
  context: {
    filesystem
  }
}: ICommandPayload<IContext>) => {
  const currentDirectory = filesystem.currentDirectory;
  const r = filesystem.resolveAbsolutePath(currentDirectory.id);
  if (Monad.either.isLeft(r)) {
    environment.error(1, r.error.message());
    return;
  }
  environment.writeln(r.value);
};
