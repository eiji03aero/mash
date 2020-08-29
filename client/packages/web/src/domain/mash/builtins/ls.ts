import * as E from "fp-ts/lib/Either";
import { IFileSystemNode, utils } from "mash-filesystem";

import { CommandPayload } from "../types";

export default async ({
  args,
  environment,
  context: {
    filesystem
  }
}: CommandPayload): Promise<void> => {
  const path = args[1] || ".";
  const r = filesystem.resolveNodeFromPath(path);
  if (E.isLeft(r)) {
    environment.error(1, r.left.message);
    return;
  }
  const node = r.right;

  if (utils.isDirectory(node)) {
    const r = filesystem.getNodes(node.children);
    if (E.isLeft(r)) {
      environment.error(1, r.left.message);
      return;
    }
    const text = r.right
      .map((c: IFileSystemNode) => c.name)
      .join(" ");
    environment.writeln(text);
  } else {
    environment.writeln(node.name);
  }
};
