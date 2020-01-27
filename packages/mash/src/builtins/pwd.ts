import { Monad } from "mash-common";
import { ICommandPayload } from "../types";

export default ({
  fileSystem,
  environment,
}: ICommandPayload) => {
  const currentDirectory = fileSystem.currentDirectory;
  const r = fileSystem.resolveAbsolutePath(currentDirectory.id);
  if (Monad.either.isLeft(r)) {
    environment.error(1, r.error.message());
    return;
  }
  environment.writeln(r.value);
};
