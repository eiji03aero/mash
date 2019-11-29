import { FileSystem } from 'mash-filesystem';

import { ExitStatus } from '../../src/types';
import { Environment } from '../../src/Environment';

describe('builtins.cd', () => {
  let fs: any;
  let env: any;
  let dir: any;

  beforeEach(() => {
    fs = FileSystem.bootstrap();
    env = Environment.bootstrap(fs);
    dir = fs.currentDirectory.name;
  });

  it('should change directory', () => {
    env.eval('cd ../');
    expect(fs.currentDirectory.name).toEqual('root');
  });

  it('should return/exitStatus error when path to not existing directory passed', () => {
    env.eval('cd not_existed_dir');
    expect(fs.currentDirectory.name).toEqual(dir);
    expect(env.exitStatus).toEqual(ExitStatus.Failure);
  });

  it('should return/exitStatus error when argument is not enough', () => {
    env.eval('cd');
    expect(fs.currentDirectory.name).toEqual(dir);
    expect(env.exitStatus).toEqual(ExitStatus.Failure);
  });
});
