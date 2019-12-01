import { sharedContext, sharedTest } from '../shared';

describe('builtins.cd', () => {
  it('should change directory', () => {
    const { env, fs } = sharedContext.hasMockEnvironment();
    env.eval('cd ../');
    expect(fs.currentDirectory.name).toEqual('root');
  });

  it('should return/exitStatus error when path to not existing directory passed', () => {
    const { env, fs } = sharedContext.hasMockEnvironment();
    const dir = fs.currentDirectory.name;
    env.eval('cd not_existed_dir');
    expect(fs.currentDirectory.name).toEqual(dir);
    sharedTest.expectExitFail(env);
  });

  it('should return/exitStatus error when argument is not enough', () => {
    const { env, fs } = sharedContext.hasMockEnvironment();
    const dir = fs.currentDirectory.name;
    env.eval('cd');
    expect(fs.currentDirectory.name).toEqual(dir);
    sharedTest.expectExitFail(env);
  });
});
