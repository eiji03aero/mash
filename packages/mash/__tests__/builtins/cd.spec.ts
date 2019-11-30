import * as context from '../shared/context';
import { ExitStatus } from '../../src/types';

describe('builtins.cd', () => {
  it('should change directory', () => {
    const { env, fs } = context.hasMockEnvironment();
    env.eval('cd ../');
    expect(fs.currentDirectory.name).toEqual('root');
  });

  it('should return/exitStatus error when path to not existing directory passed', () => {
    const { env, fs } = context.hasMockEnvironment();
    const dir = fs.currentDirectory.name;
    env.eval('cd not_existed_dir');
    expect(fs.currentDirectory.name).toEqual(dir);
    expect(env.exitStatus).toEqual(ExitStatus.Failure);
  });

  it('should return/exitStatus error when argument is not enough', () => {
    const { env, fs } = context.hasMockEnvironment();
    const dir = fs.currentDirectory.name;
    env.eval('cd');
    expect(fs.currentDirectory.name).toEqual(dir);
    expect(env.exitStatus).toEqual(ExitStatus.Failure);
  });
});
