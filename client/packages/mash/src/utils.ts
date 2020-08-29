import { ICommandOptionMap, IParsedCommandArgs } from "./types";

export const parseCommandArgs = (
  args: string[],
  defaultOptions: ICommandOptionMap
): IParsedCommandArgs => {
  const result: IParsedCommandArgs = { args: [], options: defaultOptions };
  return args.reduce((accum: IParsedCommandArgs, cur: string) => {
    if (cur[0] === "-" && cur.length === 2) {
      accum.options[cur[1]] = true;
    } else {
      accum.args.push(cur);
    }
    return accum;
  }, result);
};
