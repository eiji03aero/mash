import { CommandPayload } from '../types';

export default ({
  args,
  environment,
  fileSystem
}: CommandPayload) => {
  if (args.length < 2) {
    environment.error(1, 'needs 1 argument. usage required here');
    return;
  }

  const pathName = args[1];
  const split = pathName.split('/');
  const name = split[split.length - 1];
  const path = split.length > 1
    ? split.slice(0, split.length - 1).join('/')
    : '.';

  const { error } = fileSystem.createFile({
    path,
    params: { name }
  });

  if (error) {
    environment.error(1, error.message());
  }
};
