import * as E from "fp-ts/lib/Either";

import { CommandPayload } from "../types";

export default async ({
  environment,
  context: {
    filesystem
  }
}: CommandPayload) => {
  const currentDirectory = filesystem.currentDirectory;
  const r = filesystem.resolveAbsolutePath(currentDirectory.id);
  if (E.isLeft(r)) {
    environment.error(1, r.left.message);
    return;
  }
  environment.writeln(r.right);
};
