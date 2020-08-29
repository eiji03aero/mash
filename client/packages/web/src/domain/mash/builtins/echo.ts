import { CommandPayload } from "../types";

export default async ({
  args,
  environment,
}: CommandPayload): Promise<void> => {
  const str = args.slice(1).join(" ");
  environment.writeln(str);
};
