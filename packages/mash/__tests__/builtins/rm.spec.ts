import { sharedContext, sharedTest } from '../shared';

describe('builtins.rm', () => {
  it('should delete file', () => {
    const fileName = 'hoge.txt';
    const { env, fs } = sharedContext.hasMockEnvironment();
    fs.createFile(fileName);
    env.eval(`rm ${fileName}`);
    expect(fs.currentDirectory.containsByName(fileName)).toBeFalsy();
  });

  it('should delete directory', () => {
    const dirName = 'hoge';
    const { env, fs } = sharedContext.hasMockEnvironment();
    fs.createDirectory(dirName);
    env.eval(`rm ${dirName} -r`);
    expect(fs.currentDirectory.containsByName(dirName)).toBeFalsy();
  });

  it('should exit when argument is not enough', () => {
    const { env } = sharedContext.hasMockEnvironment();
    env.eval(`rm`);
    sharedTest.expectExitFail(env);
  });

  it('should exit when target is directory but no -r option', () => {
    const { env, fs } = sharedContext.hasMockEnvironment();
    const dirName = 'hoge';
    fs.createDirectory(dirName);
    env.eval(`rm ${dirName}`);
    sharedTest.expectExitFail(env);
  });
});
