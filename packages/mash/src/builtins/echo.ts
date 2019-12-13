import { ICommandPayload } from "../types";

export default ({
  args,
  environment,
}: ICommandPayload) => {
  const str = args.slice(1).join(" ");
  environment.writeln(str);
};
