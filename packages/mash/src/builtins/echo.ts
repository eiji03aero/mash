import {
  CommandPayload
} from '../types';

export default ({
  args,
  environment
}: CommandPayload) => {
  environment.writeln([
    { text: args.slice(1).join(' ') }
  ]);
};
