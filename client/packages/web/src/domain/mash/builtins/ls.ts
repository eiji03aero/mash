import { IFileSystemNode, utils } from "mash-filesystem";
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
  const path = args[1] || ".";
  const r = filesystem.resolveNodeFromPath(path);
  if (Monad.either.isLeft(r)) {
    environment.error(1, r.error.message());
    return;
  }
  const node = r.value;

  if (utils.isDirectory(node)) {
    const r = filesystem.getNodes(node.children);
    if (Monad.either.isLeft(r)) {
      environment.error(1, r.error.message());
      return;
    }
    const text = r.value
      .map((c: IFileSystemNode) => c.name)
      .join(" ");
    environment.writeln(text);
  } else {
    environment.writeln(node.name);
  }
};
