import { utils } from "mash-filesystem";
import { Monad } from "mash-common";
import { ICommandPayload } from "../types";

export default ({
  args,
  fileSystem,
  environment,
}: ICommandPayload) => {
  if (args.length < 2) {
    environment.error(1, "needs 1 argument. usage required here");
    return;
  }

  const path = args[1];
  const r = fileSystem.resolveNodeFromPath(path);
  if (Monad.either.isLeft(r)) {
    environment.error(1, r.error.message());
    return;
  }
  const node = r.value;

  if (utils.isDirectory(node)) {
    environment.error(1, `${node.name}: is a directory`);
    return;
  } else if (utils.isFile(node)) {
    environment.writeln(node.content);
  }
};
