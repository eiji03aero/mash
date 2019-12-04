import { CommandPayload } from '../types';
import * as utils from '../utils';

export default ({
  args: _args,
  fileSystem,
  environment
}: CommandPayload) => {
  const { args, options } = utils.parseCommandArgs(_args, {
    r: false
  });

  if (args.length < 2) {
    environment.error(1, 'needs 1 argument. usage required here');
    return;
  }

  const path = args[1];
  const { error } = fileSystem.deleteNodeFromPath(path, {
    recursive: options.r
  });

  if (error) {
    console.log(error.message());
    environment.error(1, error.message());
  }
};
