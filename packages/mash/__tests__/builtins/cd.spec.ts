import { FileSystem } from 'mash-filesystem';

import { Environment } from '../../src/Environment';

describe('builtins.cd', () => {
  it('should change directory', () => {
    const fs = FileSystem.bootstrap();
    const env = Environment.bootstrap(fs);
    env.eval('cd ../');
    expect(fs.currentDirectory.name).toEqual('root');
  });

  it.todo('should return/exitStatus error when path to not existing directory passed');

  it.todo('should return/exitStatus error when argument is not enough');
});
