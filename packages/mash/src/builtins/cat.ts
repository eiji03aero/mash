import { utils } from "mash-filesystem";
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
  const result = fileSystem.resolveNodeFromPath(path);

  if (result.isError) {
    environment.error(1, result.error.message());
    return;
  }

  const node = result.value;
  if (utils.isDirectory(node)) {
    environment.error(1, `${node.name}: is a directory`);
    return;
  } else if (utils.isFile(node)) {
    environment.writeln([
      { text: node.content },
    ]);
  }
};
