import { IDirectory, IFileSystemNode } from 'mash-filesystem';
import { CommandPayload } from '../types';

export default ({
  args,
  environment,
  fileSystem
}: CommandPayload) => {
  const path = args[1] || '.';

  const { error, node } = fileSystem.resolveNodeFromPath(path);

  if (error) {
    environment.error(1, error.message());
    return;
  }

  if (node!.isDirectory) {
    const text = (node as IDirectory).children
      .map((c: IFileSystemNode) => c.name)
      .join(' ');
    environment.writeln([{ text }]);
  }
  else {
    environment.writeln([
      { text: node!.name }
    ]);
  }
}
