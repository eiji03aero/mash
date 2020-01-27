import { utils as futils } from "mash-filesystem";
import { Monad } from "mash-common";
import { ICommandPayload } from "../types";
import * as utils from "../utils";

export default ({
  args: _args,
  fileSystem,
  environment,
}: ICommandPayload) => {
  const { args, options } = utils.parseCommandArgs(_args, {
    r: false,
  });
  if (args.length < 2) {
    environment.error(1, "needs 1 argument. usage required here");
    return;
  }

  const path = args[1];
  let r = fileSystem.resolveNodeFromPath(path);
  if (Monad.either.isLeft(r)) {
    environment.error(1, r.error.message());
    return;
  }
  const node = r.value;

  if (futils.isDirectory(node)) {
    if (!options.r) {
      environment.error(1, `${node.name}: is a directory`);
      return;
    }
    r = fileSystem.deleteDirectory(node.id);
  } else if (futils.isFile(node)) {
    r = fileSystem.deleteFile(node.id);
  }

  if (Monad.either.isLeft(r)) {
    environment.error(1, r.error.message());
  }
};
