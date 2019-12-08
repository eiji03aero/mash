import { utils as futils } from "mash-filesystem";
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
  let result = fileSystem.resolveNodeFromPath(path);

  if (result.isError) {
    environment.error(1, result.error.message());
    return;
  }

  const node = result.value;

  if (futils.isDirectory(node)) {
    if (!options.r) {
      environment.error(1, `${node.name}: is a directory`);
      return;
    }
    result = fileSystem.deleteDirectory(path);
  } else if (futils.isFile(node)) {
    result = fileSystem.deleteFile(path);
  }

  if (result.isError) {
    environment.error(1, result.error.message());
  }
};
