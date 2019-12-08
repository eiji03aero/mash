import { ICommandPayload } from "../types";

export default ({
  args,
  environment,
  fileSystem,
}: ICommandPayload) => {
  if (args.length < 2) {
    environment.error(1, "needs 1 argument. usage required here");
    return;
  }

  const path = args[1];
  const result = fileSystem.createFile(path);

  if (result.isError) {
    environment.error(1, result.error.message());
  }
};
