import { ICommandPayload } from "../types";

export default ({
  args,
  environment,
}: ICommandPayload) => {
  environment.writeln([
    { text: args.slice(1).join(" ") },
  ]);
};
