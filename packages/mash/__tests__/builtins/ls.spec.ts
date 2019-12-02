import { IFileSystemNode, IDirectory } from 'mash-filesystem';
import { sharedContext, sharedTest } from '../shared';

describe('builtins.ls', () => {
  it('should print the children of current directory', () => {
    const { env, fs, onWriteMock } = sharedContext.hasMockEnvironment();
    const childrenText = fs.currentDirectory.children
      .map((c: IFileSystemNode) => c.name)
      .join(' ');
    env.eval('ls');
    expect(onWriteMock).toHaveBeenCalledWith([
      { text: childrenText }
    ]);
  });

  it('should print the chidren of the directory via path', () => {
    const { env, fs, onWriteMock } = sharedContext.hasMockEnvironment();
    const childrenText = (fs.currentDirectory.parentNode! as IDirectory).children
      .map((c: IFileSystemNode) => c.name)
      .join(' ');
    env.eval('ls ../');
    expect(onWriteMock).toHaveBeenCalledWith([
      { text: childrenText }
    ]);
  });

  it('should print the name of file', () => {
    const { env, onWriteMock } = sharedContext.hasMockEnvironment();
    const fileName = 'todo.txt';
    env.eval(`ls ${fileName}`);
    expect(onWriteMock).toHaveBeenCalledWith([
      { text: fileName }
    ]);
  });

  it('should exit when path is invlid', () => {
    const { env } = sharedContext.hasMockEnvironment();
    env.eval(`ls ./hoge_not_exist`);
    sharedTest.expectExitFail(env);
  });
});
