import { Monad } from "mash-common";
import { IFileSystem } from "../types";
import { fixtureNodes } from "../assets";

export const installFixtureNodes = (fs: IFileSystem) => {
  fs.installNodes(fs.rootDirectory.id, fixtureNodes);

  const r = fs.resolveNodeFromPath("/home");
  if (Monad.either.isLeft(r)) throw r.error;

  fs.changeCurrentDirectory(r.value.id);
};
