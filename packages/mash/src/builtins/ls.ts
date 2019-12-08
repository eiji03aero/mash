import { IFileSystemNode, utils } from "mash-filesystem";
import { ICommandPayload } from "../types";

export default ({
  args,
  environment,
  fileSystem,
}: ICommandPayload) => {
  const path = args[1] || ".";

  const result = fileSystem.resolveNodeFromPath(path);

  if (result.isError) {
    environment.error(1, result.error.message());
    return;
  }

  if (utils.isDirectory(result.value)) {
    const text = result.value.children
      .map((c: IFileSystemNode) => c.name)
      .join(" ");
    environment.writeln([{ text }]);
  } else {
    environment.writeln([
      { text: result.value.name },
    ]);
  }
};
