import { ParsedCommandArgs, CommandOptionMap } from './types';

export const parseCommandArgs = (args: string[], defaultOptions: CommandOptionMap) => {
  const result: ParsedCommandArgs = { args: [], options: defaultOptions };
  return args.reduce((accum: ParsedCommandArgs, cur: string) => {
    if (cur[0] === '-' && cur.length === 2) {
      accum.options[cur[1]] = true;
    }
    else {
      accum.args.push(cur);
    }
    return accum;
  }, result);
};
