import {
  CommandPayload
} from '../types';

export default ({
  fileSystem,
  environment
}: CommandPayload) => {
  const currentDirectory = fileSystem.currentDirectory;
  const path = fileSystem.resolveAbsolutePath(currentDirectory);
  environment.writeln([
    { text: path }
  ]);
};
