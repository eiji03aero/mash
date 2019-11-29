import {
  CommandPayload
} from '../types';

export default ({
  args,
  fileSystem,
  environment,
}: CommandPayload) => {
  if (args.length < 2) {
    environment.error(1, 'needs 1 argument. usage required here');
    return;
  }

  const path = args[1].tokenLiteral();

  const { error } = fileSystem.changeCurrentDirectory({ path });

  if (error) {
    environment.error(1, error.message());
  }
}
