import { IFile } from 'mash-filesystem';
import { CommandPayload } from '../types';

export default ({
  args,
  fileSystem,
  environment
}: CommandPayload) => {
  if (args.length < 2) {
    environment.error(1, 'needs 1 argument. usage required here');
    return;
  }

  const path = args[1];

  const { error, node } = fileSystem.resolveNodeFromPath(path);

  if (error) {
    environment.error(1, error.message());
    return;
  }

  if (node!.isDirectory) {
    environment.error(1, `${node!.name}: is a directory`);
    return;
  }

  environment.writeln([
    { text: (node! as IFile).content }
  ]);
}
