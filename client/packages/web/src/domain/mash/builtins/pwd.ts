import { Monad } from "mash-common";

import { CommandPayload } from "../types";

export default async ({
  environment,
  context: {
    filesystem
  }
}: CommandPayload) => {
  const currentDirectory = filesystem.currentDirectory;
  const r = filesystem.resolveAbsolutePath(currentDirectory.id);
  if (Monad.either.isLeft(r)) {
    environment.error(1, r.error.message);
    return;
  }
  environment.writeln(r.value);
};
