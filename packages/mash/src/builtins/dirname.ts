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
  const text = path[0] !== '/'
    ? '.'
    : split.slice(0, split.length - 1).join('/');

  environment.writeln([
    { text }
  ]);
};
