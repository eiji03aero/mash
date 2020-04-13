import { CommandPayload } from "../types";

export default async ({
  args,
  environment,
}: CommandPayload) => {
  const str = args.slice(1).join(" ");
  environment.writeln(str);
};
