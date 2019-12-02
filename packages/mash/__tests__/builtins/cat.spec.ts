import { sharedContext, sharedTest } from '../shared';

describe('builtins.cat', () => {
  it('should print the content of file', () => {
    const { env, onWriteMock } = sharedContext.hasMockEnvironment();
    env.eval('cat README.txt');
    expect(onWriteMock).toBeCalledWith([{ text: 'read me here man' }]);
  });

  it('should exit when target is directory', () => {
    const { env } = sharedContext.hasMockEnvironment();
    env.eval('cat Applications');
    sharedTest.expectExitFail(env);
  });

  it('should exit when argument is not enough', () => {
    const { env } = sharedContext.hasMockEnvironment();
    env.eval('cat');
    sharedTest.expectExitFail(env);
  });
});
