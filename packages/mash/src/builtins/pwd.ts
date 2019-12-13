import { ICommandPayload } from "../types";

export default ({
  fileSystem,
  environment,
}: ICommandPayload) => {
  const currentDirectory = fileSystem.currentDirectory;
  const path = fileSystem.resolveAbsolutePath(currentDirectory);
  environment.writeln(path);
};
