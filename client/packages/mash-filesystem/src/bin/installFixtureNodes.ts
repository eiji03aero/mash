import * as E from "fp-ts/lib/Either";
import { IFileSystem } from "../types";
import { fixtureNodes } from "../assets";

export const installFixtureNodes = (fs: IFileSystem): void => {
  fs.installNodes(fs.rootDirectory.id, fixtureNodes);

  const r = fs.resolveNodeFromPath("/home");
  if (E.isLeft(r)) throw r.left;

  fs.changeCurrentDirectory(r.right.id);
};
