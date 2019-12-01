import { CommandPayload } from '../types';

export default ({
  args,
  environment
}: CommandPayload) => {
  if (args.length < 2) {
    environment.error(1, 'needs 1 argument. usage required here');
    return;
  }

  const path = args[1];
  const split = path.split('/');

  environment.writeln([
    { text: split[split.length - 1] }
  ]);
};
