import { IDirectory } from 'mash-filesystem';
import { sharedContext, sharedTest } from '../shared';

describe('builtins.touch', () => {
  it('should create file in same directory', () => {
    const { env, fs } = sharedContext.hasMockEnvironment();
    const fileName = 'hoge';
    env.eval(`touch ${fileName}`);
    expect(fs.currentDirectory.containsByName(fileName)).toBeTruthy();
  });

  it('should create file in different directory based on path', () => {
    const { env,fs } = sharedContext.hasMockEnvironment();
    const fileName = 'hoge';
    env.eval(`touch ../${fileName}`);
    expect((fs.currentDirectory.parentNode as IDirectory).containsByName(fileName)).toBeTruthy();
  });

  it('should exit error when passed invalid path', () => {
    const { env } = sharedContext.hasMockEnvironment();
    const path = '../hoge_na_directory/domo';
    env.eval(`touch ${path}`);
    sharedTest.expectExitFail(env);
  });

  it('should return/exitStatus error when argument is not enough', () => {
    const { env } = sharedContext.hasMockEnvironment();
    env.eval('touch');
    sharedTest.expectExitFail(env);
  });
});
