import { paths } from 'mash-common';
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

  const { error } = fileSystem.createDirectory({
    path: paths.dirname(pathName),
    params: { name: paths.basename(pathName) }
  });

  if (error) {
    environment.error(1, error.message());
  }
};
